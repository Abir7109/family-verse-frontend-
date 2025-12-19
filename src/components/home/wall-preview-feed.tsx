"use client";

import { useEffect, useMemo, useState } from "react";
import {
  WALL_CHANGED_EVENT,
  WALL_STORAGE_KEY,
  type WallEntry,
  listWallEntries,
} from "@/lib/api-client";

export default function WallPreviewFeed({ limit = 3 }: { limit?: number }) {
  const [entries, setEntries] = useState<WallEntry[]>([]);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const next = await listWallEntries(Math.max(3, limit)).catch(() => []);
      if (!cancelled) setEntries(next);
    };

    void refresh();

    const onStorage = (e: StorageEvent) => {
      if (e.key === WALL_STORAGE_KEY) void refresh();
    };
    const onWallChanged = () => void refresh();

    window.addEventListener("storage", onStorage);
    window.addEventListener(WALL_CHANGED_EVENT, onWallChanged);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(WALL_CHANGED_EVENT, onWallChanged);
    };
  }, [limit]);

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
        <div
          key={e.id}
          className="rounded-3xl border border-white/30 bg-white/35 p-4 dark:bg-white/8"
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
