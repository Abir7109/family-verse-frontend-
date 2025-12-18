import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import { familyData, type FamilyMember } from "@/data/family";
import { getGalleryImagesForMember } from "@/lib/gallery";

export default async function ProfileGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const member = familyData.members.find((m): m is FamilyMember => m.id === id);
  if (!member) notFound();

  // If `gallerySrcs` is provided in data, it wins. Otherwise, auto-discover images
  // from `public/images/family/gallery/<id>/` or `public/images/family/<id>-*`.
  const discovered = await getGalleryImagesForMember(member.id);
  const images = (member.gallerySrcs?.length ? member.gallerySrcs : discovered).length
    ? (member.gallerySrcs?.length ? member.gallerySrcs : discovered)
    : [member.photoSrc];

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">GALLERY</p>
        <h1 className="mt-3 font-lux-serif text-4xl">{member.fullName}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
          Photo gallery for this profile.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn-secondary" href={`/profiles/${member.id}`}>
            Back to profile
          </Link>
          <Link className="btn-secondary" href="/profiles">
            All profiles
          </Link>
        </div>

        {images.length === 0 ? (
          <section className="mt-10 glass-card rounded-3xl p-6">
            <p className="text-sm text-[color:var(--muted)]">
              No gallery images found for this member.
            </p>
            <p className="mt-3 text-sm text-[color:var(--muted)]">
              Add images using either convention:
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm text-[color:var(--muted)]">
              <li>
                Put files in <code>public/images/family/gallery/{member.id}/</code>
              </li>
              <li>
                Or name them <code>{member.id}-1.jpg</code>, <code>{member.id}-2.jpg</code>
                in <code>public/images/family/</code>
              </li>
            </ul>
          </section>
        ) : (
          <section className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((src: string) => (
                <div
                  key={src}
                  className="glass-card overflow-hidden rounded-3xl border border-white/30 bg-white/30 dark:bg-white/10"
                >
                  <Image
                    src={src}
                    alt={`${member.fullName} gallery`}
                    width={900}
                    height={900}
                    className="h-72 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
