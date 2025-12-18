import { promises as fs } from "fs";
import path from "path";

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function isImageFile(name: string) {
  return IMAGE_EXTS.has(path.extname(name).toLowerCase());
}

async function dirExists(dir: string) {
  try {
    const stat = await fs.stat(dir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Returns a list of public URLs (starting with `/`) for a member's gallery.
 *
 * Conventions (in priority order):
 * 1) `public/images/family/gallery/<memberId>/*.{png,jpg,jpeg,webp,gif}`
 * 2) `public/images/family/<memberId>-*.{png,jpg,jpeg,webp,gif}`
 */
export async function getGalleryImagesForMember(memberId: string) {
  const publicDir = path.join(process.cwd(), "public");

  const perMemberDir = path.join(publicDir, "images", "family", "gallery", memberId);
  if (await dirExists(perMemberDir)) {
    const files = (await fs.readdir(perMemberDir)).filter(isImageFile).sort();
    return files.map((f) => `/images/family/gallery/${memberId}/${f}`);
  }

  const flatDir = path.join(publicDir, "images", "family");
  if (await dirExists(flatDir)) {
    const files = (await fs.readdir(flatDir))
      .filter(isImageFile)
      .filter((f) => f.toLowerCase().startsWith(`${memberId.toLowerCase()}-`))
      .sort();

    return files.map((f) => `/images/family/${f}`);
  }

  return [];
}
