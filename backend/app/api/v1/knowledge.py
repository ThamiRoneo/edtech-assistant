from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from app.core.db import get_db
from app.core.security import get_current_user
from app.services.ingestion import ingestion_service
from app.models.knowledge import KnowledgeChunk

router = APIRouter()


@router.post("/ingest")
async def ingest(file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(get_current_user)):
    content = await file.read()
    text = ingestion_service.extract_text(file.filename, content)
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text")
    chunks = ingestion_service.chunk_text(text)
    # stub: no embeddings yet; store chunks without embeddings
    for c in chunks[:50]:  # limit for stub
        db.add(KnowledgeChunk(source=file.filename, content=c))
    db.commit()
    return {"status": "ingested", "chunks": len(chunks)}


class SearchReq(BaseModel):
    query: str
    k: int = 5


@router.get("/search")
def search(q: str = "", k: int = 5, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # stub search without embeddings
    rows = db.query(KnowledgeChunk).filter(KnowledgeChunk.content.contains(q) if q else True).limit(k).all()
    return [{"id": str(r.id), "source": r.source, "content": r.content[:200]} for r in rows]
