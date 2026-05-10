"""
Module: gemini_prompt_library/config.py
Purpose: Centralized configuration management using Pydantic Settings.
Author: Gemini AI Team
Version: 1.0.0
Dependencies: pydantic-settings, python-dotenv

Architecture Notes:
    Uses Pydantic's BaseSettings to load and validate environment variables.
    This ensures that the application fails fast at startup if required
    configuration is missing or invalid.

Usage Example:
    >>> from config import settings
    >>> print(settings.PROJECT_NAME)
    Gemini AI Prompt Library
"""

from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, PostgresDsn, RedisDsn, SecretStr


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or .env file.
    
    Attributes:
        PROJECT_NAME: Name of the project.
        API_V1_STR: Prefix for API v1 routes.
        SECRET_KEY: Cryptographic secret for JWT signing.
        ACCESS_TOKEN_EXPIRE_MINUTES: JWT expiration time.
        CORS_ORIGINS: Allowed CORS origins.
        DATABASE_URL: PostgreSQL connection string (asyncpg).
        REDIS_URL: Redis connection string.
        GEMINI_API_KEY: API key for Google Gemini models.
        OPENAI_API_KEY: API key for OpenAI fallback models.
        ANTHROPIC_API_KEY: API key for Anthropic fallback models.
    """
    
    PROJECT_NAME: str = "Gemini AI Prompt Library"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: SecretStr
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    CORS_ORIGINS: List[AnyHttpUrl] = []
    
    # Database
    DATABASE_URL: PostgresDsn
    
    # Cache
    REDIS_URL: RedisDsn
    
    # AI Providers
    GEMINI_API_KEY: SecretStr
    OPENAI_API_KEY: Optional[SecretStr] = None
    ANTHROPIC_API_KEY: Optional[SecretStr] = None
    
    # Model Configuration
    PRIMARY_MODEL: str = "gemini-3.1-pro-preview"
    EMBEDDING_MODEL: str = "gemini-embedding-2-preview"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


# Instantiate settings to be imported across the application
settings = Settings()
