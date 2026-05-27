"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Car, Calendar, Clock, CheckCircle, ArrowRight, MessageCircle } from "lucide-react"
import { formatDate, formatPrice, getStatusColor, getStatusLabel, generateWhatsAppMessage, getWhatsAppUrl } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { BookingWithCar } from "@/types"
import { useSettings } from "@/components/providers/SettingsProvider"

interface UserDashboardProps {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null }
  bookings: BookingWithCar[]
}

export function UserDashboard({ user, bookings }: UserDashboardProps) {
  const { currency, currencyLocale, whatsappNumber } = useSettings()
  const pending = bookings.filter((b) => b.status === "PENDING").length
  const approved = bookings.filter((b) => b.status === "APPROVED").length

  return (
    <div className="min-h-screen bg-neo-surface pt-20">
      <div className="max-w-4xl mx-auto px-5 py-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-12">
          {user.image ? <Image src={user.image} alt="" width={48} height={48} className="rounded-2xl" /> : <div className="w-12 h-12 bg-neo-green rounded-2xl flex items-center justify-center text-lg font-bold text-white">{user.name?.[0]}</div>}
          <div><h1 className="text-xl font-bold text-neo-text">Salut, {user.name?.split(" ")[0]}</h1><p className="text-sm text-neo-muted">{user.email}</p></div>
        </motion.div>

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

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neo-light">Mes réservations</h2>
          <Link href="/cars" className="group flex items-center gap-1 text-xs font-semibold text-neo-green hover:text-neo-green-dark transition-colors">Nouvelle <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></Link>
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
                      <p className="text-xs text-neo-muted">{formatDate(b.startDate)} &rarr; {formatDate(b.endDate)} · {formatPrice(b.totalPrice, currency, currencyLocale)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("badge text-[10px]", getStatusColor(b.status))}>{getStatusLabel(b.status)}</span>
                    {b.status === "PENDING" && <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-semibold text-[#25D366] px-2.5 py-1.5 border border-[#25D366]/30 rounded-lg hover:bg-[#25D366]/10 transition-colors"><MessageCircle className="w-3 h-3" />WA</a>}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
