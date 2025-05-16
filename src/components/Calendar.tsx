import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get current date for highlighting today
  const today = new Date()
  const currentDay = today.getDate()

  // Calculate days in month and first day of month
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  // Create calendar days array with empty slots for days before the 1st
  const calendarDays = [...Array(firstDayOfMonth).fill(null), ...Array(daysInMonth).keys()].map((day) =>
    day === null ? null : day + 1,
  )

  // Navigation functions
  const prevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  // Format month name
  const monthName = currentMonth.toLocaleString("default", { month: "long" })

  return (
    <Card className="bg-[#1a1a1a]">
      <CardHeader className="pb-2 p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm md:text-base">Day {currentDay}</CardTitle>
            <span className="text-xs text-gray-400">(45:15:9 left)</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-xs text-gray-300">{monthName}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
              onClick={nextMonth}
            >
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        <div className="grid grid-cols-7 text-center text-xs mb-2">
          <div className="text-gray-400">S</div>
          <div className="text-gray-400">M</div>
          <div className="text-gray-400">T</div>
          <div className="text-gray-400">W</div>
          <div className="text-gray-400">T</div>
          <div className="text-gray-400">F</div>
          <div className="text-gray-400">S</div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="h-6 w-6 md:h-8 md:w-8" />
            }

            const isToday =
              day === currentDay &&
              currentMonth.getMonth() === today.getMonth() &&
              currentMonth.getFullYear() === today.getFullYear()


            if (isToday) {
              return (
                <div
                  key={`day-${i}`}
                  className={`h-6 w-6 md:h-8 md:w-8 rounded-full ${isToday ? "bg-green-500" : "bg-yellow-500"} text-white flex items-center justify-center mx-auto text-xs md:text-sm cursor-pointer hover:opacity-90`}
                >
                  {day}
                </div>
              )
            }

            return (
              <div
                key={`day-${i}`}
                className="h-6 w-6 md:h-8 md:w-8 text-gray-300 flex items-center justify-center mx-auto text-xs md:text-sm cursor-pointer hover:bg-[#3a3a3a] hover:rounded-full"
              >
                {day}
              </div>
            )
          })}
        </div>
      </CardContent>
      <div className="px-3 md:px-6 pb-3 md:pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 md:h-5 md:w-5 rounded bg-green-600"></div>
          <span className="text-[10px] md:text-xs text-gray-400">0</span>
          <span className="text-[10px] md:text-xs text-gray-400">Redeem</span>
        </div>
        <span className="text-[10px] md:text-xs text-gray-400 cursor-pointer hover:text-white">Rules</span>
      </div>
    </Card>
  )
}
