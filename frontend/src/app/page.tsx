
'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import Spinner from '@/components/Spinner';
import ChatBubble from '@/components/ChatBubble';
import Toast from '@/components/Toast';

// Messages in the chat window
type Msg = { id: string; role: 'user' | 'assistant'; content: string };

// Query history (so user can click to re-run)
type HistoryItem = {
  id: string;
  mode: 'search' | 'summarize';
  input: string;
  at: number;
  params?: any;
};

export default function Home() {
  // health / status
  const [health, setHealth] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);

  // Mode: search vs summarize
  const [mode, setMode] = useState<'search' | 'summarize'>('summarize');

  // Model params (summarize mode)
  const [model, setModel] = useState('llama3:8b');
  const [k, setK] = useState(8);
  const [temperature, setTemperature] = useState(0.1);
  const [maxTokens, setMaxTokens] = useState(500);

  // Ingest params shared by URL ingest and PDF ingest
  const [tokens, setTokens] = useState(500);
  const [overlap, setOverlap] = useState(100);
  const [force, setForce] = useState(false);

  // ingest URLs panel
  const [urls, setUrls] = useState('https://www.iana.org/domains/reserved');
  const [ingestOut, setIngestOut] = useState<any>(null);
  const [ingestBusy, setIngestBusy] = useState(false);

  // upload PDF panel
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadOut, setUploadOut] = useState<any>(null);

  // chat
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('emperor');

  // examples + history
  const [examples, setExamples] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // notifications
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'info' | 'success' | 'error' | 'warning';
    message: string;
  }>({
    show: false,
    type: 'error',
    message: '',
  });

  const scroller = useRef<HTMLDivElement>(null);

  // load health, examples, and any saved settings from localStorage
  useEffect(() => {
    (async () => {
      // backend health
      try {
        const h = await api.health();
        setHealth(`OK (${h.env}, model: ${h.model})`);
      } catch (e: any) {
        setHealth(`Error: ${e.message}`);
      }

      // examples
      try {
        const ex = await api.examples(6);
        if (Array.isArray(ex.examples) && ex.examples.length) {
          setExamples(ex.examples);
        } else {
          setExamples([
            'emperor',
            'roman army tactics',
            'history of microsoft',
            'Byzantine emperors',
          ]);
        }
      } catch {
        setExamples([
          'emperor',
          'roman army tactics',
          'history of microsoft',
          'Byzantine emperors',
        ]);
      }

      // restore settings/history
      try {
        const saved = localStorage.getItem('pgai.settings');
        if (saved) {
          const s = JSON.parse(saved);
          if (s.model) setModel(s.model);
          if (s.k) setK(s.k);
          if (s.temperature != null) setTemperature(s.temperature);
          if (s.maxTokens) setMaxTokens(s.maxTokens);
          if (s.tokens) setTokens(s.tokens);
          if (s.overlap) setOverlap(s.overlap);
          if (s.force != null) setForce(s.force);
        }
      } catch {}
      try {
        const hst = localStorage.getItem('pgai.history');
        if (hst) {
          setHistory(JSON.parse(hst));
        }
      } catch {}
    })();
  }, []);

  // auto-scroll chat on new messages
  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  // persist settings whenever they change
  useEffect(() => {
    localStorage.setItem(
      'pgai.settings',
      JSON.stringify({
        model,
        k,
        temperature,
        maxTokens,
        tokens,
        overlap,
        force,
      })
    );
  }, [model, k, temperature, maxTokens, tokens, overlap, force]);

  function pushHistory(item: HistoryItem) {
    const next = [item, ...history].slice(0, 12);
    setHistory(next);
    localStorage.setItem('pgai.history', JSON.stringify(next));
  }

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || busy) return;

    const text = input.trim();
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: 'user', content: text },
    ]);
    setInput('');
    setBusy(true);

    try {
      if (mode === 'summarize') {
        const res = await api.summarize(text, {
          k,
          model,
          temperature,
          max_tokens: maxTokens,
        });

        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `**Summary** *(model: ${res.model})*\n\n${res.summary}`,
          },
        ]);
      } else {
        // search mode
        const res = await api.search(text, 5);
        const md = [
          `**Search Results for:** ${res.query}`,
          ...res.results.map((r: any, i: number) => {
            const url =
              r.citation?.match(/\((.+?):\d+-\d+\)/)?.[1] ??
              r?.meta?.source ??
              '#';
            return `**${i + 1}.** ${r.text}\n\n> [${r.citation}](${url})`;
          }),
        ].join('\n\n');

        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: md,
          },
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
          tokens,
          overlap,
          force,
        },
      });
    } catch (e: any) {
      setToast({
        show: true,
        type: 'error',
        message: e.message || 'Request failed',
      });
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `❌ ${e.message}`,
        },
      ]);
    } finally {
        setBusy(false);
    }
  }

  async function runIngest() {
    setIngestBusy(true);
    setIngestOut(null);
    try {
      const list = urls
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.ingest(list, tokens, overlap, force);
      setIngestOut(res);
    } catch (e: any) {
      setIngestOut({ error: e.message });
      setToast({
        show: true,
        type: 'error',
        message: e.message,
      });
    } finally {
      setIngestBusy(false);
    }
  }

  async function runUpload(file: File) {
    setUploadBusy(true);
    setUploadOut(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const qs = new URLSearchParams({
        tokens: String(tokens),
        overlap: String(overlap),
        force: 'true', // uploads usually re-index
        collection: 'default',
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/ingest_file?${qs.toString()}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setUploadOut(data);
    } catch (e: any) {
      setUploadOut({ error: e.message || 'upload failed' });
      setToast({
        show: true,
        type: 'error',
        message: e.message || 'upload failed',
      });
    } finally {
      setUploadBusy(false);
    }
  }

  function reRun(h: HistoryItem) {
    setMode(h.mode);
    setInput(h.input);
    if (h.params) {
      if (h.params.model) setModel(h.params.model);
      if (h.params.k) setK(h.params.k);
      if (h.params.temperature != null)
        setTemperature(h.params.temperature);
      if (h.params.maxTokens) setMaxTokens(h.params.maxTokens);
      if (h.params.tokens) setTokens(h.params.tokens);
      if (h.params.overlap) setOverlap(h.params.overlap);
      if (h.params.force != null) setForce(h.params.force);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((s) => ({ ...s, show: false }))}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="font-bold">
              Production-Grade AI — RAG (Next.js)
            </div>
            <div className="text-xs text-slate-400">
              API: {process.env.NEXT_PUBLIC_API_BASE} • Health:{' '}
              <span className="text-emerald-400">{health}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* search/summarize toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              <button
                className={`px-3 py-1 text-sm ${
                  mode === 'search' ? 'bg-slate-800' : ''
                }`}
                onClick={() => setMode('search')}
                disabled={busy}
              >
                Search
              </button>
              <button
                className={`px-3 py-1 text-sm ${
                  mode === 'summarize' ? 'bg-slate-800' : ''
                }`}
                onClick={() => setMode('summarize')}
                disabled={busy}
              >
                Summarize
              </button>
            </div>

            {/* summarize-only controls */}
            {mode === 'summarize' && (
              <>
                <select
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option>llama3:8b</option>
                  <option>qwen2.5:3b-instruct</option>
                </select>
                <label className="text-xs">
                  k{' '}
                  <input
                    className="w-14 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    type="number"
                    value={k}
                    onChange={(e) => setK(Number(e.target.value))}
                  />
                </label>
                <label className="text-xs">
                  temp{' '}
                  <input
                    className="w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    type="number"
                    step={0.1}
                    min={0}
                    max={1}
                    value={temperature}
                    onChange={(e) =>
                      setTemperature(Number(e.target.value))
                    }
                  />
                </label>
                <label className="text-xs">
                  max{' '}
                  <input
                    className="w-20 ml-1 bg-slate-900 border border-slate-700 rounded px-2 py-1"
                    type="number"
                    value={maxTokens}
                    onChange={(e) =>
                      setMaxTokens(Number(e.target.value))
                    }
                  />
                </label>
              </>
            )}
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
        {/* LEFT: history */}
        <aside className="hidden md:block pt-3">
          <div className="text-xs uppercase text-slate-400 mb-2">
            History
          </div>
          <div className="space-y-2">
            {history.length === 0 && (
              <div className="text-slate-500 text-xs">
                No history yet.
              </div>
            )}
            {history.map((h) => (
              <button
                key={h.id}
                className="w-full text-left text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg px-3 py-2"
                onClick={() => reRun(h)}
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
            {mode === 'summarize'
              ? 'Ask a question about your indexed sources. I’ll generate a cited summary.'
              : 'Semantic search across your indexed sources.'}
          </div>

          <div
            ref={scroller}
            className="mt-3 h-[62vh] md:h-[66vh] overflow-y-auto space-y-3 pr-1"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <div className="text-slate-400 text-sm">
                Try{' '}
                {examples.slice(0, 3).map((x, i) => (
                  <code key={i} className="mx-1">
                    {x}
                  </code>
                ))}{' '}
                or switch to <b>Search</b> mode and enter keywords.
              </div>
            )}

            {messages.map((m) => (
              <ChatBubble
                key={m.id}
                role={m.role}
                content={m.content}
              />
            ))}

            {busy && (
              <div className="text-slate-400 text-sm flex items-center gap-2">
                <Spinner /> Working…
              </div>
            )}
          </div>

          {/* INPUT BAR */}
          <form
            onSubmit={onSend}
            className="sticky bottom-4 mt-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-2 flex flex-col gap-2"
          >
            <div className="flex gap-2">
              <input
                className="flex-1 bg-transparent outline-none px-3 py-2"
                placeholder={
                  mode === 'summarize'
                    ? 'Ask about your data…'
                    : 'Search your data…'
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl px-4 py-2"
                disabled={busy}
              >
                {busy
                  ? '...'
                  : mode === 'summarize'
                  ? 'Summarize'
                  : 'Search'}
              </button>
            </div>
          </form>

          {/* INGEST ZONE */}
          <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <IngestCard
              urls={urls}
              setUrls={setUrls}
              tokens={tokens}
              setTokens={setTokens}
              overlap={overlap}
              setOverlap={setOverlap}
              force={force}
              setForce={setForce}
              runIngest={runIngest}
              out={ingestOut}
              busy={ingestBusy}
            />

            <UploadCard
              tokens={tokens}
              overlap={overlap}
              busy={uploadBusy}
              out={uploadOut}
              runUpload={runUpload}
            />

            <ExamplesCard
              examples={examples}
              onPick={(q) => setInput(q)}
            />
          </section>
        </section>
      </main>
    </div>
  );
}

// IngestCard: URL ingestion
function IngestCard(props: {
  urls: string;
  setUrls: (v: string) => void;
  tokens: number;
  setTokens: (n: number) => void;
  overlap: number;
  setOverlap: (n: number) => void;
  force: boolean;
  setForce: (b: boolean) => void;
  runIngest: () => void;
  out: any;
  busy: boolean;
}) {
  const {
    urls,
    setUrls,
    tokens,
    setTokens,
    overlap,
    setOverlap,
    force,
    setForce,
    runIngest,
    out,
    busy,
  } = props;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="font-semibold mb-2">Ingest URLs</div>
      <textarea
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 h-24"
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 items-center mt-2 text-sm">
        <label>
          tokens{' '}
          <input
            className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1"
            type="number"
            value={tokens}
            onChange={(e) => setTokens(Number(e.target.value))}
          />
        </label>
        <label>
          overlap{' '}
          <input
            className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 ml-1"
            type="number"
            value={overlap}
            onChange={(e) => setOverlap(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={force}
            onChange={(e) => setForce(e.target.checked)}
          />{' '}
          force
        </label>
        <button
          onClick={runIngest}
          className="bg-emerald-600 hover:bg-emerald-500 rounded-lg px-3 py-1.5"
          disabled={busy}
        >
          {busy ? '…' : 'Ingest'}
        </button>
      </div>

      {out && (
        <div className="mt-3 text-xs space-y-2">
          {'error' in out ? (
            <div className="text-rose-300">
              Error: {String(out.error)}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 text-slate-300">
                <span className="bg-slate-800 px-2 py-0.5 rounded">
                  indexed: {out.indexed}
                </span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">
                  chunks: {out.chunks}
                </span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">
                  avg words: {out.avg_chunk_words}
                </span>
                {out.skipped ? (
                  <span className="bg-slate-800 px-2 py-0.5 rounded">
                    skipped: {out.skipped}
                  </span>
                ) : null}
              </div>
              <pre className="text-[10px] leading-tight bg-slate-950 border border-slate-800 rounded-lg p-2 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {JSON.stringify(out, null, 2)}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// UploadCard: PDF upload ingestion
function UploadCard(props: {
  tokens: number;
  overlap: number;
  busy: boolean;
  out: any;
  runUpload: (f: File) => void;
}) {
  const { tokens, overlap, busy, out, runUpload } = props;

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a .pdf file');
      return;
    }
    runUpload(f);
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="font-semibold mb-2">Upload PDF</div>
      <div className="text-xs text-slate-400 mb-2">
        Extracts text, chunks (~{tokens} tokens / ~{overlap} overlap),
        and indexes it for search & summarize. Great for EULAs,
        research papers, internal docs, etc.
      </div>

      <label className="block">
        <input
          type="file"
          accept="application/pdf"
          className="text-xs file:mr-3 file:rounded-lg file:border file:border-slate-700 file:bg-slate-800 file:px-3 file:py-1.5 file:text-slate-200 file:text-xs hover:file:bg-slate-700"
          disabled={busy}
          onChange={onSelectFile}
        />
      </label>

      {busy && (
        <div className="mt-2 text-slate-400 text-xs flex items-center gap-2">
          <Spinner /> Uploading & indexing…
        </div>
      )}

      {out && (
        <div className="mt-3 text-xs space-y-2">
          {'error' in out ? (
            <div className="text-rose-300">
              Error: {String(out.error)}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 text-slate-300">
                <span className="bg-slate-800 px-2 py-0.5 rounded">
                  file: {out.filename || 'pdf'}
                </span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">
                  indexed: {out.indexed}
                </span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">
                  chunks: {out.chunks}
                </span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">
                  avg words: {out.avg_chunk_words}
                </span>
              </div>
              <pre className="text-[10px] leading-tight bg-slate-950 border border-slate-800 rounded-lg p-2 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {JSON.stringify(out, null, 2)}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ExamplesCard: suggestions
function ExamplesCard({
  examples,
  onPick,
}: {
  examples: string[];
  onPick: (q: string) => void;
}) {
  const items = examples?.length
    ? examples
    : [
        'emperor',
        'roman army tactics',
        'history of microsoft',
        'Byzantine emperors',
      ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="font-semibold mb-2">Examples</div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {items.map((x) => (
          <button
            key={x}
            className="bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-left"
            onClick={() => onPick(x)}
          >
            {x}
          </button>
        ))}
      </div>
    </div>
  );
}