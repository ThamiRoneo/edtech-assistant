try:
    import redis
except Exception:
    redis = None

from app.core.config import settings
import json


class SessionService:
    def __init__(self):
        self.client = None
        if redis:
            try:
                self.client = redis.from_url(settings.REDIS_URL)
            except Exception:
                self.client = None

    def get(self, key: str):
        if not self.client:
            return None
        try:
            data = self.client.get(key)
            return json.loads(data) if data else None
        except Exception:
            return None

    def set(self, key: str, value, ttl: int = 3600):
        if not self.client:
            return False
        try:
            self.client.setex(key, ttl, json.dumps(value))
            return True
        except Exception:
            return False


session_service = SessionService()
