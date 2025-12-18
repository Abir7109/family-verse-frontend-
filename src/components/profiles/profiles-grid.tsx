import Image from "next/image";
import Link from "next/link";
import { familyData } from "@/data/family";
import { formatDay, formatMonthShort, getAgeToday } from "@/lib/birthday";

export default function ProfilesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {familyData.members.map((m) => {
        const age = getAgeToday(m.dateOfBirth);
        const month = formatMonthShort(m.dateOfBirth);
        const day = formatDay(m.dateOfBirth);

        return (
          <article
            key={m.id}
            className="group lux-card lux-ring relative overflow-hidden rounded-[28px] p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[color:var(--accent)]/22 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/18 via-transparent to-black/10 dark:from-white/10 dark:to-black/30" />

            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/50 bg-white/60 shadow-sm dark:bg-white/10">
                  <Image
                    src={m.photoSrc}
                    alt={m.fullName}
                    fill
                    sizes="56px"
                    className="portrait-img object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-[color:var(--text)]">
                    {m.fullName}
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {m.role} • {age}
                  </p>
                </div>
              </div>

              {/* mini calendar */}
              <div className="w-16 shrink-0 overflow-hidden rounded-2xl border border-black/10 shadow-sm dark:border-white/10">
                <div className="bg-[color:var(--accent)] px-2 py-1 text-center text-[10px] font-semibold tracking-[0.25em] text-white">
                  BDAY
                </div>
                <div className="bg-white/60 px-2 py-2 text-center dark:bg-white/10">
                  <div className="text-xl font-bold text-[color:var(--text)]">{day}</div>
                  <div className="text-[11px] font-semibold text-[color:var(--muted)]">
                    {month}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">
              {m.work}
            </p>

            <div className="mt-5 flex gap-2">
              <Link href={`/profiles/${m.id}`} className="btn-secondary">
                Open
              </Link>
              <Link href={`/profiles/${m.id}/gallery`} className="btn-secondary">
                Gallery
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
