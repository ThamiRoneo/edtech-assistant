from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import uuid

from app.core.security import get_current_user
from app.services.storage import storage_service

router = APIRouter()


class PresignReq(BaseModel):
    filename: str
    content_type: str = "application/octet-stream"


class PresignResp(BaseModel):
    upload_url: str
    key: str


@router.post("/presigned", response_model=PresignResp)
def presign(req: PresignReq, user=Depends(get_current_user)):
    key = f"uploads/{uuid.uuid4()}-{req.filename}"
    url = storage_service.generate_presigned_put(key, req.content_type)
    if not url:
        raise HTTPException(status_code=500, detail="Storage not configured")
    return PresignResp(upload_url=url, key=key)
