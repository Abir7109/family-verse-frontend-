import Link from "next/link";
import Navbar from "@/components/navbar";

export default function AccessPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">ACCESS</p>
        <h1 className="mt-3 font-lux-serif text-4xl">Access</h1>
        <div className="mt-8 glass-card rounded-3xl p-6">
          <p className="text-sm leading-6 text-[color:var(--muted)]">
            Family Login is a placeholder right now.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/login">
              Go to Family Login
            </Link>
            <Link className="btn-secondary" href="/">
              Back home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
