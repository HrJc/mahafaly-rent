"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Car } from "@/types"

interface CarFormModalProps {
  car?: Car | null
  onClose: () => void
  onSave: () => void
}

interface FormState {
  name: string
  brand: string
  model: string
  year: number
  pricePerDay: string
  transmission: "MANUAL" | "AUTOMATIC"
  seats: number
  type: string
  fuel: string
  images: string[]
  description: string
  features: string[]
  available: boolean
}

const EMPTY: FormState = {
  name: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  pricePerDay: "",
  transmission: "MANUAL",
  seats: 5,
  type: "",
  fuel: "Essence",
  images: [""],
  description: "",
  features: [""],
  available: true,
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-1.5 block">
      {children}
    </label>
  )
}

export function CarFormModal({ car, onClose, onSave }: CarFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [availableTypes, setAvailableTypes] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/admin/types")
      .then((r) => r.json())
      .then((data: { id: string; name: string }[]) => {
        const names = data.map((t) => t.name)
        setAvailableTypes(names)
        // Définir le premier type par défaut si le form est vide
        setForm((f) => ({ ...f, type: f.type || names[0] || "" }))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (car) {
      setForm({
        name: car.name,
        brand: car.brand,
        model: car.model,
        year: car.year,
        pricePerDay: String(car.pricePerDay),
        transmission: car.transmission as "MANUAL" | "AUTOMATIC",
        seats: car.seats,
        type: car.type as FormState["type"],
        fuel: car.fuel,
        images: Array.isArray(car.images) && car.images.length > 0 ? (car.images as string[]) : [""],
        description: car.description,
        features: Array.isArray(car.features) && car.features.length > 0 ? (car.features as string[]) : [""],
        available: car.available,
      })
    } else {
      setForm(EMPTY)
    }
  }, [car])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const setListItem = (key: "images" | "features", index: number, value: string) =>
    setForm((f) => {
      const next = [...f[key]]
      next[index] = value
      return { ...f, [key]: next }
    })

  const addListItem = (key: "images" | "features") =>
    setForm((f) => ({ ...f, [key]: [...f[key], ""] }))

  const removeListItem = (key: "images" | "features", index: number) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }))

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.brand.trim() || !form.model.trim() || !form.pricePerDay) {
      setError("Nom, marque, modèle et prix sont obligatoires.")
      return
    }
    setSaving(true)
    setError("")

    const payload = {
      ...form,
      year: Number(form.year),
      pricePerDay: Number(form.pricePerDay),
      seats: Number(form.seats),
      images: form.images.filter(Boolean),
      features: form.features.filter(Boolean),
    }

    const url = car ? `/api/admin/cars/${car.id}` : "/api/admin/cars"
    const method = car ? "PATCH" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        onSave()
      } else {
        const data = await res.json()
        setError(data.message || "Erreur lors de la sauvegarde.")
      }
    } catch {
      setError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-neo-border w-full max-w-2xl my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neo-border">
            <h2 className="text-sm font-bold text-neo-text">
              {car ? "Modifier le véhicule" : "Ajouter un véhicule"}
            </h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-neo-surface transition-colors">
              <X className="w-4 h-4 text-neo-muted" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">

            {/* Informations de base */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neo-light mb-3">Informations de base</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Nom complet *</Label>
                  <input className="input-field text-xs w-full" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Mercedes-Benz S-Class" />
                </div>
                <div>
                  <Label>Marque *</Label>
                  <input className="input-field text-xs w-full" value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Mercedes-Benz" />
                </div>
                <div>
                  <Label>Modèle *</Label>
                  <input className="input-field text-xs w-full" value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="S-Class" />
                </div>
                <div>
                  <Label>Année</Label>
                  <input className="input-field text-xs w-full" type="number" min={1990} max={2030} value={form.year} onChange={(e) => set("year", Number(e.target.value))} />
                </div>
                <div>
                  <Label>Prix / jour *</Label>
                  <input className="input-field text-xs w-full" type="number" min={0} step="0.01" value={form.pricePerDay} onChange={(e) => set("pricePerDay", e.target.value)} placeholder="250" />
                </div>
              </div>
            </div>

            {/* Caractéristiques */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neo-light mb-3">Caractéristiques</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <select
                    className="input-field text-xs w-full"
                    value={form.type}
                    onChange={(e) => set("type", e.target.value)}
                    disabled={availableTypes.length === 0}
                  >
                    {availableTypes.length === 0 && <option value="">Chargement…</option>}
                    {availableTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Transmission</Label>
                  <select className="input-field text-xs w-full" value={form.transmission} onChange={(e) => set("transmission", e.target.value as FormState["transmission"])}>
                    <option value="MANUAL">Manuelle</option>
                    <option value="AUTOMATIC">Automatique</option>
                  </select>
                </div>
                <div>
                  <Label>Places</Label>
                  <input className="input-field text-xs w-full" type="number" min={1} max={20} value={form.seats} onChange={(e) => set("seats", Number(e.target.value))} />
                </div>
                <div>
                  <Label>Carburant</Label>
                  <input className="input-field text-xs w-full" value={form.fuel} onChange={(e) => set("fuel", e.target.value)} placeholder="Essence, Diesel, Électrique…" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neo-light mb-3">Description</p>
              <textarea
                className="input-field text-xs w-full resize-none"
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Décrivez le véhicule…"
              />
            </div>

            {/* Images */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neo-light mb-3">Images (URLs)</p>
              <div className="space-y-2">
                {form.images.map((url, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="input-field text-xs flex-1"
                      value={url}
                      onChange={(e) => setListItem("images", i, e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                    />
                    {form.images.length > 1 && (
                      <button onClick={() => removeListItem("images", i)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-neo-border text-neo-muted hover:text-red-500 hover:border-red-200 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => addListItem("images")} className="flex items-center gap-1.5 text-[10px] font-semibold text-neo-muted hover:text-neo-text transition-colors">
                  <Plus className="w-3 h-3" /> Ajouter une image
                </button>
              </div>
            </div>

            {/* Équipements */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neo-light mb-3">Équipements</p>
              <div className="space-y-2">
                {form.features.map((feat, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="input-field text-xs flex-1"
                      value={feat}
                      onChange={(e) => setListItem("features", i, e.target.value)}
                      placeholder="GPS, Climatisation, Bluetooth…"
                    />
                    {form.features.length > 1 && (
                      <button onClick={() => removeListItem("features", i)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-neo-border text-neo-muted hover:text-red-500 hover:border-red-200 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => addListItem("features")} className="flex items-center gap-1.5 text-[10px] font-semibold text-neo-muted hover:text-neo-text transition-colors">
                  <Plus className="w-3 h-3" /> Ajouter un équipement
                </button>
              </div>
            </div>

            {/* Disponibilité */}
            <div className="flex items-center justify-between py-3 px-4 bg-neo-surface rounded-2xl">
              <div>
                <p className="text-xs font-semibold text-neo-text">Disponible à la location</p>
                <p className="text-[10px] text-neo-light mt-0.5">Le véhicule apparaît dans le catalogue</p>
              </div>
              <button
                onClick={() => set("available", !form.available)}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors",
                  form.available ? "bg-neo-text" : "bg-neo-border"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                  form.available ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neo-border">
            <button onClick={onClose} className="text-xs font-semibold px-4 py-2 rounded-xl border border-neo-border text-neo-muted hover:text-neo-text transition-colors">
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="text-xs font-semibold px-5 py-2 rounded-xl bg-neo-text text-white hover:opacity-80 disabled:opacity-50 transition-all"
            >
              {saving ? "Sauvegarde…" : car ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
