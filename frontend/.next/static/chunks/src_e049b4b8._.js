(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const BASE = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000';
async function j(res) {
    if (!res.ok) {
        const txt = await res.text().catch(()=>'');
        let msg = "HTTP ".concat(res.status);
        try {
            const data = JSON.parse(txt);
            if (data === null || data === void 0 ? void 0 : data.detail) msg = data.detail;
        } catch (e) {
            if (txt) msg = "".concat(msg, " — ").concat(txt);
        }
        throw new Error(msg);
    }
    return res.json();
}
const api = {
    health: async ()=>{
        const res = await fetch("".concat(BASE, "/health"));
        return j(res);
    },
    ingest: async function(urls) {
        let tokens = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1000, overlap = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 120, force = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
        const u = new URL("".concat(BASE, "/ingest"));
        u.searchParams.set('tokens', String(tokens));
        u.searchParams.set('overlap', String(overlap));
        u.searchParams.set('force', String(force));
        const res = await fetch(u.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(urls)
        });
        return j(res);
    },
    search: async function(q) {
        let k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5, opts = arguments.length > 2 ? arguments[2] : void 0;
        const u = new URL("".concat(BASE, "/search"));
        u.searchParams.set('q', q);
        u.searchParams.set('k', String(k));
        // (Optional) you can send domain/source to backend via query if you add support later
        if (opts === null || opts === void 0 ? void 0 : opts.domain) u.searchParams.set('domain', opts.domain);
        if (opts === null || opts === void 0 ? void 0 : opts.source) u.searchParams.set('source', opts.source);
        const res = await fetch(u.toString());
        return j(res);
    },
    summarize: async (topic, params)=>{
        const u = new URL("".concat(BASE, "/summarize"));
        u.searchParams.set('topic', topic);
        var _params_k;
        u.searchParams.set('k', String((_params_k = params === null || params === void 0 ? void 0 : params.k) !== null && _params_k !== void 0 ? _params_k : 8));
        var _params_model;
        u.searchParams.set('model', String((_params_model = params === null || params === void 0 ? void 0 : params.model) !== null && _params_model !== void 0 ? _params_model : 'llama3:8b'));
        var _params_temperature;
        u.searchParams.set('temperature', String((_params_temperature = params === null || params === void 0 ? void 0 : params.temperature) !== null && _params_temperature !== void 0 ? _params_temperature : 0.1));
        var _params_max_tokens;
        u.searchParams.set('max_tokens', String((_params_max_tokens = params === null || params === void 0 ? void 0 : params.max_tokens) !== null && _params_max_tokens !== void 0 ? _params_max_tokens : 450));
        // pass-through for future backend support
        if (params === null || params === void 0 ? void 0 : params.domain) u.searchParams.set('domain', params.domain);
        if (params === null || params === void 0 ? void 0 : params.source) u.searchParams.set('source', params.source);
        const res = await fetch(u.toString());
        return j(res);
    },
    examples: async function() {
        let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 6;
        const u = new URL("".concat(BASE, "/examples"));
        u.searchParams.set('n', String(n));
        const res = await fetch(u.toString());
        return j(res);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Spinner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Spinner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Spinner() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-transparent"
    }, void 0, false, {
        fileName: "[project]/src/components/Spinner.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = Spinner;
var _c;
__turbopack_context__.k.register(_c, "Spinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ChatBubble.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // frontend/src/components/ChatBubble.tsx
// 'use client';
// import React from 'react';
// import clsx from 'clsx';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// export function extractCitations(md: string): { url: string; start: number; end: number }[] {
//   const re = /\((https?:\/\/[^:()\s]+):(\d+)-(\d+)\)/g;
//   const out: { url: string; start: number; end: number }[] = [];
//   let m;
//   while ((m = re.exec(md)) !== null) out.push({ url: m[1], start: Number(m[2]), end: Number(m[3]) });
//   const key = (x: { url: string; start: number; end: number }) => `${x.url}:${x.start}-${x.end}`;
//   return Array.from(new Map(out.map(x => [key(x), x])).values());
// }
// function domainOf(url: string) {
//   try { return new URL(url).host.replace(/^www\./, ''); } catch { return url; }
// }
// export default function ChatBubble({
//   role,
//   content,
// }: {
//   role: 'user' | 'assistant';
//   content: string;
// }) {
//   const citations = role === 'assistant' ? extractCitations(content) : [];
//   const linked = content.replace(/\((https?:\/\/[^:()\s]+):(\d+)-(\d+)\)/g, (_m, u, s, e) => `([${u}:${s}-${e}](${u}))`);
//   return (
//     <div className={clsx('flex', role === 'user' ? 'justify-end' : 'justify-start')}>
//       <div
//         className={clsx(
//           'max-w-[85%] md:max-w-[70%] rounded-2xl border px-4 py-3 shadow',
//           role === 'user'
//             ? 'bg-blue-600/20 border-blue-500/40 text-blue-50'
//             : 'bg-slate-900 border-slate-800 text-slate-100'
//         )}
//         aria-live="polite"
//       >
//         {/* ⬇️ put the class on a wrapper instead of ReactMarkdown */}
//         <div className="prose prose-invert prose-sm">
//           <ReactMarkdown remarkPlugins={[remarkGfm]}>
//             {linked}
//           </ReactMarkdown>
//         </div>
//         {citations.length > 0 && (
//           <div className="mt-3 border-t border-slate-800 pt-2">
//             <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Sources</div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               {citations.map((c, i) => (
//                 <a
//                   key={`${c.url}-${i}`}
//                   className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-2 flex items-center justify-between gap-3"
//                   href={c.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   title={`${c.url}:${c.start}-${c.end}`}
//                 >
//                   <span className="truncate">{domainOf(c.url)}</span>
//                   <span className="shrink-0 opacity-70">{c.start}-{c.end}</span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// frontend/src/components/ChatBubble.tsx
// frontend/src/components/ChatBubble.tsx
__turbopack_context__.s([
    "default",
    ()=>ChatBubble
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [app-client] (ecmascript)");
'use client';
;
;
;
function ChatBubble(param) {
    let { role, content } = param;
    const mine = role === 'user';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex ".concat(mine ? 'justify-end' : 'justify-start'),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ".concat(mine ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-100'),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "prose prose-invert max-w-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                    remarkPlugins: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                    ],
                    children: content
                }, void 0, false, {
                    fileName: "[project]/src/components/ChatBubble.tsx",
                    lineNumber: 103,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ChatBubble.tsx",
                lineNumber: 102,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ChatBubble.tsx",
            lineNumber: 95,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ChatBubble.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_c = ChatBubble;
var _c;
__turbopack_context__.k.register(_c, "ChatBubble");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Toast.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// frontend/src/components/Toast.tsx
__turbopack_context__.s([
    "default",
    ()=>Toast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Toast(param) {
    let { show, type = 'error', message, onClose, autoHideMs = 3500 } = param;
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Toast.useEffect": ()=>{
            if (!show) return;
            const t = setTimeout(onClose, autoHideMs);
            return ({
                "Toast.useEffect": ()=>clearTimeout(t)
            })["Toast.useEffect"];
        }
    }["Toast.useEffect"], [
        show,
        autoHideMs,
        onClose
    ]);
    if (!show) return null;
    const colors = {
        info: 'bg-sky-800 text-sky-50 border-sky-600',
        success: 'bg-emerald-800 text-emerald-50 border-emerald-600',
        error: 'bg-rose-800 text-rose-50 border-rose-600',
        warning: 'bg-amber-800 text-amber-50 border-amber-600'
    }[type];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 pointer-events-none flex items-start justify-center mt-6 z-[1000]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('pointer-events-auto px-4 py-2 rounded-lg border shadow-lg', colors),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "font-medium",
                    children: type.toUpperCase()
                }, void 0, false, {
                    fileName: "[project]/src/components/Toast.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm opacity-90",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/components/Toast.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Toast.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Toast.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(Toast, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = Toast;
var _c;
__turbopack_context__.k.register(_c, "Toast");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // 'use client'
// // import { useEffect, useRef, useState } from 'react'
// // import { api } from '@/lib/api'
// // import Spinner from '@/components/Spinner'
// // import ChatBubble from '@/components/ChatBubble'
// // import ReactMarkdown from 'react-markdown'
// // import remarkGfm from 'remark-gfm'
// // type Msg = { id: string; role: 'user'|'assistant'; content: string }
// // export default function Home() {
// //   const [health, setHealth] = useState<string>('')
// //   const [busy, setBusy] = useState<boolean>(false)
// //   // Mode: search vs summarize
// //   const [mode, setMode] = useState<'search'|'summarize'>('summarize')
// //   // Model params (summarize only)
// //   const [model, setModel] = useState('llama3:8b')
// //   const [k, setK] = useState(8)
// //   const [temperature, setTemperature] = useState(0.1)
// //   const [maxTokens, setMaxTokens] = useState(500)
// //   // Ingest panel state
// //   const [urls, setUrls] = useState('https://www.iana.org/domains/reserved')
// //   const [tokens, setTokens] = useState(500)
// //   const [overlap, setOverlap] = useState(100)
// //   const [force, setForce] = useState(false)
// //   const [ingestOut, setIngestOut] = useState<any>(null)
// //   const [ingestBusy, setIngestBusy] = useState(false)
// //   const [messages, setMessages] = useState<Msg[]>([])
// //   const [input, setInput] = useState('emperor')
// //   const scroller = useRef<HTMLDivElement>(null)
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const h = await api.health()
// //         setHealth(`OK (${h.env}, model: ${h.model})`)
// //       } catch (e:any) {
// //         setHealth(`Error: ${e.message}`)
// //       }
// //     })()
// //   }, [])
// //   useEffect(() => {
// //     scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
// //   }, [messages])
// //   async function onSend(e?: React.FormEvent) {
// //     e?.preventDefault()
// //     if (!input.trim() || busy) return
// //     const text = input.trim()
// //     setMessages(m => [...m, { id: crypto.randomUUID(), role: 'user', content: text }])
// //     setInput('')
// //     setBusy(true)
// //     try {
// //       if (mode === 'summarize') {
// //         const res = await api.summarize(text, { k, model, temperature, max_tokens: maxTokens })
// //         setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: `**Summary** *(model: ${res.model})*\n\n${res.summary}` }])
// //       } else {
// //         const res = await api.search(text, 5)
// //         const md = [
// //           `**Search Results for:** ${res.query}`,
// //           ...res.results.map((r, i) => {
// //             // r.citation: "(URL:start-end)" → extract URL
// //             const url = r.citation?.match(/\((.+?):\d+-\d+\)/)?.[1] ?? r?.meta?.source ?? '#'
// //             return `**${i+1}.** ${r.text}\n\n> [${r.citation}](${url})`
// //           })
// //         ].join('\n\n')
// //         setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: md }])
// //       }
// //     } catch (e:any) {
// //       setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: `❌ ${e.message}` }])
// //     } finally {
// //       setBusy(false)
// //     }
// //   }
// //   async function runIngest() {
// //     setIngestBusy(true); setIngestOut(null)
// //     try {
// //       const list = urls.split('\n').map(s=>s.trim()).filter(Boolean)
// //       const res = await api.ingest(list, tokens, overlap, force)
// //       setIngestOut(res)
// //     } catch (e:any) {
// //       setIngestOut({ error: e.message })
// //     } finally {
// //       setIngestBusy(false)
// //     }
// //   }
// //   return (
// //     <div className="min-h-screen bg-slate-950 text-slate-100">
// //       <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
// //         <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
// //           <div>
// //             <div className="font-bold">Production-Grade AI — RAG (Next.js)</div>
// //             <div className="text-xs text-slate-400">
// //               API: {process.env.NEXT_PUBLIC_API_BASE} • Health: <span className="text-emerald-400">{health}</span>
// //             </div>
// //           </div>
// //           <div className="hidden md:flex items-center gap-3">
// //             <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
// //               <button
// //                 className={`px-3 py-1 text-sm ${mode==='search'?'bg-slate-800':''}`}
// //                 onClick={()=>setMode('search')}
// //                 disabled={busy}
// //               >Search</button>
// //               <button
// //                 className={`px-3 py-1 text-sm ${mode==='summarize'?'bg-slate-800':''}`}
// //                 onClick={()=>setMode('summarize')}
// //                 disabled={busy}
// //               >Summarize</button>
// //             </div>
// //             {/* Summarize-only controls */}
// //             {mode==='summarize' && (
// //               <>
// //                 <select className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1" value={model} onChange={e=>setModel(e.target.value)}>
// //                   <option>llama3:8b</option>
// //                   <option>qwen2.5:3b-instruct</option>
// //                 </select>
// //                 <label className="text-xs">k <input className="w-14 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1" type="number" value={k} onChange={e=>setK(Number(e.target.value))}/></label>
// //                 <label className="text-xs">temp <input className="w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1" type="number" step={0.1} min={0} max={1} value={temperature} onChange={e=>setTemperature(Number(e.target.value))}/></label>
// //                 <label className="text-xs">max <input className="w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1" type="number" value={maxTokens} onChange={e=>setMaxTokens(Number(e.target.value))}/></label>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </header>
// //       <main className="max-w-5xl mx-auto px-4">
// //         <div className="mt-4 text-sm text-slate-400">
// //           {mode==='summarize'
// //             ? 'Type a topic to generate a cited summary from your indexed sources.'
// //             : 'Type a query to search semantically across your indexed sources.'}
// //         </div>
// //         <div ref={scroller} className="mt-3 h-[62vh] md:h-[66vh] overflow-y-auto space-y-3 pr-1">
// //           {messages.length === 0 && (
// //             <div className="text-slate-400 text-sm">
// //               Try <code>emperor</code>, <code>roman army tactics</code>, or switch to <b>Search</b> mode and enter keywords.
// //             </div>
// //           )}
// //           {messages.map(m => (
// //             <ChatBubble key={m.id} role={m.role}>
// //               <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
// //             </ChatBubble>
// //           ))}
// //           {busy && <div className="text-slate-400 text-sm flex items-center gap-2"><Spinner/> Working…</div>}
// //         </div>
// //         <form onSubmit={onSend} className="sticky bottom-4 mt-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-2 flex items-center gap-2">
// //           <input
// //             className="flex-1 bg-transparent outline-none px-3 py-2"
// //             placeholder={mode==='summarize' ? "Type a topic to summarize…" : "Type a query to search…"}
// //             value={input}
// //             onChange={e=>setInput(e.target.value)}
// //           />
// //           <button className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl px-4 py-2" disabled={busy}>
// //             {busy ? '...' : (mode==='summarize' ? 'Summarize' : 'Search')}
// //           </button>
// //         </form>
// //         <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <IngestCard
// //             urls={urls} setUrls={setUrls}
// //             tokens={tokens} setTokens={setTokens}
// //             overlap={overlap} setOverlap={setOverlap}
// //             force={force} setForce={setForce}
// //             runIngest={runIngest}
// //             out={ingestOut} busy={ingestBusy}
// //           />
// //           <ExamplesCard onPick={(q) => setInput(q)} />
// //         </section>
// //       </main>
// //     </div>
// //   )
// // }
// // function IngestCard(props: {
// //   urls: string; setUrls: (v:string)=>void;
// //   tokens: number; setTokens: (n:number)=>void;
// //   overlap: number; setOverlap: (n:number)=>void;
// //   force: boolean; setForce: (b:boolean)=>void;
// //   runIngest: () => void;
// //   out: any; busy: boolean;
// // }) {
// //   const { urls, setUrls, tokens, setTokens, overlap, setOverlap, force, setForce, runIngest, out, busy } = props
// //   return (
// //     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
// //       <div className="font-semibold mb-2">Ingest URLs</div>
// //       <textarea className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 h-24" value={urls} onChange={e=>setUrls(e.target.value)} />
// //       <div className="flex flex-wrap gap-2 items-center mt-2 text-sm">
// //         <label>tokens <input className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1" type="number" value={tokens} onChange={e=>setTokens(Number(e.target.value))}/></label>
// //         <label>overlap <input className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1" type="number" value={overlap} onChange={e=>setOverlap(Number(e.target.value))}/></label>
// //         <label className='flex items-center gap-2'><input type="checkbox" checked={force} onChange={e=>setForce(e.target.checked)} /> force</label>
// //         <button onClick={runIngest} className="bg-emerald-600 hover:bg-emerald-500 rounded-lg px-3 py-1.5" disabled={busy}>{busy?'…':'Ingest'}</button>
// //       </div>
// //       {out && <pre className="mt-3 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 whitespace-pre-wrap">{JSON.stringify(out, null, 2)}</pre>}
// //     </div>
// //   )
// // }
// // function ExamplesCard({ onPick }: { onPick: (q: string) => void }) {
// //   const [items, setItems] = useState<string[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [err, setErr] = useState<string | null>(null)
// //   useEffect(() => {
// //     let mounted = true
// //     api.examples(6)
// //       .then((res) => {
// //         if (!mounted) return
// //         setItems(res.examples ?? [])
// //         setErr(null)
// //       })
// //       .catch((e: any) => {
// //         if (!mounted) return
// //         setErr(e.message || 'Failed to load examples')
// //         setItems(['emperor', 'roman army tactics', 'history of microsoft']) // fallback
// //       })
// //       .finally(() => mounted && setLoading(false))
// //     return () => { mounted = false }
// //   }, [])
// //   return (
// //     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
// //       <div className="font-semibold mb-2">Examples</div>
// //       {loading && <div className="text-sm text-slate-400">Loading…</div>}
// //       {err && <div className="text-sm text-red-400 mb-2">⚠ {err}</div>}
// //       {!loading && (
// //         <div className="grid grid-cols-2 gap-2 text-sm">
// //           {items.map((x) => (
// //             <button
// //               key={x}
// //               className="bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-left"
// //               onClick={() => onPick(x)}
// //               title={x}
// //             >
// //               {x}
// //             </button>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }
// // frontend/src/app/page.tsx
// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import { api } from '@/lib/api';
// import Spinner from '@/components/Spinner';
// import ChatBubble from '@/components/ChatBubble';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import Toast from '@/components/Toast';
// type Msg = { id: string; role: 'user'|'assistant'; content: string };
// type HistoryItem = { id: string; mode: 'search'|'summarize'; input: string; at: number; params?: any };
// export default function Home() {
//   const [health, setHealth] = useState<string>('');
//   const [busy, setBusy] = useState<boolean>(false);
//   // Mode: search vs summarize
//   const [mode, setMode] = useState<'search'|'summarize'>('summarize');
//   // Model params (summarize only)
//   const [model, setModel] = useState('llama3:8b');
//   const [k, setK] = useState(8);
//   const [temperature, setTemperature] = useState(0.1);
//   const [maxTokens, setMaxTokens] = useState(500);
//   // Optional filters
//   const [domain, setDomain] = useState('');
//   const [source, setSource] = useState('');
//   // Ingest panel state
//   const [urls, setUrls] = useState('https://www.iana.org/domains/reserved');
//   const [tokens, setTokens] = useState(500);
//   const [overlap, setOverlap] = useState(100);
//   const [force, setForce] = useState(false);
//   const [ingestOut, setIngestOut] = useState<any>(null);
//   const [ingestBusy, setIngestBusy] = useState(false);
//   const [messages, setMessages] = useState<Msg[]>([]);
//   const [input, setInput] = useState('emperor');
//   const [examples, setExamples] = useState<string[]>([]);
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [toast, setToast] = useState<{show:boolean; type:'info'|'success'|'error'|'warning'; message:string}>({
//     show: false, type: 'error', message: ''
//   });
//   const scroller = useRef<HTMLDivElement>(null);
//   // Load health, examples, and persisted settings/history
//   useEffect(() => {
//     (async () => {
//       try {
//         const h = await api.health();
//         setHealth(`OK (${h.env}, model: ${h.model})`);
//       } catch (e:any) {
//         setHealth(`Error: ${e.message}`);
//       }
//       try {
//         const ex = await api.examples(6);
//         if (Array.isArray(ex.examples) && ex.examples.length) {
//           setExamples(ex.examples);
//         } else {
//           setExamples(['emperor', 'roman army tactics', 'history of microsoft', 'Byzantine emperors']);
//         }
//       } catch {
//         setExamples(['emperor', 'roman army tactics', 'history of microsoft', 'Byzantine emperors']);
//       }
//       const saved = localStorage.getItem('pgai.settings');
//       if (saved) {
//         try {
//           const s = JSON.parse(saved);
//           if (s.model) setModel(s.model);
//           if (s.k) setK(s.k);
//           if (s.temperature != null) setTemperature(s.temperature);
//           if (s.maxTokens) setMaxTokens(s.maxTokens);
//           if (s.domain) setDomain(s.domain);
//           if (s.source) setSource(s.source);
//         } catch {}
//       }
//       const hst = localStorage.getItem('pgai.history');
//       if (hst) {
//         try { setHistory(JSON.parse(hst)); } catch {}
//       }
//     })();
//   }, []);
//   useEffect(() => {
//     scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
//   }, [messages]);
//   useEffect(() => {
//     localStorage.setItem('pgai.settings', JSON.stringify({ model, k, temperature, maxTokens, domain, source }));
//   }, [model, k, temperature, maxTokens, domain, source]);
//   function pushHistory(item: HistoryItem) {
//     const next = [item, ...history].slice(0, 12);
//     setHistory(next);
//     localStorage.setItem('pgai.history', JSON.stringify(next));
//   }
//   async function onSend(e?: React.FormEvent) {
//     e?.preventDefault();
//     if (!input.trim() || busy) return;
//     const text = input.trim();
//     setMessages(m => [...m, { id: crypto.randomUUID(), role: 'user', content: text }]);
//     setInput('');
//     setBusy(true);
//     try {
//       if (mode === 'summarize') {
//         const res = await api.summarize(text, { k, model, temperature, max_tokens: maxTokens, domain: domain || undefined, source: source || undefined });
//         setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: `**Summary** *(model: ${res.model})*\n\n${res.summary}` }]);
//       } else {
//         const res = await api.search(text, 5, { domain: domain || undefined, source: source || undefined });
//         const md = [
//           `**Search Results for:** ${res.query}`,
//           ...res.results.map((r, i) => {
//             const url = r.citation?.match(/\((.+?):\d+-\d+\)/)?.[1] ?? r?.meta?.source ?? '#';
//             return `**${i+1}.** ${r.text}\n\n> [${r.citation}](${url})`;
//           })
//         ].join('\n\n');
//         setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: md }]);
//       }
//       pushHistory({ id: crypto.randomUUID(), mode, input: text, at: Date.now(), params: { k, model, temperature, maxTokens, domain, source }});
//     } catch (e:any) {
//       setToast({ show: true, type: 'error', message: e.message || 'Request failed' });
//       setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: `❌ ${e.message}` }]);
//     } finally {
//       setBusy(false);
//     }
//   }
//   async function runIngest() {
//     setIngestBusy(true); setIngestOut(null);
//     try {
//       const list = urls.split('\n').map(s=>s.trim()).filter(Boolean);
//       const res = await api.ingest(list, tokens, overlap, force);
//       setIngestOut(res);
//     } catch (e:any) {
//       setIngestOut({ error: e.message });
//       setToast({ show: true, type: 'error', message: e.message });
//     } finally {
//       setIngestBusy(false);
//     }
//   }
//   function reRun(h: HistoryItem) {
//     setMode(h.mode);
//     setInput(h.input);
//     if (h.params) {
//       if (h.params.model) setModel(h.params.model);
//       if (h.params.k) setK(h.params.k);
//       if (h.params.temperature != null) setTemperature(h.params.temperature);
//       if (h.params.maxTokens) setMaxTokens(h.params.maxTokens);
//       if (h.params.domain) setDomain(h.params.domain);
//       if (h.params.source) setSource(h.params.source);
//     }
//   }
//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100">
//       <Toast show={toast.show} type={toast.type} message={toast.message} onClose={()=>setToast(s=>({...s, show:false}))} />
//       <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
//         <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//           <div>
//             <div className="font-bold">Production-Grade AI — RAG (Next.js)</div>
//             <div className="text-xs text-slate-400">
//               API: {process.env.NEXT_PUBLIC_API_BASE} • Health: <span className="text-emerald-400">{health}</span>
//             </div>
//           </div>
//           <div className="hidden md:flex items-center gap-3">
//             <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
//               <button
//                 className={`px-3 py-1 text-sm ${mode==='search'?'bg-slate-800':''}`}
//                 onClick={()=>setMode('search')}
//                 disabled={busy}
//               >Search</button>
//               <button
//                 className={`px-3 py-1 text-sm ${mode==='summarize'?'bg-slate-800':''}`}
//                 onClick={()=>setMode('summarize')}
//                 disabled={busy}
//               >Summarize</button>
//             </div>
//             {/* Summarize-only controls */}
//             {mode==='summarize' && (
//               <>
//                 <select className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1" value={model} onChange={e=>setModel(e.target.value)}>
//                   <option>llama3:8b</option>
//                   <option>qwen2.5:3b-instruct</option>
//                 </select>
//                 <label className="text-xs">k <input className="w-14 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1" type="number" value={k} onChange={e=>setK(Number(e.target.value))}/></label>
//                 <label className="text-xs">temp <input className="w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1" type="number" step={0.1} min={0} max={1} value={temperature} onChange={e=>setTemperature(Number(e.target.value))}/></label>
//                 <label className="text-xs">max <input className="w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1" type="number" value={maxTokens} onChange={e=>setMaxTokens(Number(e.target.value))}/></label>
//               </>
//             )}
//           </div>
//         </div>
//       </header>
//       <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
//         {/* LEFT: history */}
//         <aside className="hidden md:block pt-3">
//           <div className="text-xs uppercase text-slate-400 mb-2">History</div>
//           <div className="space-y-2">
//             {history.length === 0 && <div className="text-slate-500 text-xs">No history yet.</div>}
//             {history.map(h => (
//               <button
//                 key={h.id}
//                 className="w-full text-left text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg px-3 py-2"
//                 onClick={()=>reRun(h)}
//                 title={new Date(h.at).toLocaleString()}
//               >
//                 <div className="opacity-70">{h.mode.toUpperCase()}</div>
//                 <div className="truncate">{h.input}</div>
//               </button>
//             ))}
//           </div>
//         </aside>
//         {/* RIGHT: chat + controls */}
//         <section>
//           <div className="mt-4 text-sm text-slate-400">
//             {mode==='summarize'
//               ? 'Type a topic to generate a cited summary from your indexed sources.'
//               : 'Type a query to search semantically across your indexed sources.'}
//           </div>
//           <div ref={scroller} className="mt-3 h-[62vh] md:h-[66vh] overflow-y-auto space-y-3 pr-1" aria-live="polite">
//             {messages.length === 0 && (
//               <div className="text-slate-400 text-sm">
//                 Try {examples.slice(0,3).map((x,i)=> <code key={i} className="mx-1">{x}</code>)} or switch to <b>Search</b> mode and enter keywords.
//               </div>
//             )}
//             {messages.map(m => (
//               <ChatBubble key={m.id} role={m.role} content={m.content} />
//             ))}
//             {busy && <div className="text-slate-400 text-sm flex items-center gap-2"><Spinner/> Working…</div>}
//           </div>
//           <form onSubmit={onSend} className="sticky bottom-4 mt-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-2 flex flex-col gap-2">
//             <div className="flex gap-2">
//               <input
//                 className="flex-1 bg-transparent outline-none px-3 py-2"
//                 placeholder={mode==='summarize' ? "Type a topic to summarize…" : "Type a query to search…"}
//                 value={input}
//                 onChange={e=>setInput(e.target.value)}
//               />
//               <button className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl px-4 py-2" disabled={busy}>
//                 {busy ? '...' : (mode==='summarize' ? 'Summarize' : 'Search')}
//               </button>
//             </div>
//             {/* Optional filters */}
//             <div className="flex flex-wrap gap-2 text-xs text-slate-300">
//               <label>domain <input className="w-56 ml-1 bg-slate-950 border border-slate-800 rounded px-2 py-1" value={domain} onChange={e=>setDomain(e.target.value)} placeholder="e.g. en.wikipedia.org" /></label>
//               <label>source <input className="w-64 ml-1 bg-slate-950 border border-slate-800 rounded px-2 py-1" value={source} onChange={e=>setSource(e.target.value)} placeholder="e.g. /wiki/History_of_Microsoft" /></label>
//             </div>
//           </form>
//           <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <IngestCard
//               urls={urls} setUrls={setUrls}
//               tokens={tokens} setTokens={setTokens}
//               overlap={overlap} setOverlap={setOverlap}
//               force={force} setForce={setForce}
//               runIngest={runIngest}
//               out={ingestOut} busy={ingestBusy}
//             />
//             <ExamplesCard examples={examples} onPick={(q) => setInput(q)} />
//           </section>
//         </section>
//       </main>
//     </div>
//   );
// }
// function IngestCard(props: {
//   urls: string; setUrls: (v:string)=>void;
//   tokens: number; setTokens: (n:number)=>void;
//   overlap: number; setOverlap: (n:number)=>void;
//   force: boolean; setForce: (b:boolean)=>void;
//   runIngest: () => void;
//   out: any; busy: boolean;
// }) {
//   const { urls, setUrls, tokens, setTokens, overlap, setOverlap, force, setForce, runIngest, out, busy } = props;
//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
//       <div className="font-semibold mb-2">Ingest URLs</div>
//       <textarea className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 h-24" value={urls} onChange={e=>setUrls(e.target.value)} />
//       <div className="flex flex-wrap gap-2 items-center mt-2 text-sm">
//         <label>tokens <input className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1" type="number" value={tokens} onChange={e=>setTokens(Number(e.target.value))}/></label>
//         <label>overlap <input className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1" type="number" value={overlap} onChange={e=>setOverlap(Number(e.target.value))}/></label>
//         <label className='flex items-center gap-2'><input type="checkbox" checked={force} onChange={e=>setForce(e.target.checked)} /> force</label>
//         <button onClick={runIngest} className="bg-emerald-600 hover:bg-emerald-500 rounded-lg px-3 py-1.5" disabled={busy}>{busy?'…':'Ingest'}</button>
//       </div>
//       {out && (
//         <div className="mt-3 text-xs space-y-2">
//           {'error' in out ? (
//             <div className="text-rose-300">Error: {String(out.error)}</div>
//           ) : (
//             <>
//               <div className="flex gap-2 text-slate-300">
//                 <span className="bg-slate-800 px-2 py-0.5 rounded">indexed: {out.indexed}</span>
//                 <span className="bg-slate-800 px-2 py-0.5 rounded">chunks: {out.chunks}</span>
//                 <span className="bg-slate-800 px-2 py-0.5 rounded">avg words: {out.avg_chunk_words}</span>
//                 {out.skipped ? <span className="bg-slate-800 px-2 py-0.5 rounded">skipped: {out.skipped}</span> : null}
//               </div>
//               <pre className="text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 whitespace-pre-wrap">{JSON.stringify(out, null, 2)}</pre>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
// function ExamplesCard({ examples, onPick }: { examples: string[]; onPick: (q: string) => void }) {
//   const items = examples?.length ? examples : [
//     'emperor',
//     'roman army tactics',
//     'history of microsoft',
//     'Byzantine emperors',
//   ];
//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
//       <div className="font-semibold mb-2">Examples</div>
//       <div className="grid grid-cols-2 gap-2 text-sm">
//         {items.map(x => (
//           <button key={x} className="bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-left" onClick={()=>onPick(x)}>{x}</button>
//         ))}
//       </div>
//     </div>
//   );
// }
// frontend/src/app/page.tsx
__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Spinner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChatBubble$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ChatBubble.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function Home() {
    _s();
    const [health, setHealth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Mode: search vs summarize
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('summarize');
    // Model params (summarize only)
    const [model, setModel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('llama3:8b');
    const [k, setK] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(8);
    const [temperature, setTemperature] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0.1);
    const [maxTokens, setMaxTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(500);
    // Optional filters
    const [domain, setDomain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [source, setSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Ingest panel state
    const [urls, setUrls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('https://www.iana.org/domains/reserved');
    const [tokens, setTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(500);
    const [overlap, setOverlap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(100);
    const [force, setForce] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ingestOut, setIngestOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [ingestBusy, setIngestBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Chat state
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('emperor');
    const [examples, setExamples] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // History + toast
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        show: false,
        type: 'error',
        message: ''
    });
    const scroller = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Load health, examples, and persisted settings/history
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            ({
                "Home.useEffect": async ()=>{
                    try {
                        const h = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].health();
                        setHealth("OK (".concat(h.env, ", model: ").concat(h.model, ")"));
                    } catch (e) {
                        setHealth("Error: ".concat(e.message));
                    }
                    try {
                        const ex = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].examples(6);
                        if (Array.isArray(ex.examples) && ex.examples.length) {
                            setExamples(ex.examples);
                        } else {
                            setExamples([
                                'emperor',
                                'roman army tactics',
                                'history of microsoft',
                                'Byzantine emperors'
                            ]);
                        }
                    } catch (e) {
                        setExamples([
                            'emperor',
                            'roman army tactics',
                            'history of microsoft',
                            'Byzantine emperors'
                        ]);
                    }
                    const saved = localStorage.getItem('pgai.settings');
                    if (saved) {
                        try {
                            const s = JSON.parse(saved);
                            if (s.model) setModel(s.model);
                            if (s.k) setK(s.k);
                            if (s.temperature != null) setTemperature(s.temperature);
                            if (s.maxTokens) setMaxTokens(s.maxTokens);
                            if (s.domain) setDomain(s.domain);
                            if (s.source) setSource(s.source);
                        } catch (e) {}
                    }
                    const hst = localStorage.getItem('pgai.history');
                    if (hst) {
                        try {
                            setHistory(JSON.parse(hst));
                        } catch (e) {}
                    }
                }
            })["Home.useEffect"]();
        }
    }["Home.useEffect"], []);
    // Auto-scroll chat
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            var _scroller_current;
            (_scroller_current = scroller.current) === null || _scroller_current === void 0 ? void 0 : _scroller_current.scrollTo({
                top: scroller.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }["Home.useEffect"], [
        messages
    ]);
    // Persist settings
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            localStorage.setItem('pgai.settings', JSON.stringify({
                model,
                k,
                temperature,
                maxTokens,
                domain,
                source
            }));
        }
    }["Home.useEffect"], [
        model,
        k,
        temperature,
        maxTokens,
        domain,
        source
    ]);
    function pushHistory(item) {
        const next = [
            item,
            ...history
        ].slice(0, 12);
        setHistory(next);
        localStorage.setItem('pgai.history', JSON.stringify(next));
    }
    async function onSend(e) {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        if (!input.trim() || busy) return;
        const text = input.trim();
        setMessages((m)=>[
                ...m,
                {
                    id: crypto.randomUUID(),
                    role: 'user',
                    content: text
                }
            ]);
        setInput('');
        setBusy(true);
        try {
            if (mode === 'summarize') {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].summarize(text, {
                    k,
                    model,
                    temperature,
                    max_tokens: maxTokens,
                    domain: domain || undefined,
                    source: source || undefined
                });
                setMessages((m)=>[
                        ...m,
                        {
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content: "**Summary** *(model: ".concat(res.model, ")*\n\n").concat(res.summary)
                        }
                    ]);
            } else {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].search(text, 5, {
                    domain: domain || undefined,
                    source: source || undefined
                });
                const md = [
                    "**Search Results for:** ".concat(res.query),
                    ...res.results.map((r, i)=>{
                        var _r_citation_match, _r_citation, _r_meta;
                        var _r_citation_match_, _ref;
                        const url = (_ref = (_r_citation_match_ = (_r_citation = r.citation) === null || _r_citation === void 0 ? void 0 : (_r_citation_match = _r_citation.match(/\((.+?):\d+-\d+\)/)) === null || _r_citation_match === void 0 ? void 0 : _r_citation_match[1]) !== null && _r_citation_match_ !== void 0 ? _r_citation_match_ : r === null || r === void 0 ? void 0 : (_r_meta = r.meta) === null || _r_meta === void 0 ? void 0 : _r_meta.source) !== null && _ref !== void 0 ? _ref : '#';
                        return "**".concat(i + 1, ".** ").concat(r.text, "\n\n> [").concat(r.citation, "](").concat(url, ")");
                    })
                ].join('\n\n');
                setMessages((m)=>[
                        ...m,
                        {
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content: md
                        }
                    ]);
            }
            pushHistory({
                id: crypto.randomUUID(),
                mode,
                input: text,
                at: Date.now(),
                params: {
                    k,
                    model,
                    temperature,
                    maxTokens,
                    domain,
                    source
                }
            });
        } catch (e) {
            setToast({
                show: true,
                type: 'error',
                message: e.message || 'Request failed'
            });
            setMessages((m)=>[
                    ...m,
                    {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: "❌ ".concat(e.message)
                    }
                ]);
        } finally{
            setBusy(false);
        }
    }
    async function runIngest() {
        setIngestBusy(true);
        setIngestOut(null);
        try {
            const list = urls.split('\n').map((s)=>s.trim()).filter(Boolean);
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].ingest(list, tokens, overlap, force);
            setIngestOut(res);
            // Refresh examples after ingest so suggestions reflect new sources
            try {
                const ex = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].examples(6);
                if (Array.isArray(ex.examples) && ex.examples.length) {
                    setExamples(ex.examples);
                }
            } catch (e) {}
            setToast({
                show: true,
                type: 'success',
                message: 'Ingest complete.'
            });
        } catch (e) {
            setIngestOut({
                error: e.message
            });
            setToast({
                show: true,
                type: 'error',
                message: e.message
            });
        } finally{
            setIngestBusy(false);
        }
    }
    function reRun(h) {
        setMode(h.mode);
        setInput(h.input);
        if (h.params) {
            if (h.params.model) setModel(h.params.model);
            if (h.params.k) setK(h.params.k);
            if (h.params.temperature != null) setTemperature(h.params.temperature);
            if (h.params.maxTokens) setMaxTokens(h.params.maxTokens);
            if (h.params.domain) setDomain(h.params.domain);
            if (h.params.source) setSource(h.params.source);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-950 text-slate-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                show: toast.show,
                type: toast.type,
                message: toast.message,
                onClose: ()=>setToast((s)=>({
                            ...s,
                            show: false
                        }))
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 775,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto px-4 py-3 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-bold",
                                    children: "Production-Grade AI — RAG (Next.js)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 780,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-slate-400",
                                    children: [
                                        "API: ",
                                        ("TURBOPACK compile-time value", "http://localhost:8000"),
                                        " • Health: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-emerald-400",
                                            children: health
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 782,
                                            columnNumber: 65
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 781,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 779,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "px-3 py-1 text-sm ".concat(mode === 'search' ? 'bg-slate-800' : ''),
                                            onClick: ()=>setMode('search'),
                                            disabled: busy,
                                            children: "Search"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 787,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "px-3 py-1 text-sm ".concat(mode === 'summarize' ? 'bg-slate-800' : ''),
                                            onClick: ()=>setMode('summarize'),
                                            disabled: busy,
                                            children: "Summarize"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 792,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 786,
                                    columnNumber: 13
                                }, this),
                                mode === 'summarize' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "bg-slate-900 border border-slate-700 rounded-lg px-2 py-1",
                                            value: model,
                                            onChange: (e)=>setModel(e.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "llama3:8b"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 803,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "qwen2.5:3b-instruct"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 804,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 802,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs",
                                            children: [
                                                "k ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: "w-14 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1",
                                                    type: "number",
                                                    value: k,
                                                    onChange: (e)=>setK(Number(e.target.value))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 806,
                                                    columnNumber: 46
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 806,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs",
                                            children: [
                                                "temp ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: "w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1",
                                                    type: "number",
                                                    step: 0.1,
                                                    min: 0,
                                                    max: 1,
                                                    value: temperature,
                                                    onChange: (e)=>setTemperature(Number(e.target.value))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 807,
                                                    columnNumber: 49
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 807,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs",
                                            children: [
                                                "max ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: "w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1",
                                                    type: "number",
                                                    value: maxTokens,
                                                    onChange: (e)=>setMaxTokens(Number(e.target.value))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 808,
                                                    columnNumber: 48
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 808,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 785,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 778,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 777,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "hidden md:block pt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs uppercase text-slate-400 mb-2",
                                children: "History"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 818,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    history.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-slate-500 text-xs",
                                        children: "No history yet."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 820,
                                        columnNumber: 38
                                    }, this),
                                    history.map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "w-full text-left text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg px-3 py-2",
                                            onClick: ()=>reRun(h),
                                            title: new Date(h.at).toLocaleString(),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "opacity-70",
                                                    children: h.mode.toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 828,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "truncate",
                                                    children: h.input
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 829,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, h.id, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 822,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 819,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 817,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 text-sm text-slate-400",
                                children: mode === 'summarize' ? 'Type a topic to generate a cited summary from your indexed sources.' : 'Type a query to search semantically across your indexed sources.'
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 837,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: scroller,
                                className: "mt-3 h-[62vh] md:h-[66vh] overflow-y-auto space-y-3 pr-1",
                                "aria-live": "polite",
                                children: [
                                    messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-slate-400 text-sm",
                                        children: [
                                            "Try ",
                                            examples.slice(0, 3).map((x, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                    className: "mx-1",
                                                    children: x
                                                }, i, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 846,
                                                    columnNumber: 54
                                                }, this)),
                                            " or switch to ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: "Search"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 846,
                                                columnNumber: 111
                                            }, this),
                                            " mode and enter keywords."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 845,
                                        columnNumber: 15
                                    }, this),
                                    messages.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChatBubble$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            role: m.role,
                                            content: m.content
                                        }, m.id, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 850,
                                            columnNumber: 15
                                        }, this)),
                                    busy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-slate-400 text-sm flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 852,
                                                columnNumber: 86
                                            }, this),
                                            " Working…"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 852,
                                        columnNumber: 22
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 843,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: onSend,
                                className: "sticky bottom-4 mt-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-2 flex flex-col gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "flex-1 bg-transparent outline-none px-3 py-2",
                                                placeholder: mode === 'summarize' ? "Type a topic to summarize…" : "Type a query to search…",
                                                value: input,
                                                onChange: (e)=>setInput(e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 857,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl px-4 py-2",
                                                disabled: busy,
                                                children: busy ? '...' : mode === 'summarize' ? 'Summarize' : 'Search'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 863,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 856,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2 text-xs text-slate-300",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    "domain ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: "w-56 ml-1 bg-slate-950 border border-slate-800 rounded px-2 py-1",
                                                        value: domain,
                                                        onChange: (e)=>setDomain(e.target.value),
                                                        placeholder: "e.g. en.wikipedia.org"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 869,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 869,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    "source ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: "w-64 ml-1 bg-slate-950 border border-slate-800 rounded px-2 py-1",
                                                        value: source,
                                                        onChange: (e)=>setSource(e.target.value),
                                                        placeholder: "e.g. /wiki/History_of_Microsoft"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.tsx",
                                                        lineNumber: 870,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 870,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 868,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 855,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "mt-6 grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IngestCard, {
                                        urls: urls,
                                        setUrls: setUrls,
                                        tokens: tokens,
                                        setTokens: setTokens,
                                        overlap: overlap,
                                        setOverlap: setOverlap,
                                        force: force,
                                        setForce: setForce,
                                        runIngest: runIngest,
                                        out: ingestOut,
                                        busy: ingestBusy
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 875,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExamplesCard, {
                                        examples: examples,
                                        onPick: (q)=>setInput(q)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 883,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 874,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 836,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 815,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 774,
        columnNumber: 5
    }, this);
}
_s(Home, "E7IP5PI3Twsk8MG4vcQ0tLrEdoU=");
_c = Home;
function IngestCard(props) {
    const { urls, setUrls, tokens, setTokens, overlap, setOverlap, force, setForce, runIngest, out, busy } = props;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-slate-900 border border-slate-800 rounded-2xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-semibold mb-2",
                children: "Ingest URLs"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 902,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 h-24",
                value: urls,
                onChange: (e)=>setUrls(e.target.value)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 903,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2 items-center mt-2 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "tokens ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1",
                                type: "number",
                                value: tokens,
                                onChange: (e)=>setTokens(Number(e.target.value))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 905,
                                columnNumber: 23
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 905,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "overlap ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1",
                                type: "number",
                                value: overlap,
                                onChange: (e)=>setOverlap(Number(e.target.value))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 906,
                                columnNumber: 24
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 906,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: force,
                                onChange: (e)=>setForce(e.target.checked)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 907,
                                columnNumber: 52
                            }, this),
                            " force"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 907,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: runIngest,
                        className: "bg-emerald-600 hover:bg-emerald-500 rounded-lg px-3 py-1.5",
                        disabled: busy,
                        children: busy ? '…' : 'Ingest'
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 908,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 904,
                columnNumber: 7
            }, this),
            out && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 text-xs space-y-2",
                children: 'error' in out ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-rose-300",
                    children: [
                        "Error: ",
                        String(out.error)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 913,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 text-slate-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bg-slate-800 px-2 py-0.5 rounded",
                                    children: [
                                        "indexed: ",
                                        out.indexed
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 917,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bg-slate-800 px-2 py-0.5 rounded",
                                    children: [
                                        "chunks: ",
                                        out.chunks
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 918,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bg-slate-800 px-2 py-0.5 rounded",
                                    children: [
                                        "avg words: ",
                                        out.avg_chunk_words
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 919,
                                    columnNumber: 17
                                }, this),
                                out.skipped ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bg-slate-800 px-2 py-0.5 rounded",
                                    children: [
                                        "skipped: ",
                                        out.skipped
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 920,
                                    columnNumber: 32
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 916,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            className: "text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 whitespace-pre-wrap",
                            children: JSON.stringify(out, null, 2)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 922,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 911,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 901,
        columnNumber: 5
    }, this);
}
_c1 = IngestCard;
function ExamplesCard(param) {
    let { examples, onPick } = param;
    const items = (examples === null || examples === void 0 ? void 0 : examples.length) ? examples : [
        'emperor',
        'roman army tactics',
        'history of microsoft',
        'Byzantine emperors'
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-slate-900 border border-slate-800 rounded-2xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-semibold mb-2",
                children: "Examples"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 940,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-2 text-sm",
                children: items.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-left",
                        onClick: ()=>onPick(x),
                        children: x
                    }, x, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 943,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 941,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 939,
        columnNumber: 5
    }, this);
}
_c2 = ExamplesCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Home");
__turbopack_context__.k.register(_c1, "IngestCard");
__turbopack_context__.k.register(_c2, "ExamplesCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_e049b4b8._.js.map