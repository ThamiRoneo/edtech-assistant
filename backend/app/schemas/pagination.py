from pydantic import BaseModel
from typing import Generic, TypeVar, List, Optional
from math import ceil

T = TypeVar('T')


class PaginationParams(BaseModel):
    page: int = 1
    page_size: int = 20

    @property
    def skip(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size


class PaginationMeta(BaseModel):
    page: int
    page_size: int
    total_items: int
    total_pages: int


class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    pagination: PaginationMeta

    @classmethod
    def create(cls, items: List[T], total_items: int, page: int, page_size: int):
        total_pages = ceil(total_items / page_size) if page_size > 0 else 0
        return cls(
            data=items,
            pagination=PaginationMeta(
                page=page,
                page_size=page_size,
                total_items=total_items,
                total_pages=total_pages,
            ),
        )
