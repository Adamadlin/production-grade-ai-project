module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
__turbopack_context__.s([
    "api",
    ()=>api
]);
const BASE = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000';
async function jfetch(path, init) {
    const url = path.startsWith('http') ? path : `${BASE}${path}`;
    const res = await fetch(url, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers || {}
        }
    });
    if (!res.ok) {
        const text = await res.text().catch(()=>'');
        // Surface Retry-After header if rate-limited:
        const retry = res.headers.get('Retry-After');
        const msg = text || `HTTP ${res.status}` + (retry ? ` (Retry-After: ${retry}s)` : '');
        throw new Error(msg);
    }
    return res.json();
}
const api = {
    health: ()=>jfetch('/health'),
    ingest: (urls, tokens = 1000, overlap = 120, force = false)=>jfetch(`/ingest?tokens=${tokens}&overlap=${overlap}&force=${String(force)}`, {
            method: 'POST',
            body: JSON.stringify(urls)
        }),
    search: (q, k = 5, opts)=>{
        const qs = new URLSearchParams({
            q,
            k: String(k)
        });
        if (opts?.source) qs.set('source', opts.source);
        if (opts?.domain) qs.set('domain', opts.domain);
        return jfetch(`/search?${qs.toString()}`);
    },
    summarize: (topic, params = {})=>{
        const qs = new URLSearchParams({
            topic,
            k: String(params.k ?? 8),
            model: params.model ?? 'llama3:8b',
            temperature: String(params.temperature ?? 0.1),
            max_tokens: String(params.max_tokens ?? 450)
        });
        if (params.source) qs.set('source', params.source);
        if (params.domain) qs.set('domain', params.domain);
        return jfetch(`/summarize?${qs.toString()}`);
    },
    examples: (n = 6)=>jfetch(`/examples?${new URLSearchParams({
            n: String(n)
        }).toString()}`)
};
}),
"[project]/src/components/Spinner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Spinner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
function Spinner() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-transparent"
    }, void 0, false, {
        fileName: "[project]/src/components/Spinner.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs) <export default as minpath>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "minpath",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
}),
"[externals]/node:process [external] (node:process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:process", () => require("node:process"));

