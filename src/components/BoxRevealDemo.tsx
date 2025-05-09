import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";

export function BoxRevealDemo() {
  return (
    <div className="w-full max-w-4xl items-center justify-center overflow-hidden pt-12 px-4">
      <BoxReveal boxColor={"#2BAF55"} duration={0.5}>
        <p className="text-[5rem] font-bold leading-tight">
          LEETHUB<span className="text-primary">.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#2BAF55"} duration={0.5}>
        <h2 className="mt-2 text-[1.75rem]">
          UI library for{" "}
          <span className="text-primary font-semibold">Design Engineers</span>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#2BAF55"} duration={0.5}>
        <div className="mt-8 text-lg leading-relaxed">
          <p>
            -&gt; 20+ free and open-source animated components built with{" "}
            <span className="font-semibold text-primary">React</span>,{" "}
            <span className="font-semibold text-primary">Typescript</span>,{" "}
            <span className="font-semibold text-primary">Tailwind CSS</span>, and{" "}
            <span className="font-semibold text-primary">Motion</span>.<br />
            -&gt; 100% open-source, and customizable.
          </p>
        </div>
      </BoxReveal>

      <BoxReveal boxColor={"#2BAF55"} duration={0.5}>
        <Button className="mt-8 text-lg px-8 py-4 text-primary">Explore</Button>
      </BoxReveal>
    </div>
  );
}


