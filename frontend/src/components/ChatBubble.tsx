


// 'use client';

// import React from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// export default function ChatBubble({
//   role,
//   content,
// }: {
//   role: 'user' | 'assistant';
//   content: string;
// }) {
//   const mine = role === 'user';
//   return (
//     <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
//       <div
//         className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
//           mine
//             ? 'bg-blue-600 text-white'
//             : 'bg-slate-900 border border-slate-800 text-slate-100'
//         }`}
//       >
//         <div className="prose prose-invert max-w-none">
//           <ReactMarkdown remarkPlugins={[remarkGfm]}>
//             {content}
//           </ReactMarkdown>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChatBubbleProps = {
  role: 'user' | 'assistant';
  content?: string;
  children?: React.ReactNode;
};

export default function ChatBubble({ role, content, children }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ' +
          (isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-sm')
        }
      >
        {/* Prefer children (custom JSX), fall back to raw markdown content */}
        {children ? (
          <div className="prose prose-invert prose-sm max-w-none">
            {children}
          </div>
        ) : (
          content && (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )
        )}
      </div>
    </div>
  );
}