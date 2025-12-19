export type WallImage = {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
};

export type WallEntry = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  flowers: number;
  images?: WallImage[];
};

export const WALL_STORAGE_KEY = "familyverse_memorial_wall_v1";
export const WALL_CHANGED_EVENT = "familyverse_wall_changed";

function apiBase() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  return base?.replace(/\/$/, "") || null;
}

function notifyWallChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(WALL_CHANGED_EVENT));
}

function toIsoDate(value: unknown) {
  // Accept Date, ISO string, or anything stringifiable.
  const d = value instanceof Date ? value : new Date(String(value ?? ""));
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

type WallEntryResponse = Omit<WallEntry, "createdAt"> & { createdAt: unknown };

function normalizeEntry(raw: unknown): WallEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<WallEntryResponse>;
  if (!r.id || !r.author || !r.message) return null;

  return {
    id: String(r.id),
    author: String(r.author),
    message: String(r.message),
    flowers: typeof r.flowers === "number" ? r.flowers : Number(r.flowers ?? 0),
    createdAt: toIsoDate(r.createdAt),
    images: Array.isArray(r.images) ? (r.images as WallImage[]) : [],
  };
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function loadLocal(): WallEntry[] {
  try {
    const raw = localStorage.getItem(WALL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WallEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocal(entries: WallEntry[]) {
  localStorage.setItem(WALL_STORAGE_KEY, JSON.stringify(entries));

  // Trigger same-tab subscribers.
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: WALL_STORAGE_KEY,
      newValue: JSON.stringify(entries),
    }),
  );
  notifyWallChanged();
}

export async function uploadWallImage(file: File): Promise<WallImage> {
  const base = apiBase();
  if (!base) {
    throw new Error("Backend is not configured (missing NEXT_PUBLIC_API_BASE_URL)");
  }

  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${base}/api/uploads/wall-image`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}). ${text}`);
  }

  const json = (await res.json()) as {
    url: string;
    publicId?: string;
    width?: number;
    height?: number;
  };

  return {
    url: json.url,
    publicId: json.publicId,
    width: json.width,
    height: json.height,
  };
}

export async function listWallEntries(limit = 20): Promise<WallEntry[]> {
  const base = apiBase();

  if (!base || typeof window === "undefined") {
    return typeof window === "undefined" ? [] : loadLocal();
  }

  const res = await fetch(`${base}/api/wall?limit=${limit}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return loadLocal();
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return [];

  return data
    .map((raw) => normalizeEntry(raw))
    .filter((e): e is WallEntry => Boolean(e));
}

export async function createWallEntry(input: {
  author: string;
  message: string;
  images?: WallImage[];
}): Promise<WallEntry> {
  const base = apiBase();

  if (!base) {
    const next: WallEntry = {
      id: uid(),
      author: input.author,
      message: input.message,
      createdAt: new Date().toISOString(),
      flowers: 0,
      images: input.images ?? [],
    };

    const entries = [next, ...loadLocal()];
    saveLocal(entries);
    return next;
  }

  const res = await fetch(`${base}/api/wall`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const next: WallEntry = {
      id: uid(),
      author: input.author,
      message: input.message,
      createdAt: new Date().toISOString(),
      flowers: 0,
      images: input.images ?? [],
    };
    const entries = [next, ...loadLocal()];
    saveLocal(entries);
    return next;
  }

  const createdRaw = (await res.json()) as unknown;
  const normalized = normalizeEntry(createdRaw);
  if (!normalized) {
    throw new Error("Invalid response from backend");
  }
  notifyWallChanged();
  return normalized;
}

export async function flowerWallEntry(id: string): Promise<WallEntry | null> {
  const base = apiBase();

  if (!base) {
    const entries = loadLocal();
    const idx = entries.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    const updated: WallEntry = {
      ...entries[idx]!,
      flowers: (entries[idx]!.flowers ?? 0) + 1,
    };

    const nextEntries = [...entries];
    nextEntries[idx] = updated;
    saveLocal(nextEntries);
    return updated;
  }

  const res = await fetch(`${base}/api/wall/${id}/flower`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  const updatedRaw = (await res.json()) as unknown;
  const normalized = normalizeEntry(updatedRaw);
  if (!normalized) return null;

  notifyWallChanged();
  return normalized;
}
