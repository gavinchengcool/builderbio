"use client";

import { useState, useEffect, useRef } from "react";

interface HeroSectionProps {
  t: (key: string) => string;
}

export default function HeroSection({ t }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);
  const installCmd = "curl -sfL https://builderbio.dev/install.sh | bash";
  const sectionRef = useRef<HTMLElement>(null);

  function handleCopy() {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll(".fade-in-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pb-12 sm:pb-24 px-4 hero-glow">
      {/* Nav — inside hero-glow so it floats on the light */}
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 relative z-10">
        <a href="https://builderbio.dev" className="flex items-center text-accent font-bold text-sm tracking-wide">
          ~/builderbio
        </a>
        <nav className="flex items-center gap-4 text-xs text-text-secondary">
          <a href="https://builderbio.dev/taste-board" className="hover:text-accent transition-colors">
            /taste-board
          </a>
          <span className="text-text-muted">·</span>
          <a href="https://gavin.builderbio.dev" className="hover:text-accent transition-colors">
            /built-by
          </a>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl text-center relative z-10 pt-12 sm:pt-24">
        {/* Slogan */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tight text-accent leading-[0.95]" style={{ wordSpacing: '-0.15em' }}>
          Show the world<br />your taste
        </h1>
        <p className="text-xs sm:text-sm md:text-lg font-normal text-text-secondary italic mt-6 sm:mt-10 mb-16 sm:mb-28">
          Because how you build with AI is who you are
        </p>

        {/* Install command */}
        <div className="mb-16 sm:mb-28 fade-in-up">
          <p className="text-[10px] sm:text-xs text-accent mb-3 font-bold tracking-wider leading-relaxed">
            {t("hero.install")}
          </p>
          <div className="terminal-block flex items-center gap-2 sm:gap-3 w-full sm:inline-flex sm:w-auto glow-breathe">
            <span className="text-accent shrink-0">$</span>
            <code className="text-[10px] sm:text-sm text-text-primary break-all sm:break-normal min-w-0">{installCmd}</code>
            <button
              onClick={handleCopy}
              className="shrink-0 ml-auto sm:ml-2 p-1.5 rounded hover:bg-bg-tertiary transition-colors text-text-muted hover:text-accent"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-16 sm:mb-20 fade-in-up">
          <h2 className="text-xs text-text-muted mb-6 sm:mb-8 tracking-wider uppercase">
            {t("hero.howItWorks")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="terminal-block text-left space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent font-bold text-lg">
                    {String(step).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-bold text-text-primary">
                    {t(`step.${step}.title`)}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {t(`step.${step}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Built by — creator section */}
        <div className="mb-8 fade-in-up">
          <h2 className="text-xs text-text-muted mb-6 sm:mb-8 tracking-wider uppercase">
            Built by
          </h2>
          <a
            href="https://gavin.builderbio.dev"
            className="terminal-block max-w-lg mx-auto text-left border-accent/30 block hover:border-accent/60 transition-colors"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-danger"></span>
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              <span className="text-xs text-text-muted ml-2">gavin.builderbio.dev</span>
            </div>
            {/* Profile header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/avatar-gavin.jpg"
                  alt="Gavin"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-text-primary">Gavin</p>
                  <p className="text-xs text-text-muted">builder of builderbio</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary italic leading-relaxed">
                &quot;The kind of builder who ships the product before writing the pitch.&quot;
              </p>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: "230", label: "sessions" },
                  { value: "12.7K", label: "turns" },
                  { value: "8.8K", label: "tool calls" },
                  { value: "34", label: "active days" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-sm font-bold text-accent">{s.value}</p>
                    <p className="text-[10px] text-text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Agents */}
              <div className="flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-text-secondary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  Claude Code
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-text-secondary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
                  Codex
                </span>
              </div>
              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {["Product Strategy", "AI Agent", "Next.js", "TypeScript", "Ship fast"].map((s) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-text-secondary">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
