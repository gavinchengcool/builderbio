import Titlebar from "@/components/Titlebar";
import PreviewModeSwitch from "../PreviewModeSwitch";

const shared = {
  name: "Miya",
  slug: "miya.builderbio.dev",
  thesis: "一个把 AI 当成长期思考搭子的人。",
  summary:
    "同一份 conversation-first 数据，既可以做成更温和的对话年鉴，也可以做成更像思考 dossier 的页面。关键不是颜色，而是关系感和阅读节奏完全不同。",
  threads: [
    "Decision untangling",
    "Late-night reframing",
    "Learning by dialogue",
  ],
  stats: [
    { label: "Sessions", value: "418" },
    { label: "Turns", value: "18.4K" },
    { label: "Tokens", value: "2.8B" },
    { label: "Active days", value: "71" },
  ],
};

function CompanionJournalCard() {
  return (
    <article className="overflow-hidden rounded-[32px] border border-[#E2D2BC] bg-[linear-gradient(180deg,#f8f2e9_0%,#fffdf8_54%,#f6efe5_100%)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#C67B5533] bg-[#C67B5512] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C67B55]">
          companion-journal
        </span>
        <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-black/55">
          mode · conversation-first
        </span>
      </div>

      <div className="rounded-[28px] border border-[#E2D2BC] bg-[#FFFDF8] p-6 text-[#2F241D] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-black/40">{shared.slug}</p>
            <h2 className="mt-2 text-5xl font-black [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif]">
              {shared.name}
            </h2>
          </div>
          <div className="rounded-[18px] border border-[#E2D2BC] bg-[#F6EFE5] px-4 py-3 text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-black/45">default pick</div>
            <div className="mt-1 text-sm font-bold text-[#C67B55]">companion-journal</div>
          </div>
        </div>

        <h3 className="mt-6 max-w-3xl text-[2rem] font-black leading-[1.04] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-[2.7rem]">
          {shared.thesis}
        </h3>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-black/68">
          这版像一本 AI 对话年鉴。重点不是“想法有多厉害”，而是 AI 在这段时间里到底陪她经历了哪些 recurring moments。
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[#E2D2BC] bg-[#FCF6EE] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">Moments that mattered</div>
            <div className="mt-4 space-y-4">
              {[
                "03-02 · 把一个犹豫了很久的决定讲清楚",
                "03-05 · 夜里回来重新命名白天的焦虑点",
                "03-10 · 同一类问题终于第一次说顺了",
              ].map((item) => (
                <div key={item} className="text-sm leading-6 text-black/68">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#E2D2BC] bg-[#FCF6EE] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/45">Relationship receipts</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {shared.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-black text-[#C67B55]">{stat.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-black/45">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function IdeaSalonCard() {
  return (
    <article className="overflow-hidden rounded-[32px] border border-[#D6C6FF] bg-[linear-gradient(180deg,#f5f0ff_0%,#fffdff_52%,#f1ecff_100%)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:p-7">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#6D5EF533] bg-[#6D5EF512] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6D5EF5]">
          idea-salon
        </span>
        <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-black/55">
          mode · conversation-first
        </span>
      </div>

      <div className="rounded-[28px] border border-[#D6C6FF] bg-white p-6 text-[#271A45] sm:p-8">
        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[24px] bg-[#F3EEFF] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/40">default pick</div>
            <div className="mt-2 text-2xl font-black text-[#6D5EF5]">idea-salon</div>
            <p className="mt-4 text-sm leading-7 text-black/65">
              这版更像思考 dossier。它不强调陪伴感，而是强调 recurring questions、角度切换和认知推进。
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-black/40">{shared.slug}</p>
            <h2 className="mt-3 text-5xl font-black [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif]">
              {shared.name}
            </h2>
            <h3 className="mt-5 max-w-3xl text-[2rem] font-black leading-[1.03] [font-family:ui-serif,Georgia,Cambria,'Times New Roman',serif] sm:text-[2.7rem]">
              {shared.thesis}
            </h3>
            <p className="mt-4 text-sm leading-7 text-black/68">{shared.summary}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[24px] border border-[#D6C6FF] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/40">Recurring threads</div>
            <div className="mt-4 space-y-3">
              {shared.threads.map((thread) => (
                <div
                  key={thread}
                  className="rounded-[18px] border border-[#D6C6FF] bg-[#F7F3FF] px-4 py-3 text-sm font-semibold text-[#271A45]"
                >
                  {thread}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#D6C6FF] p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-black/40">Question geometry</div>
            <div className="mt-4 grid gap-3">
              {[
                "换个角度看这件事",
                "我是不是把问题问错了",
                "帮我重新组织一下这个决定",
              ].map((question) => (
                <div
                  key={question}
                  className="rounded-[18px] border border-[#D6C6FF] bg-[#F7F3FF] px-4 py-3 text-sm leading-6 text-[#271A45]"
                >
                  {question}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ConversationLabPage() {
  return (
    <div>
      <Titlebar />
      <div className="min-h-screen bg-[linear-gradient(180deg,#0f1114_0%,#121419_100%)] pt-12">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12">
          <PreviewModeSwitch active="conversation-lab" />

          <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur sm:mb-10 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#6D5EF533] bg-[#6D5EF512] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#877BFF]">
                Local preview · not deployed
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                same conversation-first data, different relationship framing
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black text-white sm:text-5xl">
              Conversation archetype lab
            </h1>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/70 sm:text-base">
              同样是 conversation-first，也不该只有一张“纯聊天页面”。`companion-journal`
              更像对话年鉴，`idea-salon` 更像思考 dossier。它们讲的是同一组 data，但讲法和关系感不一样。
            </p>
          </section>

          <section className="mb-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                companion-journal
              </div>
              <p className="mt-2 text-sm leading-6 text-white/68">
                更温和、更亲密，强调“这一年 AI 如何陪我一起过问题和情绪”。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                idea-salon
              </div>
              <p className="mt-2 text-sm leading-6 text-white/68">
                更像思考手账，强调 recurring questions、观点移动和认知变化。
              </p>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <CompanionJournalCard />
            <IdeaSalonCard />
          </section>
        </main>
      </div>
    </div>
  );
}
