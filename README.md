# 🧠 Production-Grade AI Project  
### Local, Private, End-to-End RAG System (FastAPI + Ollama + Next.js)

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black?logo=next.js)
![Ollama](https://img.shields.io/badge/Ollama-Local%20LLMs-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

> ⚡️ **A production-grade, fully local AI pipeline**  
> Retrieve → Summarize → Chat with your own data, **completely offline**.

---

## 🚀 Overview
This system is a **local Retrieval-Augmented Generation (RAG) stack** that runs end-to-end on your machine — no cloud, no API keys.

It combines:
- 🧩 **FastAPI backend** – handles scraping, ingestion, embedding, and summarization  
- 🖥 **Next.js + Tailwind frontend** – smooth chat-style interface  
- 🧮 **ChromaDB** – vector database for retrieval  
- 🦙 **Ollama** – local LLM runtime (e.g., `llama3:8b`, `qwen2.5:3b-instruct`)



---

## ⚙️ Quick Start

### Prerequisites
- macOS / Linux  
- Python 3.10 +  
- Node 18 + / npm  
- [Ollama](https://ollama.com) installed locally  



```bash
1️⃣ Clone and install

git clone https://github.com/Adamadlin/production-grade-ai-project.git
cd production-grade-ai-project

python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

cd frontend
npm install
cd ..

2️⃣ Run the stack
Open three terminals:

# 🧠 Backend API
source .venv/bin/activate
make dev-backend

# 🤖 Local models
make ollama

# 💬 Frontend UI
cd frontend
npm run dev
Then visit → http://localhost:3000

🧩 How It Works

🪄 1. Ingest

Paste URLs into the “Ingest URLs” box → the backend:
	1.	Fetches and scrapes pages
	2.	Cleans text
	3.	Chunks text (tokens size + overlap)
	4.	Embeds + stores in ChromaDB
	5.	Skips already indexed pages (unless force=true)

🔍 2. Search

Performs semantic similarity search in ChromaDB, returning matching text chunks and their citations.

🧠 3. Summarize

Retrieves → builds prompt → calls local LLM → outputs a summary where every sentence ends with a citation.

Example query:

“How to use Nmap on my local network?”

Output:

The summary explains the tool usage and cites the Kali Linux pages used to build the answer.

⸻

---

## 📄 Upload PDFs (New Feature – Phase A)

You can now upload **local PDF files** directly to the backend — perfect for protected, paywalled, or offline documents.  
The system will extract text, chunk it, embed it, and add it to your vector collection automatically.

### Requirements
Make sure the following dependencies are installed (already in `requirements.txt`):
```bash
pip install python-multipart pdfminer.six

🧮 UI Controls (Frontend)

🔧 Ingest Panel

controll       Description
--------       -----------   
URLs           One per line — pages to scrape + index
tokens         Approx. words per chunk (100–4000)
overlap        Words repeated between chunks
force          Re-index even if content unchanged
collection     Vector namespace (e.g. default, eula_docs)

Result Metrics: chunks, indexed, skipped, avg_chunk_words.



💬 Chat Panel

field      Purpose
----       -------
mode  ---   Search → show chunks; Summarize → generate answer
model  ---   Local LLM (llama3:8b, qwen2.5:3b-instruct, etc.)
k     ---      Number of chunks retrieved before answering
temperature ---   Creativity level (0.0 = strict facts)
max_tokens --- Limit for generated text
domain/source filters --- Restrict search to specific domains or paths
History sidebar --- Saved previous queries in localStorage


🔒 Privacy & Security
	•	Everything runs locally via Ollama
	•	No data leaves your machine
	•	Outbound requests only when you fetch public URLs
	•	Works offline once indexed
	•	Ideal for private R&D, policy auditing, and training use


🏗 Architecture

Frontend (Next.js + Tailwind)
       │
       ▼
FastAPI Backend
 ├── /ingest        → scrape → clean → chunk → embed
 ├── /search        → semantic retrieval from Chroma
 ├── /summarize     → RAG prompt → local LLM → citations
 ├── /examples      → example queries from registry
 └── /health        → system check
       │
       ▼
ChromaDB Vector Store
       │
       ▼
Ollama Runtime (local LLMs)

🎥 Demo

▶ Watch Demo on YouTube
https://youtu.be/lIFiL-V_m18  
*(Short demo: ingesting Kali Linux docs and asking security questions)*

Highlights
	•	Ingests Kali Linux tool pages (Nmap, Metasploit, etc.)
	•	Answers questions like “how do I use Nmap?” with citations
	•	Fully offline and reproducible
	•	Uses llama3:8b and qwen2.5:3b-instruct



Layer       Technology
-----       ---------- 
Backend      FastAPI · Python · pydantic · httpx
Vector DB    ChromaDB
Frontend     Next.js 14 · TypeScript · Tailwind CSS
Models        Llama 3 · Qwen 2.5 (through Ollama)
Misc          SlowAPI (rate limiting) · Makefile (dev automation)


🧭 Repository Structure

production-grade-ai-project/
├── app/
│   ├── clients/          # scraper + LLM clients
│   ├── pipeline/         # ingest, clean, chunk, export
│   ├── rag/              # vector DB + summarization
│   ├── utils/            # hashing + registry helpers
│   ├── config.py         # pydantic settings
│   └── main.py           # FastAPI entrypoint
│
├── frontend/
│   ├── src/app/page.tsx  # main UI
│   ├── components/       # ChatBubble, Sidebar, etc.
│   └── lib/api.ts        # backend communication
│
├── Makefile              # quick dev commands
├── README.md
└── requirements.txt



🧰 Development Commands

Command                 Description
------                  -----------
make dev-backend        Start FastAPI backend
make dev-frontend       Start Next.js frontend
make ollama             Serve Ollama + pull models
make seed               Ingest Wikipedia demo page
make fmt                Format Python code (ruff + black)
make test               Run pytest suite

🧑‍🎓 Author

Adam Adlin
🚀 Full-stack developer & AI systems builder


⸻

🪪 License

MIT License © 2025 Adam Adlin


🌟 Contributing

Pull requests that improve usability, docs, or clarity are welcome.
If you build extensions or use it with your own data, share it via Issues or Discussions!





