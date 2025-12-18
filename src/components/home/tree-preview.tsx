import Link from "next/link";

export default function TreePreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="glass-card relative overflow-hidden rounded-3xl p-6">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />

        <div className="grid gap-6 md:grid-cols-[1fr_380px] md:items-center">
          <div>
            <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
              FAMILY TREE
            </p>
            <h2 className="mt-2 font-lux-serif text-3xl">
              Explore connections in a living graph
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
              Smooth animations, glowing relationships, and instant search.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/tree" className="btn-primary">
                Open Family Tree
              </Link>
              <Link href="/" className="btn-secondary">
                Learn more
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/30 bg-white/35 p-5 dark:bg-white/8">
            <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
              PREVIEW
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-2xl border border-black/10 bg-white/55 dark:border-white/10 dark:bg-white/10"
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-[color:var(--muted)]">
              Interactive tree canvas with hover highlights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
