

# from pydantic_settings import BaseSettings  # pydantic v2

# class Settings(BaseSettings):
#     # runtime env
#     ENV: str = "dev"

#     # model choice (informational for now)
#     MODEL_NAME: str = "qwen2.5-3b-instruct-4bit"

#     # paths used by the pipeline
#     DATA_DIR: str = "./data"
#     OUT_DIR: str = "./out"
#     VECTOR_DB_DIR: str = "./vectorstore"

#     # optional: if you add a scraping API later
#     SCRAPER_API_KEY: str | None = None

#     class Config:
#         env_file = ".env"

# settings = Settings()



# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Runtime environment
    ENV: str = "dev"

    # Default local LLM model for /summarize
    MODEL_NAME: str = "qwen2.5:3b-instruct"

    # Storage locations
    VECTOR_DB_DIR: str = "vectorstore"
    OUT_DIR: str = "out"
    DATA_DIR: str = "data"  # ← manifests/registries live here

    # Basic rate limiting
    RATE_LIMIT_PER_MIN: int = 60

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()