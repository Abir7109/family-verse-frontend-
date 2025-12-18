import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-16 pt-10">
      <div className="glass-card rounded-3xl p-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-semibold text-[color:var(--text)]">
              Akhter&apos;s Family
            </p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              A living archive of stories, voices, and legacy.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
            <Link className="hover:text-[color:var(--text)]" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-[color:var(--text)]" href="/access">
              Access
            </Link>
            <Link className="hover:text-[color:var(--text)]" href="/contact">
              Contact Admin
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-black/10 pt-4 text-xs text-[color:var(--muted)] dark:border-white/10">
          Reduce motion, contrast mode, and screen-reader support can be added
          here.
        </div>
      </div>
    </footer>
  );
}
