import httpx

class LLMClient:
    def __init__(self, model: str = "qwen2.5:3b-instruct", base_url: str = "http://localhost:11434"):
        self.model = model
        self.base_url = base_url.rstrip("/")

    def generate(self, prompt: str, temperature: float = 0.2, max_tokens: int = 512) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "options": {"temperature": temperature, "num_predict": max_tokens},
            "stream": False,
        }
        with httpx.Client(timeout=120) as client:
            r = client.post(f"{self.base_url}/api/generate", json=payload)
            r.raise_for_status()
            return (r.json().get("response") or "").strip()