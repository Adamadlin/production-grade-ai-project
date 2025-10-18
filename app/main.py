



# # app/main.py
# from fastapi import FastAPI, Query, HTTPException, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from urllib.parse import urlparse
# import os, json, re, logging

# from app.config import settings
# from app.logging_conf import setup_logging
# from app.clients.scraper_client import ScraperClient
# from app.pipeline.ingest_manager import IngestManager
# from app.pipeline.clean_manager import CleanManager
# from app.pipeline.chunk_manager import ChunkManager
# from app.pipeline.qc_manager import QCManager
# from app.pipeline.export_manager import ExportManager
# from app.rag.vectordb import VectorDB

# # LLM + summarization
# from app.clients.llm_client import LLMClient
# from app.rag.summarize import (
#     build_prompt,
#     summarize_with_citations,
#     ensure_citations,       # citation checker
#     fix_citations_prompt,   # repair prompt
# )

# # Dedupe + registry helpers
# from app.utils.hash import sha256_text
# from app.utils.registry import IndexRegistry

# # Rate limiting (SlowAPI)
# from slowapi import Limiter
# from slowapi.util import get_remote_address
# from slowapi.errors import RateLimitExceeded
# from slowapi.middleware import SlowAPIMiddleware


# # ---------------- Initialization ----------------
# setup_logging()
# log = logging.getLogger("api")
# app = FastAPI(title="Production-Grade AI Project")

# # CORS (tighten in prod)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Rate limiter
# limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_PER_MIN}/minute"])

# def ratelimit_handler(request: Request, exc: RateLimitExceeded):
#     retry = int(getattr(exc, "reset_in", 60))
#     return JSONResponse(
#         status_code=429,
#         headers={"Retry-After": str(retry)},
#         content={"detail": f"Rate limit exceeded. Try again in ~{retry}s."},
#     )

# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, ratelimit_handler)
# app.add_middleware(SlowAPIMiddleware)

# # Storage directories
# os.makedirs(settings.OUT_DIR, exist_ok=True)
# os.makedirs(settings.VECTOR_DB_DIR, exist_ok=True)
# os.makedirs(settings.DATA_DIR, exist_ok=True)

# # Vector DB + registry
# vdb = VectorDB(path=settings.VECTOR_DB_DIR, collection="chunks")
# reg = IndexRegistry(path=f"{settings.DATA_DIR}/index.jsonl")


# # ---------------- Helpers ----------------
# def _norm_url(u: str) -> str:
#     p = urlparse(u)
#     if not p.scheme or not p.netloc:
#         raise HTTPException(status_code=400, detail=f"Invalid URL: {u}")
#     return f"{p.scheme}://{p.netloc}{p.path or ''}"


# # ---------------- Routes ----------------
# @app.get("/health")
# def health():
#     return {"ok": True, "env": settings.ENV, "model": settings.MODEL_NAME}


# @app.post("/ingest")
# @limiter.limit("10/minute")
# async def ingest(
#     request: Request,
#     urls: list[str],
#     tokens: int = Query(1000, ge=100, le=4000, description="Approx words per chunk"),
#     overlap: int = Query(120, ge=0, le=1000, description="Word overlap between chunks"),
#     force: bool = Query(False, description="Re-index even if unchanged"),
# ):
#     if not isinstance(urls, list) or not urls:
#         raise HTTPException(status_code=400, detail="Body must be a non-empty JSON array of URLs")

#     try:
#         normalized = {_norm_url(u) for u in urls}

#         # Ingest & clean
#         ing = IngestManager(ScraperClient())
#         raw = await ing.ingest_urls(list(normalized))
#         clean = CleanManager().clean(raw)

#         # Dedupe by hash unless force=true
#         deduped, skipped = [], []
#         for d in clean:
#             src = d["source"]
#             h = sha256_text(d["text"])
#             if not force and reg.has(src, h):
#                 skipped.append({"source": src})
#                 continue
#             deduped.append({**d, "hash": h})

#         if not deduped and skipped:
#             return {
#                 "chunks": 0,
#                 "indexed": 0,
#                 "skipped": len(skipped),
#                 "params": {"tokens": tokens, "overlap": overlap, "force": force},
#                 "message": "All inputs already indexed (use ?force=true to re-index).",
#             }

#         # Chunk, QC, export
#         chunks = ChunkManager(tokens=tokens, overlap=overlap).chunk(deduped)
#         qc = QCManager()
#         _ = [qc.evaluate(c) for c in chunks]

#         exp = ExportManager()
#         json_path = exp.to_json(chunks, "dataset.json")
#         csv_path = exp.to_csv(chunks, "dataset.csv")

