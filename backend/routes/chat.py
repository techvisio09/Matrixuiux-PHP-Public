"""AI Sales Assistant chat (streaming SSE) with lead capture."""
import json
import logging
import os
import re
from datetime import datetime, timezone

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

from database import db

router = APIRouter()
logger = logging.getLogger(__name__)

TOLL_FREE = "1-888-632-9902"

CHAT_SYSTEM_PROMPT = f"""You are 'Max', the friendly AI sales assistant for UCODE SOFTTECH LLC — an authorized reseller of genuine Microsoft software (Office 2024/2021/2019 for PC & Mac, Windows 10/11, Project, Visio) and antivirus products, sold as one-time-purchase lifetime licenses with instant email delivery (15-30 minutes), a 30-day money-back guarantee, and free installation/activation support.

Your goals, in order:
1. Answer questions briefly and helpfully (maximum 2-3 short sentences per reply).
2. Naturally collect the customer's full name, email address, and phone number — ask for ONE missing detail at a time, conversationally. Never be pushy.
3. Once you have all three details, thank them and tell them a sales expert can help right away: they can call our toll-free number {TOLL_FREE} (Mon-Fri 9 AM-6 PM EST), or you can arrange a callback from our team. Ask which they prefer.
4. If they request a callback, confirm that our team will call them within 24 business hours on the number they provided.

IMPORTANT: When (and only when) you have collected the name, email AND phone, append this EXACT machine-readable marker at the very END of that reply:
[LEAD]{{"name":"<name>","email":"<email>","phone":"<phone>","callback_requested":<true|false>}}[/LEAD]
If the customer requests a callback in a later message, append the marker again with callback_requested set to true. Never mention the marker or that you are recording their details.

Keep replies short, warm and professional. Plain text only — no markdown, no bullet lists."""

chat_sessions = {}
LEAD_RE = re.compile(r"\[LEAD\](\{.*?\})\[/LEAD\]", re.S)


class ChatRequest(BaseModel):
    session_id: str
    message: str


class LeadRequest(BaseModel):
    session_id: str
    name: str
    email: str
    phone: str
    callback_requested: bool = False
    source: str = "chat_form"


@router.post("/leads")
async def create_lead(req: LeadRequest):
    lead = req.model_dump()
    lead["ts"] = datetime.now(timezone.utc).isoformat()
    await db.leads.update_one({"session_id": req.session_id}, {"$set": lead}, upsert=True)
    return {"ok": True}


def get_chat(session_id: str) -> LlmChat:
    if session_id not in chat_sessions:
        chat_sessions[session_id] = LlmChat(
            api_key=os.environ.get("EMERGENT_LLM_KEY"),
            session_id=session_id,
            system_message=CHAT_SYSTEM_PROMPT,
        ).with_model("openai", "gpt-5")
    return chat_sessions[session_id]


@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    chat = get_chat(req.session_id)
    await db.chat_messages.insert_one({
        "session_id": req.session_id, "role": "user", "text": req.message,
        "ts": datetime.now(timezone.utc).isoformat(),
    })

    async def gen():
        full = ""
        try:
            async for ev in chat.stream_message(UserMessage(text=req.message)):
                if isinstance(ev, TextDelta):
                    full += ev.content
                    yield f"data: {json.dumps({'t': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception:
            logger.exception("chat stream error")
            fallback = f"Sorry, I'm having trouble responding right now. Please call us toll-free at {TOLL_FREE} (Mon-Fri 9 AM-6 PM EST) and a sales expert will help you."
            full += fallback
            yield f"data: {json.dumps({'t': fallback})}\n\n"

        m = LEAD_RE.search(full)
        if m:
            try:
                lead = json.loads(m.group(1))
                lead.update({"session_id": req.session_id, "ts": datetime.now(timezone.utc).isoformat()})
                await db.leads.update_one({"session_id": req.session_id}, {"$set": lead}, upsert=True)
                logger.info(f"Lead captured for session {req.session_id}")
            except Exception:
                logger.exception("lead parse error")

        clean = LEAD_RE.sub("", full).strip()
        await db.chat_messages.insert_one({
            "session_id": req.session_id, "role": "assistant", "text": clean,
            "ts": datetime.now(timezone.utc).isoformat(),
        })
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
