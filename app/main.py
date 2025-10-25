





# # app/main.py
# from fastapi import FastAPI, Query, HTTPException, Request, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
# from urllib.parse import urlparse
# import os, json, re, logging, time

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
#     ensure_citations,
#     fix_citations_prompt,
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

# # CORS
# allow_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")] if settings.CORS_ORIGINS else ["*"]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=allow_origins,
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

# # Registry (per-source dedupe)
# reg = IndexRegistry(path=f"{settings.DATA_DIR}/index.jsonl")

# # --- Simple bearer auth (demo) ---
# bearer_scheme = HTTPBearer(auto_error=False)

# def require_auth(creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
#     """
#     Very simple demo guard: if API_TOKEN is set, require 'Authorization: Bearer <token>'.
#     """
#     token_required = bool(settings.API_TOKEN)
#     if not token_required:
#         return True
#     if not creds or creds.scheme.lower() != "bearer" or creds.credentials != settings.API_TOKEN:
#         raise HTTPException(status_code=401, detail="Unauthorized")
#     return True

# # ---------------- Helpers ----------------
# def _norm_url(u: str) -> str:
#     p = urlparse(u)
#     if not p.scheme or not p.netloc:
#         raise HTTPException(status_code=400, detail=f"Invalid URL: {u}")
#     return f"{p.scheme}://{p.netloc}{p.path or ''}"

# def _get_vdb(collection: str | None) -> VectorDB:
#     return VectorDB(path=settings.VECTOR_DB_DIR, collection=(collection or settings.DEFAULT_COLLECTION))

# def _llm_call_with_retry(llm: LLMClient, prompt: str, temperature: float, max_tokens: int, attempts: int = 2):
#     """
#     Small retry wrapper for LLM calls (Ollama sometimes hiccups).
#     """
#     last_err = None
#     for i in range(1, attempts + 1):
#         try:
#             return llm.generate(prompt, temperature=temperature, max_tokens=max_tokens)
#         except Exception as e:
#             last_err = e
#             log.warning(f"LLM generate failed (attempt {i}/{attempts}): {e}")
#             time.sleep(0.6 * i)
#     raise last_err

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
#     collection: str = Query(settings.DEFAULT_COLLECTION, description="Vector collection namespace"),
#     _auth_ok: bool = Depends(require_auth),
# ):
#     req_id = f"ingest-{int(time.time()*1000)}"
#     log.info(f"[{req_id}] ingest start: urls={len(urls)} tokens={tokens} overlap={overlap} force={force} collection={collection}")
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
#             msg = "All inputs already indexed (use ?force=true to re-index)."
#             log.info(f"[{req_id}] {msg}")
#             return {
#                 "chunks": 0,
#                 "indexed": 0,
#                 "skipped": len(skipped),
#                 "params": {"tokens": tokens, "overlap": overlap, "force": force, "collection": collection},
#                 "message": msg,
#             }

#         # Chunk, QC, export
#         chunks = ChunkManager(tokens=tokens, overlap=overlap).chunk(deduped)
#         qc = QCManager()
#         _ = [qc.evaluate(c) for c in chunks]

#         exp = ExportManager()
#         json_path = exp.to_json(chunks, "dataset.json")
#         csv_path = exp.to_csv(chunks, "dataset.csv")

#         # Index + update registry
#         vdb = _get_vdb(collection)
#         added = vdb.add_chunks(chunks)
#         for doc in deduped:
#             reg.add(doc["source"], doc["hash"], meta=doc.get("meta", {}))

#         # Metrics
#         avg_words = round(sum((c["end"] - c["start"]) for c in chunks) / len(chunks), 1) if chunks else 0

#         out = {
#             "chunks": len(chunks),
#             "indexed": added,
#             "skipped": len(skipped),
#             "json": json_path,
#             "csv": csv_path,
#             "params": {"tokens": tokens, "overlap": overlap, "force": force, "collection": collection},
#             "avg_chunk_words": avg_words,
#         }
#         log.info(f"[{req_id}] ingest done: {out}")
#         return out
#     except HTTPException:
#         raise
#     except Exception as e:
#         log.exception(f"[{req_id}] Ingest failed")
#         raise HTTPException(status_code=502, detail=f"Ingest failed: {e}")

