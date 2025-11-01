# import os
# from functools import lru_cache
# from typing import List

# from pydantic import Field
# from pydantic_settings import BaseSettings, SettingsConfigDict


# class Settings(BaseSettings):
#     # FastAPI env
#     ENV: str = Field(default="dev", description="Environment name")

#     # rate limit (requests/minute)
#     RATE_LIMIT_PER_MIN: int = Field(default=60)

#     # model to advertise in /health (not enforced)
#     MODEL_NAME: str = Field(default="llama3:8b")

#     # where we persist artifacts
#     OUT_DIR: str = Field(default="out")
#     VECTOR_DB_DIR: str = Field(default="vectorstore")
#     DATA_DIR: str = Field(default="data")

#     # collection name used by VectorDB
#     DEFAULT_COLLECTION: str = Field(default="default")

#     # allowed CORS origins for frontend
#     # You can either set CORS_ORIGINS='http://localhost:3000,http://foo.com'
#     # or leave it *, which we'll treat as wildcard.
#     CORS_ORIGINS: str = Field(default="*")

#     model_config = SettingsConfigDict(
#         env_prefix="",                # read env vars as-is (e.g. ENV, DATA_DIR)
#         case_sensitive=False,
#         extra="ignore",               # <-- IMPORTANT: ignore unexpected keys instead of throwing
#     )

#     def cors_list(self) -> List[str]:
#         """
#         Helper: turn CORS_ORIGINS env into list[str] for FastAPI middleware.
#         '*' means allow all.
#         """
#         if self.CORS_ORIGINS.strip() == "*":
#             return ["*"]
#         return [x.strip() for x in self.CORS_ORIGINS.split(",") if x.strip()]


# @lru_cache
# def get_settings() -> Settings:
#     return Settings()


# # create a singleton we import everywhere else
# settings = get_settings()

# app/config.py
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Core
    ENV: str = "dev"
    MODEL_NAME: str = "llama3:8b"

    # CORS (comma-separated string; parsed in main.py)
    CORS_ORIGINS: str = "*"

    # Paths
    VECTOR_DB_DIR: str = "vectors"
    DATA_DIR: str = "data"
    OUT_DIR: str = "out"

    # Ratelimit
    RATE_LIMIT_PER_MIN: int = 120

    # Auth (leave empty to disable)
    API_TOKEN: Optional[str] = None

    # Vector collection default
    DEFAULT_COLLECTION: str = "default"

    # Pydantic v2 settings
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="",      # read vars as-is (e.g., API_TOKEN)
        extra="ignore",     # ignore unknown/extra env keys (prevents extra_forbidden)
    )

settings = Settings()