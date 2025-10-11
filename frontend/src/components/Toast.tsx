// frontend/src/components/Toast.tsx
'use client';

import { useEffect } from 'react';
import clsx from 'clsx';

export default function Toast({
  show,
  type = 'error',
  message,
  onClose,
  autoHideMs = 3500,
}: {
  show: boolean;
  type?: 'info' | 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void;
  autoHideMs?: number;
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, autoHideMs);
    return () => clearTimeout(t);
  }, [show, autoHideMs, onClose]);

  if (!show) return null;

  const colors = {
    info: 'bg-sky-800 text-sky-50 border-sky-600',
    success: 'bg-emerald-800 text-emerald-50 border-emerald-600',
    error: 'bg-rose-800 text-rose-50 border-rose-600',
    warning: 'bg-amber-800 text-amber-50 border-amber-600',
  }[type];

  return (
    <div className="fixed inset-0 pointer-events-none flex items-start justify-center mt-6 z-[1000]">
      <div className={clsx('pointer-events-auto px-4 py-2 rounded-lg border shadow-lg', colors)}>
        <div className="font-medium">{type.toUpperCase()}</div>
        <div className="text-sm opacity-90">{message}</div>
      </div>
    </div>
  );
}