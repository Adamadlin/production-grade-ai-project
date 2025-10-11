import typer, asyncio
from app.clients.scraper_client import ScraperClient
from app.pipeline.ingest_manager import IngestManager
from app.pipeline.clean_manager import CleanManager
from app.pipeline.chunk_manager import ChunkManager
from app.pipeline.export_manager import ExportManager
from app.rag.summarize import summarize_with_citations

cli = typer.Typer()

@cli.command()
def ingest(url: str):
    async def run():
        ing = IngestManager(ScraperClient())
        raw = await ing.ingest_urls([url])
        clean = CleanManager().clean(raw)
        chunks = ChunkManager().chunk(clean)
        out = ExportManager()
        path = out.to_json(chunks, "dataset.json")
        typer.echo(f"Wrote {path} ({len(chunks)} chunks)")
    asyncio.run(run())

@cli.command()
def summarize(topic: str):
    dummy = [{"source": "example", "start": 0, "end": 50, "text": "", "meta": {}}]
    print(summarize_with_citations(dummy, topic))

if __name__ == "__main__":
    cli()