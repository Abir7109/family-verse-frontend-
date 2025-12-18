import Link from "next/link";
import ProfilesGrid from "@/components/profiles/profiles-grid";

export default function FeaturedProfiles() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
            PROFILES
          </p>
          <h2 className="mt-2 font-lux-serif text-3xl text-[color:var(--text)]">
            Remembered & celebrated
          </h2>
        </div>
        <Link href="/profiles" className="btn-secondary hidden sm:inline-flex">
          View all
        </Link>
      </div>

      <div className="mt-6">
        <ProfilesGrid />
      </div>
    </section>
  );
}
