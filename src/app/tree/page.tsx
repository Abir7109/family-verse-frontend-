import Navbar from "@/components/navbar";
import FamilyTree from "@/components/tree/family-tree";

export default function TreePage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
          FAMILY TREE
        </p>
        <h1 className="mt-3 font-lux-serif text-4xl">Akhter&apos;s Family</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
          Search a member, hover to highlight connections, and click a node to
          open a luxury profile preview.
        </p>

        <div className="mt-8">
          <FamilyTree />
        </div>
      </main>
    </div>
  );
}
