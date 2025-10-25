


// frontend/src/lib/api.ts
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
//     // Surface Retry-After header if rate-limited:
//     const retry = res.headers.get('Retry-After');
//     const msg = text || `HTTP ${res.status}` + (retry ? ` (Retry-After: ${retry}s)` : '');
//     throw new Error(msg);
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
//   source?: string;   // optional backend filter
//   domain?: string;   // optional backend filter
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
//   search: (q: string, k = 5, opts?: { source?: string; domain?: string }) => {
//     const qs = new URLSearchParams({ q, k: String(k) });
//     if (opts?.source) qs.set('source', opts.source);
//     if (opts?.domain) qs.set('domain', opts.domain);
//     return jfetch<SearchResp>(`/search?${qs.toString()}`);
//   },
//   summarize: (topic: string, params: SummarizeParams = {}) => {
//     const qs = new URLSearchParams({
//       topic,
//       k: String(params.k ?? 8),
//       model: params.model ?? 'llama3:8b',
//       temperature: String(params.temperature ?? 0.1),
//       max_tokens: String(params.max_tokens ?? 450),
//     });
//     if (params.source) qs.set('source', params.source);
//     if (params.domain) qs.set('domain', params.domain);
//     return jfetch<SummarizeResp>(`/summarize?${qs.toString()}`);
//   },
//   examples: (n = 6) => jfetch<ExamplesResp>(`/examples?${new URLSearchParams({ n: String(n) }).toString()}`),
// };


const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';

function authHeaders() {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (TOKEN) h['Authorization'] = `Bearer ${TOKEN}`;
  return h;
}

export const api = {
  async health() {
    const r = await fetch(`${BASE}/health`);
    if (!r.ok) throw new Error(`Health failed: ${r.status}`);
    return r.json();
  },

  async ingest(urls: string[], tokens = 1000, overlap = 120, force = false, collection?: string) {
    const qs = new URLSearchParams();
    qs.set('tokens', String(tokens));
    qs.set('overlap', String(overlap));
    qs.set('force', String(force));
    if (collection) qs.set('collection', collection);

    const r = await fetch(`${BASE}/ingest?${qs.toString()}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(urls),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async search(q: string, k = 5, opts?: { collection?: string }) {
    const qs = new URLSearchParams();
    qs.set('q', q);
    qs.set('k', String(k));
    if (opts?.collection) qs.set('collection', opts.collection);

    const r = await fetch(`${BASE}/search?${qs.toString()}`, { headers: authHeaders() });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async summarize(topic: string, params?: {
    k?: number; model?: string; temperature?: number; max_tokens?: number; collection?: string;
  }) {
    const qs = new URLSearchParams();
    qs.set('topic', topic);
    qs.set('k', String(params?.k ?? 8));
    if (params?.model) qs.set('model', params.model);
    if (params?.temperature != null) qs.set('temperature', String(params.temperature));
    if (params?.max_tokens) qs.set('max_tokens', String(params.max_tokens));
    if (params?.collection) qs.set('collection', params.collection);

    const r = await fetch(`${BASE}/summarize?${qs.toString()}`, { headers: authHeaders() });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async examples(n = 6, collection?: string) {
    const qs = new URLSearchParams();
    qs.set('n', String(n));
    if (collection) qs.set('collection', collection);

    const r = await fetch(`${BASE}/examples?${qs.toString()}`);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
};