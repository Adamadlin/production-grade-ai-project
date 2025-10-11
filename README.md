# Production-Grade AI Project (Video-style replica)

Pipeline: **Ingest → Clean → Chunk → QC → Export** + **Summarize (RAG stub)**  
Run locally:
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload