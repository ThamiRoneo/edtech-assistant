try:
    import boto3
    from botocore.exceptions import ClientError
except Exception:
    boto3 = None
    ClientError = Exception

from app.core.config import settings
from typing import Optional


class StorageService:
    def __init__(self):
        self.client = None
        if boto3 and settings.S3_ACCESS_KEY and settings.S3_SECRET_KEY:
            try:
                self.client = boto3.client(
                    "s3",
                    endpoint_url=settings.S3_ENDPOINT or None,
                    aws_access_key_id=settings.S3_ACCESS_KEY,
                    aws_secret_access_key=settings.S3_SECRET_KEY,
                    region_name="us-east-1",
                )
            except Exception:
                self.client = None
        self.bucket = settings.S3_BUCKET

    def generate_presigned_put(self, key: str, content_type: str = "application/octet-stream", expires_in: int = 3600) -> Optional[str]:
        if not self.client:
            return None
        try:
            url = self.client.generate_presigned_url(
                "put_object",
                Params={"Bucket": self.bucket, "Key": key, "ContentType": content_type},
                ExpiresIn=expires_in,
            )
            return url
        except Exception:
            return None


storage_service = StorageService()
