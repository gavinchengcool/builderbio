"use client";

import { useState } from "react";

interface InstallCommandBoxProps {
  eyebrow: string;
  align?: "left" | "center";
  glow?: boolean;
}

const INSTALL_CMD = "curl -sfL https://builderbio.dev/install.sh | bash";
const AGENT_BADGES = ["OpenClaw", "Codex", "Claude Code", "Cursor"];

export default function InstallCommandBox({
  eyebrow,
  align = "center",
  glow = false,
}: InstallCommandBoxProps) {
  const [copied, setCopied] = useState(false);
  const isCentered = align === "center";

  function handleCopy() {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={isCentered ? "text-center" : "text-left"}>
      <p className="text-[10px] sm:text-xs text-accent mb-3 font-bold tracking-wider leading-relaxed">
        {eyebrow}
      </p>

      <div
        className={`flex items-center gap-2 mb-4 flex-wrap ${
          isCentered ? "justify-center" : "justify-start"
        }`}
      >
        {AGENT_BADGES.map((name) => (
          <span
            key={name}
            className="text-[10px] h-5 px-2 rounded-full border border-border text-text-secondary inline-flex items-center justify-center"
          >
            {name}
          </span>
        ))}
        <span
          className="text-[10px] h-5 px-2 rounded-full border border-border text-text-secondary inline-flex items-center justify-center"
          style={{ paddingBottom: "3px" }}
        >
          ...
        </span>
      </div>

      <div
        className={`terminal-block w-full overflow-hidden p-0 ${
          isCentered ? "sm:mx-auto sm:max-w-[46rem]" : ""
        } ${glow ? "glow-breathe" : ""}`}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_2.75rem] items-stretch sm:grid-cols-[minmax(0,1fr)_3rem]">
          <div className="no-scrollbar flex min-w-0 items-center gap-1.5 overflow-x-auto px-2.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
            <span className="text-accent shrink-0">$</span>
            <code className="min-w-max whitespace-nowrap text-[9px] leading-none text-text-primary sm:text-sm sm:leading-normal">
              {INSTALL_CMD}
            </code>
          </div>
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center justify-end border-l border-border pr-2.5 text-text-muted transition-colors hover:text-accent sm:pr-3"
            title="Copy to clipboard"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
