import Link from "next/link";
import { familyData } from "@/data/family";

export default function TreePreview() {
  const members = familyData.members.slice(0, 6);

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
              <Link href="/profiles" className="btn-secondary">
                Browse profiles
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/30 bg-white/35 p-5 dark:bg-white/8">
            <div className="flex items-end justify-between gap-4">
              <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
                PREVIEW
              </p>
              <div className="text-xs text-[color:var(--muted)]">
                {familyData.members.length} members
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {members.map((m) => (
                <Link
                  key={m.id}
                  href={`/profiles/${m.id}`}
                  className="rounded-2xl border border-black/10 bg-white/55 px-4 py-3 text-sm text-[color:var(--text)] transition-colors hover:bg-white/70 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{m.fullName}</p>
                      <p className="mt-1 text-xs text-[color:var(--muted)]">{m.role}</p>
                    </div>
                    <span className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
                      VIEW
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <p className="mt-4 text-sm text-[color:var(--muted)]">
              Tap a member to open their profile, or open the full interactive tree.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
