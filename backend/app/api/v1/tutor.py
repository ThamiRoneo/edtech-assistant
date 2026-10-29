from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict
from typing import Optional
import json
import asyncio

from app.core.security import get_current_user
from app.services.session import session_service

router = APIRouter()


class ChatReq(BaseModel):
    model_config = ConfigDict()
    message: str
    session_id: Optional[str] = None


@router.post("/chat")
async def chat(req: ChatReq, user=Depends(get_current_user)):
    sid = req.session_id or user.get("sub") or "anon"
    history = session_service.get(f"tutor:{sid}") or []
    history.append({"role": "user", "content": req.message})
    session_service.set(f"tutor:{sid}", history[-10:], ttl=3600)

    async def gen():
        tokens = ["Let's think step by step. ", "What do we know? ", "Can we break it down? ", f"Hint: relate to {req.message[:20]}..."]
        for token in tokens:
            yield f"data: {json.dumps({'token': token})}\n\n"
            await asyncio.sleep(0.02)
        yield "data: [DONE]\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
