import Titlebar from "@/components/Titlebar";
import { loadPublicBuilderBioRecapGallery } from "@/lib/builderbio-recap";
import PreviewModeSwitch from "../PreviewModeSwitch";

export default async function ConversationLiveValidationPage() {
  const samples = await loadPublicBuilderBioRecapGallery("conversation-first", 8);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(109,94,245,0.18),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(198,123,85,0.16),transparent_28%),linear-gradient(180deg,#fff9f1_0%,#fffcf7_52%,#f7f1ff_100%)] text-[#261C3E]">
      <Titlebar forceTasteBoardActive forceHomeInactive />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6">
        <PreviewModeSwitch active="conversation-live" />

        <section className="mt-6 rounded-[32px] border border-[#E5D7FF] bg-[rgba(255,252,247,0.88)] p-6 shadow-[0_18px_50px_rgba(109,94,245,0.09)] backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#6D5EF533] bg-[#6D5EF512] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#6D5EF5]">
              Live validation
            </span>
            <span className="rounded-full border border-[#E5D7FF] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#8A7FA8]">
              public conversation-first samples
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black sm:text-5xl">
            Conversation-first validation gallery
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5D4F7D] sm:text-base">
            This page only lists real public BuilderBio profiles that the live recap chain is
            currently classifying as conversation-first. It is meant to validate mode/theme
            routing against public data, not to act as a polished gallery.
          </p>
        </section>

        {samples.length === 0 ? (
          <section className="mt-8 rounded-[32px] border border-[#E5D7FF] bg-white/80 p-6 sm:p-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6D5EF5]">
              Current status
            </div>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              No public conversation-first sample is ready yet
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5D4F7D]">
              The live chain is ready, but there is no public profile with enough real
              conversation-first data to use as a strong showcase sample yet.
            </p>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 sm:gap-6 lg:grid-cols-2">
            {samples.map((sample) => (
              <article
                key={sample.username}
                className="rounded-[32px] border border-[#E5D7FF] bg-white/82 p-6 shadow-[0_18px_50px_rgba(109,94,245,0.08)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#E5D7FF] bg-[#F7F1FF] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6D5EF5]">
                    {sample.theme}
                  </span>
                  <span className="rounded-full border border-[#E5D7FF] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#8A7FA8]">
                    {sample.mode}
                  </span>
                  {sample.sparse ? (
                    <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
                      Sparse sample
                    </span>
                  ) : (
                    <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                      Strong sample
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-black">{sample.name}</h2>
                <p className="mt-2 text-sm leading-7 text-[#5D4F7D]">{sample.title}</p>
                <p className="mt-4 text-sm leading-7 text-[#261C3E]">{sample.thesis}</p>

                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm text-[#5D4F7D]">
                  <div className="rounded-2xl border border-[#E5D7FF] bg-[#FFFCF7] p-4">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-[#8A7FA8]">
                      Sessions
                    </dt>
                    <dd className="mt-2 text-xl font-black text-[#261C3E]">
                      {sample.totalSessions || 0}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-[#E5D7FF] bg-[#FFFCF7] p-4">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-[#8A7FA8]">
                      Tokens
                    </dt>
                    <dd className="mt-2 text-xl font-black text-[#261C3E]">
                      {sample.totalTokens || 0}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`https://${sample.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#6D5EF533] bg-[#6D5EF512] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#6D5EF5] transition-colors hover:bg-[#6D5EF51f]"
                  >
                    Open sample
                  </a>
                  <a
                    href="/builderbio-preview/conversation-first"
                    className="rounded-full border border-[#E5D7FF] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8A7FA8] transition-colors hover:border-[#6D5EF533] hover:text-[#6D5EF5]"
                  >
                    Compare with preview
                  </a>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
