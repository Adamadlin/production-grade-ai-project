

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
//   const [items, setItems] = useState<string[]>([])
//   const [loading, setLoading] = useState(true)
//   const [err, setErr] = useState<string | null>(null)

//   useEffect(() => {
//     let mounted = true
//     api.examples(6)
//       .then((res) => {
//         if (!mounted) return
//         setItems(res.examples ?? [])
//         setErr(null)
//       })
//       .catch((e: any) => {
//         if (!mounted) return
//         setErr(e.message || 'Failed to load examples')
//         setItems(['emperor', 'roman army tactics', 'history of microsoft']) // fallback
//       })
//       .finally(() => mounted && setLoading(false))
//     return () => { mounted = false }
//   }, [])

//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
//       <div className="font-semibold mb-2">Examples</div>
//       {loading && <div className="text-sm text-slate-400">Loading…</div>}
//       {err && <div className="text-sm text-red-400 mb-2">⚠ {err}</div>}
//       {!loading && (
//         <div className="grid grid-cols-2 gap-2 text-sm">
//           {items.map((x) => (
//             <button
//               key={x}
//               className="bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-left"
//               onClick={() => onPick(x)}
//               title={x}
//             >
//               {x}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }


// frontend/src/app/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import Spinner from '@/components/Spinner';
import ChatBubble from '@/components/ChatBubble';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Toast from '@/components/Toast';

type Msg = { id: string; role: 'user'|'assistant'; content: string };
type HistoryItem = { id: string; mode: 'search'|'summarize'; input: string; at: number; params?: any };

