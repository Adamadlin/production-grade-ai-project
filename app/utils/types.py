from typing import TypedDict, Dict

class RawDoc(TypedDict):
    url: str
    html: str | None
    text: str | None
    meta: Dict[str, str]

class CleanDoc(TypedDict):
    source: str
    text: str
    meta: Dict[str, str]

class Chunk(TypedDict):
    source: str
    text: str
    start: int
    end: int
    meta: Dict[str, str]

class QCEval(TypedDict):
    toxicity: float
    pii: float
    bias: float