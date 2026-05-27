"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Check, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VehicleCategory {
  id: string
  name: string
  createdAt: string
}

export function TypesPanel() {
  const [types, setTypes] = useState<VehicleCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editError, setEditError] = useState("")
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  const fetchTypes = async () => {
    const res = await fetch("/api/admin/types")
    if (res.ok) setTypes(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchTypes() }, [])
  useEffect(() => { if (editId) editInputRef.current?.focus() }, [editId])

  const handleAdd = async () => {
    if (!newName.trim()) return
    setAdding(true)
    setAddError("")
    const res = await fetch("/api/admin/types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    })
    if (res.ok) {
      setNewName("")
      fetchTypes()
    } else {
      const d = await res.json()
      setAddError(d.message || "Erreur")
    }
    setAdding(false)
  }

  const startEdit = (type: VehicleCategory) => {
    setEditId(type.id)
    setEditName(type.name)
    setEditError("")
    setDeleteError(null)
    setConfirmDeleteId(null)
  }

  const handleRename = async (id: string) => {
    if (!editName.trim()) return
    setEditError("")
    const res = await fetch(`/api/admin/types/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    })
    if (res.ok) {
      setEditId(null)
      fetchTypes()
    } else {
      const d = await res.json()
      setEditError(d.message || "Erreur")
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setDeleteError(null)
    const res = await fetch(`/api/admin/types/${id}`, { method: "DELETE" })
    if (res.ok) {
      setConfirmDeleteId(null)
      fetchTypes()
    } else {
      const d = await res.json()
      setDeleteError(d.message || "Erreur")
      setConfirmDeleteId(null)
    }
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-neo-border p-10 text-center text-xs text-neo-muted">
        Chargement…
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="bg-white rounded-2xl border border-neo-border overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-neo-border flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-neo-text">Types de véhicules</p>
            <p className="text-[10px] text-neo-light mt-0.5">{types.length} type{types.length !== 1 ? "s" : ""} · utilisés dans le catalogue et le formulaire d&apos;ajout</p>
          </div>
        </div>

        {/* Error banner */}
        {deleteError && (
          <div className="mx-5 mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {deleteError}
            <button onClick={() => setDeleteError(null)} className="ml-auto"><X className="w-3 h-3" /></button>
          </div>
        )}

        {/* List */}
        <div className="divide-y divide-neo-border/50">
          {types.map((type) => (
            <div key={type.id} className="flex items-center gap-3 px-5 py-3 hover:bg-neo-surface/40 transition-colors">

              {editId === type.id ? (
                /* Inline edit */
                <div className="flex items-center gap-2 flex-1">
                  <input
                    ref={editInputRef}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleRename(type.id); if (e.key === "Escape") setEditId(null) }}
                    className="input-field text-xs flex-1 py-1.5"
                  />
                  {editError && <span className="text-[10px] text-red-500">{editError}</span>}
                  <button onClick={() => handleRename(type.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-neo-text text-white hover:opacity-80">
                    <Check className="w-3 h-3" />
                  </button>
                  <button onClick={() => setEditId(null)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-neo-border text-neo-muted hover:text-neo-text">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                /* Normal row */
                <>
                  <span className="badge text-[10px] bg-neo-surface text-neo-text border border-neo-border flex-1">
                    {type.name}
                  </span>

                  {confirmDeleteId === type.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neo-muted">Confirmer ?</span>
                      <button
                        onClick={() => handleDelete(type.id)}
                        disabled={deletingId === type.id}
                        className="text-[10px] font-semibold px-2.5 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                      >
                        {deletingId === type.id ? "…" : "Oui"}
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className="text-[10px] font-semibold px-2.5 py-1.5 border border-neo-border text-neo-muted rounded-lg hover:text-neo-text">
                        Non
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => startEdit(type)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-neo-border text-neo-muted hover:text-neo-text hover:border-neo-text transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => { setConfirmDeleteId(type.id); setDeleteError(null) }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-neo-border text-neo-muted hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {types.length === 0 && (
            <p className="px-5 py-8 text-center text-xs text-neo-light">Aucun type · ajoutez-en un ci-dessous</p>
          )}
        </div>

        {/* Add form */}
        <div className={cn("px-5 py-4 border-t border-neo-border bg-neo-surface/40")}>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-2">Ajouter un type</p>
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setAddError("") }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Ex : PICKUP, MINIVAN…"
              className="input-field text-xs flex-1"
            />
            <button
              onClick={handleAdd}
              disabled={adding || !newName.trim()}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-neo-text text-white rounded-xl hover:opacity-80 disabled:opacity-40 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              {adding ? "…" : "Ajouter"}
            </button>
          </div>
          {addError && <p className="text-[10px] text-red-500 mt-1.5">{addError}</p>}
        </div>
      </div>
    </motion.div>
  )
}
