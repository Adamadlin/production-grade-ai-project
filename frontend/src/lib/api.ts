


// // frontend/src/lib/api.ts
// const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

// async function jfetch<T>(path: string, init?: RequestInit): Promise<T> {
//   const url = path.startsWith('http') ? path : `${BASE}${path}`;
//   const res = await fetch(url, {
//     ...init,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(init?.headers || {}),
//     },
//   });
//   if (!res.ok) {
//     const text = await res.text().catch(() => '');
//     throw new Error(text || `HTTP ${res.status}`);
//   }
//   return res.json() as Promise<T>;
// }

// type HealthResp = { ok: boolean; env: string; model: string };
// type SearchResp = {
//   query: string;
//   results: Array<{
//     text: string;
//     meta?: { source?: string; start?: number; end?: number };
//     citation?: string; // "(URL:start-end)"
//   }>;
// };
// type SummarizeParams = {
//   k?: number;
//   model?: string;
//   temperature?: number;
//   max_tokens?: number;
// };
// type SummarizeResp = { topic: string; summary: string; used: number; model: string };
// type IngestResp = {
//   chunks: number;
//   indexed: number;
//   skipped?: number;
//   json: string;
//   csv: string;
//   params: { tokens: number; overlap: number; force?: boolean };
//   avg_chunk_words: number;
//   message?: string;
// };
// type ExamplesResp = { examples: string[] };

// export const api = {
//   health: () => jfetch<HealthResp>('/health'),
//   ingest: (urls: string[], tokens = 1000, overlap = 120, force = false) =>
//     jfetch<IngestResp>(`/ingest?tokens=${tokens}&overlap=${overlap}&force=${String(force)}`, {
//       method: 'POST',
//       body: JSON.stringify(urls),
//     }),
//   search: (q: string, k = 5) => jfetch<SearchResp>(`/search?q=${encodeURIComponent(q)}&k=${k}`),
//   summarize: (topic: string, params: SummarizeParams = {}) => {
//     const qs = new URLSearchParams({
//       topic,
//       k: String(params.k ?? 8),
//       model: params.model ?? 'llama3:8b',
//       temperature: String(params.temperature ?? 0.1),
//       max_tokens: String(params.max_tokens ?? 450),
//     });
//     return jfetch<SummarizeResp>(`/summarize?${qs.toString()}`);
//   },
//   // 👇 NEW: backend-driven example topics
//   examples: (n = 6) =>
//     jfetch<ExamplesResp>(`/examples?${new URLSearchParams({ n: String(n) }).toString()}`),
// };


// frontend/src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

async function jfetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    // Surface Retry-After header if rate-limited:
    const retry = res.headers.get('Retry-After');
    const msg = text || `HTTP ${res.status}` + (retry ? ` (Retry-After: ${retry}s)` : '');
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

type HealthResp = { ok: boolean; env: string; model: string };
type SearchResp = {
  query: string;
  results: Array<{
    text: string;
    meta?: { source?: string; start?: number; end?: number };
    citation?: string; // "(URL:start-end)"
  }>;
};
type SummarizeParams = {
  k?: number;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  source?: string;   // optional backend filter
  domain?: string;   // optional backend filter
};
type SummarizeResp = { topic: string; summary: string; used: number; model: string };
type IngestResp = {
  chunks: number;
  indexed: number;
  skipped?: number;
  json: string;
  csv: string;
  params: { tokens: number; overlap: number; force?: boolean };
  avg_chunk_words: number;
  message?: string;
};
type ExamplesResp = { examples: string[] };

export const api = {
  health: () => jfetch<HealthResp>('/health'),
  ingest: (urls: string[], tokens = 1000, overlap = 120, force = false) =>
    jfetch<IngestResp>(`/ingest?tokens=${tokens}&overlap=${overlap}&force=${String(force)}`, {
      method: 'POST',
      body: JSON.stringify(urls),
    }),
  search: (q: string, k = 5, opts?: { source?: string; domain?: string }) => {
    const qs = new URLSearchParams({ q, k: String(k) });
    if (opts?.source) qs.set('source', opts.source);
    if (opts?.domain) qs.set('domain', opts.domain);
    return jfetch<SearchResp>(`/search?${qs.toString()}`);
  },
  summarize: (topic: string, params: SummarizeParams = {}) => {
    const qs = new URLSearchParams({
      topic,
      k: String(params.k ?? 8),
      model: params.model ?? 'llama3:8b',
      temperature: String(params.temperature ?? 0.1),
      max_tokens: String(params.max_tokens ?? 450),
    });
    if (params.source) qs.set('source', params.source);
    if (params.domain) qs.set('domain', params.domain);
    return jfetch<SummarizeResp>(`/summarize?${qs.toString()}`);
  },
  examples: (n = 6) => jfetch<ExamplesResp>(`/examples?${new URLSearchParams({ n: String(n) }).toString()}`),
};