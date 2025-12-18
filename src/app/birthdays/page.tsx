import Navbar from "@/components/navbar";
import BirthdayCenter from "@/components/birthdays/birthday-center";

export default function BirthdaysPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
          EVENTS
        </p>
        <h1 className="mt-3 font-lux-serif text-4xl">Birthdays & celebrations</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
          Upcoming birthdays, countdowns, and a beautiful celebration experience.
        </p>

        <div className="mt-8">
          <BirthdayCenter />
        </div>
      </main>
    </div>
  );
}
