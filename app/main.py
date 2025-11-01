
#  https://youtu.be/lIFiL-V_m18
# app/main.py
from fastapi import FastAPI, Query, HTTPException, Request, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from urllib.parse import urlparse
import os, json, re, logging, time

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

# PDF support
from app.utils.pdf_reader import pdf_to_text

# Rate limiting (SlowAPI)
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware


# ---------------- Initialization ----------------
setup_logging()
log = logging.getLogger("api")
app = FastAPI(title="Production-Grade AI Project")

# CORS
allow_origins = (
    [o.strip() for o in settings.CORS_ORIGINS.split(",")]
    if getattr(settings, "CORS_ORIGINS", None)
    else ["*"]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
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

# Global registry (per-source dedupe across runs)
reg = IndexRegistry(path=f"{settings.DATA_DIR}/index.jsonl")

# --- Simple bearer auth (demo) ---
bearer_scheme = HTTPBearer(auto_error=False)

def require_auth(creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """
    If settings.API_TOKEN is non-empty, require Authorization: Bearer <token>.
    Otherwise allow all requests.
    """
    token = getattr(settings, "API_TOKEN", None)
    if not token:
        return True
    if not creds or creds.scheme.lower() != "bearer" or creds.credentials != token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

# def require_auth(creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
#     """
#     Very simple demo guard.
#     We USED TO require Authorization: Bearer <token>,
#     but for now we just allow all so UI "just works".
#     """
#     return True


# ---------------- Helpers ----------------
def _norm_url(u: str) -> str:
    """
    Normalize and sanity-check a URL from user input.
    """
    p = urlparse(u)
    if not p.scheme or not p.netloc:
        raise HTTPException(status_code=400, detail=f"Invalid URL: {u}")
    return f"{p.scheme}://{p.netloc}{p.path or ''}"

def _get_vdb(collection: str | None) -> VectorDB:
    """
    Get (or create) a VectorDB handle for a named collection.
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
    Small retry wrapper for LLM calls (Ollama sometimes hiccups).
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
    return {"ok": True, "env": settings.ENV, "model": settings.MODEL_NAME}


@app.post("/ingest")
@limiter.limit("10/minute")
async def ingest(
    request: Request,
    urls: list[str],
    tokens: int = Query(
        1000, ge=100, le=4000, description="Approx words per chunk"
    ),
    overlap: int = Query(
        120, ge=0, le=1000, description="Word overlap between chunks"
    ),
    force: bool = Query(
        False, description="Re-index even if unchanged"
    ),
    collection: str = Query(
        default_factory=lambda: settings.DEFAULT_COLLECTION,
        description="Vector collection namespace",
    ),
    _auth_ok: bool = Depends(require_auth),
):
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
        normalized = {_norm_url(u) for u in urls}

        # 1. Scrape/download
        ing = IngestManager(ScraperClient())
        raw = await ing.ingest_urls(list(normalized))

        # 2. Clean HTML → text
        clean = CleanManager().clean(raw)

        # 3. Deduplicate per-source hash (unless force=true)
        deduped, skipped = [], []
        for d in clean:
            src = d["source"]
            h = sha256_text(d["text"])
            if not force and reg.has(src, h):
                skipped.append({"source": src})
                continue
            deduped.append({**d, "hash": h})

        # If everything was already indexed, short-circuit
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

        # 4. Chunk text
        chunks = ChunkManager(tokens=tokens, overlap=overlap).chunk(deduped)

        # 5. QC (scoring, basic lint)
        qc = QCManager()
        _ = [qc.evaluate(c) for c in chunks]

        # 6. Export dataset snapshot
        exp = ExportManager()
        json_path = exp.to_json(chunks, "dataset.json")
        csv_path = exp.to_csv(chunks, "dataset.csv")

        # 7. Add to vector DB
        vdb = _get_vdb(collection)
        added = vdb.add_chunks(chunks)

        # 8. Update registry so we skip same content in future
        for doc in deduped:
            reg.add(doc["source"], doc["hash"], meta=doc.get("meta", {}))

        # 9. Stats
        avg_words = round(
            sum((c["end"] - c["start"]) for c in chunks) / len(chunks),
            1,
        ) if chunks else 0

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


@app.post("/ingest_file")
@limiter.limit("10/minute")
async def ingest_file(
    request: Request,
    file: UploadFile = File(...),
    tokens: int = Query(
        1000, ge=100, le=4000, description="Approx words per chunk"
    ),
    overlap: int = Query(
        120, ge=0, le=1000, description="Word overlap between chunks"
    ),
    force: bool = Query(
        True, description="Re-index even if unchanged (uploads usually re-send)"
    ),
    collection: str = Query(
        default_factory=lambda: settings.DEFAULT_COLLECTION,
        description="Vector collection namespace",
    ),
    _auth_ok: bool = Depends(require_auth),
):
    """
    Upload a single PDF, extract text, chunk, embed, and index it.
    Great for paywalled/private docs you already have locally.
    """
    req_id = f"ingestfile-{int(time.time()*1000)}"
    log.info(
        f"[{req_id}] ingest_file start: filename={file.filename} "
        f"tokens={tokens} overlap={overlap} force={force} collection={collection}"
    )

    # Require PDF extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only .pdf is supported right now")

    try:
        raw_bytes = await file.read()
        if not raw_bytes:
            raise HTTPException(status_code=400, detail="Empty file upload")

        # 1. Extract text
        text = pdf_to_text(raw_bytes)
        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF (might be scanned image/no OCR)",
            )

        # We'll pretend this is like a URL source so we get citations later
        virtual_source = f"upload://{file.filename}"

        cleaned_doc = {
            "source": virtual_source,
            "text": text,
            "meta": {
                "filename": file.filename,
                "bytes": len(raw_bytes),
            },
        }

        # 2. Deduplicate by hash (unless force=true)
        h = sha256_text(text)
        deduped = []
        skipped = []
        if not force and reg.has(virtual_source, h):
            skipped.append({"source": virtual_source})
        else:
            deduped.append({**cleaned_doc, "hash": h})

        if not deduped and skipped:
            msg = "File already indexed (use ?force=true to re-index)."
            log.info(f"[{req_id}] {msg}")
            return {
                "filename": file.filename,
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

        # 3. Chunk
        chunks = ChunkManager(tokens=tokens, overlap=overlap).chunk(deduped)

        # 4. QC
        qc = QCManager()
        _ = [qc.evaluate(c) for c in chunks]

        # 5. Export snapshot
        exp = ExportManager()
        json_path = exp.to_json(chunks, "dataset.json")
        csv_path = exp.to_csv(chunks, "dataset.csv")

        # 6. Add to vector DB
        vdb = _get_vdb(collection)
        added = vdb.add_chunks(chunks)

        # 7. Mark in registry
        reg.add(virtual_source, h, meta=cleaned_doc.get("meta", {}))

        # 8. Stats
        avg_words = round(
            sum((c["end"] - c["start"]) for c in chunks) / len(chunks),
            1,
        ) if chunks else 0

        out = {
            "filename": file.filename,
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
        log.info(f"[{req_id}] ingest_file done: {out}")
        return out

    except HTTPException:
        raise
    except Exception as e:
        log.exception(f"[{req_id}] ingest_file failed")
        raise HTTPException(
            status_code=502,
            detail=f"Ingest file failed: {e}",
        )


@app.get("/search")
@limiter.limit("60/minute")
def search(
    request: Request,
    q: str = Query(..., min_length=2),
    k: int = 5,
    collection: str = Query(default_factory=lambda: settings.DEFAULT_COLLECTION),
    _auth_ok: bool = Depends(require_auth),
):
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
            f"[{req_id}] search ok: q='{q}' k={k} "
            f"results={len(hits)} collection={collection}"
        )
        return out
    except Exception as e:
        log.exception(f"[{req_id}] Search failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/summarize")
@limiter.limit("30/minute")
def summarize(
    request: Request,
    topic: str = Query(..., min_length=2),
    k: int = 8,
    model: str | None = None,
    max_tokens: int = 450,
    temperature: float = 0.1,
    collection: str = Query(default_factory=lambda: settings.DEFAULT_COLLECTION),
    _auth_ok: bool = Depends(require_auth),
):
    """
    RAG summarize:
    - retrieve top-k chunks from vector DB
    - build strict prompt with citations
    - call local LLM (Ollama)
    - enforce 1 citation per sentence
    """
    req_id = f"sum-{int(time.time()*1000)}"
    model = model or settings.MODEL_NAME

    try:
        vdb = _get_vdb(collection)
        hits = vdb.search(topic, k=k)

        if not hits:
            out = {
                "topic": topic,
                "summary": "(no results)",
                "used": 0,
                "model": model,
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
            f"[{req_id}] LLM prompt (model={model}, k={k}, "
            f"collection={collection}): {prompt[:200]}..."
        )

        llm = LLMClient(model=model)
        summary = _llm_call_with_retry(
            llm,
            prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        # citation enforcement / repair
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
            "model": model,
            "collection": collection,
        }
        log.info(f"[{req_id}] summarize ok: used={len(chunks)}")
        return out

    except Exception as e:
        log.exception(f"[{req_id}] LLM summarize failed")
        fallback = summarize_with_citations(
            chunks if "chunks" in locals() else [],
            topic,
        ) + f"\n\n(LLM error: {e})"
        return {
            "topic": topic,
            "summary": fallback,
            "used": len(chunks) if "chunks" in locals() else 0,
            "model": model,
            "collection": collection,
        }


@app.get("/examples")
def examples(
    n: int = 6,
    collection: str = Query(default_factory=lambda: settings.DEFAULT_COLLECTION),
):
    """
    Return up to n example topics derived from already-indexed sources.
    We read the registry file (data/index.jsonl), pull URL/file names,
    and turn them into human-friendly queries.
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
            last = (p.path or "/").rstrip("/").split("/")[-1] if p.scheme else src
            candidate = last or p.netloc if hasattr(p, "netloc") else src

            # prettify
            candidate = candidate.replace("-", " ")
            candidate = re.sub(r"\.html?$", "", candidate).strip()
            if candidate.lower() in ("", "index", "www"):
                if hasattr(p, "netloc"):
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


# usage notes for you:
# backend:
#   cd ~/Desktop/PRODUCTION_GRADE_AI_PROJECT
#   source .venv/bin/activate
#   make dev-backend
#
# ollama:
#   make ollama   (in another terminal)
#
# frontend:
#   cd frontend
#   npm run dev
#
# then:
#   - Ingest URLs from left panel
#   - Upload PDF in new Upload card
#   - Ask questions in Summarize mode




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