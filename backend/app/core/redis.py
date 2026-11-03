import os
from redis import Redis

from app.core.config import settings

_redis_client = None

def get_redis() -> Redis | None:
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    try:
        _redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True, socket_connect_timeout=2, socket_timeout=2)
        return _redis_client
    except Exception:
        _redis_client = None
        return None
