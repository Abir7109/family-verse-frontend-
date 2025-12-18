"use client";

import { useEffect, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          aria-modal="true"
          role="dialog"
          aria-labelledby={title ? titleId : undefined}
        >
          <motion.div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/30 bg-[color:var(--panel)] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)]"
            initial={{ y: 18, scale: 0.985, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.99, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[color:var(--accent)]/25 blur-3xl" />

            <div className="flex items-start justify-between gap-4">
              <div>
                {title ? (
                  <h2
                    id={titleId}
                    className="font-lux-serif text-2xl text-[color:var(--text)]"
                  >
                    {title}
                  </h2>
                ) : null}
              </div>

              <button
                onClick={onClose}
                className="rounded-2xl border border-black/10 bg-white/50 px-3 py-2 text-sm text-[color:var(--text)] hover:bg-white/70 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <div className={title ? "mt-6" : "mt-2"}>{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
