"use client"

import { useApp } from "@/lib/app-context"
import { RouteView } from "./route-view"
import { StudentsView } from "./students-view"
import { SchedulesView } from "./schedules-view"
import { ConfigView } from "./config-view"
import {
  Route,
  Users,
  Calendar,
  Settings,
  Bus,
} from "lucide-react"

const TABS = [
  { id: "ruta", label: "Ruta", icon: Route },
  { id: "alumnos", label: "Alumnos", icon: Users },
  { id: "horarios", label: "Horarios", icon: Calendar },
  { id: "config", label: "Config", icon: Settings },
] as const

export function AppShell() {
  const { van, toggleVan, currentView, setCurrentView, data, toast } = useApp()

  const subtitle = `Furgon ${van} · ${new Date().toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  })}`

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b-2 border-[var(--yellow)] bg-[var(--navy2)] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bus className="h-5 w-5 text-[var(--yellow)]" />
          <div>
            <div className="text-xl font-extrabold text-[var(--yellow)] tracking-wider">
              RUTA ESCOLAR
            </div>
            <div className="text-[11px] text-[var(--gray)]">{subtitle}</div>
          </div>
        </div>
        <button
          onClick={toggleVan}
          className="font-extrabold text-[17px] px-4 py-1.5 rounded-full active:scale-95 transition-transform"
          style={{
            background: van === "A" ? "var(--yellow)" : "var(--blue)",
            color: van === "A" ? "var(--navy)" : "#fff",
          }}
        >
          FURGON {van}
        </button>
      </header>

      {/* Content - flex-1 with overflow, no fixed padding needed */}
      <main className="flex-1 overflow-y-auto scroll-touch scrollbar-hide min-h-0">
        {currentView === "ruta" && <RouteView />}
        {currentView === "alumnos" && <StudentsView />}
        {currentView === "horarios" && <SchedulesView />}
        {currentView === "config" && <ConfigView />}
      </main>

      {/* Bottom Navigation - part of flex layout, not fixed */}
      <nav
        className="flex bg-[var(--navy2)] border-t border-[var(--border-color)] flex-shrink-0"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = currentView === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors active:opacity-70"
              style={{
                color: active ? "var(--yellow)" : "var(--gray)",
                fontWeight: active ? 700 : 400,
              }}
            >
              <Icon className="h-[20px] w-[20px]" />
              <span className="text-[10px]">{tab.label}</span>
              {active && (
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--yellow)" }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Toast */}
      <div
        className="fixed left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-[15px] font-bold z-[300] max-w-[92vw] text-center whitespace-nowrap pointer-events-none transition-all duration-300 text-white"
        style={{
          bottom: "calc(70px + env(safe-area-inset-bottom, 0px))",
          background:
            toast.type === "ok"
              ? "var(--green)"
              : toast.type === "err"
              ? "var(--red)"
              : "var(--blue)",
          opacity: toast.show ? 1 : 0,
          transform: `translateX(-50%) translateY(${toast.show ? 0 : 20}px)`,
        }}
      >
        {toast.msg}
      </div>
    </div>
  )
}
