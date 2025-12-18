"use client";

import { useEffect, useMemo, useState } from "react";

type WallEntry = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  flowers: number;
};

const STORAGE_KEY = "familyverse_memorial_wall_v1";

function loadEntries(): WallEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WallEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function WallPreviewFeed({ limit = 3 }: { limit?: number }) {
  const [entries, setEntries] = useState<WallEntry[]>([]);

  useEffect(() => {
    setEntries(loadEntries());

    // Keep preview in sync when user posts a new entry (same-tab).
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setEntries(loadEntries());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const recent = useMemo(() => {
    return [...entries]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }, [entries, limit]);

  if (recent.length === 0) {
    return (
      <div className="rounded-3xl border border-white/30 bg-white/30 p-5 text-sm text-[color:var(--muted)] dark:bg-white/8">
        No memories yet. Write the first tribute to start the wall.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {recent.map((e) => (
        <div key={e.id} className="rounded-3xl border border-white/30 bg-white/35 p-4 dark:bg-white/8">
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
                }).format(new Date(e.createdAt))}
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/55 px-3 py-2 text-xs font-semibold text-[color:var(--text)] dark:border-white/10 dark:bg-white/10">
              🌸 {e.flowers}
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">
            {e.message}
          </p>
        </div>
      ))}
    </div>
  );
}
