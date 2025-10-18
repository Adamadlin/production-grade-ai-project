# 🧠 Production-Grade AI Project  
**End-to-End Retrieval-Augmented Generation (RAG) System built with FastAPI, Ollama, and Next.js**

---

## 🚀 Overview  
A **full-stack, production-ready AI system** built completely from scratch.  
It combines a **Python FastAPI backend** for ingestion, retrieval, and summarization with a **Next.js + Tailwind frontend** that delivers a smooth, chat-style experience.

> 💡 **Paste any URL** — Wikipedia, blogs, EULAs — and the system will:  
> 🔍 Crawl & clean it  
> 📚 Index it in a local vector DB  
> 🧠 Search or summarize with verified inline citations  
> ⚡ Run fully offline with local Ollama models  

---

## 🧩 Tech Stack  

### 🖥 Backend (AI Core)
| Component | Purpose |
|------------|----------|
| **FastAPI** | High-performance async API framework |
| **Chroma Vector DB** | Persistent local embedding store |
| **Ollama** | Runs local LLMs *(llama3 8B / qwen2.5 3B-instruct)* |
| **Sentence Transformers** | Embedding & semantic retrieval |
| **SlowAPI** | Rate-limiting middleware |
| **Structured Logging** | Clean, production-grade logs |

### 💻 Frontend (UI)
| Component | Purpose |
|------------|----------|
| **Next.js 14 (App Router)** | Modern React framework |
| **React 18 + Hooks** | Declarative interface |
| **Tailwind CSS** | Clean, responsive design |
| **React Markdown + GFM** | Citation-friendly output |
| **TypeScript** | Safe, maintainable code |

---

## 🏗️ Architecture 
User
↓
Next.js (Frontend)
↓
FastAPI (Backend)
↓
RAG Pipeline → Ollama (LLM)
↓
Chroma Vector DB


### Pipeline Flow
| Endpoint | Description |
|-----------|--------------|
| `/ingest` | Scrape → clean → chunk → embed → index documents |
| `/search` | Retrieve semantically similar text |
| `/summarize` | Generate summaries with strict citation rules |

---

## 🧱 Folder Structure 
├── app/                # FastAPI backend
│   ├── clients/        # Scraper, LLM, storage connectors
│   ├── pipeline/       # Ingestion, cleaning, chunking, QC
│   ├── rag/            # RAG + summarization logic
│   └── utils/          # Hashing, registry, timing, etc.
│
├── frontend/           # Next.js + Tailwind app
│   ├── src/app/        # Main pages
│   ├── src/components/ # ChatBubble, Spinner, Toast
│   └── src/lib/        # API wrapper
│
├── vectorstore/        # Persisted embeddings
├── data/               # Registry / indexes
├── out/                # Exported datasets
└── scripts/cli.py      # Optional CLI entry

---

## ⚙️ Local Setup  

### 1️⃣ Backend — FastAPI + Ollama
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Start Ollama (ensure model pulled)
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

Then open 👉 http://localhost:3000
(The frontend automatically connects to http://localhost:8000 as defined in .env.local.)


Example Usage
	1.	In the web UI, paste a URL (e.g. https://en.wikipedia.org/wiki/History_of_Microsoft)
	2.	Click Ingest to index it
	3.	Type a topic like “history of Microsoft” and click Summarize
	4.	The result will show citations, for example:

Microsoft was founded by Bill Gates and Paul Allen in 1975 (wiki:400–900).
Windows later dominated global PC markets (wiki:10800–11300).


## 🎥 Demo Video

[![Production-Grade AI Project Demo](https://img.youtube.com/vi/lIFiL-V_m18/0.jpg)](https://youtu.be/lIFiL-V_m18)
> Demonstration of ingesting Kali Linux documentation and generating summarized responses using **Qwen 2.5:3B-Instruct**.


Environment Variables
.env (Backend)

MODEL_NAME=llama3:8b
RATE_LIMIT_PER_MIN=30
ENV=local
OUT_DIR=out
DATA_DIR=data
VECTOR_DB_DIR=vectorstore
.env.local (Frontend)

NEXT_PUBLIC_API_BASE=http://localhost:8000



Endpoint :/health
Method :GET
Description : Check server status


Endpoint :/ingest
Method: POST
Descruption: Crawl + embed web data


Endpoint :/search
Method: GET
Description :Semantic retrieval

Endpoint : /summarize
Method: GET
Description :Generate a cited summary



License

MIT © 2025 Adam Adlin


If you like this project, please ⭐ star the repo — it really helps!
Connect with me on LinkedIn for updates and future releases.