#         # Index + update registry
#         added = vdb.add_chunks(chunks)
#         for doc in deduped:
#             reg.add(doc["source"], doc["hash"], meta=doc.get("meta", {}))

#         # Metrics
#         avg_words = round(sum((c["end"] - c["start"]) for c in chunks) / len(chunks), 1) if chunks else 0

#         return {
#             "chunks": len(chunks),
#             "indexed": added,
#             "skipped": len(skipped),
#             "json": json_path,
#             "csv": csv_path,
#             "params": {"tokens": tokens, "overlap": overlap, "force": force},
#             "avg_chunk_words": avg_words,
#         }
#     except HTTPException:
#         raise
#     except Exception as e:
#         log.exception("Ingest failed")
#         raise HTTPException(status_code=502, detail=f"Ingest failed: {e}")


# @app.get("/search")
# @limiter.limit("60/minute")
# def search(
#     request: Request,
#     q: str = Query(..., min_length=2),
#     k: int = 5,
# ):
#     try:
#         hits = vdb.search(q, k=k)
#         for h in hits:
#             m = h["meta"]
#             h["citation"] = f"({m['source']}:{m['start']}-{m['end']})"
#         return {"query": q, "results": hits}
#     except Exception as e:
#         log.exception("Search failed")
#         raise HTTPException(status_code=500, detail=str(e))


# @app.get("/summarize")
# @limiter.limit("30/minute")
# def summarize(
#     request: Request,
#     topic: str = Query(..., min_length=2),
#     k: int = 8,                         # more recall by default
#     model: str = "llama3:8b",           # you pulled this model
#     max_tokens: int = 450,
#     temperature: float = 0.1,
# ):
#     """RAG: retrieve top-k, build strict prompt with citations, call local LLM via Ollama."""
#     try:
#         hits = vdb.search(topic, k=k)
#         if not hits:
#             return {"topic": topic, "summary": "(no results)", "used": 0, "model": model}

#         chunks = [
#             {
#                 "source": h["meta"]["source"],
#                 "start": h["meta"]["start"],
#                 "end": h["meta"]["end"],
#                 "text": h["text"],
#             }
#             for h in hits
#         ]

#         prompt = build_prompt(topic, chunks)
#         log.info(f"Sending prompt to LLM (model={model}): {prompt[:200]}...")

#         llm = LLMClient(model=model)
#         summary = llm.generate(prompt, temperature=temperature, max_tokens=max_tokens)

#         # Enforce one-citation-per-sentence; if missing, quick repair pass
#         if not ensure_citations(summary):
#             try:
#                 fix_prompt = fix_citations_prompt(summary)
#                 summary = llm.generate(fix_prompt, temperature=0.0, max_tokens=max_tokens)
#             except Exception:
#                 pass

#         return {"topic": topic, "summary": summary, "used": len(chunks), "model": model}
#     except Exception as e:
#         log.exception("LLM summarize failed")
#         fallback = summarize_with_citations(chunks if 'chunks' in locals() else [], topic) + f"\n\n(LLM error: {e})"
#         return {"topic": topic, "summary": fallback, "used": len(chunks) if 'chunks' in locals() else 0, "model": model}


# @app.get("/examples")
# def examples(n: int = 6):
#     """
#     Return up to n example topics derived from already-indexed sources (data/index.jsonl).
#     Extracts URL slugs/domains and turns them into human-friendly example queries.
#     """
#     try:
#         path = f"{settings.DATA_DIR}/index.jsonl"
#         sources = []
#         if os.path.exists(path):
#             with open(path, "r") as f:
#                 for line in f:
#                     try:
#                         obj = json.loads(line)
#                         src = obj.get("source")
#                         if src and src not in sources:
#                             sources.append(src)
#                     except Exception:
#                         continue

#         topics: list[str] = []
#         for src in sources:
#             p = urlparse(src)
#             last = (p.path or "/").rstrip("/").split("/")[-1]
#             candidate = last or p.netloc
#             candidate = candidate.replace("-", " ")
#             candidate = re.sub(r"\.html?$", "", candidate).strip()
#             if candidate.lower() in ("", "index", "www"):
#                 candidate = p.netloc.replace("www.", "")
#             if candidate and candidate not in topics:
#                 topics.append(candidate)

#         if not topics:
#             topics = [
#                 "emperor",
#                 "roman army tactics",
#                 "history of microsoft",
#                 "reserved domains",
#                 "byzantine emperors",
#             ]

#         return {"examples": topics[: max(1, min(n, 12))]}
#     except Exception:
#         return {"examples": ["emperor", "roman army tactics", "history of microsoft"]}


# app/main.py
from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from urllib.parse import urlparse
from typing import Optional
import os, json, re, logging

from app.config import settings
from app.logging_conf import setup_logging
from app.clients.scraper_client import ScraperClient
from app.pipeline.ingest_manager import IngestManager
from app.pipeline.clean_manager import CleanManager
from app.pipeline.chunk_manager import ChunkManager
from app.pipeline.qc_manager import QCManager
from app.pipeline.export_manager import ExportManager
from app.rag.vectordb import VectorDB

# LLM + summarization
from app.clients.llm_client import LLMClient
from app.rag.summarize import (
    build_prompt,
    summarize_with_citations,
    ensure_citations,
    fix_citations_prompt,
)

# Dedupe + registry helpers
from app.utils.hash import sha256_text
from app.utils.registry import IndexRegistry

# Rate limiting (SlowAPI)
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware


# ---------------- Initialization ----------------
setup_logging()
log = logging.getLogger("api")
app = FastAPI(title="Production-Grade AI Project")

# CORS (tighten in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_PER_MIN}/minute"])

def ratelimit_handler(request: Request, exc: RateLimitExceeded):
    retry = int(getattr(exc, "reset_in", 60))
    return JSONResponse(
        status_code=429,
        headers={"Retry-After": str(retry)},
        content={"detail": f"Rate limit exceeded. Try again in ~{retry}s."},
    )

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, ratelimit_handler)
app.add_middleware(SlowAPIMiddleware)

# Storage directories
os.makedirs(settings.OUT_DIR, exist_ok=True)
os.makedirs(settings.VECTOR_DB_DIR, exist_ok=True)
os.makedirs(settings.DATA_DIR, exist_ok=True)

# Vector DB + registry
vdb = VectorDB(path=settings.VECTOR_DB_DIR, collection="chunks")
reg = IndexRegistry(path=f"{settings.DATA_DIR}/index.jsonl")


# ---------------- Helpers ----------------
def _norm_url(u: str) -> str:
    p = urlparse(u)
    if not p.scheme or not p.netloc:
        raise HTTPException(status_code=400, detail=f"Invalid URL: {u}")
    return f"{p.scheme}://{p.netloc}{p.path or ''}"


def _filter_by_domain(hits: list[dict], domain: Optional[str]) -> list[dict]:
    """Keep only hits whose source netloc endswith the provided domain."""
    if not domain:
        return hits
    dom = domain.strip().lower()
    filtered = []
    for h in hits:
        try:
            netloc = urlparse(h["meta"]["source"]).netloc.lower()
            if netloc.endswith(dom):
                filtered.append(h)
        except Exception:
            continue
    return filtered


# ---------------- Routes ----------------
@app.get("/health")
def health():
    return {"ok": True, "env": settings.ENV, "model": settings.MODEL_NAME}


@app.post("/ingest")
@limiter.limit("10/minute")
async def ingest(
    request: Request,
    urls: list[str],
    tokens: int = Query(1000, ge=100, le=4000, description="Approx words per chunk"),
    overlap: int = Query(120, ge=0, le=1000, description="Word overlap between chunks"),
    force: bool = Query(False, description="Re-index even if unchanged"),
):
    if not isinstance(urls, list) or not urls:
        raise HTTPException(status_code=400, detail="Body must be a non-empty JSON array of URLs")

    try:
        normalized = {_norm_url(u) for u in urls}

        # Ingest & clean
        ing = IngestManager(ScraperClient())
        raw = await ing.ingest_urls(list(normalized))
        clean = CleanManager().clean(raw)

        # Dedupe by hash unless force=true
        deduped, skipped = [], []
        for d in clean:
            src = d["source"]
            h = sha256_text(d["text"])
            if not force and reg.has(src, h):
                skipped.append({"source": src})
                continue
            deduped.append({**d, "hash": h})

        if not deduped and skipped:
            return {
                "chunks": 0,
                "indexed": 0,
                "skipped": len(skipped),
                "params": {"tokens": tokens, "overlap": overlap, "force": force},
                "message": "All inputs already indexed (use ?force=true to re-index).",
            }

        # Chunk, QC, export
        chunks = ChunkManager(tokens=tokens, overlap=overlap).chunk(deduped)
        qc = QCManager()
        _ = [qc.evaluate(c) for c in chunks]

        exp = ExportManager()
        json_path = exp.to_json(chunks, "dataset.json")
        csv_path = exp.to_csv(chunks, "dataset.csv")

        # Index + update registry
        added = vdb.add_chunks(chunks)
        for doc in deduped:
            reg.add(doc["source"], doc["hash"], meta=doc.get("meta", {}))

        # Metrics
        avg_words = round(sum((c["end"] - c["start"]) for c in chunks) / len(chunks), 1) if chunks else 0

        return {
            "chunks": len(chunks),
            "indexed": added,
            "skipped": len(skipped),
            "json": json_path,
            "csv": csv_path,
            "params": {"tokens": tokens, "overlap": overlap, "force": force},
            "avg_chunk_words": avg_words,
        }
    except HTTPException:
        raise
    except Exception as e:
        log.exception("Ingest failed")
        raise HTTPException(status_code=502, detail=f"Ingest failed: {e}")


@app.get("/search")
@limiter.limit("60/minute")
def search(
    request: Request,
    q: str = Query(..., min_length=2),
    k: int = 5,
    domain: Optional[str] = Query(None, description="Limit results to this domain (e.g., 'kali.org' or 'en.wikipedia.org')"),
):
    try:
        hits = vdb.search(q, k=k)
        hits = _filter_by_domain(hits, domain)
        for h in hits:
            m = h["meta"]
            h["citation"] = f"({m['source']}:{m['start']}-{m['end']})"
        return {"query": q, "results": hits, "domain": domain}
    except Exception as e:
        log.exception("Search failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/summarize")
@limiter.limit("30/minute")
def summarize(
    request: Request,
    topic: str = Query(..., min_length=2),
    k: int = 8,                       # more recall by default
    model: str = "llama3:8b",         # you pulled this model
    max_tokens: int = 450,
    temperature: float = 0.1,
    domain: Optional[str] = Query(None, description="Limit results to this domain (e.g., 'kali.org')"),
):
    """RAG: retrieve top-k, optionally filter by domain, then call local LLM via Ollama."""
    try:
        hits = vdb.search(topic, k=k)
        hits = _filter_by_domain(hits, domain)
        if not hits:
            return {"topic": topic, "summary": "(no results)", "used": 0, "model": model, "domain": domain}

        chunks = [
            {
                "source": h["meta"]["source"],
                "start": h["meta"]["start"],
                "end": h["meta"]["end"],
                "text": h["text"],
            }
            for h in hits
        ]

        prompt = build_prompt(topic, chunks)
        log.info(f"Sending prompt to LLM (model={model}): {prompt[:200]}...")

        llm = LLMClient(model=model)
        summary = llm.generate(prompt, temperature=temperature, max_tokens=max_tokens)

        # Enforce one-citation-per-sentence; if missing, quick repair pass
        if not ensure_citations(summary):
            try:
                fix_prompt = fix_citations_prompt(summary)
                summary = llm.generate(fix_prompt, temperature=0.0, max_tokens=max_tokens)
            except Exception:
                pass

        return {"topic": topic, "summary": summary, "used": len(chunks), "model": model, "domain": domain}
    except Exception as e:
        log.exception("LLM summarize failed")
        fallback = summarize_with_citations(chunks if 'chunks' in locals() else [], topic) + f"\n\n(LLM error: {e})"
        return {"topic": topic, "summary": fallback, "used": len(chunks) if 'chunks' in locals() else 0, "model": model, "domain": domain}


@app.get("/examples")
def examples(n: int = 6):
    """
    Return up to n example topics derived from already-indexed sources (data/index.jsonl).
    Extracts URL slugs/domains and turns them into human-friendly example queries.
    """
    try:
        path = f"{settings.DATA_DIR}/index.jsonl"
        sources = []
        if os.path.exists(path):
            with open(path, "r") as f:
                for line in f:
                    try:
                        obj = json.loads(line)
                        src = obj.get("source")
                        if src and src not in sources:
                            sources.append(src)
                    except Exception:
                        continue

        topics: list[str] = []
        for src in sources:
            p = urlparse(src)
            last = (p.path or "/").rstrip("/").split("/")[-1]
            candidate = last or p.netloc
            candidate = candidate.replace("-", " ")
            candidate = re.sub(r"\.html?$", "", candidate).strip()
            if candidate.lower() in ("", "index", "www"):
                candidate = p.netloc.replace("www.", "")
            if candidate and candidate not in topics:
                topics.append(candidate)

        if not topics:
            topics = [
                "emperor",
                "roman army tactics",
                "history of microsoft",
                "reserved domains",
                "byzantine emperors",
            ]

        return {"examples": topics[: max(1, min(n, 12))]}
    except Exception:
        return {"examples": ["emperor", "roman army tactics", "history of microsoft"]}


#  cd ~/Desktop/PRODUCTION_GRADE_AI_PROJECT
# source .venv/bin/activate
# uvicorn app.main:app --reload
#  ollama serve
# cd ~/Desktop/PRODUCTION_GRADE_AI_PROJECT/frontend
# npm run dev