module.exports = [
"[project]/.next-internal/server/app/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

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
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__38b19390._.js.map