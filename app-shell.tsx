"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Save, Sunrise, Sunset } from "lucide-react"

export function SchedulesView() {
  const { data, saveSchedule } = useApp()
  const [schedules, setSchedules] = useState(
    data.schools.map((_, i) => ({
      entry: data.schedules[i]?.entry || "08:00",
      exit: data.schedules[i]?.exit || "15:00",
    }))
  )

  const handleSave = (index: number) => {
    saveSchedule(index, schedules[index].entry, schedules[index].exit)
  }

  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <span className="text-xs font-bold text-[var(--gray)] tracking-[2px] uppercase">
          HORARIOS POR COLEGIO
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        {data.schools.map((school, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-3"
          >
            <div className="text-sm font-bold text-[var(--yellow)] mb-3 truncate">
              {school}
            </div>
            <div className="mb-3">
              <label className="flex items-center gap-1 text-[10px] font-semibold text-[var(--gray)] mb-1">
                <Sunrise className="h-3 w-3" />
                Entrada
              </label>
              <input
                type="time"
                value={schedules[i]?.entry || "08:00"}
                onChange={(e) => {
                  const copy = [...schedules]
                  copy[i] = { ...copy[i], entry: e.target.value }
                  setSchedules(copy)
                }}
                className="w-full rounded-lg bg-[var(--navy3)] border-[1.5px] border-[var(--border-color)] text-[var(--foreground)] text-sm px-2.5 py-2 outline-none focus:border-[var(--yellow)] transition-colors"
              />
            </div>
            <div className="mb-3">
              <label className="flex items-center gap-1 text-[10px] font-semibold text-[var(--gray)] mb-1">
                <Sunset className="h-3 w-3" />
                Salida
              </label>
              <input
                type="time"
                value={schedules[i]?.exit || "15:00"}
                onChange={(e) => {
                  const copy = [...schedules]
                  copy[i] = { ...copy[i], exit: e.target.value }
                  setSchedules(copy)
                }}
                className="w-full rounded-lg bg-[var(--navy3)] border-[1.5px] border-[var(--border-color)] text-[var(--foreground)] text-sm px-2.5 py-2 outline-none focus:border-[var(--yellow)] transition-colors"
              />
            </div>
            <button
              onClick={() => handleSave(i)}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[var(--yellow)] py-2 text-xs font-bold text-[var(--navy)] active:scale-[0.97] transition-transform"
            >
              <Save className="h-3.5 w-3.5" />
              Guardar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
