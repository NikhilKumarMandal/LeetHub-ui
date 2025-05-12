import { BoxRevealDemo } from "@/components/BoxRevealDemo";
import { TerminalDemo } from "@/components/TerminalDemo";

export default function HeroSection() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 py-8 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[20%] sm:-top-[30%] lg:-top-[40%] -right-[60%] h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -bottom-[20%] sm:-bottom-[30%] lg:-bottom-[40%] -left-[60%] h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl"></div>
        </div>

        {/* Responsive Grid with fixed alignment */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left w-full lg:w-1/2">
            <div className="inline-flex items-center rounded-full border px-4 py-2 text-xs sm:text-sm md:text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 w-fit mx-auto lg:mx-0">
              Launch Promo: 20% Off Pro Plan
            </div>
            <BoxRevealDemo />
          </div>

          {/* Terminal Component */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-5">
              <TerminalDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
