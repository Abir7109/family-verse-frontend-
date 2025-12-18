"use client";

import { useEffect, useState } from "react";
import { familyData, type FamilyMember } from "@/data/family";
import { useMounted } from "@/lib/use-mounted";
import {
  daysUntilBirthday,
  formatDay,
  formatMonthShort,
  getAgeToday,
  isBirthdayToday,
} from "@/lib/birthday";
import Modal from "@/components/ui/modal";
import { AnimatePresence, motion } from "framer-motion";

type Wish = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function wishesKey(memberId: string) {
  return `familyverse_birthday_wishes_v1_${memberId}`;
}

function loadWishes(memberId: string): Wish[] {
  try {
    const raw = localStorage.getItem(wishesKey(memberId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Wish[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWishes(memberId: string, wishes: Wish[]) {
  localStorage.setItem(wishesKey(memberId), JSON.stringify(wishes));
}

function nextBirthdaySortValue(member: FamilyMember, now = new Date()) {
  // lower is sooner
  return daysUntilBirthday(member.dateOfBirth, now);
}

export default function BirthdayCenter() {
  const mounted = useMounted();
  const [selected, setSelected] = useState<FamilyMember | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishAuthor, setWishAuthor] = useState("");
  const [wishText, setWishText] = useState("");

  const [upcoming, setUpcoming] = useState<
    Array<{ member: FamilyMember; days: number; today: boolean }>
  >([]);

  useEffect(() => {
    if (!mounted) return;
    const now = new Date();
    setUpcoming(
      [...familyData.members]
        .sort(
          (a, b) => nextBirthdaySortValue(a, now) - nextBirthdaySortValue(b, now),
        )
        .map((m) => ({
          member: m,
          days: daysUntilBirthday(m.dateOfBirth, now),
          today: isBirthdayToday(m.dateOfBirth, now),
        })),
    );
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (!selected) return;
    setWishes(loadWishes(selected.id));
    setWishText("");
  }, [mounted, selected]);

  const addWish = () => {
    if (!selected) return;
    const text = wishText.trim();
    if (text.length < 2) return;

    const next: Wish = {
      id: uid(),
      author: wishAuthor.trim() || "Anonymous",
      text,
      createdAt: new Date().toISOString(),
    };

    const newWishes = [next, ...wishes];
    setWishes(newWishes);
    saveWishes(selected.id, newWishes);
    setWishText("");
  };

  if (!mounted) {
    return (
      <div className="glass-card rounded-3xl p-6 text-sm text-[color:var(--muted)]">
        Loading Birthday Center…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-3xl p-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
              UPCOMING
            </p>
            <h2 className="mt-2 font-lux-serif text-2xl">
              Birthday countdowns
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Tap a card to open the celebration page and leave beautiful wishes.
            </p>
          </div>
        </div>

        <div className="mt-6 -mx-2 overflow-x-auto px-2">
          <div className="flex min-w-max gap-4 pb-2">
            {upcoming.map(({ member, days, today }) => {
              const month = formatMonthShort(member.dateOfBirth);
              const day = formatDay(member.dateOfBirth);
              const age = getAgeToday(member.dateOfBirth);

              return (
                <motion.button
                  key={member.id}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelected(member)}
                  className="glass-card w-[320px] rounded-3xl p-5 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-[color:var(--text)]">
                        {member.fullName}
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">
                        {member.role} • {age}
                      </p>
                    </div>

                    {/* mini calendar */}
                    <div className="w-16 shrink-0 overflow-hidden rounded-2xl border border-black/10 shadow-sm dark:border-white/10">
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

                  <div className="mt-4 rounded-2xl border border-white/30 bg-white/30 p-4 dark:bg-white/5">
                    <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
                      COUNTDOWN
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[color:var(--text)]">
                      {today ? "Today" : `${days} day${days === 1 ? "" : "s"}`}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass-card rounded-3xl p-5">
          <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
            FEATURE
          </p>
          <h3 className="mt-2 font-lux-serif text-2xl">Auto-open celebration</h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            On the exact birthday date, the site automatically opens a luxury
            celebration popup — once per day per device.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
            NEXT
          </p>
          <h3 className="mt-2 font-lux-serif text-2xl">Anniversaries & events</h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            We can add anniversaries and memorial dates here with reminders and
            a shared calendar.
          </p>
        </div>
      </section>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Happy Birthday, ${selected.fullName}` : undefined}
      >
        {selected ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="glass-card rounded-3xl p-5">
                <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
                  CELEBRATION
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Write a wish and preserve the moment. (Stored locally for now.)
                </p>

                <div className="mt-4 grid gap-3">
                  <input
                    value={wishAuthor}
                    onChange={(e) => setWishAuthor(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full rounded-2xl border border-black/10 bg-white/55 px-4 py-3 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)] focus:ring-2 focus:ring-[color:var(--accent)]/40 dark:border-white/10 dark:bg-white/10"
                  />
                  <textarea
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="Write a birthday wish…"
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-black/10 bg-white/55 px-4 py-3 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)] focus:ring-2 focus:ring-[color:var(--accent)]/40 dark:border-white/10 dark:bg-white/10"
                  />
                  <button className="btn-primary" onClick={addWish}>
                    Save Wish
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-end justify-between gap-4">
                  <h4 className="font-lux-serif text-xl">Wishes</h4>
                  <div className="text-sm text-[color:var(--muted)]">
                    {wishes.length}
                  </div>
                </div>

                <div className="mt-3 grid gap-3">
                  <AnimatePresence>
                    {wishes.map((w) => (
                      <motion.div
                        key={w.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="glass-card rounded-3xl p-4"
                      >
                        <p className="text-sm font-semibold text-[color:var(--text)]">
                          {w.author}
                        </p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(w.createdAt))}
                        </p>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[color:var(--muted)]">
                          {w.text}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {wishes.length === 0 ? (
                    <div className="rounded-3xl border border-white/30 bg-white/30 p-4 text-sm text-[color:var(--muted)] dark:bg-white/5">
                      No wishes yet.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="glass-card rounded-3xl p-5">
              <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
                DETAILS
              </p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--text)]">
                {selected.role}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {selected.work}
              </p>

              <div className="mt-5 rounded-3xl border border-white/30 bg-white/30 p-5 text-center dark:bg-white/5">
                <div className="text-5xl font-extrabold text-[color:var(--text)]">
                  {formatDay(selected.dateOfBirth)}
                </div>
                <div className="mt-1 text-sm font-semibold text-[color:var(--muted)]">
                  {formatMonthShort(selected.dateOfBirth)}
                </div>
                <div className="mt-3 text-sm text-[color:var(--muted)]">
                  Current age: {getAgeToday(selected.dateOfBirth)}
                </div>
              </div>
            </aside>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
