import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";

export function TerminalDemo() {
  return (
    <Terminal>
      <TypingAnimation>&gt; Starting Two Sum Problem...</TypingAnimation>

      <AnimatedSpan delay={1500} className="text-green-500">
        <span>✔ Reading input array: [2, 7, 11, 15]</span>
      </AnimatedSpan>

      <AnimatedSpan delay={2000} className="text-green-500">
        <span>✔ Target sum: 9</span>
      </AnimatedSpan>

      <AnimatedSpan delay={2500} className="text-green-500">
        <span>✔ Initializing hash map...</span>
      </AnimatedSpan>

      <AnimatedSpan delay={3000} className="text-green-500">
        <span>✔ Checking number: 2 (index 0)</span>
      </AnimatedSpan>

      <AnimatedSpan delay={3500} className="text-green-500">
        <span>✔ Checking number: 7 (index 1)</span>
      </AnimatedSpan>

      <AnimatedSpan delay={4000} className="text-green-500">
        <span>✔ Match found: 2 + 7 = 9</span>
      </AnimatedSpan>

      <AnimatedSpan delay={4500} className="text-green-500">
        <span>✔ Indices: [0, 1]</span>
      </AnimatedSpan>

      <TypingAnimation delay={5000} className="text-muted-foreground">
        Output: [0, 1]
      </TypingAnimation>

      <TypingAnimation delay={5500} className="text-muted-foreground">
        Problem solved successfully!
      </TypingAnimation>
    </Terminal>
  );
}
