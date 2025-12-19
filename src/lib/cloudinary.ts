import type { WallImage } from "@/lib/api-client";

export function cloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) return null;

  return {
    cloudName,
    uploadPreset,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  };
}

export async function uploadToCloudinary(file: File): Promise<WallImage> {
  const cfg = cloudinaryConfig();
  if (!cfg) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", cfg.uploadPreset);

  const res = await fetch(cfg.uploadUrl, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed (${res.status}). ${text}`);
  }

  const json = (await res.json()) as {
    secure_url: string;
    public_id?: string;
    width?: number;
    height?: number;
  };

  return {
    url: json.secure_url,
    publicId: json.public_id,
    width: json.width,
    height: json.height,
  };
}
