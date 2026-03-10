"use client";

import { usePathname } from "next/navigation";

export default function Titlebar() {
  const pathname = usePathname();
  const isTasteBoard = pathname.startsWith("/taste-board");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-secondary/80 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
        <a
          href="https://builderbio.dev"
          className="flex items-center gap-2 text-text-secondary font-bold text-sm tracking-wide hover:text-accent transition-colors"
        >
          <span className="text-text-muted">~/</span>builderbio
        </a>
        <nav className="flex items-center gap-4 text-xs text-text-secondary">
          <a
            href="https://builderbio.dev/taste-board"
            className={isTasteBoard ? "text-accent" : "hover:text-accent transition-colors"}
          >
            /taste-board
          </a>
          <span className="text-text-muted">·</span>
          <a href="https://gavin.builderbio.dev" className="hover:text-accent transition-colors">
            /built-by
          </a>
        </nav>
      </div>
    </header>
  );
}
