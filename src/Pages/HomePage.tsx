import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import FeaturesSection from "@/sections/FeaturesSection";
import HeroSections from "@/sections/HeroSections";
import PricingSection from "@/sections/PricingSection";

function HomePage() {
  return (
    // <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/80">
    //   <Navbar />
    //   <div className="h-16" /> 
    //   <main className="flex-1">
    //     <HeroSections />
    //     <FeaturesSection />
    //     <PricingSection/>
    //   </main>
    //   <Footer />
    // </div>
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/80">
      <Navbar />
      <main className="flex-1">
      <HeroSections />
        <FeaturesSection />
       <PricingSection/>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
