import Navbar from "@/components/navbar";
import MemorialWall from "@/components/wall/memorial-wall";

export default function WallPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
          MEMORIAL WALL
        </p>
        <h1 className="mt-3 font-lux-serif text-4xl">Leave a memory</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
          A collective space for wishes, stories, and digital flowers — designed
          with calm luxury.
        </p>

        <div className="mt-8">
          <MemorialWall />
        </div>
      </main>
    </div>
  );
}
