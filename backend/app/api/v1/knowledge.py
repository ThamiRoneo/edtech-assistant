from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.security import get_current_user

router = APIRouter()


@router.post("/ingest")
async def ingest(file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(get_current_user)):
    # stub: would extract PDF/text and embed to pgvector
    return {"status": "accepted", "filename": file.filename}
