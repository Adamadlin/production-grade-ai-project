
# .PHONY: dev-backend dev-frontend ollama seed fmt test

# # start FastAPI backend with reload
# dev-backend:
# 	cd app && uvicorn main:app --reload --host 0.0.0.0 --port 8000

# # start Next.js frontend
# dev-frontend:
# 	cd frontend && npm run dev

# # run Ollama and pull models
# ollama:
# 	ollama serve & sleep 1 ; \
# 	ollama pull llama3:8b || true ; \
# 	ollama pull qwen2.5:3b-instruct || true

# # quick seed of some data into the vector DB
# seed:
# 	curl -s -X POST "http://localhost:8000/ingest?tokens=800&overlap=100&force=true" \
# 	  -H "Content-Type: application/json" \
# 	  -d '["https://en.wikipedia.org/wiki/Roman_Empire"]' | jq

# # autoformat python code
# fmt:
# 	ruff fix app || true
# 	black app || true

# # run pytest
# test:
# 	pytest -q


.PHONY: dev-backend dev-frontend ollama seed fmt test

# start FastAPI backend with reload
dev-backend:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# start Next.js frontend
dev-frontend:
	cd frontend && npm run dev

# run Ollama and pull models
ollama:
	ollama serve & sleep 1 ; \
	ollama pull llama3:8b || true ; \
	ollama pull qwen2.5:3b-instruct || true

# quick seed of some data into the vector DB
seed:
	curl -s -X POST "http://localhost:8000/ingest?tokens=800&overlap=100&force=true" \
	  -H "Content-Type: application/json" \
	  -d '["https://en.wikipedia.org/wiki/Roman_Empire"]' | jq

# autoformat python code
fmt:
	ruff fix app || true
	black app || true

# run pytest
test:
	pytest -q