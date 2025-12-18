import Link from "next/link";

export default function BirthdaysPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="glass-card rounded-3xl p-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
              EVENTS
            </p>
            <h2 className="mt-2 font-lux-serif text-3xl">
              Birthdays, countdowns & wishes
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
              Mini calendar cards, auto celebration popup, and a wish wall for each
              member.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/birthdays" className="btn-primary">
              Open Birthday Center
            </Link>
            <Link href="/events" className="btn-secondary">
              View events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
