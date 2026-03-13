import type { CSSProperties } from "react";
import Titlebar from "@/components/Titlebar";
import InstallCommandBox from "@/components/InstallCommandBox";
import PreviewModeSwitch from "../PreviewModeSwitch";

const themeStyle = {
  "--bg-primary": "#FFF9F1",
  "--bg-secondary": "#FFFCF7",
  "--bg-tertiary": "#F2EBFF",
  "--border": "#E5D7FF",
  "--text-primary": "#261C3E",
  "--text-secondary": "#5D4F7D",
  "--text-muted": "#8A7FA8",
  "--accent": "#6D5EF5",
  "--accent-dim": "#6D5EF520",
  "--accent-hover": "#8A7BFF",
} as CSSProperties;

const hourDistribution = [
  2, 1, 4, 8, 9, 6, 3, 1, 0, 0, 1, 3, 6, 8, 10, 14, 20, 27, 36, 41, 39, 28, 16, 7,
];

const heatmapEntries = [
  0, 1, 2, 2, 0, 0, 1, 3, 4, 2, 1, 0, 0, 2, 3, 4, 4, 2, 1, 1, 0, 0, 3, 4, 4, 3, 2, 1,
  0, 1, 2, 4, 3, 2, 0, 0, 0, 1, 2, 2, 3, 4, 4, 2, 1, 0, 1, 1, 2,
];

function heatmapClass(value: number) {
  if (value === 0) return "bg-[#F2EAFD]";
  if (value === 1) return "bg-[#D9CCFF]";
  if (value === 2) return "bg-[#B9A7FF]";
  if (value === 3) return "bg-[#8F7AFF]";
  return "bg-[#6D5EF5]";
}

function pct(value: number, max: number) {
  return `${Math.max(8, Math.round((value / max) * 100))}%`;
}

