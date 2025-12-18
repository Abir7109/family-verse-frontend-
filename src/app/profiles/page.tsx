import Navbar from "@/components/navbar";
import ProfilesGrid from "@/components/profiles/profiles-grid";

export default function ProfilesPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">PROFILES</p>
        <h1 className="mt-3 font-lux-serif text-4xl">Family profiles</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
          Browse family members and open an individual profile.
        </p>

        <div className="mt-8">
          <ProfilesGrid />
        </div>
      </main>
    </div>
  );
}
