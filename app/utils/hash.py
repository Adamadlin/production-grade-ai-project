# app/utils/hash.py
import hashlib

def sha256_text(text: str) -> str:
    """Deterministic hash for deduping cleaned documents."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()