# from app.utils.types import CleanDoc, Chunk

# class ChunkManager:
#     def __init__(self, tokens: int = 1200, overlap: int = 200):
#         self.tokens = tokens
#         self.overlap = overlap

#     def chunk(self, docs: list[CleanDoc]) -> list[Chunk]:
#         chunks: list[Chunk] = []
#         for d in docs:
#             words = d["text"].split()
#             i = 0
#             while i < len(words):
#                 j = min(i + self.tokens, len(words))
#                 text = " ".join(words[i:j])
#                 chunks.append({"source": d["source"], "text": text, "start": i, "end": j, "meta": d["meta"]})
#                 i = j - self.overlap if j - self.overlap > i else j
#         return chunks




from app.utils.types import CleanDoc, Chunk

class ChunkManager:
    def __init__(self, tokens: int = 1000, overlap: int = 120):
        """
        :param tokens: number of words per chunk
        :param overlap: how many words overlap between chunks (helps keep context)
        """
        self.tokens = tokens
        self.overlap = overlap

    def chunk(self, docs: list[CleanDoc]) -> list[Chunk]:
        chunks: list[Chunk] = []
        for d in docs:
            words = d["text"].split()
            i = 0
            while i < len(words):
                j = min(i + self.tokens, len(words))
                text = " ".join(words[i:j])
                chunks.append({
                    "source": d["source"],
                    "text": text,
                    "start": i,
                    "end": j,
                    "meta": d["meta"]
                })
                # slide window forward by tokens - overlap
                i = j - self.overlap if j - self.overlap > i else j
        return chunks