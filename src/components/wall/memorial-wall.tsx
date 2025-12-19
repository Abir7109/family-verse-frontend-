"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { useMounted } from "@/lib/use-mounted";
import { AnimatePresence, motion } from "framer-motion";
import {
  type WallEntry,
  type WallImage,
  createWallEntry,
  flowerWallEntry,
  listWallEntries,
  uploadWallImage,
} from "@/lib/api-client";
import { cloudinaryConfig, uploadToCloudinary } from "@/lib/cloudinary";

const MAX_IMAGES = 3;

type PendingFile = {
  file: File;
  previewUrl: string;
};

export default function MemorialWall() {
  const mounted = useMounted();
  const [entries, setEntries] = useState<WallEntry[]>([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const pendingFilesRef = useRef<PendingFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;
    (async () => {
      const loaded = await listWallEntries(50).catch(() => []);
      if (!cancelled) setEntries(loaded);
    })();

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  useEffect(() => {
    pendingFilesRef.current = pendingFiles;
  }, [pendingFiles]);

  useEffect(() => {
    return () => {
      // cleanup previews on unmount
      pendingFilesRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [entries]);

  const onPickFiles = (files: FileList | null) => {
    if (!files) return;

    setError(null);

    const existing = pendingFiles.length;
    const remaining = Math.max(0, MAX_IMAGES - existing);

    const picked = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining)
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));

    setPendingFiles((prev) => [...prev, ...picked]);
  };

  const removePendingFile = (idx: number) => {
    setPendingFiles((prev) => {
      const next = [...prev];
      const removed = next.splice(idx, 1)[0];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  };

  const uploadImages = async (): Promise<WallImage[]> => {
    if (pendingFiles.length === 0) return [];

    // Preferred: backend-controlled Cloudinary uploads.
    try {
      const results: WallImage[] = [];
      for (const p of pendingFiles) {
        results.push(await uploadWallImage(p.file));
      }
      return results;
    } catch (e: unknown) {
      // Only fallback to unsigned uploads if the preset is explicitly configured.
      // In production, we want failures to surface clearly (usually CORS or API base URL misconfig).
      const cfg = cloudinaryConfig();
      if (!cfg) {
        const msg = e instanceof Error ? e.message : "Upload failed";
        throw new Error(msg);
      }

      const results: WallImage[] = [];
      for (const p of pendingFiles) {
        results.push(await uploadToCloudinary(p.file));
      }
      return results;
    }
  };

  const addEntry = async () => {
    const a = author.trim() || "Anonymous";
    const m = message.trim();
    if (m.length < 2) return;

    setSubmitting(true);
    setError(null);

    try {
      const images = await uploadImages();
      const created = await createWallEntry({ author: a, message: m, images });

      setEntries((prev) => [created, ...prev]);
      setMessage("");

      // reset pending files
      pendingFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPendingFiles([]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to post";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const flower = async (id: string) => {
    const updated = await flowerWallEntry(id);
    if (!updated) return;
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
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
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">WRITE</p>
        <h2 className="mt-2 font-lux-serif text-2xl">Leave a tribute</h2>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          Share a memory, a wish, or a message of love.
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

          <div>
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-[color:var(--text)]">
                Photos (up to {MAX_IMAGES})
              </label>
              <span className="text-xs text-[color:var(--muted)]">
                {pendingFiles.length}/{MAX_IMAGES}
              </span>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onPickFiles(e.target.files)}
              className="mt-2 block w-full text-sm text-[color:var(--muted)] file:mr-4 file:rounded-full file:border-0 file:bg-white/60 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--text)] hover:file:bg-white/75 dark:file:bg-white/10 dark:hover:file:bg-white/15"
              disabled={pendingFiles.length >= MAX_IMAGES || submitting}
            />

            {pendingFiles.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {pendingFiles.map((p, idx) => (
                  <div
                    key={p.previewUrl}
                    className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
                  >
                    <img
                      src={p.previewUrl}
                      alt="Selected"
                      className="h-20 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePendingFile(idx)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white"
                      aria-label="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          ) : null}

          <button className="btn-primary" onClick={addEntry} disabled={submitting}>
            {submitting ? "Posting…" : "Post to Memorial Wall"}
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
            <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">WALL</p>
            <h2 className="mt-2 font-lux-serif text-2xl">Memories from the heart</h2>
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
                    onClick={() => void flower(e.id)}
                    aria-label="Send flowers"
                  >
                    + 🌸 {e.flowers}
                  </button>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[color:var(--muted)]">
                  {e.message}
                </p>

                {e.images && e.images.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {e.images.slice(0, 6).map((img) => (
                      <a
                        key={img.url}
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
                      >
                        <img
                          src={img.url}
                          alt="Memory"
                          className="h-28 w-full object-cover"
                          loading="lazy"
                        />
                      </a>
                    ))}
                  </div>
                ) : null}

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
