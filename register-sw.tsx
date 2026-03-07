"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Save, School, Mail, Info, MessageSquare, Phone } from "lucide-react"

export function ConfigView() {
  const { data, saveSchools, saveMessages } = useApp()

  const [schools, setSchools] = useState([...data.schools])
  const [messages, setMessages] = useState({ ...data.messages })

  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <span className="text-xs font-bold text-[var(--gray)] tracking-[2px] uppercase">
          CONFIGURACION
        </span>
      </div>

      {/* Schools */}
      <div className="mx-4 mb-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
        <h3 className="flex items-center gap-2 text-[15px] font-bold text-[var(--yellow)] mb-3">
          <School className="h-4 w-4" />
          Colegios
        </h3>
        {schools.map((s, i) => (
          <div key={i} className="mb-3">
            <label className="block text-[10px] font-semibold text-[var(--gray)] uppercase tracking-wide mb-1">
              Colegio {i + 1}
            </label>
            <input
              value={s}
              onChange={(e) => {
                const copy = [...schools]
                copy[i] = e.target.value
                setSchools(copy)
              }}
              className="w-full rounded-lg bg-[var(--navy3)] border-[1.5px] border-[var(--border-color)] text-[var(--foreground)] text-[15px] px-3 py-2.5 outline-none focus:border-[var(--yellow)] transition-colors"
            />
          </div>
        ))}
        <button
          onClick={() =>
            saveSchools(
              schools.map((s, i) => s.trim() || `Colegio ${i + 1}`)
            )
          }
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[var(--yellow)] py-3 text-[15px] font-bold text-[var(--navy)] active:scale-[0.97] transition-transform"
        >
          <Save className="h-4 w-4" />
          GUARDAR COLEGIOS
        </button>
      </div>

      {/* Messages */}
      <div className="mx-4 mb-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
        <h3 className="flex items-center gap-2 text-[15px] font-bold text-[var(--yellow)] mb-3">
          <Mail className="h-4 w-4" />
          Mensajes Predefinidos
        </h3>
        {(
          [
            { key: "camino" as const, label: "En Camino" },
            { key: "puerta" as const, label: "En Puerta" },
            { key: "inicio" as const, label: "Inicio de Ruta" },
            { key: "fin" as const, label: "Fin de Ruta" },
          ] as const
        ).map(({ key, label }) => (
          <div key={key} className="mb-3">
            <label className="block text-[10px] font-semibold text-[var(--gray)] uppercase tracking-wide mb-1">
              {label}
            </label>
            <textarea
              value={messages[key]}
              onChange={(e) =>
                setMessages((m) => ({ ...m, [key]: e.target.value }))
              }
              rows={2}
              className="w-full rounded-lg bg-[var(--navy3)] border-[1.5px] border-[var(--border-color)] text-[var(--foreground)] text-sm px-3 py-2.5 outline-none focus:border-[var(--yellow)] transition-colors resize-none"
            />
          </div>
        ))}
        <p className="text-[11px] text-[var(--gray)] mb-3">
          {"Variables: {apoderado} {alumno} {colegio} {furgon}"}
        </p>
        <button
          onClick={() => saveMessages(messages)}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[var(--yellow)] py-3 text-[15px] font-bold text-[var(--navy)] active:scale-[0.97] transition-transform"
        >
          <Save className="h-4 w-4" />
          GUARDAR MENSAJES
        </button>
      </div>

      {/* How it works */}
      <div className="mx-4 mb-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
        <h3 className="flex items-center gap-2 text-[15px] font-bold text-[var(--yellow)] mb-3">
          <Info className="h-4 w-4" />
          Como Funciona
        </h3>
        <div className="text-[13px] text-[var(--gray)] leading-7 space-y-3">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-[var(--green)] mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-[var(--green)]">WhatsApp:</strong> Al tocar
              &quot;En Camino&quot; o &quot;En Puerta&quot; se abre WhatsApp con el mensaje
              listo. Solo toca enviar. Al volver, la app sigue aqui tal cual la
              dejaste.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-[var(--blue)] mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-[var(--blue)]">SMS:</strong> Igual pero abre
              la app de mensajes de texto.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--yellow)] font-bold flex-shrink-0 mt-0.5 text-xs">CL</span>
            <span>
              <strong className="text-[var(--yellow)]">Telefonos:</strong> Pon solo
              912345678 y se agrega +569 automaticamente.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Save className="h-4 w-4 text-[var(--foreground)] mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-[var(--foreground)]">Datos:</strong> Todo se
              guarda automaticamente en tu dispositivo.
            </span>
          </div>
        </div>
      </div>

      {/* Install instructions */}
      <div className="mx-4 mb-6 rounded-xl border border-[var(--yellow)]/30 bg-[rgba(245,197,24,0.08)] p-4">
        <h3 className="flex items-center gap-2 text-[15px] font-bold text-[var(--yellow)] mb-3">
          <Info className="h-4 w-4" />
          Instalar como App
        </h3>
        <div className="text-[13px] text-[var(--gray)] leading-7 space-y-2">
          <p>
            <strong className="text-[var(--foreground)]">iPhone/iPad:</strong> Abre
            en Safari, toca el boton Compartir (cuadrado con flecha) y selecciona
            &quot;Agregar a pantalla de inicio&quot;.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Android:</strong> Abre en
            Chrome, toca el menu (3 puntos) y selecciona &quot;Agregar a pantalla de
            inicio&quot; o &quot;Instalar app&quot;.
          </p>
        </div>
      </div>
    </div>
  )
}