module.exports = mod;
}),
"[externals]/node:process [external] (node:process, cjs) <export default as minproc>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "minproc",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:process [external] (node:process, cjs)");
}),
"[externals]/node:url [external] (node:url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}),
"[externals]/node:url [external] (node:url, cjs) <export fileURLToPath as urlToPath>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "urlToPath",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__["fileURLToPath"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:url [external] (node:url, cjs)");
}),
"[project]/src/components/ChatBubble.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import React from 'react';
// import clsx from 'clsx';
// export default function ChatBubble({ role, children }: { role: 'user'|'assistant'|'system'; children: React.ReactNode }) {
//   const mine = role === 'user';
//   return (
//     <div className={clsx('w-full flex', mine ? 'justify-end' : 'justify-start')}>
//       <div
//         className={clsx(
//           'max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap',
//           mine ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-100 rounded-bl-sm'
//         )}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }       
// frontend/src/components/ChatBubble.tsx
__turbopack_context__.s([
    "default",
    ()=>ChatBubble,
    "extractCitations",
    ()=>extractCitations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-ssr] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function extractCitations(md) {
    const re = /\((https?:\/\/[^:()\s]+):(\d+)-(\d+)\)/g;
    const out = [];
    let m;
    while((m = re.exec(md)) !== null){
        out.push({
            url: m[1],
            start: Number(m[2]),
            end: Number(m[3])
        });
    }
    // de-dupe by URL + span
    const key = (x)=>`${x.url}:${x.start}-${x.end}`;
    return Array.from(new Map(out.map((x)=>[
            key(x),
            x
        ])).values());
}
function domainOf(url) {
    try {
        return new URL(url).host.replace(/^www\./, '');
    } catch  {
        return url;
    }
}
function ChatBubble({ role, content }) {
    const citations = role === 'assistant' ? extractCitations(content) : [];
    // Turn plain "(URL:start-end)" into clickable markdown links
    const linked = content.replace(/\((https?:\/\/[^:()\s]+):(\d+)-(\d+)\)/g, (_m, u, s, e)=>`([${u}:${s}-${e}](${u}))`);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('flex', role === 'user' ? 'justify-end' : 'justify-start'),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('max-w-[85%] md:max-w-[70%] rounded-2xl border px-4 py-3 shadow', role === 'user' ? 'bg-blue-600/20 border-blue-500/40 text-blue-50' : 'bg-slate-900 border-slate-800 text-slate-100'),
            "aria-live": "polite",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                    remarkPlugins: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
                    ],
                    className: "prose prose-invert prose-sm",
                    children: linked
                }, void 0, false, {
                    fileName: "[project]/src/components/ChatBubble.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this),
                citations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 border-t border-slate-800 pt-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs uppercase tracking-wide text-slate-400 mb-1",
                            children: "Sources"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatBubble.tsx",
                            lineNumber: 77,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-2",
                            children: citations.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    className: "text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-2 flex items-center justify-between gap-3",
                                    href: c.url,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    title: `${c.url}:${c.start}-${c.end}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: domainOf(c.url)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ChatBubble.tsx",
                                            lineNumber: 88,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "shrink-0 opacity-70",
                                            children: [
                                                c.start,
                                                "-",
                                                c.end
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ChatBubble.tsx",
                                            lineNumber: 89,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, `${c.url}-${i}`, true, {
                                    fileName: "[project]/src/components/ChatBubble.tsx",
                                    lineNumber: 80,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatBubble.tsx",
                            lineNumber: 78,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ChatBubble.tsx",
                    lineNumber: 76,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ChatBubble.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ChatBubble.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 'use client'
// import { useEffect, useRef, useState } from 'react'
// import { api } from '@/lib/api'
// import Spinner from '@/components/Spinner'
// import ChatBubble from '@/components/ChatBubble'
// import ReactMarkdown from 'react-markdown'
// import remarkGfm from 'remark-gfm'
// type Msg = { id: string; role: 'user'|'assistant'; content: string }
// export default function Home() {
//   const [health, setHealth] = useState<string>('')
//   const [busy, setBusy] = useState<boolean>(false)
//   // Mode: search vs summarize
//   const [mode, setMode] = useState<'search'|'summarize'>('summarize')
//   // Model params (summarize only)
//   const [model, setModel] = useState('llama3:8b')
//   const [k, setK] = useState(8)
//   const [temperature, setTemperature] = useState(0.1)
//   const [maxTokens, setMaxTokens] = useState(500)
//   // Ingest panel state
//   const [urls, setUrls] = useState('https://www.iana.org/domains/reserved')
//   const [tokens, setTokens] = useState(500)
//   const [overlap, setOverlap] = useState(100)
//   const [force, setForce] = useState(false)
//   const [ingestOut, setIngestOut] = useState<any>(null)
//   const [ingestBusy, setIngestBusy] = useState(false)
//   const [messages, setMessages] = useState<Msg[]>([])
//   const [input, setInput] = useState('emperor')
//   const scroller = useRef<HTMLDivElement>(null)
//   useEffect(() => {
//     (async () => {
//       try {
//         const h = await api.health()
//         setHealth(`OK (${h.env}, model: ${h.model})`)
//       } catch (e:any) {
//         setHealth(`Error: ${e.message}`)
//       }
//     })()
//   }, [])
//   useEffect(() => {
//     scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
//   }, [messages])
//   async function onSend(e?: React.FormEvent) {
//     e?.preventDefault()
//     if (!input.trim() || busy) return
//     const text = input.trim()
//     setMessages(m => [...m, { id: crypto.randomUUID(), role: 'user', content: text }])
//     setInput('')
//     setBusy(true)
//     try {
//       if (mode === 'summarize') {
//         const res = await api.summarize(text, { k, model, temperature, max_tokens: maxTokens })
//         setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: `**Summary** *(model: ${res.model})*\n\n${res.summary}` }])
//       } else {
//         const res = await api.search(text, 5)
//         const md = [
//           `**Search Results for:** ${res.query}`,
//           ...res.results.map((r, i) => {
//             // r.citation: "(URL:start-end)" → extract URL
//             const url = r.citation?.match(/\((.+?):\d+-\d+\)/)?.[1] ?? r?.meta?.source ?? '#'
//             return `**${i+1}.** ${r.text}\n\n> [${r.citation}](${url})`
//           })
//         ].join('\n\n')
//         setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: md }])
//       }
//     } catch (e:any) {
//       setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: `❌ ${e.message}` }])
//     } finally {
//       setBusy(false)
//     }
//   }
//   async function runIngest() {
//     setIngestBusy(true); setIngestOut(null)
//     try {
//       const list = urls.split('\n').map(s=>s.trim()).filter(Boolean)
//       const res = await api.ingest(list, tokens, overlap, force)
//       setIngestOut(res)
//     } catch (e:any) {
//       setIngestOut({ error: e.message })
//     } finally {
//       setIngestBusy(false)
//     }
//   }
//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100">
//       <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
//         <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
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
//       <main className="max-w-5xl mx-auto px-4">
//         <div className="mt-4 text-sm text-slate-400">
//           {mode==='summarize'
//             ? 'Type a topic to generate a cited summary from your indexed sources.'
//             : 'Type a query to search semantically across your indexed sources.'}
//         </div>
//         <div ref={scroller} className="mt-3 h-[62vh] md:h-[66vh] overflow-y-auto space-y-3 pr-1">
//           {messages.length === 0 && (
//             <div className="text-slate-400 text-sm">
//               Try <code>emperor</code>, <code>roman army tactics</code>, or switch to <b>Search</b> mode and enter keywords.
//             </div>
//           )}
//           {messages.map(m => (
//             <ChatBubble key={m.id} role={m.role}>
//               <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
//             </ChatBubble>
//           ))}
//           {busy && <div className="text-slate-400 text-sm flex items-center gap-2"><Spinner/> Working…</div>}
//         </div>
//         <form onSubmit={onSend} className="sticky bottom-4 mt-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-2 flex items-center gap-2">
//           <input
//             className="flex-1 bg-transparent outline-none px-3 py-2"
//             placeholder={mode==='summarize' ? "Type a topic to summarize…" : "Type a query to search…"}
//             value={input}
//             onChange={e=>setInput(e.target.value)}
//           />
//           <button className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl px-4 py-2" disabled={busy}>
//             {busy ? '...' : (mode==='summarize' ? 'Summarize' : 'Search')}
//           </button>
//         </form>
//         <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <IngestCard
//             urls={urls} setUrls={setUrls}
//             tokens={tokens} setTokens={setTokens}
//             overlap={overlap} setOverlap={setOverlap}
//             force={force} setForce={setForce}
//             runIngest={runIngest}
//             out={ingestOut} busy={ingestBusy}
//           />
//           <ExamplesCard onPick={(q) => setInput(q)} />
//         </section>
//       </main>
//     </div>
//   )
// }
// function IngestCard(props: {
//   urls: string; setUrls: (v:string)=>void;
//   tokens: number; setTokens: (n:number)=>void;
//   overlap: number; setOverlap: (n:number)=>void;
//   force: boolean; setForce: (b:boolean)=>void;
//   runIngest: () => void;
//   out: any; busy: boolean;
// }) {
//   const { urls, setUrls, tokens, setTokens, overlap, setOverlap, force, setForce, runIngest, out, busy } = props
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
//       {out && <pre className="mt-3 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 whitespace-pre-wrap">{JSON.stringify(out, null, 2)}</pre>}
//     </div>
//   )
// }
// function ExamplesCard({ onPick }: { onPick: (q: string) => void }) {
//   const items = [
//     'emperor',
//     'roman army tactics',
//     'history of microsoft',
//     'Byzantine emperors',
//   ]
//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
//       <div className="font-semibold mb-2">Examples</div>
//       <div className="grid grid-cols-2 gap-2 text-sm">
//         {items.map(x => (
//           <button key={x} className="bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-left" onClick={()=>onPick(x)}>{x}</button>
//         ))}
//       </div>
//     </div>
//   )
// }
__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spinner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Spinner.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChatBubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ChatBubble.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-ssr] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function Home() {
    const [health, setHealth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Mode: search vs summarize
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('summarize');
    // Model params (summarize only)
    const [model, setModel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('llama3:8b');
    const [k, setK] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(8);
    const [temperature, setTemperature] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0.1);
    const [maxTokens, setMaxTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(500);
    // Ingest panel state
    const [urls, setUrls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('https://www.iana.org/domains/reserved');
    const [tokens, setTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(500);
    const [overlap, setOverlap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(100);
    const [force, setForce] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ingestOut, setIngestOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [ingestBusy, setIngestBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('emperor');
    const scroller = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (async ()=>{
            try {
                const h = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].health();
                setHealth(`OK (${h.env}, model: ${h.model})`);
            } catch (e) {
                setHealth(`Error: ${e.message}`);
            }
        })();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        scroller.current?.scrollTo({
            top: scroller.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [
        messages
    ]);
    async function onSend(e) {
        e?.preventDefault();
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
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].summarize(text, {
                    k,
                    model,
                    temperature,
                    max_tokens: maxTokens
                });
                setMessages((m)=>[
                        ...m,
                        {
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content: `**Summary** *(model: ${res.model})*\n\n${res.summary}`
                        }
                    ]);
            } else {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].search(text, 5);
                const md = [
                    `**Search Results for:** ${res.query}`,
                    ...res.results.map((r, i)=>{
                        // r.citation: "(URL:start-end)" → extract URL
                        const url = r.citation?.match(/\((.+?):\d+-\d+\)/)?.[1] ?? r?.meta?.source ?? '#';
                        return `**${i + 1}.** ${r.text}\n\n> [${r.citation}](${url})`;
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
        } catch (e) {
            setMessages((m)=>[
                    ...m,
                    {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `❌ ${e.message}`
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
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].ingest(list, tokens, overlap, force);
            setIngestOut(res);
        } catch (e) {
            setIngestOut({
                error: e.message
            });
        } finally{
            setIngestBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-950 text-slate-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-5xl mx-auto px-4 py-3 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-bold",
                                    children: "Production-Grade AI — RAG (Next.js)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-slate-400",
                                    children: [
                                        "API: ",
                                        ("TURBOPACK compile-time value", "http://localhost:8000"),
                                        " • Health: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-emerald-400",
                                            children: health
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 337,
                                            columnNumber: 65
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 336,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 334,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `px-3 py-1 text-sm ${mode === 'search' ? 'bg-slate-800' : ''}`,
                                            onClick: ()=>setMode('search'),
                                            disabled: busy,
                                            children: "Search"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 342,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `px-3 py-1 text-sm ${mode === 'summarize' ? 'bg-slate-800' : ''}`,
                                            onClick: ()=>setMode('summarize'),
                                            disabled: busy,
                                            children: "Summarize"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 347,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, this),
                                mode === 'summarize' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "bg-slate-900 border border-slate-700 rounded-lg px-2 py-1",
                                            value: model,
                                            onChange: (e)=>setModel(e.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "llama3:8b"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 358,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "qwen2.5:3b-instruct"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 359,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 357,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs",
                                            children: [
                                                "k ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: "w-14 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1",
                                                    type: "number",
                                                    value: k,
                                                    onChange: (e)=>setK(Number(e.target.value))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 361,
                                                    columnNumber: 46
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 361,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs",
                                            children: [
                                                "temp ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: "w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1",
                                                    type: "number",
                                                    step: 0.1,
                                                    min: 0,
                                                    max: 1,
                                                    value: temperature,
                                                    onChange: (e)=>setTemperature(Number(e.target.value))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 362,
                                                    columnNumber: 49
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 362,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs",
                                            children: [
                                                "max ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: "w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1",
                                                    type: "number",
                                                    value: maxTokens,
                                                    onChange: (e)=>setMaxTokens(Number(e.target.value))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 363,
                                                    columnNumber: 48
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 363,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 340,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 333,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 332,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-5xl mx-auto px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 text-sm text-slate-400",
                        children: mode === 'summarize' ? 'Type a topic to generate a cited summary from your indexed sources.' : 'Type a query to search semantically across your indexed sources.'
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 371,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: scroller,
                        className: "mt-3 h-[62vh] md:h-[66vh] overflow-y-auto space-y-3 pr-1",
                        children: [
                            messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-slate-400 text-sm",
                                children: [
                                    "Try ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        children: "emperor"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 380,
                                        columnNumber: 19
                                    }, this),
                                    ", ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        children: "roman army tactics"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 380,
                                        columnNumber: 41
                                    }, this),
                                    ", or switch to ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: "Search"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 380,
                                        columnNumber: 87
                                    }, this),
                                    " mode and enter keywords."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 379,
                                columnNumber: 13
                            }, this),
                            messages.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChatBubble$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    role: m.role,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                        remarkPlugins: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
                                        ],
                                        children: m.content
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 15
                                    }, this)
                                }, m.id, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 384,
                                    columnNumber: 13
                                }, this)),
                            busy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-slate-400 text-sm flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Spinner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 388,
                                        columnNumber: 84
                                    }, this),
                                    " Working…"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 388,
                                columnNumber: 20
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: onSend,
                        className: "sticky bottom-4 mt-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-2 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "flex-1 bg-transparent outline-none px-3 py-2",
                                placeholder: mode === 'summarize' ? "Type a topic to summarize…" : "Type a query to search…",
                                value: input,
                                onChange: (e)=>setInput(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 392,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl px-4 py-2",
                                disabled: busy,
                                children: busy ? '...' : mode === 'summarize' ? 'Summarize' : 'Search'
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 398,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 391,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mt-6 grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IngestCard, {
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
                                lineNumber: 404,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ExamplesCard, {
                                onPick: (q)=>setInput(q)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 412,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 403,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 370,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 331,
        columnNumber: 5
    }, this);
}
function IngestCard(props) {
    const { urls, setUrls, tokens, setTokens, overlap, setOverlap, force, setForce, runIngest, out, busy } = props;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-slate-900 border border-slate-800 rounded-2xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-semibold mb-2",
                children: "Ingest URLs"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 430,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                className: "w-full bg-slate-950 border border-slate-800 rounded-lg p-2 h-24",
                value: urls,
                onChange: (e)=>setUrls(e.target.value)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 431,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2 items-center mt-2 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "tokens ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1",
                                type: "number",
                                value: tokens,
                                onChange: (e)=>setTokens(Number(e.target.value))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 433,
                                columnNumber: 23
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 433,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "overlap ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1",
                                type: "number",
                                value: overlap,
                                onChange: (e)=>setOverlap(Number(e.target.value))
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 434,
                                columnNumber: 24
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 434,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: force,
                                onChange: (e)=>setForce(e.target.checked)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 435,
                                columnNumber: 52
                            }, this),
                            " force"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 435,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: runIngest,
                        className: "bg-emerald-600 hover:bg-emerald-500 rounded-lg px-3 py-1.5",
                        disabled: busy,
                        children: busy ? '…' : 'Ingest'
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 436,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 432,
                columnNumber: 7
            }, this),
            out && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                className: "mt-3 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 whitespace-pre-wrap",
                children: JSON.stringify(out, null, 2)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 438,
                columnNumber: 15
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 429,
        columnNumber: 5
    }, this);
}
function ExamplesCard({ onPick }) {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [err, setErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].examples(6).then((res)=>{
            if (!mounted) return;
            setItems(res.examples ?? []);
            setErr(null);
        }).catch((e)=>{
            if (!mounted) return;
            setErr(e.message || 'Failed to load examples');
            setItems([
                'emperor',
                'roman army tactics',
                'history of microsoft'
            ]); // fallback
        }).finally(()=>mounted && setLoading(false));
        return ()=>{
            mounted = false;
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-slate-900 border border-slate-800 rounded-2xl p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-semibold mb-2",
                children: "Examples"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 467,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-slate-400",
                children: "Loading…"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 468,
                columnNumber: 19
            }, this),
            err && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-red-400 mb-2",
                children: [
                    "⚠ ",
                    err
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 469,
                columnNumber: 15
            }, this),
            !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-2 text-sm",
                children: items.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-left",
                        onClick: ()=>onPick(x),
                        title: x,
                        children: x
                    }, x, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 473,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 471,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 466,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__36225ff4._.js.map