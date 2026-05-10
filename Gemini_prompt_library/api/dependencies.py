from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_async_session

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_async_session():
        yield session
