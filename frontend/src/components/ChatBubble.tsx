// frontend/src/components/ChatBubble.tsx
'use client';

import React from 'react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function extractCitations(md: string): { url: string; start: number; end: number }[] {
  const re = /\((https?:\/\/[^:()\s]+):(\d+)-(\d+)\)/g;
  const out: { url: string; start: number; end: number }[] = [];
  let m;
  while ((m = re.exec(md)) !== null) out.push({ url: m[1], start: Number(m[2]), end: Number(m[3]) });
  const key = (x: { url: string; start: number; end: number }) => `${x.url}:${x.start}-${x.end}`;
  return Array.from(new Map(out.map(x => [key(x), x])).values());
}

function domainOf(url: string) {
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return url; }
}

export default function ChatBubble({
  role,
  content,
}: {
  role: 'user' | 'assistant';
  content: string;
}) {
  const citations = role === 'assistant' ? extractCitations(content) : [];
  const linked = content.replace(/\((https?:\/\/[^:()\s]+):(\d+)-(\d+)\)/g, (_m, u, s, e) => `([${u}:${s}-${e}](${u}))`);

  return (
    <div className={clsx('flex', role === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[85%] md:max-w-[70%] rounded-2xl border px-4 py-3 shadow',
          role === 'user'
            ? 'bg-blue-600/20 border-blue-500/40 text-blue-50'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        )}
        aria-live="polite"
      >
        {/* ⬇️ put the class on a wrapper instead of ReactMarkdown */}
        <div className="prose prose-invert prose-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {linked}
          </ReactMarkdown>
        </div>

        {citations.length > 0 && (
          <div className="mt-3 border-t border-slate-800 pt-2">
            <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Sources</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {citations.map((c, i) => (
                <a
                  key={`${c.url}-${i}`}
                  className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-2 flex items-center justify-between gap-3"
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  title={`${c.url}:${c.start}-${c.end}`}
                >
                  <span className="truncate">{domainOf(c.url)}</span>
                  <span className="shrink-0 opacity-70">{c.start}-{c.end}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}