# @app.get("/search")
# @limiter.limit("60/minute")
# def search(
#     request: Request,
#     q: str = Query(..., min_length=2),
#     k: int = 5,
#     collection: str = Query(settings.DEFAULT_COLLECTION),
#     _auth_ok: bool = Depends(require_auth),
# ):
#     req_id = f"search-{int(time.time()*1000)}"
#     try:
#         vdb = _get_vdb(collection)
#         hits = vdb.search(q, k=k)
#         for h in hits:
#             m = h["meta"]
#             h["citation"] = f"({m['source']}:{m['start']}-{m['end']})"
#         out = {"query": q, "results": hits, "collection": collection}
#         log.info(f"[{req_id}] search ok: k={k} results={len(hits)} collection={collection}")
#         return out
#     except Exception as e:
#         log.exception(f"[{req_id}] Search failed")
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/summarize")
# @limiter.limit("30/minute")
# def summarize(
#     request: Request,
#     topic: str = Query(..., min_length=2),
#     k: int = 8,
#     model: str = None,
#     max_tokens: int = 450,
#     temperature: float = 0.1,
#     collection: str = Query(settings.DEFAULT_COLLECTION),
#     _auth_ok: bool = Depends(require_auth),
# ):
#     """RAG: retrieve top-k, build strict prompt with citations, call local LLM via Ollama."""
#     req_id = f"sum-{int(time.time()*1000)}"
#     model = model or settings.MODEL_NAME
#     try:
#         vdb = _get_vdb(collection)
#         hits = vdb.search(topic, k=k)
#         if not hits:
#             out = {"topic": topic, "summary": "(no results)", "used": 0, "model": model, "collection": collection}
#             log.info(f"[{req_id}] summarize no-results: {out}")
#             return out

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
#         log.info(f"[{req_id}] LLM prompt (model={model}, k={k}, collection={collection}): {prompt[:200]}...")

#         llm = LLMClient(model=model)
#         summary = _llm_call_with_retry(llm, prompt, temperature=temperature, max_tokens=max_tokens)

#         # Enforce one-citation-per-sentence; if missing, quick repair pass
#         if not ensure_citations(summary):
#             try:
#                 fix_prompt = fix_citations_prompt(summary)
#                 summary = _llm_call_with_retry(llm, fix_prompt, temperature=0.0, max_tokens=max_tokens)
#             except Exception as e:
#                 log.warning(f"[{req_id}] citation-fix failed: {e}")

#         out = {"topic": topic, "summary": summary, "used": len(chunks), "model": model, "collection": collection}
#         log.info(f"[{req_id}] summarize ok: used={len(chunks)}")
#         return out
#     except Exception as e:
#         log.exception(f"[{req_id}] LLM summarize failed")
#         fallback = summarize_with_citations(chunks if 'chunks' in locals() else [], topic) + f"\n\n(LLM error: {e})"
#         return {"topic": topic, "summary": fallback, "used": len(chunks) if 'chunks' in locals() else 0, "model": model, "collection": collection}

# @app.get("/examples")
# def examples(n: int = 6, collection: str = Query(settings.DEFAULT_COLLECTION)):
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
#                         # OPTIONAL: you could store collection in registry meta and filter here
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

#         return {"examples": topics[: max(1, min(n, 12))], "collection": collection}
#     except Exception:
#         return {"examples": ["emperor", "roman army tactics", "history of microsoft"], "collection": collection}



#  cd ~/Desktop/PRODUCTION_GRADE_AI_PROJECT
# source .venv/bin/activate
# uvicorn app.main:app --reload
#  ollama serve
# cd ~/Desktop/PRODUCTION_GRADE_AI_PROJECT/frontend
# npm run dev



# https://youtu.be/lIFiL-V_m18











# app/main.py
from fastapi import FastAPI, Query, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from urllib.parse import urlparse
import os, json, re, logging, time
from typing import List, Optional

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

# CORS using settings.cors_list()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{settings.RATE_LIMIT_PER_MIN}/minute"],
)

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

# Registry (per-source dedupe)
reg = IndexRegistry(path=f"{settings.DATA_DIR}/index.jsonl")


# --- Simple bearer auth (demo) ---
bearer_scheme = HTTPBearer(auto_error=False)

