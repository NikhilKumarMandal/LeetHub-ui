// components/ProblemItem.tsx
import type { ReactNode } from "react"
import { Check } from "lucide-react"

export interface ProblemItemProps {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  isSolved?: boolean
  progress: number
  icon?: ReactNode
}

export function ProblemItem({
  id,
  title,
  difficulty,
  isSolved = false,
  progress,
  icon,
}: ProblemItemProps) {
  const difficultyColor: Record<ProblemItemProps["difficulty"], string> = {
    Easy: "text-green-500",
    Medium: "text-yellow-500",
    Hard: "text-red-500",
  }

  const progressColor: Record<ProblemItemProps["difficulty"], string> = {
    Easy: "bg-green-500",
    Medium: "bg-yellow-500",
    Hard: "bg-red-500",
  }

  const difficultyText: Record<ProblemItemProps["difficulty"], string> = {
    Easy: "Easy",
    Medium: "Med.",
    Hard: "Hard",
  }

  return (
    <div className="flex items-center p-2 md:p-3 rounded hover:bg-[#2d2d2d] cursor-pointer">
      <div className="w-6 md:w-8 text-center">
        <div
          className={`h-4 w-4 md:h-5 md:w-5 rounded-full bg-[#2d2d2d] border ${
            isSolved ? "border-green-500" : "border-gray-700"
          } flex items-center justify-center mx-auto`}
        >
          {isSolved ? (
            <Check className="h-2 w-2 md:h-3 md:w-3 text-green-500" />
          ) : icon ? (
            icon
          ) : (
            <span className="text-[10px] md:text-xs text-gray-400">
              {id.split(".")[0]}
            </span>
          )}
        </div>
      </div>
      <div className="ml-2 flex-1 text-sm md:text-base truncate">{title}</div>
      <div className={`${difficultyColor[difficulty]} text-xs md:text-sm font-medium`}>
        {difficultyText[difficulty]}
      </div>
      <div className="ml-2 md:ml-4 w-16 md:w-24 flex justify-end">
        <div className="w-12 md:w-16 h-2 md:h-2.5 bg-[#2d2d2d] rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor[difficulty]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

