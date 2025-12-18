import Image from "next/image";
import Link from "next/link";
import { familyData } from "@/data/family";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--accent)]/18 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-[520px] w-[520px] rounded-full bg-black/5 blur-3xl dark:bg-white/10" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs tracking-[0.30em] text-[color:var(--muted)]">
            {familyData.familyName.toUpperCase()}
          </p>
          <h1 className="mt-4 font-lux-serif text-5xl leading-[1.05] text-[color:var(--text)] md:text-6xl">
            A timeless digital sanctuary for your family legacy.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--muted)]">
            Stories, birthdays, memories, and connections — beautifully preserved
            in a modern, luxury experience.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/tree" className="btn-primary">
              Explore Family Tree
            </Link>
            <Link href="/wall" className="btn-secondary">
              Visit Memorial Wall
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="relative mb-5 overflow-hidden rounded-3xl border border-white/30 bg-white/30 dark:bg-white/10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            <Image
              src="/images/family/together.jpeg"
              alt="Akhter's Family"
              width={900}
              height={600}
              className="h-56 w-full bg-black/5 object-contain dark:bg-white/5"
              priority
            />
            <div className="absolute bottom-3 left-3 rounded-2xl bg-white/60 px-3 py-2 text-xs font-semibold tracking-[0.20em] text-[color:var(--text)] backdrop-blur-md dark:bg-white/10">
              AKHTER&apos;S FAMILY
            </div>
          </div>

          <p className="text-xs tracking-[0.22em] text-[color:var(--muted)]">
            TODAY IN THE FAMILY
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[color:var(--text)]">
            Welcome back.
          </h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            See upcoming birthdays, spotlight memories, and quick access to
            profiles.
          </p>

          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-black/10 bg-white/55 p-4 dark:border-white/10 dark:bg-white/10">
              <p className="text-sm font-semibold text-[color:var(--text)]">
                Birthday celebrations
              </p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                Automatic birthday popups with luxury cards.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/55 p-4 dark:border-white/10 dark:bg-white/10">
              <p className="text-sm font-semibold text-[color:var(--text)]">
                Family tree preview
              </p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                Smooth expand/collapse with glowing connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
