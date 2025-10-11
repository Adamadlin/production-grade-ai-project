import logging
from app.clients.scraper_client import ScraperClient
from app.utils.types import RawDoc

log = logging.getLogger("ingest")

class IngestManager:
    def __init__(self, scraper: ScraperClient):
        self.scraper = scraper

    async def ingest_urls(self, urls: list[str]) -> list[RawDoc]:
        pages = await self.scraper.fetch_many(urls)
        docs: list[RawDoc] = []
        for u, html in zip(urls, pages):
            docs.append({"url": u, "html": html, "text": None, "meta": {"source": "web"}})
        log.info("Ingested %d pages", len(docs))
        return docs