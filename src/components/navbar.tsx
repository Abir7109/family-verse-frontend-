"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useMounted } from "@/lib/use-mounted";

const nav = [
  { label: "Home", href: "/" },
  { label: "Family Tree", href: "/tree" },
  { label: "Memorial Wall", href: "/wall" },
  { label: "Birthdays", href: "/birthdays" },
];

export default function Navbar() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Close the mobile menu on navigation.
    setMenuOpen(false);
  }, [pathname]);

  const themeLabel = mounted ? (theme === "dark" ? "Light" : "Dark") : "Theme";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto relative flex w-full max-w-6xl items-center justify-between gap-3 rounded-3xl border border-white/30 bg-[color:var(--panel)]/85 px-4 py-3 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.10)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-2xl bg-white/60 shadow-sm dark:bg-white/10">
            <Image
              src="/family-verse.png"
              alt="FamilyVerse"
              width={36}
              height={36}
              priority
              className="h-9 w-9 object-contain"
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[color:var(--text)]">
              Akhter&apos;s Family
            </p>
            <p className="text-xs text-[color:var(--muted)]">FamilyVerse</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-white/55 text-[color:var(--text)] dark:bg-white/12"
                    : "text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-white/40 dark:hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="btn-secondary"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
          >
            <span suppressHydrationWarning>{themeLabel}</span>
          </button>

          <button
            className="btn-secondary md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            Menu
          </button>

        </div>

        {/* Mobile nav dropdown */}
        {menuOpen ? (
          <nav
            id="mobile-nav"
            className="absolute left-0 right-0 top-full mt-3 rounded-3xl border border-white/30 bg-[color:var(--panel-solid)] p-2 shadow-[0_18px_55px_rgba(0,0,0,0.18)] md:hidden"
          >
            <div className="grid gap-1">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-2xl px-3 py-3 text-sm transition-colors ${
                      active
                        ? "bg-white/55 text-[color:var(--text)] dark:bg-white/12"
                        : "text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-white/40 dark:hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/profiles"
                className="rounded-2xl px-3 py-3 text-sm text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-white/40 dark:hover:bg-white/10"
              >
                Profiles
              </Link>
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
