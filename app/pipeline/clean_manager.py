import re
from bs4 import BeautifulSoup
from app.utils.types import RawDoc, CleanDoc

class CleanManager:
    def to_text(self, html: str) -> str:
        soup = BeautifulSoup(html or "", "html.parser")
        text = soup.get_text(" ", strip=True)
        text = re.sub(r"\s+", " ", text)
        return text

    def clean(self, raw: list[RawDoc]) -> list[CleanDoc]:
        out: list[CleanDoc] = []
        for r in raw:
            text = r["text"] or self.to_text(r["html"] or "")
            out.append({"source": r["url"], "text": text, "meta": r["meta"]})
        return out