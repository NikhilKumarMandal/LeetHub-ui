// import {
//   AnimatedSpan,
//   Terminal,
//   TypingAnimation,
// } from "@/components/magicui/terminal";

// export function TerminalDemo() {
//   return (
//     <Terminal>
//       <TypingAnimation>&gt; Starting Two Sum Problem...</TypingAnimation>

//       <AnimatedSpan delay={1500} className="text-green-500">
//         <span>✔ Reading input array: [2, 7, 11, 15]</span>
//       </AnimatedSpan>

//       <AnimatedSpan delay={2000} className="text-green-500">
//         <span>✔ Target sum: 9</span>
//       </AnimatedSpan>

//       <AnimatedSpan delay={2500} className="text-green-500">
//         <span>✔ Initializing hash map...</span>
//       </AnimatedSpan>

//       <AnimatedSpan delay={3000} className="text-green-500">
//         <span>✔ Checking number: 2 (index 0)</span>
//       </AnimatedSpan>

//       <AnimatedSpan delay={3500} className="text-green-500">
//         <span>✔ Checking number: 7 (index 1)</span>
//       </AnimatedSpan>

//       <AnimatedSpan delay={4000} className="text-green-500">
//         <span>✔ Match found: 2 + 7 = 9</span>
//       </AnimatedSpan>

//       <AnimatedSpan delay={4500} className="text-green-500">
//         <span>✔ Indices: [0, 1]</span>
//       </AnimatedSpan>

//       <TypingAnimation delay={5000} className="text-muted-foreground">
//         Output: [0, 1]
//       </TypingAnimation>

//       <TypingAnimation delay={5500} className="text-muted-foreground">
//         Problem solved successfully!
//       </TypingAnimation>
//     </Terminal>
//   );
// }

import { useEffect, useState } from "react";

export function TerminalDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { text: "Starting Two Sum Problem...", delay: 500 },
    { text: "✓ Reading input array: [2, 7, 11, 15]", delay: 700 },
    { text: "✓ Target sum: 9", delay: 600 },
    { text: "✓ Initializing hash map...", delay: 800 },
    { text: "✓ Checking number: 2 (index 0)", delay: 700 },
    { text: "✓ Checking number: 7 (index 1)", delay: 700 },
    { text: "✓ Match found: 2 + 7 = 9", delay: 800 },
    { text: "✓ Indices: [0, 1]", delay: 600 },
    { text: "Output: [0, 1]", delay: 500 },
    { text: "Problem solved successfully!", delay: 800 },
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, steps[currentStep].delay);
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
    }
  }, [currentStep, steps, isComplete]);

  return (
    <div className="w-full h-full bg-black rounded-lg border border-gray-800 shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-primary/10">
      <div className="flex items-center border-b border-gray-800 px-4 py-2 bg-gray-900">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="mx-auto text-sm font-mono text-gray-400">
          Two Sum Problem
        </div>
      </div>
      <div className="p-4 font-mono text-sm text-green-400 h-[350px] overflow-y-auto bg-[#0D1117]">
        {steps.slice(0, currentStep).map((step, index) => (
          <div key={index} className="mb-2 animate-fade-in">
            {index === 0 ? <span className="text-blue-400">{">"} </span> : ""}
            {step.text}
          </div>
        ))}
        {!isComplete && <span className="animate-pulse">▋</span>}
      </div>
    </div>
  );
}
