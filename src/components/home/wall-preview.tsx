import Link from "next/link";
import WallPreviewFeed from "@/components/home/wall-preview-feed";

export default function WallPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
            MEMORIAL WALL
          </p>
          <h2 className="mt-2 font-lux-serif text-3xl">Messages that feel real</h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
            Elegant tribute cards, flowers, and a calm guestbook experience.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/wall" className="btn-primary">
              Open Memorial Wall
            </Link>
            <Link href="/wall" className="btn-secondary">
              Leave a memory
            </Link>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden rounded-3xl p-6">
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[color:var(--accent)]/18 blur-3xl" />
          <div className="flex items-end justify-between gap-4">
            <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
              PREVIEW
            </p>
            <Link href="/wall" className="text-xs tracking-[0.25em] text-[color:var(--muted)] hover:text-[color:var(--text)]">
              OPEN
            </Link>
          </div>

          <div className="mt-4">
            <WallPreviewFeed limit={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
