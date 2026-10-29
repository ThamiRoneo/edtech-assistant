from redis import Redis
from time import time
from fastapi import Request, HTTPException
from functools import wraps
import os

try:
    redis_client = Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"), decode_responses=True)
except Exception:
    redis_client = None


def rate_limit(max_requests: int = 10, window_seconds: int = 60):
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
            if request is None or redis_client is None:
                return await func(*args, **kwargs)
            key = f"ratelimit:{request.client.host if request.client else 'unknown'}:{func.__name__}"
            now = time()
            pipe = redis_client.pipeline()
            pipe.zremrangebyscore(key, 0, now - window_seconds)
            pipe.zadd(key, {str(now): now})
            pipe.zcard(key)
            pipe.expire(key, window_seconds)
            _, _, count, _ = pipe.execute()
            if count > max_requests:
                raise HTTPException(status_code=429, detail="Too many requests")
            return await func(*args, **kwargs)
        return wrapper
    return decorator
