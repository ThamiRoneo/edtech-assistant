from typing import List
import os

try:
    from openai import OpenAI
except Exception:
    OpenAI = None

from app.core.config import settings


class EmbeddingService:
    def __init__(self):
        self.client = None
        if OpenAI and settings.OPENAI_API_KEY:
            try:
                self.client = OpenAI(api_key=settings.OPENAI_API_KEY, base_url=settings.OPENAI_API_BASE)
            except Exception:
                self.client = None

    def embed_text(self, text: str) -> List[float]:
        if not self.client:
            # Return zero vector as fallback
            return [0.0] * 1536
        try:
            resp = self.client.embeddings.create(model="text-embedding-3-small", input=text)
            return resp.data[0].embedding
        except Exception:
            return [0.0] * 1536

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        if not self.client:
            return [[0.0] * 1536 for _ in texts]
        try:
            resp = self.client.embeddings.create(model="text-embedding-3-small", input=texts)
            return [d.embedding for d in resp.data]
        except Exception:
            return [[0.0] * 1536 for _ in texts]


embedding_service = EmbeddingService()
