"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Car, Calendar, Clock, CheckCircle, ArrowRight, MessageCircle, X, Pencil, Phone } from "lucide-react"
import { formatDate, formatPrice, getStatusColor, getStatusLabel, generateWhatsAppMessage, getWhatsAppUrl } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { BookingWithCar } from "@/types"
import { useSettings } from "@/components/providers/SettingsProvider"

interface UserDashboardProps {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; phone?: string | null }
  bookings: BookingWithCar[]
}

export function UserDashboard({ user, bookings }: UserDashboardProps) {
  const router = useRouter()
  const { currency, currencyLocale, whatsappNumber } = useSettings()
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState(user.name ?? "")
  const [editPhone, setEditPhone] = useState(user.phone ?? "")
  const [saving, setSaving] = useState(false)

  const pending = bookings.filter((b) => b.status === "PENDING").length
  const approved = bookings.filter((b) => b.status === "APPROVED").length

  const handleCancel = async (id: string) => {
    setCancelingId(id)
    await fetch(`/api/bookings/${id}`, { method: "PATCH" })
    setCancelingId(null)
    setConfirmCancelId(null)
    router.refresh()
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, phone: editPhone }),
    })
    setSaving(false)
    setEditOpen(false)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-neo-surface pt-20">
      <div className="max-w-4xl mx-auto px-5 py-10">

        {/* Header profil */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            {user.image
              ? <Image src={user.image} alt="" width={48} height={48} className="rounded-2xl" />
              : <div className="w-12 h-12 bg-neo-green rounded-2xl flex items-center justify-center text-lg font-bold text-white">{user.name?.[0]}</div>}
            <div>
              <h1 className="text-xl font-bold text-neo-text">Salut, {user.name?.split(" ")[0]}</h1>
              <p className="text-sm text-neo-muted">{user.email}</p>
              {user.phone && (
                <p className="text-xs text-neo-light flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />{user.phone}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-neo-border text-neo-muted hover:text-neo-text transition-colors"
          >
            <Pencil className="w-3 h-3" /> Modifier le profil
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-14">
          {[
            { icon: Calendar, label: "Total", value: bookings.length },
            { icon: Clock, label: "En attente", value: pending },
            { icon: CheckCircle, label: "Approuvées", value: approved },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 text-center border border-neo-border">
              <s.icon className="w-5 h-5 text-neo-green mx-auto mb-2" />
              <p className="text-3xl font-bold text-neo-text">{s.value}</p>
              <p className="text-[10px] text-neo-light font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Liste réservations */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neo-light">Mes réservations</h2>
          <Link href="/cars" className="group flex items-center gap-1 text-xs font-semibold text-neo-green hover:text-neo-green-dark transition-colors">
            Nouvelle <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neo-border">
            <Car className="w-8 h-8 text-neo-border mx-auto mb-3" />
            <p className="text-neo-muted mb-5 text-sm">Aucune réservation</p>
            <Link href="/cars" className="btn-primary text-xs">Parcourir les véhicules</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b, i) => {
              const waUrl = getWhatsAppUrl(generateWhatsAppMessage({ carName: b.car.name, startDate: new Date(b.startDate), endDate: new Date(b.endDate), totalPrice: Number(b.totalPrice) }, currency, currencyLocale), whatsappNumber)
              return (
                <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="bg-white rounded-2xl border border-neo-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-10 bg-neo-surface rounded-xl overflow-hidden relative shrink-0">
                      {Array.isArray(b.car.images) && b.car.images[0] && <Image src={b.car.images[0] as string} alt="" fill className="object-cover" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neo-text">{b.car.name}</p>
                      <p className="text-xs text-neo-muted">{formatDate(b.startDate)} → {formatDate(b.endDate)} · {formatPrice(b.totalPrice, currency, currencyLocale)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("badge text-[10px]", getStatusColor(b.status))}>{getStatusLabel(b.status)}</span>
                    {b.status === "PENDING" && (
                      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-semibold text-[#25D366] px-2.5 py-1.5 border border-[#25D366]/30 rounded-lg hover:bg-[#25D366]/10 transition-colors">
                        <MessageCircle className="w-3 h-3" />WA
                      </a>
                    )}
                    {b.status === "PENDING" && (
                      confirmCancelId === b.id ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-neo-muted">Confirmer ?</span>
                          <button onClick={() => handleCancel(b.id)} disabled={cancelingId === b.id} className="text-[10px] font-semibold px-2.5 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
                            {cancelingId === b.id ? "…" : "Oui"}
                          </button>
                          <button onClick={() => setConfirmCancelId(null)} className="text-[10px] font-semibold px-2.5 py-1.5 border border-neo-border text-neo-muted rounded-lg">
                            Non
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmCancelId(b.id)} className="flex items-center gap-1 text-[10px] font-semibold text-red-500 px-2.5 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                          <X className="w-3 h-3" /> Annuler
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal édition profil */}
      <AnimatePresence>
        {editOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}>
            <motion.div initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} className="bg-white rounded-3xl border border-neo-border w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-neo-text">Modifier le profil</h2>
                <button onClick={() => setEditOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-neo-surface transition-colors">
                  <X className="w-4 h-4 text-neo-muted" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-1.5 block">Nom complet</label>
                  <input className="input-field text-xs w-full" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Votre nom" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-1.5 block">Téléphone</label>
                  <input className="input-field text-xs w-full" type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+261 34 00 000 00" />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setEditOpen(false)} className="flex-1 text-xs font-semibold px-4 py-2.5 rounded-xl border border-neo-border text-neo-muted hover:text-neo-text transition-colors">
                  Annuler
                </button>
                <button onClick={handleSaveProfile} disabled={saving} className="flex-1 text-xs font-semibold px-4 py-2.5 rounded-xl bg-neo-text text-white hover:opacity-80 disabled:opacity-50 transition-all">
                  {saving ? "Sauvegarde…" : "Enregistrer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
