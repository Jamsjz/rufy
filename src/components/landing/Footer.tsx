'use client';

import { Feather } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border-light">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-ink-muted">
          <Feather className="w-5 h-5" />
          <span className="font-heading">Rufy Poetry</span>
        </div>
        <p className="text-sm text-ink-muted">
          Write poetry that flows
        </p>
      </div>
    </footer>
  );
}
