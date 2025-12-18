import BirthdayAutoPopup from "@/components/birthday-auto-popup";
import Navbar from "@/components/navbar";
import Hero from "@/components/home/hero";
import FeaturedProfiles from "@/components/home/featured-profiles";
import TreePreview from "@/components/home/tree-preview";
import WallPreview from "@/components/home/wall-preview";
import BirthdaysPreview from "@/components/home/birthdays-preview";
import Footer from "@/components/home/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)]">
      <BirthdayAutoPopup />
      <Navbar />

      <main>
        <Hero />
        <FeaturedProfiles />
        <TreePreview />
        <WallPreview />
        <BirthdaysPreview />
        <Footer />
      </main>
    </div>
  );
}
