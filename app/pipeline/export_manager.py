import json, csv
from pathlib import Path
from typing import Iterable
from app.config import settings
from app.utils.types import Chunk

class ExportManager:
    def __init__(self, out_dir: str | None = None):
        self.out = Path(out_dir or settings.OUT_DIR)
        self.out.mkdir(parents=True, exist_ok=True)

    def to_json(self, chunks: Iterable[Chunk], name="dataset.json") -> str:
        p = self.out / name
        with p.open("w", encoding="utf-8") as f:
            json.dump(list(chunks), f, ensure_ascii=False, indent=2)
        return str(p)

    def to_csv(self, chunks: Iterable[Chunk], name="dataset.csv") -> str:
        p = self.out / name
        rows = list(chunks)
        if not rows:
            p.write_text("")
            return str(p)
        with p.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=rows[0].keys())
            w.writeheader()
            w.writerows(rows)
        return str(p)