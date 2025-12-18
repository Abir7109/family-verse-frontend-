"use client";

import { useEffect, useMemo, useState } from "react";
import { familyData, type FamilyMember } from "@/data/family";
import { useMounted } from "@/lib/use-mounted";
import Modal from "@/components/ui/modal";
import {
  daysUntilBirthday,
  formatDay,
  formatMonthShort,
  getAgeToday,
} from "@/lib/birthday";
import Link from "next/link";
import { motion } from "framer-motion";

type PositionedNode = {
  member: FamilyMember;
  leftPct: number;
  top: number;
};


function getConnections(memberId: string) {
  const rel = familyData.relationships;

  const spouse = rel
    .filter((r) => r.type === "spouse")
    .flatMap((r) =>
      r.from === memberId ? [r.to] : r.to === memberId ? [r.from] : [],
    );

  const parents = rel
    .filter((r) => r.type === "parent" && r.to === memberId)
    .map((r) => r.from);

  const children = rel
    .filter((r) => r.type === "parent" && r.from === memberId)
    .map((r) => r.to);

  const connected = new Set([memberId, ...spouse, ...parents, ...children]);
  return { spouse, parents, children, connected };
}

export default function FamilyTree() {
  const mounted = useMounted();
  const [now, setNow] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<FamilyMember | null>(null);

  useEffect(() => {
    if (!mounted) return;
    // Snapshot once per mount to keep SSR/CSR consistent and avoid hydration mismatch.
    setNow(new Date());
  }, [mounted]);

  const layout = useMemo(() => {
    // Determine "parents" as the spouse pair(s).
    const spouses = familyData.relationships.filter((r) => r.type === "spouse");
    const parentIds = new Set<string>();
    spouses.forEach((r) => {
      parentIds.add(r.from);
      parentIds.add(r.to);
    });

    const parents = familyData.members.filter((m) => parentIds.has(m.id));
    const kids = familyData.members.filter((m) => !parentIds.has(m.id));

    // Percent-based horizontal placement. Cards are absolutely positioned.
    // Keep nodes away from the extreme edges to reduce clipping on narrower viewports,
    // but leave enough horizontal space so the layout doesn't feel cramped.
    const spread = (count: number) => {
      if (count === 1) return [50];
      const left = 18;
      const right = 82;
      return Array.from({ length: count }, (_, i) =>
        left + ((right - left) * i) / (count - 1),
      );
    };

    const parentLeft = spread(parents.length);
    const kidLeft = spread(kids.length);

    const parentNodes: PositionedNode[] = parents.map((m, i) => ({
      member: m,
      leftPct: parentLeft[i]!,
      top: 40,
    }));

    const kidNodes: PositionedNode[] = kids.map((m, i) => ({
      member: m,
      leftPct: kidLeft[i]!,
      top: 280,
    }));

    const all = [...parentNodes, ...kidNodes];

    // Build simple line endpoints in percentages.
    const find = (id: string) => all.find((n) => n.member.id === id);

    const links = familyData.relationships
      .map((r) => {
        const a = find(r.from);
        const b = find(r.to);
        if (!a || !b) return null;

        const yA = a.top + 46;
        const yB = b.top + 46;
        return {
          key: `${r.type}:${r.from}->${r.to}`,
          type: r.type,
          x1: a.leftPct,
          y1: yA,
          x2: b.leftPct,
          y2: yB,
          from: r.from,
          to: r.to,
        };
      })
      .filter(Boolean) as Array<{
      key: string;
      type: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      from: string;
      to: string;
    }>;

    return { parents: parentNodes, kids: kidNodes, all, links };
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return familyData.members.filter((m) => m.fullName.toLowerCase().includes(q));
  }, [query]);

  const searchTargetId = matches?.[0]?.id ?? null;

  const activeConnected = useMemo(() => {
    if (!activeId) return null;
    return getConnections(activeId).connected;
  }, [activeId]);

  const spotlightSet = useMemo(() => {
    if (activeConnected) return activeConnected;
    if (searchTargetId) return new Set([searchTargetId]);
    return null;
  }, [activeConnected, searchTargetId]);

  if (!mounted || !now) {
    return (
      <div className="glass-card rounded-3xl p-6 text-sm text-[color:var(--muted)]">
        Loading Family Tree…
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[color:var(--text)]">
            Family Tree (Luxury)
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Card-based, realistic nodes with roles, ages, and birthdays — hover to
            glow relationships.
          </p>
        </div>

        <div className="flex w-full gap-2 md:w-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search full name…"
            className="w-full rounded-2xl border border-black/10 bg-white/55 px-4 py-3 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)] focus:ring-2 focus:ring-[color:var(--accent)]/40 dark:border-white/10 dark:bg-white/10"
          />
          <button className="btn-secondary shrink-0" onClick={() => setQuery("")}>Clear</button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto overflow-y-hidden rounded-3xl border border-white/30 bg-white/30 p-5 dark:bg-white/5">
        <div className="relative h-[520px] min-w-[900px] sm:min-w-0">
          {/* connection lines layer */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 520" preserveAspectRatio="none">
            {layout.links.map((l) => {
              const hot =
                (spotlightSet?.has(l.from) && spotlightSet?.has(l.to)) ||
                (searchTargetId && (l.from === searchTargetId || l.to === searchTargetId));

              // Smooth curve for parent-child, straight-ish for spouse
              const d =
                l.type === "parent"
                  ? `M ${l.x1} ${l.y1} C ${l.x1} ${(l.y1 + l.y2) / 2}, ${l.x2} ${(l.y1 + l.y2) / 2}, ${l.x2} ${l.y2}`
                  : `M ${l.x1} ${l.y1} L ${l.x2} ${l.y2}`;

              return (
                <motion.path
                  key={l.key}
                  d={d}
                  fill="none"
                  stroke={hot ? "var(--accent)" : "rgba(34,34,34,0.18)"}
                  strokeWidth={hot ? 2.8 : 1.8}
                  initial={false}
                  animate={{ opacity: hot ? 0.95 : 0.55 }}
                />
              );
            })}
          </svg>

          {/* nodes layer */}
          {[...layout.parents, ...layout.kids].map((n) => {
            const isSearch = searchTargetId === n.member.id;
            const isActive = activeId === n.member.id;
            const inSpotlight = spotlightSet ? spotlightSet.has(n.member.id) : false;

            // Dim non-spotlight nodes when searching/hovering.
            const dimmed = (activeConnected || searchTargetId) && !(isSearch || isActive || inSpotlight);

            const age = getAgeToday(n.member.dateOfBirth);
            const month = formatMonthShort(n.member.dateOfBirth);
            const day = formatDay(n.member.dateOfBirth);
            const inDays = daysUntilBirthday(n.member.dateOfBirth, now);

            return (
              <motion.button
                key={n.member.id}
                onMouseEnter={() => setActiveId(n.member.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(n.member.id)}
                onBlur={() => setActiveId(null)}
                onClick={() => setSelected(n.member)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                className={`absolute w-[min(320px,92vw)] sm:w-[340px] -translate-x-1/2 rounded-[28px] text-left transition-opacity ${
                  dimmed ? "opacity-35" : "opacity-100"
                }`}
                style={{ left: `${n.leftPct}%`, top: n.top }}
              >
                <div className="lux-card lux-ring group relative overflow-hidden rounded-[28px] p-5">
                  <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[color:var(--accent)]/22 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 dark:from-white/10 dark:to-black/30" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-[color:var(--text)]">
                        {n.member.fullName}
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">
                        {n.member.role} • Age {age}
                      </p>
                    </div>

                    {/* birthday badge */}
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

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">
                    {n.member.work}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="rounded-2xl border border-white/30 bg-white/30 px-3 py-2 text-xs text-[color:var(--muted)] dark:bg-white/5">
                      {inDays === 0 ? "Birthday today" : `Next birthday in ${inDays} day${inDays === 1 ? "" : "s"}`}
                    </div>
                    <span className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
                      VIEW
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-[color:var(--muted)]">
        Tip: Hover to glow relationships • Search to spotlight • Click a card to open a detailed preview.
      </p>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.fullName}>
        {selected ? (
          <div className="grid gap-4 md:grid-cols-[1fr_240px]">
            <div>
              <p className="text-sm text-[color:var(--muted)]">{selected.role}</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {selected.work}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="btn-primary" href={`/profiles/${selected.id}`}>
                  Open full profile
                </Link>
                <Link className="btn-secondary" href="/wall">
                  Add memory
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/30 bg-white/40 p-4 text-center dark:bg-white/10">
              <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
                BIRTHDAY
              </p>
              <div className="mt-2 text-5xl font-extrabold text-[color:var(--text)]">
                {formatDay(selected.dateOfBirth)}
              </div>
              <div className="text-sm font-semibold text-[color:var(--muted)]">
                {formatMonthShort(selected.dateOfBirth)}
              </div>
              <div className="mt-3 text-sm text-[color:var(--muted)]">
                Age: {getAgeToday(selected.dateOfBirth)}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
