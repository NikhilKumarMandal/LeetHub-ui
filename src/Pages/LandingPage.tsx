import Topbar from "@/components/Topbar";
import FeaturesSection from "@/sections/FeaturesSection";
import HeroSections from "@/sections/HeroSections";
import PricingSection from "@/sections/PricingSection";

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/80">
      <Topbar />
      <main className="flex-1">
        <HeroSections />
        <FeaturesSection />
        <PricingSection />
      </main>
    </div>
  );
}

export default LandingPage;
