from collections import defaultdict
from time import time
from fastapi import Request, HTTPException

# Simple in-memory rate limiter
_requests = defaultdict(list)


def rate_limit(max_requests: int = 10, window_seconds: int = 60):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            request: Request = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if request is None:
                for k, v in kwargs.items():
                    if isinstance(v, Request):
                        request = v
                        break
            if request is None:
                return await func(*args, **kwargs)
            key = request.client.host if request.client else "unknown"
            now = time()
            bucket = _requests[key]
            # Remove old entries
            _requests[key] = [t for t in bucket if now - t < window_seconds]
            if len(_requests[key]) >= max_requests:
                raise HTTPException(status_code=429, detail="Too many requests")
            _requests[key].append(now)
            return await func(*args, **kwargs)
        return wrapper
    return decorator
