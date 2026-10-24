import json
from typing import Any, Dict, List, Optional

try:
    import httpx
    from openai import OpenAI
except Exception:
    httpx = None
    OpenAI = None

from app.core.config import settings


class LLMClient:
    def __init__(self):
        self.client = None
        if OpenAI and settings.OPENAI_API_KEY:
            try:
                self.client = OpenAI(api_key=settings.OPENAI_API_KEY, base_url=settings.OPENAI_API_BASE)
            except Exception:
                self.client = None
        self.timeout = httpx.Timeout(60.0, connect=10.0) if httpx else None

    async def chat_json(self, messages: List[Dict[str, Any]], model: Optional[str] = None, temperature: float = 0.2) -> Dict[str, Any]:
        if not self.client:
            raise RuntimeError("LLM client not configured")
        model = model or settings.LLM_MODEL_GRADE
        resp = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            response_format={"type": "json_object"},
        )
        content = resp.choices[0].message.content or "{}"
        return json.loads(content)

    async def grade_with_vision(self, messages: List[Dict[str, Any]], model: Optional[str] = None) -> Dict[str, Any]:
        if not self.client:
            raise RuntimeError("LLM client not configured")
        model = model or settings.LLM_MODEL_GRADE
        resp = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.1,
            response_format={"type": "json_object"},
        )
        content = resp.choices[0].message.content or "{}"
        return json.loads(content)


llm_client = LLMClient()
