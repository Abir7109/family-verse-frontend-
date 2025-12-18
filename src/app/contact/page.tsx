import Navbar from "@/components/navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">CONTACT</p>
        <h1 className="mt-3 font-lux-serif text-4xl">Contact Admin</h1>
        <div className="mt-8 glass-card rounded-3xl p-6">
          <p className="text-sm leading-6 text-[color:var(--muted)]">
            This is a placeholder contact page.
          </p>
          <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
            Next step: add an email address, a contact form, or a private admin-only
            message inbox.
          </p>
        </div>
      </main>
    </div>
  );
}
