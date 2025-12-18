import Link from "next/link";

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
          <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
            PREVIEW
          </p>

          <div className="mt-4 grid gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/30 bg-white/35 p-4 text-sm text-[color:var(--muted)] dark:bg-white/8"
              >
                <div className="h-3 w-24 rounded bg-black/10 dark:bg-white/10" />
                <div className="mt-3 h-3 w-full rounded bg-black/10 dark:bg-white/10" />
                <div className="mt-2 h-3 w-5/6 rounded bg-black/10 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
