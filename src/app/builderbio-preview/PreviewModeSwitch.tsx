import Link from "next/link";

type PreviewModeSwitchProps = {
  active:
    | "builder"
    | "hybrid"
    | "conversation-first"
    | "conversation-live"
    | "conversation-lab"
    | "archetype-lab";
};

function chipClass(active: boolean) {
  return active
    ? "border-accent/40 bg-accent/12 text-accent"
    : "border-border bg-bg-primary/40 text-text-secondary hover:border-accent/25 hover:text-text-primary";
}

export default function PreviewModeSwitch({ active }: PreviewModeSwitchProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 sm:mb-6">
      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-text-muted">
        Preview modes
      </span>
      <Link
        href="/builderbio-preview"
        className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${chipClass(
          active === "builder"
        )}`}
      >
        Builder mode
      </Link>
      <Link
        href="/builderbio-preview/hybrid"
        className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${chipClass(
          active === "hybrid"
        )}`}
      >
        Hybrid mode
      </Link>
      <Link
        href="/builderbio-preview/conversation-first"
        className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${chipClass(
          active === "conversation-first"
        )}`}
      >
        Conversation-first
      </Link>
      <Link
        href="/builderbio-preview/conversation-lab"
        className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${chipClass(
          active === "conversation-lab"
        )}`}
      >
        Conversation lab
      </Link>
      <Link
        href="/builderbio-preview/conversation-live"
        className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${chipClass(
          active === "conversation-live"
        )}`}
      >
        Conversation live
      </Link>
      <Link
        href="/builderbio-preview/archetype-lab"
        className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${chipClass(
          active === "archetype-lab"
        )}`}
      >
        Archetype lab
      </Link>
    </div>
  );
}
