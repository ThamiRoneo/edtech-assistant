from fastapi import HTTPException
from typing import Any, Optional


class APIError(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
        details: Optional[Any] = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class NotFoundError(APIError):
    def __init__(self, message: str = "Resource not found", details: Optional[Any] = None):
        super().__init__(code="NOT_FOUND", message=message, status_code=404, details=details)


class UnauthorizedError(APIError):
    def __init__(self, message: str = "Unauthorized", details: Optional[Any] = None):
        super().__init__(code="UNAUTHORIZED", message=message, status_code=401, details=details)


class ForbiddenError(APIError):
    def __init__(self, message: str = "Forbidden", details: Optional[Any] = None):
        super().__init__(code="FORBIDDEN", message=message, status_code=403, details=details)


class ValidationError(APIError):
    def __init__(self, message: str = "Validation failed", details: Optional[Any] = None):
        super().__init__(code="VALIDATION_ERROR", message=message, status_code=422, details=details)


class ConflictError(APIError):
    def __init__(self, message: str = "Conflict", details: Optional[Any] = None):
        super().__init__(code="CONFLICT", message=message, status_code=409, details=details)


class BadRequestError(APIError):
    def __init__(self, message: str = "Bad request", details: Optional[Any] = None):
        super().__init__(code="BAD_REQUEST", message=message, status_code=400, details=details)
