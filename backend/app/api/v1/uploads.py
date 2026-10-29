from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
import uuid

from app.core.security import get_current_user
from app.core.errors import BadRequestError
from app.services.storage import storage_service

router = APIRouter()


class PresignReq(BaseModel):
    model_config = ConfigDict()
    filename: str
    content_type: str = "application/octet-stream"


class PresignResp(BaseModel):
    model_config = ConfigDict()
    upload_url: str
    key: str


@router.post("/presigned", response_model=PresignResp)
def presign(req: PresignReq, user=Depends(get_current_user)):
    allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"]
    if req.content_type not in allowed and not req.content_type.startswith("image/"):
        raise BadRequestError("Unsupported content type")
    key = f"uploads/{uuid.uuid4()}-{req.filename}"
    url = storage_service.generate_presigned_put(key, req.content_type)
    if not url:
        # return a stub key for local dev without S3
        return PresignResp(upload_url=f"http://localhost:9000/edtech-uploads/{key}", key=key)
    return PresignResp(upload_url=url, key=key)
