import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import { familyData } from "@/data/family";
import { formatDay, formatMonthShort, getAgeToday } from "@/lib/birthday";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const member = familyData.members.find((m) => m.id === id);
  if (!member) notFound();

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">PROFILE</p>
        <h1 className="mt-3 font-lux-serif text-4xl">{member.fullName}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
          {member.role} • Age {getAgeToday(member.dateOfBirth)}
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="glass-card rounded-3xl p-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/30 dark:bg-white/10">
              <Image
                src={member.photoSrc}
                alt={member.fullName}
                width={900}
                height={900}
                className="h-80 w-full object-cover"
                priority
              />
            </div>

            <p className="mt-5 text-sm leading-6 text-[color:var(--muted)]">{member.work}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn-primary" href={`/profiles/${member.id}/gallery`}>
                Open gallery
              </Link>
              <Link className="btn-secondary" href="/tree">
                View in Tree
              </Link>
              <Link className="btn-secondary" href="/wall">
                Add memory
              </Link>
              <Link className="btn-secondary" href="/birthdays">
                Send a wish
              </Link>
            </div>
          </section>

          <aside className="glass-card rounded-3xl p-6">
            <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">BIRTHDAY</p>
            <div className="mt-4 rounded-3xl border border-white/30 bg-white/30 p-5 text-center dark:bg-white/5">
              <div className="text-5xl font-extrabold text-[color:var(--text)]">
                {formatDay(member.dateOfBirth)}
              </div>
              <div className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                {formatMonthShort(member.dateOfBirth)}
              </div>
            </div>

            <div className="mt-6 text-sm text-[color:var(--muted)]">
              <p>ID: {member.id}</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
