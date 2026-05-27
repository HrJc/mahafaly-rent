"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Car, Users, TrendingUp, Clock, CheckCircle, BarChart2, Settings, Plus, Pencil, Trash2 } from "lucide-react"
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { BookingWithUser, Car as CarType } from "@/types"
import type { DashboardStats } from "@/types"
import { SettingsPanel } from "@/components/dashboard/SettingsPanel"
import { CarFormModal } from "@/components/dashboard/CarFormModal"
import { TypesPanel } from "@/components/dashboard/TypesPanel"
import { useSettings } from "@/components/providers/SettingsProvider"

interface AdminDashboardProps {
  stats: DashboardStats
  bookings: BookingWithUser[]
  cars: CarType[]
}

export function AdminDashboard({ stats, bookings, cars }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"bookings" | "types" | "cars" | "settings">("bookings")
  const [updating, setUpdating] = useState<string | null>(null)
  const [carModal, setCarModal] = useState<{ open: boolean; car: CarType | null }>({ open: false, car: null })
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const { currency, currencyLocale } = useSettings()

  const updateBookingStatus = useCallback(async (id: string, status: string) => {
    setUpdating(id)
    await fetch(`/api/admin/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    setUpdating(null)
    router.refresh()
  }, [router])

  const handleDeleteCar = useCallback(async (id: string) => {
    setDeleting(id)
    await fetch(`/api/admin/cars/${id}`, { method: "DELETE" })
    setDeleting(null)
    setConfirmDeleteId(null)
    router.refresh()
  }, [router])

  const openCreate = () => setCarModal({ open: true, car: null })
  const openEdit = (car: CarType) => setCarModal({ open: true, car })
  const closeModal = () => setCarModal({ open: false, car: null })
  const onSaved = () => { closeModal(); router.refresh() }

  return (
    <div className="min-h-screen bg-neo-surface pt-20">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <h1 className="text-2xl font-bold text-neo-text mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {[
            { icon: BarChart2, label: "Réservations", value: stats.totalBookings },
            { icon: Clock, label: "En attente", value: stats.pendingBookings },
            { icon: CheckCircle, label: "Approuvées", value: stats.approvedBookings },
            { icon: TrendingUp, label: "Revenus", value: formatPrice(stats.totalRevenue, currency, currencyLocale) },
            { icon: Car, label: "Véhicules", value: stats.totalCars },
            { icon: Users, label: "Dispos", value: stats.availableCars },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 text-center border border-neo-border">
              <s.icon className="w-4 h-4 text-neo-green mx-auto mb-2" />
              <p className="text-xl font-bold text-neo-text">{s.value}</p>
              <p className="text-[10px] text-neo-light font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl border border-neo-border p-1 w-fit">
          {(["bookings", "types", "cars", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-5 py-2 rounded-xl transition-all",
                activeTab === tab ? "bg-neo-text text-white" : "text-neo-muted hover:text-neo-text"
              )}
            >
              {tab === "settings" && <Settings className="w-3 h-3" />}
              {tab === "bookings" ? "Réservations" : tab === "types" ? "Types" : tab === "cars" ? "Véhicules" : "Paramètres"}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {activeTab === "bookings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-neo-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neo-border">
                    {["Client", "Véhicule", "Dates", "Total", "Statut", "Actions"].map((h) => (
                      <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-neo-light px-5 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-neo-border/50 hover:bg-neo-surface/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          {b.user.image && <Image src={b.user.image} alt="" width={24} height={24} className="rounded-lg" />}
                          <div>
                            <p className="text-xs font-semibold text-neo-text">{b.user.name}</p>
                            <p className="text-[10px] text-neo-light">{b.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-neo-muted">{b.car.name}</td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-neo-muted">{formatDate(b.startDate)}</p>
                        <p className="text-[10px] text-neo-light">{formatDate(b.endDate)}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-neo-text">{formatPrice(b.totalPrice, currency, currencyLocale)}</td>
                      <td className="px-5 py-4">
                        <span className={cn("badge text-[10px]", getStatusColor(b.status))}>{getStatusLabel(b.status)}</span>
                      </td>
                      <td className="px-5 py-4">
                        {b.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button onClick={() => updateBookingStatus(b.id, "APPROVED")} disabled={updating === b.id} className="text-[10px] font-semibold px-3 py-1.5 bg-neo-green-light text-neo-green-dark rounded-lg hover:bg-neo-green/20 transition-colors disabled:opacity-50">OK</button>
                            <button onClick={() => updateBookingStatus(b.id, "CANCELLED")} disabled={updating === b.id} className="text-[10px] font-semibold px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50">Non</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Types */}
        {activeTab === "types" && <TypesPanel />}

        {/* Settings */}
        {activeTab === "settings" && <SettingsPanel />}

        {/* Cars */}
        {activeTab === "cars" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header with Add button */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neo-light">
                {cars.length} véhicule{cars.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={openCreate}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-neo-text text-white rounded-xl hover:opacity-80 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter un véhicule
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-neo-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neo-border">
                      {["Véhicule", "Type", "Prix/j", "Dispo", "Actions"].map((h) => (
                        <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-neo-light px-5 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr key={car.id} className="border-b border-neo-border/50 hover:bg-neo-surface/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-9 bg-neo-surface rounded-lg overflow-hidden relative shrink-0">
                              {Array.isArray(car.images) && car.images[0] && (
                                <Image src={car.images[0] as string} alt={car.name} fill className="object-cover" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-neo-text">{car.name}</p>
                              <p className="text-[10px] text-neo-light">{car.brand} · {car.year}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="badge text-[10px] bg-neo-surface text-neo-text border border-neo-border">
                            {car.type}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs font-semibold text-neo-text">
                          {formatPrice(car.pricePerDay, currency, currencyLocale)}
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn("badge text-[10px]", car.available ? "bg-neo-green-light text-neo-green-dark" : "bg-red-50 text-red-500")}>
                            {car.available ? "Dispo" : "Indispo"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {confirmDeleteId === car.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-neo-muted">Confirmer ?</span>
                              <button
                                onClick={() => handleDeleteCar(car.id)}
                                disabled={deleting === car.id}
                                className="text-[10px] font-semibold px-2.5 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                              >
                                {deleting === car.id ? "…" : "Oui"}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-[10px] font-semibold px-2.5 py-1.5 border border-neo-border text-neo-muted rounded-lg hover:text-neo-text transition-colors"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEdit(car)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-neo-border text-neo-muted hover:text-neo-text hover:border-neo-text transition-colors"
                                title="Modifier"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(car.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg border border-neo-border text-neo-muted hover:text-red-500 hover:border-red-200 transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {cars.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-xs text-neo-light">
                          Aucun véhicule · <button onClick={openCreate} className="font-semibold text-neo-text hover:underline">Ajouter le premier</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal Create / Edit */}
      {carModal.open && (
        <CarFormModal
          car={carModal.car}
          onClose={closeModal}
          onSave={onSaved}
        />
      )}
    </div>
  )
}
