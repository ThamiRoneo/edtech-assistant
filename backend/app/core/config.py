import os
from typing import List


class Settings:
    def __init__(self):
        self.DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://edtech:edtech@localhost:5432/edtech")
        self.REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY", "")
        self.CLERK_PUBLISHABLE_KEY = os.getenv("CLERK_PUBLISHABLE_KEY", "")
        self.CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "")
        self.OPENAI_API_BASE = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
        self.LLM_MODEL_GRADE = os.getenv("LLM_MODEL_GRADE", "gpt-4o-mini")
        self.LLM_MODEL_TUTOR = os.getenv("LLM_MODEL_TUTOR", "gpt-4o")
        self.S3_ENDPOINT = os.getenv("S3_ENDPOINT", "")
        self.S3_BUCKET = os.getenv("S3_BUCKET", "edtech-uploads")
        self.S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY", "")
        self.S3_SECRET_KEY = os.getenv("S3_SECRET_KEY", "")
        self.CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")


settings = Settings()
