# app/rag/vectordb.py
from typing import List, Dict
import chromadb
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction

class VectorDB:
    def __init__(self, path: str = "./vectorstore", collection: str = "chunks"):
        self.client = chromadb.PersistentClient(path=path)
        # Uses FastEmbed under the hood if installed (we installed it)
        self.col = self.client.get_or_create_collection(
            name=collection,
            embedding_function=DefaultEmbeddingFunction()
        )

    def add_chunks(self, chunks: List[Dict]) -> int:
        ids = []
        docs = []
        metas = []
        for c in chunks:
            cid = f"{c['source']}#{c['start']}-{c['end']}"
            ids.append(cid)
            docs.append(c["text"])
            metas.append({"source": c["source"], "start": c["start"], "end": c["end"]})
        # Chroma will embed automatically because we set embedding_function
        self.col.add(ids=ids, documents=docs, metadatas=metas)
        return len(ids)

    def search(self, query: str, k: int = 5):
        res = self.col.query(query_texts=[query], n_results=k)
        # Normalize into a list of {text, metadata}
        out = []
        for text, meta in zip(res["documents"][0], res["metadatas"][0]):
            out.append({"text": text, "meta": meta})
        return out