


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

// frontend/src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    let msg = `HTTP ${res.status}`;
    try {
      const data = JSON.parse(txt);
      if (data?.detail) msg = data.detail;
    } catch {
      if (txt) msg = `${msg} — ${txt}`;
    }
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  health: async (): Promise<{ ok: boolean; env: string; model: string }> => {
    const res = await fetch(`${BASE}/health`);
    return j(res);
  },

  ingest: async (
    urls: string[],
    tokens = 1000,
    overlap = 120,
    force = false,
  ) => {
    const u = new URL(`${BASE}/ingest`);
    u.searchParams.set('tokens', String(tokens));
    u.searchParams.set('overlap', String(overlap));
    u.searchParams.set('force', String(force));
    const res = await fetch(u.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(urls),
    });
    return j(res);
  },

  search: async (
    q: string,
    k = 5,
    opts?: { domain?: string; source?: string }
  ): Promise<{ query: string; results: any[] }> => {
    const u = new URL(`${BASE}/search`);
    u.searchParams.set('q', q);
    u.searchParams.set('k', String(k));
    // (Optional) you can send domain/source to backend via query if you add support later
    if (opts?.domain) u.searchParams.set('domain', opts.domain);
    if (opts?.source) u.searchParams.set('source', opts.source);
    const res = await fetch(u.toString());
    return j(res);
  },

  summarize: async (
    topic: string,
    params?: {
      k?: number;
      model?: string;
      temperature?: number;
      max_tokens?: number;
      domain?: string; // optional, future backend filter
      source?: string; // optional, future backend filter
    },
  ): Promise<{ topic: string; summary: string; used: number; model: string }> => {
    const u = new URL(`${BASE}/summarize`);
    u.searchParams.set('topic', topic);
    u.searchParams.set('k', String(params?.k ?? 8));
    u.searchParams.set('model', String(params?.model ?? 'llama3:8b'));
    u.searchParams.set('temperature', String(params?.temperature ?? 0.1));
    u.searchParams.set('max_tokens', String(params?.max_tokens ?? 450));
    // pass-through for future backend support
    if (params?.domain) u.searchParams.set('domain', params.domain);
    if (params?.source) u.searchParams.set('source', params.source);

    const res = await fetch(u.toString());
    return j(res);
  },

  examples: async (n = 6): Promise<{ examples: string[] }> => {
    const u = new URL(`${BASE}/examples`);
    u.searchParams.set('n', String(n));
    const res = await fetch(u.toString());
    return j(res);
  },
};