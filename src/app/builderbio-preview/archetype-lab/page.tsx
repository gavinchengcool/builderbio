import Titlebar from "@/components/Titlebar";
import PreviewModeSwitch from "../PreviewModeSwitch";

type ThemeName =
  | "product-operator"
  | "terminal-native"
  | "editorial-maker"
  | "night-shift"
  | "research-forge"
  | "calm-craft";

type ThemeCard = {
  name: ThemeName;
  mode: "builder";
  why: string;
};

const shared = {
  name: "Gavin",
  slug: "gavin.builderbio.dev",
  thesis: "一个把 Agent 研究、产品策略和实际交付串成同一条工作流的 Builder。",
  summary:
    "同一份 Gavin BuilderBio 数据里，最清楚的主线是：一边研究 Agent 生态，一边把这种研究直接做成产品和公开页面。",
  signature: "Coding Agent Showcase",
  signatureSummary:
    "一个能扫描本地 session 日志，并生成可分享 Builder 画像页的产品线。",
  stats: [
    { label: "Sessions", value: "230" },
    { label: "Turns", value: "12.7K" },
    { label: "Tool Calls", value: "8.8K" },
    { label: "Active Days", value: "34" },
    { label: "Tokens", value: "9.99B" },
  ],
  signals: ["CLI 优先", "晨间型 Builder", "研究和交付并行", "多 Agent 协作"],
  receipts: [
    { label: "Peak day", value: "2026-03-06" },
    { label: "Strongest hour", value: "10 AM" },
    { label: "Primary split", value: "Codex 速度 / Claude Code 深度" },
  ],
};

const themes: ThemeCard[] = [
  {
    name: "product-operator",
    mode: "builder",
    why: "出货型、产品型、项目推进感强的时候，应该长得像一个清晰的 operator 面板。",
  },
  {
    name: "terminal-native",
    mode: "builder",
    why: "CLI 重、工具重、终端感很强的时候，应该像一个活着的工作台，不该像 portfolio。",
  },
  {
    name: "editorial-maker",
    mode: "builder",
    why: "作品感、表达欲、可转发性更强的时候，应该更像一本人物特写，而不是 dashboard。",
  },
  {
    name: "night-shift",
    mode: "builder",
    why: "深夜高频、多 agent 接力、冲刺感强的时候，首屏就该有张力和夜间能量。",
  },
  {
    name: "research-forge",
    mode: "builder",
    why: "研究、分析、翻译、证据链重的时候，页面应该像 dossier，而不是增长页。",
  },
  {
    name: "calm-craft",
    mode: "builder",
    why: "长期打磨、慢工出细活、单项目深耕的时候，页面应该更克制、更有手感。",
  },
];

