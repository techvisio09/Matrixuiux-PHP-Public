"""Auth helpers: password hashing, JWT tokens, current-user resolution.

Supports two auth methods against the same users collection:
- JWT email/password (access_token / refresh_token httpOnly cookies)
- Emergent Google social login (session_token httpOnly cookie + user_sessions collection)
"""
import os
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt
from fastapi import HTTPException, Request

from database import db

JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except ValueError:
        return False


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email,
               "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response, access_token: str, refresh_token: str):
    response.set_cookie("access_token", access_token, httponly=True, secure=True,
                        samesite="none", max_age=3600, path="/")
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=True,
                        samesite="none", max_age=604800, path="/")


def public_user(user: dict) -> dict:
    return {k: v for k, v in user.items() if k not in ("_id", "password_hash")}


async def _user_from_jwt(token: str):
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            return None
        user_id = payload["sub"]
    except (jwt.InvalidTokenError, KeyError):
        return None
    return await db.users.find_one({"user_id": user_id}, {"_id": 0})


async def _user_from_session(session_token: str):
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        return None
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    return await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})


async def get_user_from_request(request: Request):
    """Resolve the authenticated user from cookies or Authorization header, or None."""
    token = request.cookies.get("access_token")
    if token:
        user = await _user_from_jwt(token)
        if user:
            return user
    session_token = request.cookies.get("session_token")
    if session_token:
        user = await _user_from_session(session_token)
        if user:
            return user
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        bearer = auth_header[7:]
        user = await _user_from_jwt(bearer)
        if user:
            return user
        user = await _user_from_session(bearer)
        if user:
            return user
    return None


async def get_current_user(request: Request) -> dict:
    user = await get_user_from_request(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
