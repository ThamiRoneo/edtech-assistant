from collections import defaultdict
from time import time
from fastapi import Request, HTTPException
from functools import wraps


_requests = defaultdict(list)


def rate_limit(max_requests: int = 10, window_seconds: int = 60):
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            request = kwargs.get('request') or next((arg for arg in args if isinstance(arg, Request)), None)
            if request is None:
                return await func(*args, **kwargs)
            key = request.client.host if request.client else "unknown"
            now = time()
            bucket = _requests[key]
            _requests[key] = [t for t in bucket if now - t < window_seconds]
            if len(_requests[key]) >= max_requests:
                raise HTTPException(status_code=429, detail="Too many requests")
            _requests[key].append(now)
            return await func(*args, **kwargs)

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            request = kwargs.get('request') or next((arg for arg in args if isinstance(arg, Request)), None)
            if request is None:
                return func(*args, **kwargs)
            key = request.client.host if request.client else "unknown"
            now = time()
            bucket = _requests[key]
            _requests[key] = [t for t in bucket if now - t < window_seconds]
            if len(_requests[key]) >= max_requests:
                raise HTTPException(status_code=429, detail="Too many requests")
            _requests[key].append(now)
            return func(*args, **kwargs)

        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper
    return decorator