export default function Home() {
  const [health, setHealth] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);

  // Mode: search vs summarize
  const [mode, setMode] = useState<'search'|'summarize'>('summarize');

  // Model params (summarize only)
  const [model, setModel] = useState('llama3:8b');
  const [k, setK] = useState(8);
  const [temperature, setTemperature] = useState(0.1);
  const [maxTokens, setMaxTokens] = useState(500);

  // Optional filters
  const [domain, setDomain] = useState('');
  const [source, setSource] = useState('');

  // Ingest panel state
  const [urls, setUrls] = useState('https://www.iana.org/domains/reserved');
  const [tokens, setTokens] = useState(500);
  const [overlap, setOverlap] = useState(100);
  const [force, setForce] = useState(false);
  const [ingestOut, setIngestOut] = useState<any>(null);
  const [ingestBusy, setIngestBusy] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('emperor');
  const [examples, setExamples] = useState<string[]>([]);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toast, setToast] = useState<{show:boolean; type:'info'|'success'|'error'|'warning'; message:string}>({
    show: false, type: 'error', message: ''
  });

  const scroller = useRef<HTMLDivElement>(null);

  // Load health, examples, and persisted settings/history
  useEffect(() => {
    (async () => {
      try {
        const h = await api.health();
        setHealth(`OK (${h.env}, model: ${h.model})`);
      } catch (e:any) {
        setHealth(`Error: ${e.message}`);
      }
      try {
        const ex = await api.examples(6);
        if (Array.isArray(ex.examples) && ex.examples.length) {
          setExamples(ex.examples);
        } else {
          setExamples(['emperor', 'roman army tactics', 'history of microsoft', 'Byzantine emperors']);
        }
      } catch {
        setExamples(['emperor', 'roman army tactics', 'history of microsoft', 'Byzantine emperors']);
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
        } catch {}
      }
      const hst = localStorage.getItem('pgai.history');
      if (hst) {
        try { setHistory(JSON.parse(hst)); } catch {}
      }
    })();
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('pgai.settings', JSON.stringify({ model, k, temperature, maxTokens, domain, source }));
  }, [model, k, temperature, maxTokens, domain, source]);

  function pushHistory(item: HistoryItem) {
    const next = [item, ...history].slice(0, 12);
    setHistory(next);
    localStorage.setItem('pgai.history', JSON.stringify(next));
  }

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || busy) return;

    const text = input.trim();
    setMessages(m => [...m, { id: crypto.randomUUID(), role: 'user', content: text }]);
    setInput('');
    setBusy(true);

    try {
      if (mode === 'summarize') {
        const res = await api.summarize(text, { k, model, temperature, max_tokens: maxTokens, domain: domain || undefined, source: source || undefined });
        setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: `**Summary** *(model: ${res.model})*\n\n${res.summary}` }]);
      } else {
        const res = await api.search(text, 5, { domain: domain || undefined, source: source || undefined });
        const md = [
          `**Search Results for:** ${res.query}`,
          ...res.results.map((r, i) => {
            const url = r.citation?.match(/\((.+?):\d+-\d+\)/)?.[1] ?? r?.meta?.source ?? '#';
            return `**${i+1}.** ${r.text}\n\n> [${r.citation}](${url})`;
          })
        ].join('\n\n');
        setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: md }]);
      }
      pushHistory({ id: crypto.randomUUID(), mode, input: text, at: Date.now(), params: { k, model, temperature, maxTokens, domain, source }});
    } catch (e:any) {
      setToast({ show: true, type: 'error', message: e.message || 'Request failed' });
      setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: `❌ ${e.message}` }]);
    } finally {
      setBusy(false);
    }
  }

  async function runIngest() {
    setIngestBusy(true); setIngestOut(null);
    try {
      const list = urls.split('\n').map(s=>s.trim()).filter(Boolean);
      const res = await api.ingest(list, tokens, overlap, force);
      setIngestOut(res);
    } catch (e:any) {
      setIngestOut({ error: e.message });
      setToast({ show: true, type: 'error', message: e.message });
    } finally {
      setIngestBusy(false);
    }
  }

  function reRun(h: HistoryItem) {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={()=>setToast(s=>({...s, show:false}))} />

      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="font-bold">Production-Grade AI — RAG (Next.js)</div>
            <div className="text-xs text-slate-400">
              API: {process.env.NEXT_PUBLIC_API_BASE} • Health: <span className="text-emerald-400">{health}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              <button
                className={`px-3 py-1 text-sm ${mode==='search'?'bg-slate-800':''}`}
                onClick={()=>setMode('search')}
                disabled={busy}
              >Search</button>
              <button
                className={`px-3 py-1 text-sm ${mode==='summarize'?'bg-slate-800':''}`}
                onClick={()=>setMode('summarize')}
                disabled={busy}
              >Summarize</button>
            </div>

            {/* Summarize-only controls */}
            {mode==='summarize' && (
              <>
                <select className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1" value={model} onChange={e=>setModel(e.target.value)}>
                  <option>llama3:8b</option>
                  <option>qwen2.5:3b-instruct</option>
                </select>
                <label className="text-xs">k <input className="w-14 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1" type="number" value={k} onChange={e=>setK(Number(e.target.value))}/></label>
                <label className="text-xs">temp <input className="w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1" type="number" step={0.1} min={0} max={1} value={temperature} onChange={e=>setTemperature(Number(e.target.value))}/></label>
                <label className="text-xs">max <input className="w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1" type="number" value={maxTokens} onChange={e=>setMaxTokens(Number(e.target.value))}/></label>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
        {/* LEFT: history */}
        <aside className="hidden md:block pt-3">
          <div className="text-xs uppercase text-slate-400 mb-2">History</div>
          <div className="space-y-2">
            {history.length === 0 && <div className="text-slate-500 text-xs">No history yet.</div>}
            {history.map(h => (
              <button
                key={h.id}
                className="w-full text-left text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg px-3 py-2"
                onClick={()=>reRun(h)}
                title={new Date(h.at).toLocaleString()}
              >
                <div className="opacity-70">{h.mode.toUpperCase()}</div>
                <div className="truncate">{h.input}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* RIGHT: chat + controls */}
        <section>
          <div className="mt-4 text-sm text-slate-400">
            {mode==='summarize'
              ? 'Type a topic to generate a cited summary from your indexed sources.'
              : 'Type a query to search semantically across your indexed sources.'}
          </div>

          <div ref={scroller} className="mt-3 h-[62vh] md:h-[66vh] overflow-y-auto space-y-3 pr-1" aria-live="polite">
            {messages.length === 0 && (
              <div className="text-slate-400 text-sm">
                Try {examples.slice(0,3).map((x,i)=> <code key={i} className="mx-1">{x}</code>)} or switch to <b>Search</b> mode and enter keywords.
              </div>
            )}
            {messages.map(m => (
              <ChatBubble key={m.id} role={m.role} content={m.content} />
            ))}
            {busy && <div className="text-slate-400 text-sm flex items-center gap-2"><Spinner/> Working…</div>}
          </div>

          <form onSubmit={onSend} className="sticky bottom-4 mt-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-2 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                className="flex-1 bg-transparent outline-none px-3 py-2"
                placeholder={mode==='summarize' ? "Type a topic to summarize…" : "Type a query to search…"}
                value={input}
                onChange={e=>setInput(e.target.value)}
              />
              <button className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl px-4 py-2" disabled={busy}>
                {busy ? '...' : (mode==='summarize' ? 'Summarize' : 'Search')}
              </button>
            </div>
            {/* Optional filters */}
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <label>domain <input className="w-56 ml-1 bg-slate-950 border border-slate-800 rounded px-2 py-1" value={domain} onChange={e=>setDomain(e.target.value)} placeholder="e.g. en.wikipedia.org" /></label>
              <label>source <input className="w-64 ml-1 bg-slate-950 border border-slate-800 rounded px-2 py-1" value={source} onChange={e=>setSource(e.target.value)} placeholder="e.g. /wiki/History_of_Microsoft" /></label>
            </div>
          </form>

          <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <IngestCard
              urls={urls} setUrls={setUrls}
              tokens={tokens} setTokens={setTokens}
              overlap={overlap} setOverlap={setOverlap}
              force={force} setForce={setForce}
              runIngest={runIngest}
              out={ingestOut} busy={ingestBusy}
            />
            <ExamplesCard examples={examples} onPick={(q) => setInput(q)} />
          </section>
        </section>
      </main>
    </div>
  );
}

function IngestCard(props: {
  urls: string; setUrls: (v:string)=>void;
  tokens: number; setTokens: (n:number)=>void;
  overlap: number; setOverlap: (n:number)=>void;
  force: boolean; setForce: (b:boolean)=>void;
  runIngest: () => void;
  out: any; busy: boolean;
}) {
  const { urls, setUrls, tokens, setTokens, overlap, setOverlap, force, setForce, runIngest, out, busy } = props;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="font-semibold mb-2">Ingest URLs</div>
      <textarea className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 h-24" value={urls} onChange={e=>setUrls(e.target.value)} />
      <div className="flex flex-wrap gap-2 items-center mt-2 text-sm">
        <label>tokens <input className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1" type="number" value={tokens} onChange={e=>setTokens(Number(e.target.value))}/></label>
        <label>overlap <input className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1" type="number" value={overlap} onChange={e=>setOverlap(Number(e.target.value))}/></label>
        <label className='flex items-center gap-2'><input type="checkbox" checked={force} onChange={e=>setForce(e.target.checked)} /> force</label>
        <button onClick={runIngest} className="bg-emerald-600 hover:bg-emerald-500 rounded-lg px-3 py-1.5" disabled={busy}>{busy?'…':'Ingest'}</button>
      </div>
      {out && (
        <div className="mt-3 text-xs space-y-2">
          {'error' in out ? (
            <div className="text-rose-300">Error: {String(out.error)}</div>
          ) : (
            <>
              <div className="flex gap-2 text-slate-300">
                <span className="bg-slate-800 px-2 py-0.5 rounded">indexed: {out.indexed}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">chunks: {out.chunks}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">avg words: {out.avg_chunk_words}</span>
                {out.skipped ? <span className="bg-slate-800 px-2 py-0.5 rounded">skipped: {out.skipped}</span> : null}
              </div>
              <pre className="text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 whitespace-pre-wrap">{JSON.stringify(out, null, 2)}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ExamplesCard({ examples, onPick }: { examples: string[]; onPick: (q: string) => void }) {
  const items = examples?.length ? examples : [
    'emperor',
    'roman army tactics',
    'history of microsoft',
    'Byzantine emperors',
  ];
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="font-semibold mb-2">Examples</div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {items.map(x => (
          <button key={x} className="bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-left" onClick={()=>onPick(x)}>{x}</button>
        ))}
      </div>
    </div>
  );
}