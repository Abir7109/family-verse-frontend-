import Navbar from "@/components/navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">ACCESS</p>
        <h1 className="mt-3 font-lux-serif text-4xl">Family Login</h1>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
          Login isn’t implemented yet. This page exists so the button can navigate.
        </p>

        <div className="mt-8 glass-card rounded-3xl p-6">
          <p className="text-sm text-[color:var(--muted)]">
            Next step: add authentication (e.g. NextAuth/Auth.js) and restrict private
            sections.
          </p>
        </div>
      </main>
    </div>
  );
}
