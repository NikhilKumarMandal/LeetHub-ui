import Footer from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import HeroSections from "@/sections/HeroSections"



function HomePage() {
  return (
    <>
      {/* <Navbar />
      <HeroSections/>
    <Footer /> */}
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/80">
      <Navbar />
      <main className="flex-1">
        <HeroSections />
      </main>
      <Footer />
    </div>
      </>
  )
}

export default HomePage