# 🧠 Production-Grade AI Project  
**End-to-end Retrieval-Augmented Generation (RAG) system with FastAPI, Ollama, and Next.js**

---

## 🚀 Overview
A full-stack, production-ready **AI system** built completely from scratch.  
It combines a **Python FastAPI backend** for ingestion, retrieval, and summarization with a **Next.js + Tailwind** frontend that delivers a smooth, chat-style user experience.

💡 Paste any URL — Wikipedia, blogs, EULAs — and the system will:
- 🔍 **Crawl** and clean it  
- 📚 **Index** it in a local vector DB  
- 🧠 **Search** or **Summarize** with verified inline citations  
- ⚡ Run fully offline with local Ollama models  

---

## 🧩 Tech Stack

### 🖥 Backend (AI Core)
- **FastAPI** – blazing-fast API framework  
- **Chroma Vector DB** – persistent local embedding store  
- **Ollama** – runs local LLMs (`llama3:8b`, `qwen2.5:3b-instruct`)  
- **Sentence Transformers** – text embedding and retrieval  
- **SlowAPI** – rate limiting middleware  
- **Structured Logging** – clean, production-grade logs  

### 💻 Frontend (UI)
- **Next.js 14 (App Router)** – modern React framework  
- **React 18 + Hooks** – declarative interface  
- **Tailwind CSS** – clean, responsive design  
- **React Markdown + GFM** – citation-friendly output  
- **TypeScript** – safe and maintainable code  

---

## 🏗️ Architecture
User → Next.js UI → FastAPI Backend → RAG Pipeline → Ollama (LLM)
↓
Chroma Vector DB

### Flow:
1. `/ingest` — Scrape, clean, chunk, embed, and index documents.  
2. `/search` — Retrieve semantically similar text.  
3. `/summarize` — Generate a summary with strict citation rules.  

---

## 🧱 Folder Structure
PRODUCTION_GRADE_AI_PROJECT/
├── app/                 # FastAPI backend
│   ├── clients/         # Scraper, LLM, storage connectors
│   ├── pipeline/        # Ingestion, cleaning, chunking, QC
│   ├── rag/             # RAG + summarization logic
│   └── utils/           # Hashing, registry, timing, etc.
├── frontend/            # Next.js + Tailwind app
│   ├── src/app/         # Main pages
│   ├── src/components/  # ChatBubble, Spinner, Toast
│   └── src/lib/         # API wrapper
├── vectorstore/         # Persisted embeddings
├── data/                # Registry / indexes
├── out/                 # Exported datasets
└── scripts/cli.py       # Optional CLI entr

---

## ⚙️ Local Setup

### 1️⃣ Backend — FastAPI + Ollama
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Start Ollama (must have model pulled)
ollama serve
ollama pull llama3:8b

# Run the backend
uvicorn app.main:app --reload --port 8000

Test:
curl http://localhost:8000/health


2️⃣ Frontend — Next.js UI
cd frontend
npm install
npm run dev
Now open 👉 http://localhost:3000

(Frontend automatically connects to http://localhost:8000 as defined in .env.local.)



🧠 Example Usage
	1.	In the web UI, paste a URL (e.g. https://en.wikipedia.org/wiki/History_of_Microsoft)
	2.	Click Ingest to index it
	3.	Type a topic like “history of Microsoft” and click Summarize
	4.	The result will show:
Microsoft was founded by Bill Gates and Paul Allen in 1975 (wiki:400–900).
Windows later dominated global PC markets (wiki:10800–11300).

🧰 Environment Variables
.env (backend)
MODEL_NAME=llama3:8b
RATE_LIMIT_PER_MIN=30
ENV=local
OUT_DIR=out
DATA_DIR=data
VECTOR_DB_DIR=vectorstore

.env.local (frontend)
NEXT_PUBLIC_API_BASE=http://localhost:8000




🧪 API Reference
Endpoint :/health
Method:GET
Description:Check server status


Endpoint:/ingest
Method:POST
Description:Crawl and embed web 

Endpoint:/search
Method:GET
Description:Semantic retrieval


Endpoint:/summarize
Method:GET
Description:Generate a cited summary