def require_auth(creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """
    If settings.API_TOKEN is non-empty, require Authorization: Bearer <token>.
    Otherwise allow all.
    """
    # if not settings.API_TOKEN:
    #     return True
    # if (
    #     not creds
    #     or creds.scheme.lower() != "bearer"
    #     or creds.credentials != settings.API_TOKEN
    # ):
    #     raise HTTPException(status_code=401, detail="Unauthorized")
    return True


# ---------------- Helpers ----------------
def _norm_url(u: str) -> str:
    """
    Clean + validate a URL, strip querystring/fragments.
    """
    p = urlparse(u)
    if not p.scheme or not p.netloc:
        raise HTTPException(status_code=400, detail=f"Invalid URL: {u}")
    return f"{p.scheme}://{p.netloc}{p.path or ''}"


def _get_vdb(collection: Optional[str]) -> VectorDB:
    """
    Return a VectorDB handle for a given collection.
    """
    return VectorDB(
        path=settings.VECTOR_DB_DIR,
        collection=(collection or settings.DEFAULT_COLLECTION),
    )


def _llm_call_with_retry(
    llm: LLMClient,
    prompt: str,
    temperature: float,
    max_tokens: int,
    attempts: int = 2,
):
    """
    Tiny retry loop for Ollama hiccups.
    """
    last_err = None
    for i in range(1, attempts + 1):
        try:
            return llm.generate(
                prompt,
                temperature=temperature,
                max_tokens=max_tokens,
            )
        except Exception as e:
            last_err = e
            log.warning(f"LLM generate failed (attempt {i}/{attempts}): {e}")
            time.sleep(0.6 * i)
    raise last_err


# ---------------- Routes ----------------
@app.get("/health")
def health():
    return {
        "ok": True,
        "env": settings.ENV,
        "model": settings.MODEL_NAME,
    }


@app.post("/ingest")
@limiter.limit("10/minute")
async def ingest(
    request: Request,
    urls: List[str],
    tokens: int = Query(
        1000, ge=100, le=4000,
        description="Approx words per chunk"
    ),
    overlap: int = Query(
        120, ge=0, le=1000,
        description="Word overlap between chunks"
    ),
    force: bool = Query(
        False,
        description="Re-index even if unchanged"
    ),
    collection: str = Query(
        default=settings.DEFAULT_COLLECTION,
        description="Vector collection namespace"
    ),
    _auth_ok: bool = Depends(require_auth),
):
    """
    Ingest one or more URLs:
    1. scrape
    2. clean
    3. dedupe by hash unless force=true
    4. chunk, QC, export
    5. add to vector DB
    """
    req_id = f"ingest-{int(time.time()*1000)}"
    log.info(
        f"[{req_id}] ingest start: urls={len(urls)} "
        f"tokens={tokens} overlap={overlap} force={force} collection={collection}"
    )

    if not isinstance(urls, list) or not urls:
        raise HTTPException(
            status_code=400,
            detail="Body must be a non-empty JSON array of URLs",
        )

    try:
        # normalize incoming URLs
        normalized = {_norm_url(u) for u in urls}

        # scrape
        ing = IngestManager(ScraperClient())
        raw = await ing.ingest_urls(list(normalized))

        # clean html -> text
        clean = CleanManager().clean(raw)

        # local dedupe
        deduped, skipped = [], []
        for d in clean:
            src = d["source"]
            h = sha256_text(d["text"])
            if not force and reg.has(src, h):
                skipped.append({"source": src})
                continue
            deduped.append({**d, "hash": h})

        if not deduped and skipped:
            msg = "All inputs already indexed (use ?force=true to re-index)."
            log.info(f"[{req_id}] {msg}")
            return {
                "chunks": 0,
                "indexed": 0,
                "skipped": len(skipped),
                "params": {
                    "tokens": tokens,
                    "overlap": overlap,
                    "force": force,
                    "collection": collection,
                },
                "message": msg,
            }

        # chunk + qc
        chunks = ChunkManager(tokens=tokens, overlap=overlap).chunk(deduped)
        qc = QCManager()
        _ = [qc.evaluate(c) for c in chunks]

        # export (debugging / offline inspection)
        exp = ExportManager()
        json_path = exp.to_json(chunks, "dataset.json")
        csv_path = exp.to_csv(chunks, "dataset.csv")

        # add to vector db
        vdb = _get_vdb(collection)
        added = vdb.add_chunks(chunks)

        # update registry
        for doc in deduped:
            reg.add(doc["source"], doc["hash"], meta=doc.get("meta", {}))

        # stats
        avg_words = (
            round(
                sum((c["end"] - c["start"]) for c in chunks) / len(chunks),
                1,
            )
            if chunks else 0
        )

        out = {
            "chunks": len(chunks),
            "indexed": added,
            "skipped": len(skipped),
            "json": json_path,
            "csv": csv_path,
            "params": {
                "tokens": tokens,
                "overlap": overlap,
                "force": force,
                "collection": collection,
            },
            "avg_chunk_words": avg_words,
        }
        log.info(f"[{req_id}] ingest done: {out}")
        return out

    except HTTPException:
        raise
    except Exception as e:
        log.exception(f"[{req_id}] Ingest failed")
        raise HTTPException(
            status_code=502,
            detail=f"Ingest failed: {e}",
        )


@app.get("/search")
@limiter.limit("60/minute")
def search(
    request: Request,
    q: str = Query(..., min_length=2),
    k: int = 5,
    collection: str = Query(settings.DEFAULT_COLLECTION),
    _auth_ok: bool = Depends(require_auth),
):
    """
    Semantic vector search against your ingested chunks.
    """
    req_id = f"search-{int(time.time()*1000)}"
    try:
        vdb = _get_vdb(collection)
        hits = vdb.search(q, k=k)

        for h in hits:
            m = h["meta"]
            h["citation"] = f"({m['source']}:{m['start']}-{m['end']})"

        out = {
            "query": q,
            "results": hits,
            "collection": collection,
        }
        log.info(
            f"[{req_id}] search ok: k={k} "
            f"results={len(hits)} collection={collection}"
        )
        return out

    except Exception as e:
        log.exception(f"[{req_id}] Search failed")
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@app.get("/summarize")
@limiter.limit("30/minute")
def summarize(
    request: Request,
    topic: str = Query(..., min_length=2),
    k: int = 8,
    model: Optional[str] = None,
    max_tokens: int = 450,
    temperature: float = 0.1,
    collection: str = Query(settings.DEFAULT_COLLECTION),
    _auth_ok: bool = Depends(require_auth),
):
    """
    Retrieve top-k relevant chunks -> build strict prompt with citations ->
    ask local LLM -> ensure every sentence cites a source.
    """
    req_id = f"sum-{int(time.time()*1000)}"
    chosen_model = model or settings.MODEL_NAME

    try:
        vdb = _get_vdb(collection)
        hits = vdb.search(topic, k=k)

        if not hits:
            out = {
                "topic": topic,
                "summary": "(no results)",
                "used": 0,
                "model": chosen_model,
                "collection": collection,
            }
            log.info(f"[{req_id}] summarize no-results: {out}")
            return out

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
        log.info(
            f"[{req_id}] LLM prompt (model={chosen_model}, k={k}, "
            f"collection={collection}): {prompt[:200]}..."
        )

        llm = LLMClient(model=chosen_model)
        summary = _llm_call_with_retry(
            llm,
            prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        # try to enforce "1 citation per sentence"
        if not ensure_citations(summary):
            try:
                fix_prompt = fix_citations_prompt(summary)
                summary = _llm_call_with_retry(
                    llm,
                    fix_prompt,
                    temperature=0.0,
                    max_tokens=max_tokens,
                )
            except Exception as e:
                log.warning(f"[{req_id}] citation-fix failed: {e}")

        out = {
            "topic": topic,
            "summary": summary,
            "used": len(chunks),
            "model": chosen_model,
            "collection": collection,
        }
        log.info(f"[{req_id}] summarize ok: used={len(chunks)}")
        return out

    except Exception as e:
        log.exception(f"[{req_id}] LLM summarize failed")
        # fallback: local heuristic summarizer
        fallback = (
            summarize_with_citations(
                chunks if "chunks" in locals() else [],
                topic,
            )
            + f"\n\n(LLM error: {e})"
        )
        return {
            "topic": topic,
            "summary": fallback,
            "used": len(chunks) if "chunks" in locals() else 0,
            "model": chosen_model,
            "collection": collection,
        }


@app.get("/examples")
def examples(
    n: int = 6,
    collection: str = Query(settings.DEFAULT_COLLECTION),
):
    """
    Return up to n example topics derived from already-indexed sources (data/index.jsonl).
    We turn URL slugs/etc. into human-friendly queries.
    """
    try:
        path = f"{settings.DATA_DIR}/index.jsonl"
        sources: List[str] = []

        if os.path.exists(path):
            with open(path, "r") as f:
                for line in f:
                    try:
                        obj = json.loads(line)
                        src = obj.get("source")
                        # NOTE: if you later store collection info in registry,
                        # filter it here against `collection`
                        if src and src not in sources:
                            sources.append(src)
                    except Exception:
                        continue

        topics: List[str] = []
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

        return {
            "examples": topics[: max(1, min(n, 12))],
            "collection": collection,
        }

    except Exception:
        return {
            "examples": [
                "emperor",
                "roman army tactics",
                "history of microsoft",
            ],
            "collection": collection,
        }


# Handy reference (not executed):
#
# dev order:
#   1. source .venv/bin/activate
#   2. make dev-backend      # FastAPI @ :8000
#   3. make ollama           # start/pull models in another terminal
#   4. make dev-frontend     # Next.js @ :3000
#
# ingest example (in UI or curl):
#   POST /ingest
#   body: ["https://en.wikipedia.org/wiki/Roman_Empire"]
#
# demo video:
#   https://youtu.be/lIFiL-V_m18



# terminal 1
# cd ~/Desktop/PRODUCTION_GRADE_AI_PROJECT
# source .venv/bin/activate
# make dev-backend


# terminal 2
# cd ~/Desktop/PRODUCTION_GRADE_AI_PROJECT
# make ollama


# terminal 3
# cd ~/Desktop/PRODUCTION_GRADE_AI_PROJECT/frontend
# npm run dev