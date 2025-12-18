import Link from "next/link";
import Navbar from "@/components/navbar";
import { familyData } from "@/data/family";
import {
  daysUntilBirthday,
  formatDay,
  formatMonthShort,
  getAgeToday,
  isBirthdayToday,
} from "@/lib/birthday";

export const dynamic = "force-dynamic";

export default function EventsPage() {
  const now = new Date();

  const upcomingBirthdays = [...familyData.members]
    .map((m) => ({
      member: m,
      days: daysUntilBirthday(m.dateOfBirth, now),
      today: isBirthdayToday(m.dateOfBirth, now),
    }))
    .sort((a, b) => a.days - b.days);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">EVENTS</p>
        <h1 className="mt-3 font-lux-serif text-4xl">Family events</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
          A calm, luxury calendar view of birthdays and future family milestones.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Birthdays */}
          <section className="glass-card rounded-3xl p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
                  BIRTHDAYS
                </p>
                <h2 className="mt-2 font-lux-serif text-2xl">
                  Upcoming celebrations
                </h2>
              </div>
              <Link href="/birthdays" className="btn-secondary">
                Open Birthday Center
              </Link>
            </div>

            <div className="mt-6 grid gap-3">
              {upcomingBirthdays.map(({ member, days, today }) => {
                const month = formatMonthShort(member.dateOfBirth);
                const day = formatDay(member.dateOfBirth);
                const age = getAgeToday(member.dateOfBirth);

                return (
                  <div key={member.id} className="glass-card rounded-3xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-[color:var(--text)]">
                          {member.fullName}
                        </p>
                        <p className="mt-1 text-sm text-[color:var(--muted)]">
                          {member.role} • Turning {today ? age : age + 1}
                        </p>
                      </div>

                      <div className="w-16 shrink-0 overflow-hidden rounded-2xl border border-black/10 shadow-sm dark:border-white/10">
                        <div className="bg-[color:var(--accent)] px-2 py-1 text-center text-[10px] font-semibold tracking-[0.25em] text-white">
                          BDAY
                        </div>
                        <div className="bg-white/60 px-2 py-2 text-center dark:bg-white/10">
                          <div className="text-xl font-bold text-[color:var(--text)]">
                            {day}
                          </div>
                          <div className="text-[11px] font-semibold text-[color:var(--muted)]">
                            {month}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="rounded-2xl border border-white/30 bg-white/30 px-3 py-2 text-xs text-[color:var(--muted)] dark:bg-white/5">
                        {today
                          ? "Today"
                          : `${days} day${days === 1 ? "" : "s"} away`}
                      </div>
                      <Link href={`/profiles/${member.id}`} className="btn-secondary">
                        View profile
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Milestones */}
          <aside className="glass-card rounded-3xl p-6">
            <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
              MILESTONES
            </p>
            <h2 className="mt-2 font-lux-serif text-2xl">
              Anniversaries & moments
            </h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              This section is ready for anniversaries, memorial dates, graduations,
              and custom events.
            </p>

            <div className="mt-6 rounded-3xl border border-white/30 bg-white/30 p-5 text-sm text-[color:var(--muted)] dark:bg-white/5">
              No milestones added yet.
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/wall" className="btn-secondary">
                Memorial Wall
              </Link>
              <Link href="/tree" className="btn-secondary">
                Family Tree
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
