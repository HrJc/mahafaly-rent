"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BookedRange {
  startDate: string
  endDate: string
  status: "PENDING" | "APPROVED"
}

interface Props {
  ranges: BookedRange[]
  startDate: string
  endDate: string
  onDateClick: (date: string) => void
}

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

function toYMD(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function AvailabilityCalendar({ ranges, startDate, endDate, onDateClick }: Props) {
  const today = toYMD(new Date())
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const bookedStatus = useMemo(() => {
    const map: Record<string, "PENDING" | "APPROVED"> = {}
    for (const r of ranges) {
      const start = new Date(r.startDate + "T12:00:00")
      const end = new Date(r.endDate + "T12:00:00")
      const cur = new Date(start)
      while (cur <= end) {
        map[toYMD(cur)] = r.status
        cur.setDate(cur.getDate() + 1)
      }
    }
    return map
  }, [ranges])

  const days = useMemo(() => {
    const { year, month } = viewDate
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    const startOffset = (first.getDay() + 6) % 7
    const cells: (string | null)[] = Array(startOffset).fill(null)
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push(toYMD(new Date(year, month, d)))
    }
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewDate])

  const prevMonth = () =>
    setViewDate(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    )
  const nextMonth = () =>
    setViewDate(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    )
  const canGoPrev = () => {
    const now = new Date()
    return viewDate.year > now.getFullYear() || (viewDate.year === now.getFullYear() && viewDate.month > now.getMonth())
  }

  return (
    <div className="bg-neo-surface rounded-2xl p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} disabled={!canGoPrev()} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neo-border/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4 text-neo-muted" />
        </button>
        <p className="text-xs font-bold text-neo-text">{MONTHS[viewDate.month]} {viewDate.year}</p>
        <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neo-border/50 transition-colors">
          <ChevronRight className="w-4 h-4 text-neo-muted" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[9px] font-bold uppercase tracking-wider text-neo-light py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day, i) => {
          if (!day) return <div key={i} />
          const isPast = day < today
          const bookedAs = bookedStatus[day]
          const isBooked = !!bookedAs
          const isStart = day === startDate
          const isEnd = day === endDate
          const isSelected = isStart || isEnd
          const isInRange = startDate && endDate && day > startDate && day < endDate
          const isToday = day === today
          const isDisabled = isPast || isBooked

          return (
            <button
              key={day}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onDateClick(day)}
              className={cn(
                "h-8 w-full flex items-center justify-center text-[11px] font-medium transition-colors rounded-lg",
                isPast && "text-neo-light/40 cursor-not-allowed",
                bookedAs === "APPROVED" && "bg-red-100 text-red-400 cursor-not-allowed",
                bookedAs === "PENDING" && "bg-amber-50 text-amber-500 cursor-not-allowed",
                isSelected && "bg-neo-text text-white rounded-full z-10",
                isInRange && "bg-neo-text/10 text-neo-text rounded-none",
                isToday && !isSelected && !isBooked && !isPast && "border border-neo-text/30",
                !isDisabled && !isSelected && "hover:bg-neo-border/70 cursor-pointer",
              )}
            >
              {new Date(day + "T12:00:00").getDate()}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neo-border/50 flex-wrap">
        <span className="flex items-center gap-1.5 text-[10px] text-neo-light"><span className="w-2.5 h-2.5 rounded-full bg-red-300 shrink-0" /> Réservé</span>
        <span className="flex items-center gap-1.5 text-[10px] text-neo-light"><span className="w-2.5 h-2.5 rounded-full bg-amber-300 shrink-0" /> En attente</span>
        <span className="flex items-center gap-1.5 text-[10px] text-neo-light"><span className="w-2.5 h-2.5 rounded-full bg-neo-text shrink-0" /> Votre sélection</span>
      </div>
    </div>
  )
}
