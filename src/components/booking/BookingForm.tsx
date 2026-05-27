"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ArrowRight, MessageCircle, AlertCircle } from "lucide-react"
import { calculateDays, calculateTotalPrice, formatPrice, generateWhatsAppMessage, getWhatsAppUrl } from "@/lib/utils"
import { useSettings } from "@/components/providers/SettingsProvider"

const bookingSchema = z.object({
  startDate: z.string().min(1, "Date requise"),
  endDate: z.string().min(1, "Date requise"),
}).refine((d) => new Date(d.endDate) > new Date(d.startDate), { message: "Fin après début", path: ["endDate"] })

type FormData = z.infer<typeof bookingSchema>
interface BookingFormProps { car: any }

export function BookingForm({ car }: BookingFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { currency, currencyLocale, whatsappNumber } = useSettings()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const today = new Date().toISOString().split("T")[0]

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(bookingSchema) })
  const startDate = watch("startDate")
  const endDate = watch("endDate")
  const days = startDate && endDate ? calculateDays(new Date(startDate), new Date(endDate)) : 0
  const total = days > 0 ? calculateTotalPrice(Number(car.pricePerDay), new Date(startDate), new Date(endDate)) : 0

  const onSubmit = async (data: FormData) => {
    if (!session) { router.push(`/login?callbackUrl=/cars/${car.id}`); return }
    setLoading(true); setError(null)
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carId: car.id, startDate: data.startDate, endDate: data.endDate }) })
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Erreur") }
      const booking = await res.json()
      setBookingData({ ...booking, carName: car.name, totalPrice: Number(booking.totalPrice) })
      setSuccess(true)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Erreur") } finally { setLoading(false) }
  }

  if (success && bookingData) {
    const waUrl = getWhatsAppUrl(generateWhatsAppMessage({ carName: car.name, startDate: new Date(bookingData.startDate), endDate: new Date(bookingData.endDate), totalPrice: bookingData.totalPrice }, currency, currencyLocale), whatsappNumber)
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-neo-green-light border border-neo-green/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-neo-green rounded-xl flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div>
          <div><h3 className="text-sm font-bold text-neo-text">Réservation envoyée !</h3><p className="text-xs text-neo-muted">Confirmation sous 24h</p></div>
        </div>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-sm font-semibold rounded-2xl hover:bg-[#22c55e] transition-colors">
          <MessageCircle className="w-4 h-4 fill-white" /> WhatsApp
        </a>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-neo-light">Réserver</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-semibold text-neo-muted mb-1 block">Début</label>
          <input type="date" min={today} {...register("startDate")} className="input-field" />
          {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="text-[10px] font-semibold text-neo-muted mb-1 block">Fin</label>
          <input type="date" min={startDate || today} {...register("endDate")} className="input-field" />
          {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate.message}</p>}
        </div>
      </div>
      <AnimatePresence>
        {days > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-neo-surface rounded-2xl p-4">
            <div className="flex justify-between text-sm text-neo-muted mb-2"><span>{formatPrice(Number(car.pricePerDay), currency, currencyLocale)} × {days}j</span><span>{formatPrice(total, currency, currencyLocale)}</span></div>
            <div className="border-t border-neo-border pt-2 flex justify-between"><span className="text-sm font-semibold text-neo-text">Total</span><span className="text-xl font-bold text-neo-text">{formatPrice(total, currency, currencyLocale)}</span></div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <div className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-50 rounded-2xl"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />En cours...</span>
          : <>{session ? "Réserver" : "Se connecter pour réserver"}<ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  )
}
