# app/utils/registry.py
from __future__ import annotations
import json
import os
import time
from typing import Dict, Optional

class IndexRegistry:
    """
    Minimal JSONL registry to track ingested documents and avoid duplicates.
    Keyed by (url, hash). Each line: {"url": "...", "hash": "...", "added_at": 1699999999, "meta": {...}}
    """

    def __init__(self, path: str):
        self.path = path
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        self._known: dict[tuple[str, str], dict] = {}
        if os.path.exists(self.path):
            with open(self.path, "r", encoding="utf-8") as f:
                for line in f:
                    try:
                        rec = json.loads(line)
                        key = ((rec.get("url") or rec.get("source")), rec["hash"])
                        self._known[key] = rec
                    except Exception:
                        # Ignore malformed lines
                        pass

    def has(self, url: str, h: str) -> bool:
        return (url, h) in self._known

    def add(self, url: str, h: str, meta: Optional[Dict] = None) -> None:
        rec = {
            "url": url,
            "hash": h,
            "added_at": int(time.time()),
            "meta": meta or {},
        }
        with open(self.path, "a", encoding="utf-8") as f:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
        self._known[(url, h)] = rec