function chip(text: string, className: string) {
  return (
    <span
      key={text}
      className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${className}`}
    >
      {text}
    </span>
  );
}

function ProductOperatorCard() {
  return (
    <article className="overflow-hidden rounded-[32px] border border-[#ffb49b] bg-[linear-gradient(180deg,#fff6f1_0%,#fff 52%,#fff7f2_100%)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#ff6b35]/25 bg-[#ff6b35]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff6b35]">
          product-operator
        </span>
        <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-black/55">
          mode · builder
        </span>
      </div>

      <div className="rounded-[28px] border border-[#ffd4c5] bg-white p-5 text-[#241915] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-black/40">{shared.slug}</p>
            <h2 className="mt-2 text-4xl font-black">Gavin</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-black/65">{shared.summary}</p>
          </div>
          <div className="rounded-2xl border border-[#ff6b35]/15 bg-[#fff6f1] px-4 py-3 text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-black/45">default pick</div>
            <div className="mt-1 text-sm font-bold text-[#ff6b35]">product-operator</div>
          </div>
        </div>

        <h3 className="mt-6 max-w-3xl text-[1.85rem] font-black leading-[1.05] sm:text-[2.4rem]">
          {shared.thesis}
        </h3>

        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {shared.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-black/10 bg-[#fffaf6] px-4 py-4"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-black/45">{stat.label}</div>
              <div className="mt-2 text-2xl font-black text-[#ff6b35]">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {shared.signals.map((signal) => chip(signal, "border-black/10 bg-white text-black/75"))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-black/10 bg-[#fffaf6] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">Signature build</div>
            <div className="mt-2 text-2xl font-black">{shared.signature}</div>
            <p className="mt-3 text-sm leading-6 text-black/65">{shared.signatureSummary}</p>
          </div>
          <div className="rounded-[24px] border border-black/10 bg-[#fffaf6] p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">Why this fit</div>
            <p className="mt-2 text-sm leading-6 text-black/65">
              这版重点是清楚、可扫读、像出货中的产品，而不是像展览或实验报告。
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function TerminalNativeCard() {
  return (
    <article className="overflow-hidden rounded-[32px] border border-[#0e3f2a] bg-[linear-gradient(180deg,#07160f_0%,#091d14_55%,#07120d_100%)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#00e676]/25 bg-[#00e676]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00e676]">
          terminal-native
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/55">
          mode · builder
        </span>
      </div>

      <div className="rounded-[28px] border border-[#164d33] bg-[#07160f] p-5 font-mono text-[#d7ffe8] sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-[#164d33] pb-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#7eb89a]">$ whoami</div>
            <div className="mt-2 text-3xl font-black text-[#00e676]">gavin</div>
          </div>
          <div className="rounded-xl border border-[#164d33] px-3 py-2 text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#7eb89a]">inferred theme</div>
            <div className="mt-1 text-sm font-bold text-[#00e676]">terminal-native</div>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm leading-6 text-[#b9f5d4]">
          <p>
            <span className="text-[#00e676]">$ thesis</span> {shared.thesis}
          </p>
          <p>
            <span className="text-[#00e676]">$ why</span> 这里应该更像“正在工作的机器”，而不是已经包装好的人物卡。
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#164d33] bg-black/20 p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#7eb89a]">tool density</div>
            <div className="mt-3 space-y-2">
              {[
                ["Bash", 92],
                ["Read", 56],
                ["Edit", 49],
                ["Write", 31],
              ].map(([label, pct]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-[#b9f5d4]">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#0b2418]">
                    <div className="h-2 rounded-full bg-[#00e676]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#164d33] bg-black/20 p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#7eb89a]">session log</div>
            <div className="mt-3 space-y-2 text-xs leading-5 text-[#b9f5d4]">
              <div>230 sessions scanned</div>
              <div>12.7K turns</div>
              <div>8.8K tool calls</div>
              <div>peak hour 10:00</div>
              <div>role split: Codex speed / Claude Code depth</div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {shared.signals.map((signal) =>
            chip(signal, "border-[#164d33] bg-black/20 text-[#b9f5d4]")
          )}
        </div>
      </div>
    </article>
  );
}

function EditorialMakerCard() {
  return (
    <article className="overflow-hidden rounded-[32px] border border-[#d5dcff] bg-[linear-gradient(180deg,#fbfcff_0%,#ffffff 50%,#f7f8ff_100%)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#5b6cff]/20 bg-[#5b6cff]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5b6cff]">
          editorial-maker
        </span>
        <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-black/55">
          mode · builder
        </span>
      </div>

      <div className="rounded-[28px] border border-[#dde3ff] bg-white p-6 text-[#22284a] sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-black/40">{shared.slug}</p>
        <h2 className="mt-3 text-5xl font-black [font-family:ui-serif,Georgia,Cambria,'Times_New_Roman',serif] sm:text-6xl">
          Gavin
        </h2>
        <h3 className="mt-5 max-w-3xl text-[2rem] font-black leading-[1.02] [font-family:ui-serif,Georgia,Cambria,'Times_New_Roman',serif] sm:text-[2.7rem]">
          {shared.thesis}
        </h3>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[24px] bg-[#f7f8ff] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/40">default pick</div>
            <div className="mt-2 text-2xl font-black text-[#5b6cff]">editorial-maker</div>
            <p className="mt-4 text-sm leading-7 text-black/65">
              这版强调人物感、标题节奏、留白和“值得被截图的一屏”，而不是把每个数据都摆得很满。
            </p>
          </div>
          <div>
            <p className="text-sm leading-7 text-black/68">{shared.summary}</p>
            <blockquote className="mt-5 border-l-2 border-[#5b6cff] pl-4 text-lg font-bold leading-8 text-[#22284a] [font-family:ui-serif,Georgia,Cambria,'Times_New_Roman',serif]">
              “把研究直接做成产品，再把产品本身变成一张可传播的身份页。”
            </blockquote>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[#dde3ff] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/40">Signature build</div>
            <div className="mt-2 text-3xl font-black [font-family:ui-serif,Georgia,Cambria,'Times_New_Roman',serif]">
              {shared.signature}
            </div>
            <p className="mt-3 text-sm leading-7 text-black/68">{shared.signatureSummary}</p>
          </div>
          <div className="rounded-[24px] border border-[#dde3ff] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/40">Taste signals</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {shared.signals.map((signal) =>
                chip(signal, "border-[#dde3ff] bg-[#f7f8ff] text-[#22284a]")
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function NightShiftCard() {
  return (
    <article className="overflow-hidden rounded-[32px] border border-[#3b2140] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_28%),linear-gradient(180deg,#140915_0%,#1b0e1d_52%,#0f0b17_100%)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.3)] sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#f97316]/25 bg-[#f97316]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff9a53]">
          night-shift
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/55">
          mode · builder
        </span>
      </div>

      <div className="rounded-[28px] border border-[#4b2852] bg-[#140915]/80 p-5 text-[#ffe8d9] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">{shared.slug}</div>
            <h2 className="mt-2 text-4xl font-black sm:text-5xl">Gavin</h2>
          </div>
          <div className="rounded-full border border-[#f97316]/20 bg-[#f97316]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff9a53]">
            inferred after night-heavy pattern
          </div>
        </div>

        <h3 className="mt-6 max-w-3xl text-[1.85rem] font-black leading-[1.03] sm:text-[2.45rem]">
          {shared.thesis}
        </h3>

        <div className="mt-6 rounded-[24px] border border-[#4b2852] bg-black/15 p-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">burst profile</div>
          <div className="mt-4 flex h-24 items-end gap-2">
            {[18, 24, 38, 64, 82, 100, 73].map((value, index) => (
              <div key={index} className="flex-1">
                <div
                  className="rounded-t-[6px] bg-[linear-gradient(180deg,#ffbe8f,#f97316)]"
                  style={{ height: `${value}%` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-white/72">
            这版不是在讲“稳定进度”，而是在讲某种夜间能量、加速感和高峰冲刺。
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {shared.receipts.map((receipt) => (
            <div key={receipt.label} className="rounded-2xl border border-[#4b2852] bg-black/15 p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">{receipt.label}</div>
              <div className="mt-2 text-lg font-black text-[#ff9a53]">{receipt.value}</div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function ResearchForgeCard() {
  return (
    <article className="overflow-hidden rounded-[32px] border border-[#b9ece6] bg-[linear-gradient(180deg,#f4fffd_0%,#ffffff 50%,#f5fffd_100%)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#2dd4bf]/20 bg-[#2dd4bf]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#14b8a6]">
          research-forge
        </span>
        <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-black/55">
          mode · builder
        </span>
      </div>

      <div className="rounded-[28px] border border-[#c8efea] bg-white p-5 text-[#143833] sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[24px] border border-[#c8efea] bg-[#f4fffd] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">case file</div>
            <h2 className="mt-3 text-3xl font-black">Gavin</h2>
            <p className="mt-3 text-sm leading-6 text-black/65">
              default pick: <span className="font-bold text-[#14b8a6]">research-forge</span>
            </p>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">thesis</div>
            <h3 className="mt-2 max-w-3xl text-[1.8rem] font-black leading-[1.05] sm:text-[2.35rem]">
              {shared.thesis}
            </h3>
            <p className="mt-4 text-sm leading-7 text-black/68">{shared.summary}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[#c8efea] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">Evidence cluster</div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-black/68">
              <li>Agent 研究、产品策略和公开表达出现在同一条主线上</li>
              <li>高频出现的关键词不是单一技术，而是生态、产品和工具化</li>
              <li>代表作本身就是“把研究变成产品”的证据</li>
            </ul>
          </div>
          <div className="rounded-[24px] border border-[#c8efea] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">Top-line facts</div>
            <div className="mt-4 space-y-2">
              {shared.stats.slice(0, 4).map((stat) => (
                <div key={stat.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-black/55">{stat.label}</span>
                  <span className="font-bold text-[#143833]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CalmCraftCard() {
  return (
    <article className="overflow-hidden rounded-[32px] border border-[#51453b] bg-[linear-gradient(180deg,#171717_0%,#1b1e22_50%,#171819_100%)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#d9a86c]/25 bg-[#d9a86c]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e6bb84]">
          calm-craft
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/55">
          mode · builder
        </span>
      </div>

      <div className="rounded-[28px] border border-[#3d342c] bg-[#1b1e22] p-6 text-[#efe6dc] sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/42">{shared.slug}</div>
            <h2 className="mt-2 text-4xl font-black">Gavin</h2>
          </div>
          <div className="text-sm text-[#e6bb84]">default pick: calm-craft</div>
        </div>

        <h3 className="mt-6 max-w-3xl text-[1.7rem] font-black leading-[1.07] sm:text-[2.2rem]">
          {shared.thesis}
        </h3>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-white/68">
          这版不想显得很吵。它更强调一种长期打磨、稳步累积、让作品自己说明味道的感觉。
        </p>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="rounded-[24px] border border-[#3d342c] bg-black/10 p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/42">Signature build</div>
            <div className="mt-2 text-2xl font-black text-[#e6bb84]">{shared.signature}</div>
            <p className="mt-3 text-sm leading-6 text-white/68">{shared.signatureSummary}</p>
          </div>
          <div className="grid gap-2">
            {shared.stats.slice(0, 3).map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#3d342c] bg-black/10 px-4 py-3 text-right"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">{stat.label}</div>
                <div className="mt-1 text-lg font-black">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function renderTheme(theme: ThemeName) {
  switch (theme) {
    case "product-operator":
      return <ProductOperatorCard />;
    case "terminal-native":
      return <TerminalNativeCard />;
    case "editorial-maker":
      return <EditorialMakerCard />;
    case "night-shift":
      return <NightShiftCard />;
    case "research-forge":
      return <ResearchForgeCard />;
    case "calm-craft":
      return <CalmCraftCard />;
  }
}

export default function ArchetypeLabPage() {
  return (
    <div>
      <Titlebar />
      <div className="min-h-screen bg-[linear-gradient(180deg,#0f1114_0%,#121419_100%)] pt-12">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12">
          <PreviewModeSwitch active="archetype-lab" />

          <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur sm:mb-10 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#ff6b35]/25 bg-[#ff6b35]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff6b35]">
                Local preview · not deployed
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                same Gavin-based data, different visual archetypes
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black text-white sm:text-5xl">
              Archetype lab
            </h1>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/70 sm:text-base">
              你之前看不出差异，是因为我上一版只换了“壳子”。这版我把同一份 Gavin 数据重新组织成不同的首屏逻辑、
              不同的信息密度、不同的卡片语言和不同的图表语法。现在它们应该更像 6 个不同设计师做出来的首屏，而不是同一页换色。
            </p>
          </section>

          <section className="mb-6 grid gap-4 lg:grid-cols-3">
            {themes.map((theme) => (
              <div key={`${theme.name}-why`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">{theme.name}</div>
                <p className="mt-2 text-sm leading-6 text-white/68">{theme.why}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            {themes.map((theme) => (
              <div key={theme.name}>{renderTheme(theme.name)}</div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
