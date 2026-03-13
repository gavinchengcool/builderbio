import type { CSSProperties } from "react";
import Titlebar from "@/components/Titlebar";
import PreviewModeSwitch from "../PreviewModeSwitch";

const themeStyle = {
  "--bg-primary": "#F7F8FC",
  "--bg-secondary": "#FFFFFF",
  "--bg-tertiary": "#EEF1FF",
  "--border": "#D8DDF4",
  "--text-primary": "#161A2A",
  "--text-secondary": "#4C577A",
  "--text-muted": "#7983A6",
  "--accent": "#5B6CFF",
  "--accent-dim": "#5B6CFF20",
  "--accent-hover": "#7A88FF",
} as CSSProperties;

const rhythmBars = [12, 18, 22, 17, 11, 15, 24, 31, 28, 20, 16, 13];
const threadHeat = [3, 4, 6, 8, 9, 8, 6];

export default function HybridPreviewPage() {
  return (
    <div>
      <Titlebar />
      <div
        className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(91,108,255,0.16),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(255,107,53,0.12),transparent_26%),linear-gradient(180deg,#f7f8fc_0%,#ffffff_48%,#f3f4fa_100%)] pt-12"
        style={themeStyle}
      >
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-12">
          <PreviewModeSwitch active="hybrid" />

          <section className="mb-8 overflow-hidden rounded-[32px] border border-[#D8DDF4] bg-[rgba(255,255,255,0.82)] p-5 shadow-[0_18px_50px_rgba(91,108,255,0.08)] backdrop-blur sm:mb-10 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#5B6CFF33] bg-[#5B6CFF12] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#5B6CFF]">
                Local preview · not deployed
              </span>
              <span className="rounded-full border border-[#D8DDF4] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#7983A6]">
                Hybrid structure
              </span>
              <span className="rounded-full border border-[#D8DDF4] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#7983A6]">
                mode · hybrid
              </span>
              <span className="rounded-full border border-[#D8DDF4] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#7983A6]">
                inferred theme · research-forge
              </span>
              <span className="rounded-full border border-[#D8DDF4] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#7983A6]">
                chosen theme · research-forge
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8">
              <div>
                <div className="mb-5 flex items-start gap-4 sm:mb-6">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] border border-[#C5CDEF] bg-[linear-gradient(135deg,#eff2ff,#fff2ec)] text-3xl font-black text-[#5B6CFF] shadow-[0_14px_36px_rgba(91,108,255,0.12)]">
                    L
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#7983A6]">
                      lena.builderbio.dev
                    </p>
                    <h1 className="mt-2 text-4xl font-black text-[#161A2A] sm:text-5xl">
                      Lena
                    </h1>
                    <p className="mt-2 text-sm text-[#4C577A]">
                      Builder + thinker · product builder who also uses AI as a long-running thought partner
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["X", "LinkedIn", "Website"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#D8DDF4] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#4C577A]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#5B6CFF33] bg-[#5B6CFF12] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5B6CFF]">
                    Unfiltered
                  </span>
                  <span className="rounded-full border border-[#D8DDF4] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[#7983A6]">
                    Generated 2026-03-13
                  </span>
                </div>

                <h2 className="max-w-4xl text-[2.05rem] font-black leading-[1.05] text-[#161A2A] sm:text-6xl sm:leading-[0.96]">
                  一个既会把 AI 用来推进项目，也会把它当成长期思考场的人。
                </h2>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "白天推进产品",
                    "晚上整理问题",
                    "Build + dialogue 双主线",
                    "多 Agent 分工",
                  ].map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full border border-[#D7DCF6] bg-[#EEF1FF] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#161A2A] sm:text-[11px]"
                    >
                      {signal}
                    </span>
                  ))}
                </div>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-[#4C577A] sm:text-base">
                  这类用户不能被压扁成单一 builder，也不能被误判成纯聊天。Lena
                  的轨迹同时包含产品交付、文档和策略推进，也包含明显的复盘、提问、再澄清线程，所以页面中段必须同时放 build arc 和 thread arc。
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-[#D8DDF4] bg-[linear-gradient(135deg,rgba(91,108,255,0.12),rgba(255,255,255,0.82))] p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#5B6CFF]">
                    Mixed evidence
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {[
                      { label: "Build sessions", value: "138" },
                      { label: "Thread sessions", value: "84" },
                      { label: "Tool calls", value: "5.2K" },
                      { label: "Active days", value: "49" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-[22px] border border-[#D8DDF4] bg-white/75 p-4"
                      >
                        <div className="text-2xl font-black text-[#5B6CFF]">{stat.value}</div>
                        <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#7983A6]">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#D8DDF4] bg-white/74 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#5B6CFF]">
                    AI relationship style
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-[#161A2A]">
                    Operator × reflection loop
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#4C577A]">
                    白天会用 Codex 和 Claude Code 把工作往前推，晚上再回到 AI 里拆问题、做复盘、重新组织第二天的判断。
                  </p>
                </div>

                <div className="rounded-[28px] border border-[#D8DDF4] bg-white/74 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#5B6CFF]">
                    Why hybrid
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#4C577A]">
                    有稳定项目、有高工具密度，也有明显的低工具长对话和 recurring threads。这种 history 不该被强行压进纯 builder 或纯 conversation-first。
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-5 lg:grid-cols-2 sm:mb-10 sm:gap-6">
            <article className="rounded-[32px] border border-[#D8DDF4] bg-white/78 p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#5B6CFF]">
                Signature Build
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#161A2A] sm:text-4xl">
                Customer insight cockpit
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#4C577A] sm:text-base">
                这条项目线最能代表 Lena 的 build side：把客户研究、产品判断和可操作的 dashboard 做成同一条交付链，而不是把思考和执行拆成两套工具。
              </p>
              <div className="mt-6 rounded-[24px] border border-[#D8DDF4] bg-[#F6F8FF] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#7983A6]">
                  Why it matters
                </div>
                <div className="mt-3 space-y-3">
                  {[
                    "跨 17 个 sessions 持续推进",
                    "项目里既有 dashboard 实现，也有用户访谈整理",
                    "Codex 负责快执行，Claude Code 负责结构和收束",
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-sm text-[#4C577A]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B6CFF]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-[32px] border border-[#D8DDF4] bg-white/78 p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#5B6CFF]">
                Signature Thread
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#161A2A] sm:text-4xl">
                Nightly decision unwind
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#4C577A] sm:text-base">
                这条 thread 最能代表 Lena 的 conversation side：白天推进完项目，晚上回到 AI
                里重新拆判断、厘清犹豫、给第二天的执行做收口。
              </p>
              <div className="mt-6 rounded-[24px] border border-[#D8DDF4] bg-[#FFF7F2] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#7983A6]">
                  Why it matters
                </div>
                <div className="mt-3 space-y-3">
                  {[
                    "横跨 29 个夜间 sessions",
                    "低工具密度但平均 78 turns",
                    "高频出现“换个角度想”和“我真正担心的是什么”",
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-sm text-[#4C577A]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B35]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="mb-8 grid gap-5 lg:grid-cols-[1.04fr_0.96fr] sm:mb-10 sm:gap-6">
            <article className="rounded-[32px] border border-[#D8DDF4] bg-white/78 p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#5B6CFF]">
                AI Roles
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#161A2A] sm:text-3xl">
                同一组 agent，既承担执行，也承担回看和再组织。
              </h2>
              <div className="mt-6 grid gap-4">
                {[
                  {
                    name: "Codex",
                    role: "Fast execution",
                    summary: "白天推进产品、改界面、补功能时，Codex 像冲锋位。",
                    evidence: "94 sessions · 2.7K turns · 2.9K tool calls",
                    color: "#34D399",
                  },
                  {
                    name: "Claude Code",
                    role: "Deep restructure",
                    summary: "当项目需要重新收结构、拉长思考深度时，会切到 Claude Code。",
                    evidence: "44 sessions · 3.5K turns · 1.6K tool calls",
                    color: "#FF6B35",
                  },
                  {
                    name: "OpenClaw",
                    role: "Reflection partner",
                    summary: "更多出现在晚上的 thread 里，用来拆决定、梳理想法和回看白天的问题。",
                    evidence: "84 sessions · 6.1K turns · 18 tool calls",
                    color: "#A78BFA",
                  },
                ].map((role) => (
                  <div
                    key={role.name}
                    className="rounded-[24px] border border-[#D8DDF4] bg-[#FBFCFF] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xl font-black text-[#161A2A]">{role.name}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#7983A6]">
                          {role.role}
                        </div>
                      </div>
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#4C577A]">{role.summary}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#7983A6]">
                      {role.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[32px] border border-[#D8DDF4] bg-white/78 p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#5B6CFF]">
                Shared rhythm
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#161A2A] sm:text-3xl">
                白天 build，晚上回看，这就是 hybrid 的节奏证据。
              </h2>

              <div className="mt-6 rounded-[24px] border border-[#D8DDF4] bg-[#F6F8FF] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#7983A6]">
                  Weekly momentum
                </div>
                <div className="mt-4 flex h-28 items-end gap-2">
                  {rhythmBars.map((value, index) => (
                    <div key={index} className="flex-1">
                      <div
                        className="rounded-t-[7px] bg-[linear-gradient(180deg,#9FAAFF,#5B6CFF)]"
                        style={{ height: `${value * 3}%` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-[#4C577A]">
                  前半段是比较连续的 build rhythm，后半段会明显叠加 nightly reflection thread。
                </p>
              </div>

              <div className="mt-5 rounded-[24px] border border-[#D8DDF4] bg-[#FFF8F3] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#7983A6]">
                  Thread intensity
                </div>
                <div className="mt-4 flex items-end gap-3">
                  {threadHeat.map((value, index) => (
                    <div key={index} className="flex-1">
                      <div
                        className="rounded-[12px] bg-[linear-gradient(180deg,#FFC19F,#FF6B35)]"
                        style={{ height: `${20 + value * 10}px` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-[#4C577A]">
                  这些不是“跑题”的聊天，而是反复帮助第二天 build 收口的 thread receipts。
                </p>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
