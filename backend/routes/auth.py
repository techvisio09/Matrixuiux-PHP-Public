"""Authentication: JWT email/password + Emergent Google social login."""
import os
import secrets
import uuid
from datetime import datetime, timezone, timedelta

import httpx
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, EmailStr, Field

from database import db
from auth_utils import (
    hash_password, verify_password, create_access_token, create_refresh_token,
    set_auth_cookies, public_user, get_current_user, get_jwt_secret, JWT_ALGORITHM,
)
import jwt as pyjwt

router = APIRouter(prefix="/auth")

EMERGENT_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"

MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleSessionRequest(BaseModel):
    session_id: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(min_length=6)


def _now():
    return datetime.now(timezone.utc)


async def _check_lockout(identifier: str):
    rec = await db.login_attempts.find_one({"identifier": identifier}, {"_id": 0})
    if rec and rec.get("count", 0) >= MAX_ATTEMPTS:
        locked_until = datetime.fromisoformat(rec["locked_until"])
        if locked_until > _now():
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})


async def _record_failure(identifier: str):
    await db.login_attempts.update_one(
        {"identifier": identifier},
        {"$inc": {"count": 1}, "$set": {"locked_until": (_now() + timedelta(minutes=LOCKOUT_MINUTES)).isoformat()}},
        upsert=True,
    )


@router.post("/register")
async def register(req: RegisterRequest, response: Response):
    email = req.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    user = {
        "user_id": f"user_{uuid.uuid4().hex[:12]}",
        "email": email,
        "name": req.name.strip(),
        "password_hash": hash_password(req.password),
        "picture": None,
        "role": "customer",
        "auth_provider": "password",
        "created_at": _now().isoformat(),
    }
    await db.users.insert_one(dict(user))
    set_auth_cookies(response, create_access_token(user["user_id"], email), create_refresh_token(user["user_id"]))
    return public_user(user)


@router.post("/login")
async def login(req: LoginRequest, request: Request, response: Response):
    email = req.email.lower()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    await _check_lockout(identifier)

    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user or not user.get("password_hash") or not verify_password(req.password, user["password_hash"]):
        await _record_failure(identifier)
        if user and not user.get("password_hash"):
            raise HTTPException(status_code=401, detail="This account uses Google sign-in. Please continue with Google.")
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, create_access_token(user["user_id"], email), create_refresh_token(user["user_id"]))
    return public_user(user)


@router.post("/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    for cookie in ("access_token", "refresh_token", "session_token"):
        response.delete_cookie(cookie, path="/")
    return {"ok": True}


@router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    return public_user(user)


@router.post("/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = pyjwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.find_one({"user_id": payload["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    response.set_cookie("access_token", create_access_token(user["user_id"], user["email"]),
                        httponly=True, secure=True, samesite="none", max_age=3600, path="/")
    return public_user(user)


@router.post("/google/session")
async def google_session(req: GoogleSessionRequest, response: Response):
    """Exchange an Emergent Auth session_id for a session_token (called after Google redirect)."""
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(EMERGENT_SESSION_URL, headers={"X-Session-ID": req.session_id})
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session")
    data = resp.json()

    email = data["email"].lower()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        user = {
            "user_id": f"user_{uuid.uuid4().hex[:12]}",
            "email": email,
            "name": data.get("name") or email.split("@")[0],
            "password_hash": None,
            "picture": data.get("picture"),
            "role": "customer",
            "auth_provider": "google",
            "created_at": _now().isoformat(),
        }
        await db.users.insert_one(dict(user))
    elif data.get("picture") and not user.get("picture"):
        await db.users.update_one({"user_id": user["user_id"]}, {"$set": {"picture": data["picture"]}})
        user["picture"] = data["picture"]

    session_token = data["session_token"]
    await db.user_sessions.insert_one({
        "user_id": user["user_id"],
        "session_token": session_token,
        "expires_at": (_now() + timedelta(days=7)).isoformat(),
        "created_at": _now().isoformat(),
    })
    response.set_cookie("session_token", session_token, httponly=True, secure=True,
                        samesite="none", max_age=604800, path="/")
    return public_user(user)


@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    user = await db.users.find_one({"email": req.email.lower()}, {"_id": 0})
    if user:
        token = secrets.token_urlsafe(32)
        await db.password_reset_tokens.insert_one({
            "token": token, "user_id": user["user_id"], "used": False,
            "expires_at": _now() + timedelta(hours=1), "created_at": _now(),
        })
        print(f"[PASSWORD RESET] token for {req.email}: {token}")
    return {"ok": True, "message": "If an account exists, a reset link has been sent."}


@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    rec = await db.password_reset_tokens.find_one({"token": req.token, "used": False})
    if not rec:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    expires_at = rec["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < _now():
        raise HTTPException(status_code=400, detail="Reset token expired")
    await db.users.update_one({"user_id": rec["user_id"]}, {"$set": {"password_hash": hash_password(req.password)}})
    await db.password_reset_tokens.update_one({"token": req.token}, {"$set": {"used": True}})
    return {"ok": True}
