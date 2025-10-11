import asyncio
import httpx

class ScraperClient:
    def __init__(self, api_key: str | None = None):
        self.api_key = api_key

    async def fetch_text(self, url: str) -> str:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
            r.raise_for_status()
            return r.text

    async def fetch_many(self, urls: list[str]) -> list[str]:
        return await asyncio.gather(*[self.fetch_text(u) for u in urls])