export default function ConversationFirstPreviewPage() {
  const maxHour = Math.max(...hourDistribution, 1);

  return (
    <div>
      <Titlebar />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(109,94,245,0.18),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(198,123,85,0.16),transparent_28%),linear-gradient(180deg,#fff9f1_0%,#fffcf7_52%,#f7f1ff_100%)] pt-12" style={themeStyle}>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-12">
          <PreviewModeSwitch active="conversation-first" />

          <section className="mb-8 overflow-hidden rounded-[32px] border border-[#E5D7FF] bg-[rgba(255,252,247,0.88)] p-5 shadow-[0_18px_50px_rgba(109,94,245,0.09)] backdrop-blur sm:mb-10 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-2 sm:mb-6">
              <span className="rounded-full border border-[#6D5EF533] bg-[#6D5EF512] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#6D5EF5]">
                Local preview · not deployed
              </span>
              <span className="rounded-full border border-[#E5D7FF] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#8A7FA8]">
                Conversation-first direction
              </span>
              <span className="rounded-full border border-[#E5D7FF] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#8A7FA8]">
                mode · conversation-first
              </span>
              <span className="rounded-full border border-[#E5D7FF] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#8A7FA8]">
                theme · idea-salon
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
              <div>
                <div className="mb-5 flex items-start gap-4 sm:mb-6">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] border border-[#CFC1FF] bg-[linear-gradient(135deg,#efe7ff,#fff3ea)] text-3xl font-black text-[#6D5EF5] shadow-[0_14px_40px_rgba(109,94,245,0.12)]">
                    M
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#8A7FA8]">
                      miya.builderbio.dev
                    </p>
                    <h1 className="mt-2 text-4xl font-black text-[#261C3E] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-5xl">
                      Miya
                    </h1>
                    <p className="mt-2 text-sm text-[#5D4F7D]">
                      提问型对话者 · AI 思考搭子用户
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["X", "LinkedIn", "Website"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#E5D7FF] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#5D4F7D]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#C2B3FF] bg-[#6D5EF512] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6D5EF5]">
                    Unfiltered
                  </span>
                  <span className="rounded-full border border-[#E5D7FF] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[#8A7FA8]">
                    Generated 2026-03-13
                  </span>
                </div>

                <h2 className="max-w-4xl text-[2.1rem] font-black leading-[1.05] text-[#261C3E] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-6xl sm:leading-[0.96]">
                  一个把 AI 当成长期思考搭子的人。
                </h2>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "先把问题聊清楚",
                    "夜间对话高峰",
                    "反复追问同一主题",
                    "把 AI 当镜子",
                  ].map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full border border-[#D7CCFF] bg-[#F2EBFF] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#261C3E] sm:text-[11px]"
                    >
                      {signal}
                    </span>
                  ))}
                </div>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-[#5D4F7D] sm:text-base">
                  这类页面不应该再讲“做了哪些项目”，而是讲这个人是怎么和 AI 一起想问题、拆情绪、整理决定、反复回到同一个主题上的。Miya
                  的主线不是 build，而是用 AI 做长期对话、记录和思路澄清。
                </p>
                <p className="mt-3 max-w-3xl text-xs leading-6 text-[#8A7FA8]">
                  这里的核心判断来自真实对话节奏：低工具密度、高 turns 深度、重复出现的问题线程，以及非常明显的晚间高峰。
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-[#D7CCFF] bg-[linear-gradient(135deg,rgba(109,94,245,0.12),rgba(255,255,255,0.78))] p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6D5EF5]">
                    Conversation scale
                  </p>
                  <div className="mt-3 text-5xl font-black text-[#261C3E]">2.8B</div>
                  <p className="mt-2 text-sm font-semibold text-[#261C3E]">
                    Tokens created through AI conversation
                  </p>
                  <p className="mt-4 text-sm leading-6 text-[#5D4F7D]">
                    对这类用户来说，tokens 和活跃天数不是在证明“写了多少代码”，而是在证明这段 AI
                    关系有多深、多频繁、多持续。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Sessions", value: "418" },
                    { label: "Turns", value: "18.4K" },
                    { label: "Active days", value: "71" },
                    { label: "Longest streak", value: "16" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[24px] border border-[#E5D7FF] bg-[rgba(255,255,255,0.68)] p-4"
                    >
                      <div className="text-2xl font-black text-[#6D5EF5]">{stat.value}</div>
                      <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#8A7FA8]">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[28px] border border-[#E5D7FF] bg-[rgba(255,255,255,0.7)] p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6D5EF5]">
                    AI relationship style
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-[#261C3E] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif]">
                    提问型 × 回看型
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#5D4F7D]">
                    不是问完就走，而是会带着旧问题回来，把 AI 当成复盘、校准和重新组织想法的地方。
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-5 lg:grid-cols-[1.06fr_0.94fr] sm:mb-10 sm:gap-6">
            <div className="rounded-[32px] border border-[#E5D7FF] bg-[rgba(255,255,255,0.72)] p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6D5EF5]">
                Signature Thread
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#261C3E] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-4xl">
                深夜把模糊问题一点点聊明白
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5D4F7D] sm:text-base">
                最能代表这类用户的，不是某个项目，而是一条会反复回来的问题线程。Miya
                会把“我到底在纠结什么”“这个决定为什么总拿不准”“我真正想要的是什么”这类问题，拆成多次长对话慢慢聊清楚。
              </p>

              <div className="mt-6 rounded-[24px] border border-[#E5D7FF] bg-[#F7F1FF] p-4">
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#8A7FA8]">
                  Why it matters
                </p>
                <div className="space-y-3">
                  {[
                    "这条线程横跨 23 个 sessions",
                    "几乎没有工具调用，但平均每次 112 turns",
                    "反复出现“确认方向”“换个角度想”“帮我整理一下”这类提问",
                  ].map((item) => (
                    <div key={item} className="flex gap-3 text-sm text-[#5D4F7D]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6D5EF5]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#E5D7FF] bg-[rgba(255,255,255,0.72)] p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6D5EF5]">
                Recurring threads
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#261C3E] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-3xl">
                这些主题一再出现，才是这类页面真正的主线。
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "Decision untangling",
                    summary: "面对模糊决定时，会先和 AI 对齐问题本身，再谈方案。",
                  },
                  {
                    title: "Late-night reframing",
                    summary: "很多深对话都发生在晚上，像是在给白天没想通的事情重新命名。",
                  },
                  {
                    title: "Learning by dialogue",
                    summary: "学习不是查资料式的，而是通过追问、复述和换角度理解。",
                  },
                ].map((thread) => (
                  <div
                    key={thread.title}
                    className="rounded-[24px] border border-[#E5D7FF] bg-[#FFFCF7] p-4"
                  >
                    <div className="text-lg font-black text-[#261C3E]">{thread.title}</div>
                    <p className="mt-2 text-sm leading-6 text-[#5D4F7D]">{thread.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-5 lg:grid-cols-2 sm:mb-10 sm:gap-6">
            <div className="rounded-[32px] border border-[#E5D7FF] bg-[rgba(255,255,255,0.72)] p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6D5EF5]">
                AI Roles
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#261C3E] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-3xl">
                这里的 AI 更像不同类型的对话对象，而不是不同编程工位。
              </h2>

              <div className="mt-6 grid gap-4">
                {[
                  {
                    name: "OpenClaw",
                    role: "Thinking partner",
                    summary: "承接长对话、反复追问和问题澄清，像一个陪着把想法慢慢理顺的对象。",
                    evidence: "231 个 sessions · 平均每次 61 turns · 工具调用很低",
                  },
                  {
                    name: "Claude Code",
                    role: "Technical explainer",
                    summary: "偶尔需要技术解释或把模糊概念落地时，会切到更偏结构化解释的 agent。",
                    evidence: "33 个 sessions · 多出现在学习和梳理阶段",
                  },
                ].map((agent) => (
                  <div
                    key={agent.name}
                    className="rounded-[24px] border border-[#E5D7FF] bg-[#FFFCF7] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-[#261C3E]">{agent.name}</h3>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#6D5EF5]">
                          {agent.role}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#5D4F7D]">{agent.summary}</p>
                    <div className="mt-3 rounded-[18px] border border-[#E5D7FF] bg-[#F7F1FF] px-3 py-2 text-xs text-[#261C3E]">
                      {agent.evidence}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#E5D7FF] bg-[rgba(255,255,255,0.72)] p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6D5EF5]">
                When We Talk
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#261C3E] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-3xl">
                真正的高峰，集中在晚上 7 点到 10 点。
              </h2>

              <div className="mt-6 overflow-x-auto pb-2">
                <div className="min-w-[420px]">
                  <div className="flex h-36 items-end gap-1 rounded-[24px] border border-[#E5D7FF] bg-[#FFFCF7] px-3 py-3">
                    {hourDistribution.map((sessions, hour) => (
                      <div key={hour} className="flex h-full min-w-0 flex-1 items-end">
                        <div
                          className="w-full rounded-t-[5px] bg-[linear-gradient(180deg,#A89BFF,#6D5EF5)]"
                          style={{ height: pct(sessions, maxHour) }}
                          title={`${hour}:00 — ${sessions} sessions`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#8A7FA8]">
                    <span>0:00</span>
                    <span>6:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:00</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-[#E5D7FF] bg-[#F7F1FF] p-4">
                <div className="text-xl font-black text-[#261C3E]">8–10 PM 是固定高峰</div>
                <p className="mt-2 text-sm leading-6 text-[#5D4F7D]">
                  白天更像处理事情，晚上才像真正把问题摊开聊。高峰窗口累计 116 个 sessions。
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-5 lg:grid-cols-[1.02fr_0.98fr] sm:mb-10 sm:gap-6">
            <div className="rounded-[32px] border border-[#E5D7FF] bg-[rgba(255,255,255,0.72)] p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6D5EF5]">
                Activity
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#261C3E] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-3xl">
                71 个活跃日，让这段 AI 对话关系看起来像一条连续的生活轨迹。
              </h2>
              <div className="mt-6 overflow-x-auto pb-2">
                <div className="grid min-w-max grid-flow-col grid-rows-7 gap-1">
                  {heatmapEntries.map((value, index) => (
                    <div
                      key={index}
                      className={`h-3 w-3 rounded-[3px] ${heatmapClass(value)}`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#5D4F7D]">
                <span>
                  Longest streak: <strong className="text-[#261C3E]">16 days</strong>
                </span>
                <span>
                  Active: <strong className="text-[#261C3E]">71 / 103 days</strong>
                </span>
                <span>
                  Return arcs: <strong className="text-[#261C3E]">9 threads</strong>
                </span>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#E5D7FF] bg-[rgba(255,255,255,0.72)] p-5 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6D5EF5]">
                Log receipts
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#261C3E] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-3xl">
                最值得截图传播的，不是“会不会写代码”，而是这段关系到底有多深。
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: "Deepest thread",
                    value: "274 turns",
                    detail: "一整晚围绕同一个问题追问、澄清、重述，没有切走。",
                  },
                  {
                    label: "Most revisited question",
                    value: "11 returns",
                    detail: "同一个选择题，被分 11 次对话慢慢聊明白。",
                  },
                  {
                    label: "Busiest day",
                    value: "2026-02-27",
                    detail: "单日 9 个 sessions，几乎都在反复整理同一个决定。",
                  },
                  {
                    label: "Favorite opening",
                    value: "帮我理一下",
                    detail: "高频开场不是命令，而是请求一起把事情讲清楚。",
                  },
                ].map((receipt) => (
                  <div
                    key={receipt.label}
                    className="rounded-[24px] border border-[#E5D7FF] bg-[#FFFCF7] p-4"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#8A7FA8]">
                      {receipt.label}
                    </div>
                    <div className="mt-2 text-2xl font-black text-[#261C3E]">{receipt.value}</div>
                    <p className="mt-2 text-xs leading-5 text-[#5D4F7D]">{receipt.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[#E5D7FF] bg-[rgba(255,255,255,0.76)] p-5 sm:p-8">
            <div className="grid gap-5 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6D5EF5]">
                  Make your own
                </p>
                <h2 className="mt-2 text-3xl font-black text-[#261C3E] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-4xl">
                  Make your own BuilderBio.
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#5D4F7D] sm:text-base">
                  Give BuilderBio the history of your local coding agents and it will turn your
                  project arcs, conversation patterns, and standout moments into a shareable AI
                  recap.
                </p>
              </div>
              <div>
                <InstallCommandBox eyebrow="PASTE INTO YOUR CODING AGENT" align="left" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
