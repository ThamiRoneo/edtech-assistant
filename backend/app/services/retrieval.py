from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any


class RetrievalService:
    def search(self, db: Session, query_embedding: List[float], k: int = 5) -> List[Dict[str, Any]]:
        # pgvector cosine similarity
        q = text(
            """
            SELECT id, source, content, 1 - (embedding <=> :emb) as score
            FROM knowledge_chunks
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> :emb
            LIMIT :k
            """
        )
        res = db.execute(q, {"emb": query_embedding, "k": k})
        rows = []
        for r in res:
            rows.append({"id": str(r.id), "source": r.source, "content": r.content, "score": float(r.score)})
        return rows


retrieval_service = RetrievalService()
