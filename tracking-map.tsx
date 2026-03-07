"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useApp } from "@/lib/app-context"
import type { Student } from "@/lib/store"
import {
  Plus,
  Pencil,
  ChevronUp,
  ChevronDown,
  X,
  Trash2,
  Save,
  AlertTriangle,
  Search,
} from "lucide-react"

function StudentModal({
  open,
  onClose,
  editStudent,
}: {
  open: boolean
  onClose: () => void
  editStudent: Student | null
}) {
  const { data, saveStudent, deleteStudent } = useApp()
  const isNew = !editStudent

  const [name, setName] = useState(editStudent?.name || "")
  const [school, setSchool] = useState(editStudent?.school || 0)
  const [guardian, setGuardian] = useState(editStudent?.guardian || "")
  const [phone, setPhone] = useState(editStudent?.phone || "")
  const [vanA, setVanA] = useState(editStudent?.vanA || false)
  const [vanB, setVanB] = useState(editStudent?.vanB || false)
  const [address, setAddress] = useState(editStudent?.address || "")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setConfirmDelete(false)
  }, [open])

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [open])

  const handleSave = useCallback(() => {
    if (!name.trim()) return
    saveStudent(
      { name: name.trim(), school, guardian: guardian.trim(), phone: phone.trim(), vanA, vanB, address: address.trim() },
      editStudent?.id
    )
    onClose()
  }, [name, school, guardian, phone, vanA, vanB, address, editStudent, saveStudent, onClose])

  const handleDelete = useCallback(() => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    if (editStudent) {
      deleteStudent(editStudent.id)
      onClose()
    }
  }, [editStudent, confirmDelete, deleteStudent, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Modal container - flex column keeps button always visible */}
      <div
        className="w-full flex flex-col rounded-t-[20px] border-t-2 border-[var(--yellow)] bg-[var(--navy2)]"
        style={{ maxHeight: "92dvh" }}
      >
        {/* Header - always visible */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-xl font-extrabold text-[var(--yellow)]">
            {isNew ? "Nuevo Alumno" : "Editar Alumno"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--navy3)] text-[var(--gray)] active:scale-95 transition-transform"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable form - this is the only part that scrolls */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 pb-3 min-h-0">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--gray)] uppercase tracking-wide mb-1.5">
                Nombre del Alumno *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo"
                autoComplete="off"
                className="w-full rounded-lg bg-[var(--navy3)] border-[1.5px] border-[var(--border-color)] text-[var(--foreground)] text-[15px] px-3 py-3 outline-none focus:border-[var(--yellow)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--gray)] uppercase tracking-wide mb-1.5">
                Colegio
              </label>
              <select
                value={school}
                onChange={(e) => setSchool(parseInt(e.target.value))}
                className="w-full rounded-lg bg-[var(--navy3)] border-[1.5px] border-[var(--border-color)] text-[var(--foreground)] text-[15px] px-3 py-3 outline-none focus:border-[var(--yellow)] transition-colors"
              >
                {data.schools.map((s, i) => (
                  <option key={i} value={i} className="bg-[var(--navy2)]">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--gray)] uppercase tracking-wide mb-1.5">
                Nombre Apoderado
              </label>
              <input
                value={guardian}
                onChange={(e) => setGuardian(e.target.value)}
                placeholder="Nombre apoderado"
                autoComplete="off"
                className="w-full rounded-lg bg-[var(--navy3)] border-[1.5px] border-[var(--border-color)] text-[var(--foreground)] text-[15px] px-3 py-3 outline-none focus:border-[var(--yellow)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--gray)] uppercase tracking-wide mb-1.5">
                Telefono Celular
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="912345678"
                type="tel"
                inputMode="tel"
                autoComplete="off"
                className="w-full rounded-lg bg-[var(--navy3)] border-[1.5px] border-[var(--border-color)] text-[var(--foreground)] text-[15px] px-3 py-3 outline-none focus:border-[var(--yellow)] transition-colors"
              />
              <p className="text-[11px] text-[var(--gray)] mt-1">
                Solo pon 912345678 y se agrega +569 automatico
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--gray)] uppercase tracking-wide mb-1.5">
                Asignar a Furgon
              </label>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setVanA(!vanA)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition-all border-[2.5px]"
                  style={{
                    borderColor: vanA ? "var(--yellow)" : "var(--border-color)",
                    background: vanA ? "rgba(245,197,24,0.15)" : "var(--navy3)",
                    color: vanA ? "var(--yellow)" : "var(--gray)",
                  }}
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-md border-[2.5px] text-sm font-bold"
                    style={{
                      background: vanA ? "var(--yellow)" : "transparent",
                      borderColor: vanA ? "var(--yellow)" : "var(--border-color)",
                      color: vanA ? "var(--navy)" : "transparent",
                    }}
                  >
                    {vanA ? "✓" : ""}
                  </div>
                  FURGON A
                </button>
                <button
                  type="button"
                  onClick={() => setVanB(!vanB)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition-all border-[2.5px]"
                  style={{
                    borderColor: vanB ? "var(--blue)" : "var(--border-color)",
                    background: vanB ? "rgba(59,130,246,0.15)" : "var(--navy3)",
                    color: vanB ? "var(--blue)" : "var(--gray)",
                  }}
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-md border-[2.5px] text-sm font-bold"
                    style={{
                      background: vanB ? "var(--blue)" : "transparent",
                      borderColor: vanB ? "var(--blue)" : "var(--border-color)",
                      color: vanB ? "#fff" : "transparent",
                    }}
                  >
                    {vanB ? "✓" : ""}
                  </div>
                  FURGON B
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--gray)] uppercase tracking-wide mb-1.5">
                Direccion / Referencia
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle / referencia"
                autoComplete="off"
                className="w-full rounded-lg bg-[var(--navy3)] border-[1.5px] border-[var(--border-color)] text-[var(--foreground)] text-[15px] px-3 py-3 outline-none focus:border-[var(--yellow)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS - ALWAYS visible, never scroll, sticky at bottom */}
        <div
          className="flex gap-2 px-4 pt-3 flex-shrink-0 border-t border-[var(--border-color)] bg-[var(--navy2)]"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--yellow)] py-3.5 text-base font-bold text-[var(--navy)] active:scale-[0.97] transition-transform disabled:opacity-40 disabled:active:scale-100"
          >
            <Save className="h-5 w-5" />
            {isNew ? "AGREGAR ALUMNO" : "GUARDAR CAMBIOS"}
          </button>
          {!isNew && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center rounded-xl px-4 py-3.5 active:scale-[0.97] transition-transform"
              style={{
                background: confirmDelete ? "var(--red)" : "rgba(239,68,68,0.15)",
                color: confirmDelete ? "#fff" : "var(--red)",
                border: "2px solid var(--red)",
              }}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function StudentsView() {
  const { data, van, moveStudent } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [search, setSearch] = useState("")

  const sorted = [...data.students].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const filtered = search.trim()
    ? sorted.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.guardian.toLowerCase().includes(search.toLowerCase()) ||
          s.phone.includes(search)
      )
    : sorted

  const vanACount = data.students.filter((s) => s.vanA).length
  const vanBCount = data.students.filter((s) => s.vanB).length
  const noVan = data.students.filter((s) => !s.vanA && !s.vanB).length

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[var(--gray)] tracking-[2px] uppercase">
            ALUMNOS ({data.students.length})
          </span>
          <button
            onClick={() => {
              setEditStudent(null)
              setModalOpen(true)
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--yellow)] px-4 py-2.5 text-[15px] font-bold text-[var(--navy)] active:scale-[0.97] transition-transform"
            style={{ boxShadow: "0 4px 15px rgba(245,197,24,0.3)" }}
          >
            <Plus className="h-4 w-4" />
            NUEVO
          </button>
        </div>

        {/* Quick stats */}
        {data.students.length > 0 && (
          <div className="flex gap-2 mb-3">
            <div className="flex-1 rounded-lg py-1.5 text-center" style={{ background: "rgba(245,197,24,0.12)", border: "1px solid rgba(245,197,24,0.25)" }}>
              <div className="text-sm font-bold text-[var(--yellow)]">{vanACount}</div>
              <div className="text-[9px] text-[var(--gray)] uppercase tracking-wider">Furgon A</div>
            </div>
            <div className="flex-1 rounded-lg py-1.5 text-center" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}>
              <div className="text-sm font-bold text-[var(--blue)]">{vanBCount}</div>
              <div className="text-[9px] text-[var(--gray)] uppercase tracking-wider">Furgon B</div>
            </div>
            {noVan > 0 && (
              <div className="flex-1 rounded-lg py-1.5 text-center" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <div className="text-sm font-bold text-[var(--red)]">{noVan}</div>
                <div className="text-[9px] text-[var(--gray)] uppercase tracking-wider">Sin Furgon</div>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        {data.students.length > 3 && (
          <div className="relative mb-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gray)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar alumno, apoderado o telefono..."
              className="w-full rounded-xl bg-[var(--navy3)] border-[1.5px] border-[var(--border-color)] text-[var(--foreground)] text-sm pl-9 pr-9 py-2.5 outline-none focus:border-[var(--yellow)] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gray)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12 px-6">
          <div className="text-4xl mb-3">🚐</div>
          <div className="text-[var(--foreground)] font-bold text-base mb-1">
            Aun no hay alumnos
          </div>
          <div className="text-[var(--gray)] text-sm">
            Toca <span className="text-[var(--yellow)] font-bold">+ NUEVO</span> para agregar el primero.
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 px-6 text-[var(--gray)] text-sm">
          No se encontraron resultados para &quot;{search}&quot;
        </div>
      ) : (
        filtered.map((s) => (
          <div
            key={s.id}
            className="mx-4 my-1.5 flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-3"
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base text-[var(--foreground)] truncate">
                {s.name}
              </div>
              <div className="text-[11px] text-[var(--gray)] mt-0.5">
                {data.schools[s.school] || "Colegio"} · {s.guardian || "---"} ·{" "}
                {s.phone || "sin tel"}
              </div>
              {s.address && (
                <div className="text-[10px] text-[#64748b] mt-0.5 truncate">
                  📍 {s.address}
                </div>
              )}
              <div className="flex gap-1 mt-1 flex-wrap">
                {s.vanA && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(245,197,24,0.2)",
                      color: "var(--yellow)",
                      border: "1px solid rgba(245,197,24,0.4)",
                    }}
                  >
                    Furgon A
                  </span>
                )}
                {s.vanB && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(59,130,246,0.2)",
                      color: "var(--blue)",
                      border: "1px solid rgba(59,130,246,0.4)",
                    }}
                  >
                    Furgon B
                  </span>
                )}
                {!s.vanA && !s.vanB && (
                  <span className="text-[10px] text-[var(--red)] flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Sin furgon
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button
                onClick={() => {
                  setEditStudent(s)
                  setModalOpen(true)
                }}
                className="flex items-center gap-1 rounded-lg bg-[var(--navy3)] px-3 py-2.5 text-sm font-bold text-[var(--light)] active:scale-95 transition-transform"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </button>
              <div className="flex gap-1">
                <button
                  onClick={() => moveStudent(s.id, -1)}
                  className="flex h-8 w-full items-center justify-center rounded-md bg-[var(--navy3)] border border-[var(--border-color)] text-[var(--gray)] active:bg-[var(--border-color)] transition-colors"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveStudent(s.id, 1)}
                  className="flex h-8 w-full items-center justify-center rounded-md bg-[var(--navy3)] border border-[var(--border-color)] text-[var(--gray)] active:bg-[var(--border-color)] transition-colors"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <StudentModal
        key={editStudent?.id || "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editStudent={editStudent}
      />
    </div>
  )
}
