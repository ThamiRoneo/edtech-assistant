from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import json
import asyncio

from app.core.security import get_current_user

router = APIRouter()


class ChatReq(BaseModel):
    message: str
    session_id: Optional[str] = None


@router.post("/chat")
async def chat(req: ChatReq, user=Depends(get_current_user)):
    async def gen():
        # stub SSE
        for token in ["Let", " us", " think", "...", " (Socratic)"]:
            yield f"data: {json.dumps({'token': token})}\n\n"
            await asyncio.sleep(0.01)
        yield "data: [DONE]\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
