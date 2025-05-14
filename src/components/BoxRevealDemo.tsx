import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { Link } from "react-router-dom";

export function BoxRevealDemo() {
  return (
    <div className="w-full max-w-4xl items-center justify-center overflow-hidden pt-12 px-4">
      <BoxReveal boxColor={"#2BAF55"} duration={0.5}>
        <p className="sm:text-6xl text-[5rem] font-bold leading-tight">
          LEETHUB<span className="text-primary">.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#2BAF55"} duration={0.5}>
        <h2 className="mt-2 text-[1.75rem]">
          Practice platform for{" "}
          <span className="text-primary font-semibold">
            Aspiring Developers
          </span>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#2BAF55"} duration={0.5}>
        <div className="mt-8 text-lg leading-relaxed">
          <p>
            -&gt;focus on LeetHub — that will help you land a job at companies
            like <span className="font-semibold text-primary">FAANG</span>,{" "}
            <span className="font-semibold text-primary">MAANG</span>, or{" "}
            <span className="font-semibold text-primary">TAANG</span>.<br />
            -&gt; 1000 plus DSA problem we have
          </p>
        </div>
      </BoxReveal>

      <BoxReveal boxColor={"#2BAF55"} duration={0.5}>
        <Link to="/auth/homepage">
          <Button className="mt-8 text-lg px-8 py-4 text-primary">Explore</Button>
        </Link>
      </BoxReveal>
    </div>
  );
}
