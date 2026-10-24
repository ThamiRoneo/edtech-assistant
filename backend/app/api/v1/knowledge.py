from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.db import get_db
from app.core.security import get_current_user
from app.services.ingestion import ingestion_service
from app.services.retrieval import retrieval_service
from app.models.knowledge import KnowledgeChunk

router = APIRouter()


@router.post("/ingest")
async def ingest(file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(get_current_user)):
    content = await file.read()
    text = ingestion_service.extract_text(file.filename, content)
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text")
    chunks = ingestion_service.chunk_text(text)
    embeddings = ingestion_service.embed_chunks(chunks)
    count = 0
    for c, emb in zip(chunks, embeddings):
        if emb and len(emb) == 1536:
            db.add(KnowledgeChunk(source=file.filename, content=c, embedding=emb))
            count += 1
        else:
            db.add(KnowledgeChunk(source=file.filename, content=c))
            count += 1
    db.commit()
    return {"status": "ingested", "chunks": count}


class SearchReq(BaseModel):
    query: str
    k: int = 5


@router.get("/search")
def search(q: str = "", k: int = 5, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if q:
        from app.services.embeddings import embedding_service
        emb = embedding_service.embed_text(q)
        if emb and len(emb) == 1536 and any(x != 0 for x in emb):
            results = retrieval_service.search(db, emb, k=k)
            return results
    rows = db.query(KnowledgeChunk).filter(KnowledgeChunk.content.contains(q) if q else True).limit(k).all()
    return [{"id": str(r.id), "source": r.source, "content": r.content[:200]} for r in rows]
