"use client";

import { useEffect, useState } from "react";
import { familyData } from "@/data/family";
import {
  formatDay,
  formatMonthShort,
  getAgeToday,
  isBirthdayToday,
} from "@/lib/birthday";
import { useMounted } from "@/lib/use-mounted";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function todayKey(now = new Date()) {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function BirthdayAutoPopup() {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [birthdayMembers, setBirthdayMembers] = useState<typeof familyData.members>([]);

  useEffect(() => {
    if (!mounted) return;
    const now = new Date();
    setBirthdayMembers(
      familyData.members.filter((m) => isBirthdayToday(m.dateOfBirth, now)),
    );
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (birthdayMembers.length === 0) return;

    const key = `birthday_popup_shown_${todayKey()}`;
    const alreadyShown = localStorage.getItem(key) === "1";

    if (!alreadyShown) {
      setOpen(true);
      localStorage.setItem(key, "1");
    }
  }, [mounted, birthdayMembers.length]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && birthdayMembers.length > 0 ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/30 bg-[color:var(--panel)] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)]"
            initial={{ y: 18, scale: 0.985, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.99, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            {/* glow */}
            <div className="pointer-events-none absolute -top-20 -right-24 h-64 w-64 rounded-full bg-[color:var(--accent)]/25 blur-3xl" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.22em] text-[color:var(--muted)]">
                  AKHTER&apos;S FAMILY
                </p>
                <h2 className="mt-1 font-lux-serif text-3xl text-[color:var(--text)]">
                  Happy Birthday
                </h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-black/10 bg-white/50 px-3 py-2 text-sm text-[color:var(--text)] hover:bg-white/70 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {birthdayMembers.map((m) => {
                const age = getAgeToday(m.dateOfBirth);
                const month = formatMonthShort(m.dateOfBirth);
                const day = formatDay(m.dateOfBirth);

                return (
                  <div
                    key={m.id}
                    className="glass-card rounded-3xl p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-[color:var(--text)]">
                          {m.fullName}
                        </p>
                        <p className="text-sm text-[color:var(--muted)]">
                          {m.role} • Turning {age}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-[color:var(--muted)]">
                          {m.work}
                        </p>
                      </div>

                      {/* mini calendar */}
                      <div className="shrink-0">
                        <div className="w-16 overflow-hidden rounded-2xl border border-black/10 shadow-sm dark:border-white/10">
                          <div className="bg-[color:var(--accent)] px-2 py-1 text-center text-[10px] font-semibold tracking-[0.25em] text-white">
                            BDAY
                          </div>
                          <div className="bg-white/60 px-2 py-2 text-center dark:bg-white/10">
                            <div className="text-xl font-bold text-[color:var(--text)]">
                              {day}
                            </div>
                            <div className="text-[11px] font-semibold text-[color:var(--muted)]">
                              {month}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link className="btn-primary" href="/birthdays">
                        Send a Wish
                      </Link>
                      <Link className="btn-secondary" href="/wall">
                        Drop a Flower
                      </Link>
                      <Link className="btn-secondary" href="/tree">
                        View in Tree
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-xs text-[color:var(--muted)]">
              This popup auto-opens once per device per day.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
