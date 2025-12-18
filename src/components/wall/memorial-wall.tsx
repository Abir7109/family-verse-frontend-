"use client";

import { useEffect, useMemo, useState } from "react";
import { useMounted } from "@/lib/use-mounted";
import { AnimatePresence, motion } from "framer-motion";

type WallEntry = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  flowers: number;
};

const STORAGE_KEY = "familyverse_memorial_wall_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function loadEntries(): WallEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WallEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveEntries(entries: WallEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function MemorialWall() {
  const mounted = useMounted();
  const [entries, setEntries] = useState<WallEntry[]>([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!mounted) return;
    setEntries(loadEntries());
  }, [mounted]);

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [entries]);

  const addEntry = () => {
    const a = author.trim() || "Anonymous";
    const m = message.trim();
    if (m.length < 2) return;

    const next: WallEntry = {
      id: uid(),
      author: a,
      message: m,
      createdAt: new Date().toISOString(),
      flowers: 0,
    };

    const newEntries = [next, ...entries];
    setEntries(newEntries);
    saveEntries(newEntries);
    setMessage("");
  };

  const flower = (id: string) => {
    const newEntries = entries.map((e) =>
      e.id === id ? { ...e, flowers: e.flowers + 1 } : e,
    );
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  if (!mounted) {
    return (
      <div className="glass-card rounded-3xl p-6 text-sm text-[color:var(--muted)]">
        Loading Memorial Wall…
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <section className="glass-card rounded-3xl p-5">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
          WRITE
        </p>
        <h2 className="mt-2 font-lux-serif text-2xl">Leave a tribute</h2>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          Share a memory, a wish, or a message of love. This is stored on your
          device for now (we can add secure family accounts later).
        </p>

        <div className="mt-5 grid gap-3">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded-2xl border border-black/10 bg-white/55 px-4 py-3 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)] focus:ring-2 focus:ring-[color:var(--accent)]/40 dark:border-white/10 dark:bg-white/10"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a memory…"
            rows={6}
            className="w-full resize-none rounded-2xl border border-black/10 bg-white/55 px-4 py-3 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)] focus:ring-2 focus:ring-[color:var(--accent)]/40 dark:border-white/10 dark:bg-white/10"
          />

          <button className="btn-primary" onClick={addEntry}>
            Post to Memorial Wall
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-white/30 bg-white/30 p-4 text-sm text-[color:var(--muted)] dark:bg-white/5">
          Tip: The best messages are specific — a small story, a favorite quote,
          or a moment you want to preserve.
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
              WALL
            </p>
            <h2 className="mt-2 font-lux-serif text-2xl">
              Memories from the heart
            </h2>
          </div>
          <div className="hidden text-sm text-[color:var(--muted)] md:block">
            {sorted.length} messages
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <AnimatePresence>
            {sorted.map((e) => (
              <motion.article
                key={e.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="glass-card group rounded-3xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[color:var(--text)]">
                      {e.author}
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--muted)]">
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(e.createdAt))}
                    </p>
                  </div>

                  <button
                    className="rounded-2xl border border-black/10 bg-white/55 px-3 py-2 text-sm font-semibold text-[color:var(--text)] hover:bg-white/70 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
                    onClick={() => flower(e.id)}
                    aria-label="Send flowers"
                  >
                    + 🌸 {e.flowers}
                  </button>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[color:var(--muted)]">
                  {e.message}
                </p>

                <div className="pointer-events-none mt-5 h-px w-full bg-black/10 dark:bg-white/10" />

                <p className="mt-3 text-xs tracking-[0.25em] text-[color:var(--muted)]">
                  AKHTER&apos;S FAMILY
                </p>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {sorted.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/30 bg-white/30 p-6 text-sm text-[color:var(--muted)] dark:bg-white/5">
            No messages yet. Be the first to leave a memory.
          </div>
        ) : null}
      </section>
    </div>
  );
}
