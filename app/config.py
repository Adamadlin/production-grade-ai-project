import os
from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # FastAPI env
    ENV: str = Field(default="dev", description="Environment name")

    # rate limit (requests/minute)
    RATE_LIMIT_PER_MIN: int = Field(default=60)

    # model to advertise in /health (not enforced)
    MODEL_NAME: str = Field(default="llama3:8b")

    # where we persist artifacts
    OUT_DIR: str = Field(default="out")
    VECTOR_DB_DIR: str = Field(default="vectorstore")
    DATA_DIR: str = Field(default="data")

    # collection name used by VectorDB
    DEFAULT_COLLECTION: str = Field(default="default")

    # allowed CORS origins for frontend
    # You can either set CORS_ORIGINS='http://localhost:3000,http://foo.com'
    # or leave it *, which we'll treat as wildcard.
    CORS_ORIGINS: str = Field(default="*")

    model_config = SettingsConfigDict(
        env_prefix="",                # read env vars as-is (e.g. ENV, DATA_DIR)
        case_sensitive=False,
        extra="ignore",               # <-- IMPORTANT: ignore unexpected keys instead of throwing
    )

    def cors_list(self) -> List[str]:
        """
        Helper: turn CORS_ORIGINS env into list[str] for FastAPI middleware.
        '*' means allow all.
        """
        if self.CORS_ORIGINS.strip() == "*":
            return ["*"]
        return [x.strip() for x in self.CORS_ORIGINS.split(",") if x.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


# create a singleton we import everywhere else
settings = get_settings()