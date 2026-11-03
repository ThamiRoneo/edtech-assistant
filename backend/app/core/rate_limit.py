from time import time
from fastapi import Request, HTTPException
from functools import wraps

from app.core.redis import get_redis
from app.core.config import settings


def _get_client_ip(request: Request) -> str:
    if request.client and request.client.host in settings.TRUSTED_PROXIES:
        xff = request.headers.get("X-Forwarded-For")
        if xff:
            return xff.split(",")[0].strip()
        xri = request.headers.get("X-Real-IP")
        if xri:
            return xri.strip()
    if request.client:
        return request.client.host
    return "unknown"


def rate_limit(max_requests: int = 10, window_seconds: int = 60, key_prefix: str | None = None):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if request is None:
                for k, v in kwargs.items():
                    if isinstance(v, Request):
                        request = v
                        break
            redis_client = get_redis()
            if request is None or redis_client is None:
                if settings.RATE_LIMIT_FAIL_CLOSED and settings.ENVIRONMENT == "production":
                    raise HTTPException(status_code=503, detail="Rate limiting unavailable")
                return await func(*args, **kwargs)
            user = kwargs.get("user") or None
            user_id = None
            if isinstance(user, dict):
                user_id = user.get("sub") or user.get("id")
            ip = _get_client_ip(request)
            prefix = key_prefix or func.__name__
            key = f"ratelimit:{prefix}:{user_id or ip}"
            try:
                now = time()
                pipe = redis_client.pipeline()
                pipe.zremrangebyscore(key, 0, now - window_seconds)
                pipe.zadd(key, {str(now): now})
                pipe.zcard(key)
                pipe.expire(key, window_seconds)
                _, _, count, _ = pipe.execute()
                if count > max_requests:
                    raise HTTPException(status_code=429, detail="Too many requests")
            except HTTPException:
                raise
            except Exception:
                if settings.RATE_LIMIT_FAIL_CLOSED and settings.ENVIRONMENT == "production":
                    raise HTTPException(status_code=503, detail="Rate limiting unavailable")
                return await func(*args, **kwargs)
            return await func(*args, **kwargs)
        return wrapper
    return decorator
