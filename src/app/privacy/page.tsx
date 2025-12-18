import Navbar from "@/components/navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">PRIVACY</p>
        <h1 className="mt-3 font-lux-serif text-4xl">Privacy</h1>
        <div className="mt-8 glass-card rounded-3xl p-6">
          <p className="text-sm leading-6 text-[color:var(--muted)]">
            This app is currently a local/demo family experience. Birthday wishes and
            memorial wall entries are stored in your browser (localStorage).
          </p>
          <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
            If you add authentication later, update this page to describe what data is
            stored and who can access it.
          </p>
        </div>
      </main>
    </div>
  );
}
