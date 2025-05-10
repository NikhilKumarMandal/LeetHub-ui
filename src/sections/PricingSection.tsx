import PricingCard from "@/components/PricingCard"

export default function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[40%] -right-[60%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            Pricing
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Plan</h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We offer flexible plans to meet your needs, whether you're a beginner or a seasoned professional.
            </p>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <div className="grid max-w-5xl w-full gap-6 py-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <PricingCard
              title="Free"
              description="Perfect for beginners and casual learners."
              price="$0"
              features={["100+ Easy Problems", "Basic IDE Features", "Community Access", "Basic Progress Tracking"]}
              buttonText="Get Started"
              buttonLink="/signup"
              buttonVariant="outline"
            />
            <PricingCard
              title="Pro"
              description="For serious programmers and job seekers."
              price="$19"
              features={[
                "All 2000+ Problems",
                "Advanced IDE Features",
                "Company-specific Problem Sets",
                "Detailed Analytics",
                "Solution Explanations",
              ]}
              buttonText="Get Started"
              buttonLink="/signup"
              buttonVariant="default"
              popular={true}
            />
            <PricingCard
              title="Team"
              description="For teams and organizations."
              price="$49"
              features={[
                "Everything in Pro",
                "Team Management",
                "Mock Interviews",
                "Team Analytics",
                "Priority Support",
              ]}
              buttonText="Contact Sales"
              buttonLink="/contact"
              buttonVariant="outline"
            />
          </div>
        </div>
      </div>
    </section>
  )
}