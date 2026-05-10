import asyncio
import logging
from sqlalchemy.ext.asyncio import create_async_engine
from .config import settings
from .models.base import Base

# Import all models so metadata knows about them
from .models.graph import User, NodeConcept, EdgeConnection

logger = logging.getLogger(__name__)

async def init_db():
    logger.info("Initializing Database...")
    engine = create_async_engine(str(settings.DATABASE_URL), echo=True)
    async with engine.begin() as conn:
        # Caution: drop_all is for development only!
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database Initialized.")

if __name__ == "__main__":
    asyncio.run(init_db())
