"use client"

import { useState, useCallback } from "react"
import { useApp } from "@/lib/app-context"
import { buildMessage, sendMessage } from "@/lib/store"
import {
  MessageSquare,
  Phone,
  MapPin,
  RotateCcw,
  Play,
  Square,
  Truck,
  DoorOpen,
  UserX,
  CheckCircle2,
  Undo2,
  X,
} from "lucide-react"

function BulkModal({
  open,
  onClose,
  type,
}: {
  open: boolean
  onClose: () => void
  type: "start" | "end"
}) {
  const { data, van, sendMethod, orderedStudents, isAbsent, flash } = useApp()
  const [bulkIndex, setBulkIndex] = useState(0)

  const active = orderedStudents().filter((s) => !isAbsent(s.id))

  const handleSend = useCallback(() => {
    if (bulkIndex >= active.length) return
    const s = active[bulkIndex]
    const tpl = type === "start" ? data.messages.inicio : data.messages.fin
    if (s.phone) {
      sendMessage(s.phone, buildMessage(tpl, s, data.schools, van), sendMethod)
    } else {
      flash(s.name + " sin telefono", "err")
    }
    setBulkIndex((i) => i + 1)
  }, [bulkIndex, active, type, data, van, sendMethod, flash])

  if (!open) return null

  const done = bulkIndex >= active.length

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
          setBulkIndex(0)
        }
      }}
    >
      <div
        className="w-full flex flex-col rounded-t-[20px] border-t-2 border-[var(--yellow)] bg-[var(--navy2)]"
        style={{ maxHeight: "92dvh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-xl font-extrabold text-[var(--yellow)]">
            {type === "start" ? "Iniciar Ruta" : "Terminar Ruta"}
          </h2>
          <button
            onClick={() => {
              onClose()
              setBulkIndex(0)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--navy3)] text-[var(--gray)] active:scale-95 transition-transform"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-[var(--gray)] px-4 pb-3 flex-shrink-0">
          Se abre {sendMethod === "whatsapp" ? "WhatsApp" : "SMS"} con cada
          mensaje. Al volver, toca siguiente.
        </p>

        {/* Scrollable student list */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-3 min-h-0 space-y-2">
          {active.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-lg p-2.5"
              style={{
                background: "var(--navy3)",
                border: `1.5px solid ${
                  i < bulkIndex
                    ? "var(--green)"
                    : i === bulkIndex
                    ? "var(--yellow)"
                    : "var(--border-color)"
                }`,
              }}
            >
              <span className="text-lg">
                {i < bulkIndex ? (
                  <CheckCircle2 className="h-5 w-5 text-[var(--green)]" />
                ) : i === bulkIndex ? (
                  <Play className="h-5 w-5 text-[var(--yellow)]" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-[var(--border-color)]" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className="font-bold text-sm truncate"
                  style={{
                    color:
                      i < bulkIndex
                        ? "var(--green)"
                        : i === bulkIndex
                        ? "var(--yellow)"
                        : "var(--light)",
                  }}
                >
                  {s.name}
                </div>
                <div className="text-xs text-[var(--gray)]">
                  {s.guardian || "---"} · {s.phone || "sin tel"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky action area */}
        <div
          className="px-4 pt-3 flex-shrink-0 border-t border-[var(--border-color)] bg-[var(--navy2)]"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        >
          <div
            className="text-center text-sm font-bold mb-3"
            style={{ color: done ? "var(--green)" : "var(--gray)" }}
          >
            {done
              ? "Todos enviados!"
              : `${bulkIndex}/${active.length} enviados`}
          </div>
          {done ? (
            <button
              onClick={() => {
                onClose()
                setBulkIndex(0)
              }}
              className="w-full rounded-xl bg-[var(--green)] py-3.5 text-base font-bold text-white active:scale-[0.97] transition-transform"
            >
              Listo
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="w-full rounded-xl bg-[var(--green)] py-3.5 text-base font-bold text-white active:scale-[0.97] transition-transform"
            >
              {sendMethod === "whatsapp" ? (
                <span className="inline-flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Enviar a {active[bulkIndex]?.name}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Enviar a {active[bulkIndex]?.name}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function StudentCard({
  student,
  index,
}: {
  student: { id: string; name: string; school: number; guardian: string; phone: string; address: string }
  index: number
}) {
  const { data, sendMethod, isAbsent, isDelivered, toggleAbsent, toggleDelivered, sendCamino, sendPuerta } = useApp()

  const absent = isAbsent(student.id)
  const delivered = isDelivered(student.id)
  const schoolName = data.schools[student.school] || "Colegio"

  const schoolColors = [
    { bg: "rgba(245,197,24,0.15)", text: "#f5c518", border: "rgba(245,197,24,0.3)" },
    { bg: "rgba(59,130,246,0.15)", text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
    { bg: "rgba(168,85,247,0.15)", text: "#c084fc", border: "rgba(168,85,247,0.3)" },
  ]
  const sc = schoolColors[student.school] || schoolColors[0]

  return (
    <div
      className="mx-4 my-1.5 rounded-xl overflow-hidden transition-all"
      style={{
        background: "var(--card-bg)",
        border: `1.5px solid ${absent ? "var(--red)" : delivered ? "var(--green)" : "var(--border-color)"}`,
        opacity: absent ? 0.45 : 1,
      }}
    >
      {/* Top section */}
      <div className="flex items-center gap-3 px-3 pt-3 pb-2">
        <div
          className="text-[22px] font-extrabold min-w-[28px] text-center"
          style={{ color: absent ? "var(--red)" : delivered ? "var(--green)" : "var(--yellow)" }}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[17px] text-[var(--foreground)] truncate">
            {student.name}
          </div>
          <span
            className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded mt-0.5"
            style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
          >
            {schoolName}
          </span>
          <div className="text-xs text-[var(--gray)] mt-0.5">
            {student.guardian || ""} {student.phone ? `· ${student.phone}` : ""}
          </div>
          {student.address && (
            <div className="text-[11px] text-[#64748b] mt-0.5 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {student.address}
            </div>
          )}
        </div>
        <div>
          {absent && (
            <span className="text-[10px] text-white px-2 py-0.5 rounded font-bold bg-[var(--red)]">
              AUSENTE
            </span>
          )}
          {delivered && (
            <span className="text-[10px] text-white px-2 py-0.5 rounded font-bold bg-[var(--green)]">
              ENTREGADO
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
        <button
          onClick={() => sendCamino(student.id)}
          className="flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-[15px] font-bold active:scale-95 transition-transform"
          style={{
            background: "rgba(249,115,22,0.18)",
            border: "2px solid var(--orange)",
            color: "var(--orange)",
          }}
        >
          <Truck className="h-4 w-4" />
          En Camino
        </button>
        <button
          onClick={() => sendPuerta(student.id)}
          className="flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-[15px] font-bold active:scale-95 transition-transform"
          style={{
            background: "rgba(34,197,94,0.18)",
            border: "2px solid var(--green)",
            color: "var(--green)",
          }}
        >
          <DoorOpen className="h-4 w-4" />
          En Puerta
        </button>
        <button
          onClick={() => toggleAbsent(student.id)}
          className="flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-[15px] font-bold active:scale-95 transition-transform"
          style={{
            background: absent ? "rgba(148,163,184,0.1)" : "rgba(239,68,68,0.12)",
            border: `2px solid ${absent ? "var(--gray)" : "var(--red)"}`,
            color: absent ? "var(--gray)" : "var(--red)",
          }}
        >
          {absent ? <Undo2 className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
          {absent ? "No Ausente" : "Ausente"}
        </button>
        <button
          onClick={() => toggleDelivered(student.id)}
          className="flex items-center justify-center gap-1.5 rounded-xl py-3.5 text-[15px] font-bold active:scale-95 transition-transform"
          style={{
            background: "rgba(34,197,94,0.15)",
            border: "2px solid var(--green)",
            color: "var(--green)",
          }}
        >
          {delivered ? <Undo2 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {delivered ? "No Entregado" : "Entregado"}
        </button>
      </div>
    </div>
  )
}

export function RouteView() {
  const { van, sendMethod, setSendMethod, orderedStudents, isAbsent, isDelivered, resetDay } = useApp()
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkType, setBulkType] = useState<"start" | "end">("start")

  const students = orderedStudents()
  const today = new Date()
  const dateStr = today.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const nAbs = students.filter((s) => isAbsent(s.id)).length
  const nDel = students.filter((s) => isDelivered(s.id)).length

  return (
    <div className="pb-4">
      {/* Action buttons */}
      <div className="flex gap-2 px-4 pt-3 pb-1.5">
        <button
          onClick={() => {
            setBulkType("start")
            setBulkOpen(true)
          }}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--green)] py-3 text-sm font-bold text-white active:scale-[0.97] transition-transform"
        >
          <Play className="h-4 w-4" />
          INICIAR RUTA
        </button>
        <button
          onClick={() => {
            setBulkType("end")
            setBulkOpen(true)
          }}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--red)] py-3 text-sm font-bold text-white active:scale-[0.97] transition-transform"
        >
          <Square className="h-4 w-4" />
          TERMINAR
        </button>
        <button
          onClick={resetDay}
          className="flex items-center justify-center rounded-xl bg-[var(--navy3)] px-3 py-3 text-[var(--light)] active:scale-[0.97] transition-transform"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Method toggle */}
      <div className="mx-4 mb-2 flex rounded-xl overflow-hidden border-[1.5px] border-[var(--border-color)]">
        <button
          onClick={() => setSendMethod("whatsapp")}
          className="flex-1 py-3 text-sm font-bold transition-all flex items-center justify-center gap-1.5"
          style={{
            background: sendMethod === "whatsapp" ? "var(--green)" : "var(--navy3)",
            color: sendMethod === "whatsapp" ? "#fff" : "var(--gray)",
          }}
        >
          <MessageSquare className="h-4 w-4" />
          WhatsApp
        </button>
        <button
          onClick={() => setSendMethod("sms")}
          className="flex-1 py-3 text-sm font-bold transition-all flex items-center justify-center gap-1.5"
          style={{
            background: sendMethod === "sms" ? "var(--green)" : "var(--navy3)",
            color: sendMethod === "sms" ? "#fff" : "var(--gray)",
          }}
        >
          <Phone className="h-4 w-4" />
          SMS
        </button>
      </div>

      {/* Date bar */}
      <div className="mx-4 mb-1 flex items-center justify-between rounded-xl bg-[var(--card-bg)] px-3.5 py-2.5">
        <span className="text-[13px] font-semibold text-[var(--yellow)] capitalize">
          {dateStr}
        </span>
        <span className="text-xs text-[var(--gray)]">
          {students.length} · {nAbs} aus · {nDel} ent
        </span>
      </div>

      {/* Student cards */}
      {students.length === 0 ? (
        <div className="text-center py-12 px-6">
          <div className="text-4xl mb-3">🚐</div>
          <div className="text-[var(--foreground)] font-bold text-base mb-1">
            No hay alumnos en Furgon {van}
          </div>
          <div className="text-[var(--gray)] text-sm">
            Agrega alumnos en la pestana Alumnos.
          </div>
        </div>
      ) : (
        students.map((s, i) => <StudentCard key={s.id} student={s} index={i} />)
      )}

      <BulkModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        type={bulkType}
      />
    </div>
  )
}
