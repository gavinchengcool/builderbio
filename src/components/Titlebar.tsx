"use client";

import { usePathname } from "next/navigation";

export default function Titlebar({
  forceBuiltByActive = false,
  forceTasteBoardActive = false,
  forceHomeInactive = false,
}: {
  forceBuiltByActive?: boolean;
  forceTasteBoardActive?: boolean;
  forceHomeInactive?: boolean;
}) {
  const pathname = usePathname();
  const isTasteBoard = forceTasteBoardActive || pathname.startsWith("/taste-board");
  const isHome = !forceHomeInactive && pathname === "/";
  const isBuiltBy = forceBuiltByActive;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-secondary/80 backdrop-blur-sm">
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'1px',background:'linear-gradient(90deg, transparent, var(--border), transparent)'}} />
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-3 sm:px-4">
        <a
          href="https://builderbio.dev"
          className={`flex items-center font-bold text-xs tracking-wide transition-colors sm:text-sm ${isHome ? "text-accent" : "text-text-secondary hover:text-accent"}`}
        >
          ~/builderbio
        </a>
        <nav className="flex items-center gap-2 text-[10px] text-text-secondary sm:gap-4 sm:text-xs">
          <a
            href="https://builderbio.dev/taste-board"
            className={isTasteBoard ? "text-accent" : "hover:text-accent transition-colors"}
          >
            /taste-board
          </a>
          <span className="hidden text-text-muted sm:inline">·</span>
          <a
            href="https://gavin.builderbio.dev"
            className={isBuiltBy ? "text-accent" : "hover:text-accent transition-colors"}
          >
            /built-by
          </a>
        </nav>
      </div>
    </header>
  );
}
