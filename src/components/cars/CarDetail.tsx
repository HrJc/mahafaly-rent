"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Zap, Fuel, ArrowLeft, Check } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { BookingForm } from "@/components/booking/BookingForm"
import { cn } from "@/lib/utils"
import { useSettings } from "@/components/providers/SettingsProvider"

interface CarDetailProps { car: any }

export function CarDetail({ car }: CarDetailProps) {
  const [activeImage, setActiveImage] = useState(0)
  const { currency, currencyLocale } = useSettings()

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-5 py-6">
        <Link href="/cars" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neo-muted hover:text-neo-text transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Retour
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="relative aspect-[16/10] bg-neo-surface rounded-3xl overflow-hidden mb-3">
              {car.images?.[activeImage] && <Image src={car.images[activeImage]} alt={car.name} fill className="object-cover" priority />}
            </div>
            {car.images?.length > 1 && (
              <div className="flex gap-2">
                {car.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={cn("relative flex-1 aspect-[16/10] rounded-xl overflow-hidden transition-all", activeImage === i ? "ring-2 ring-neo-green" : "opacity-40 hover:opacity-70")}>
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-col">
            <div className="flex items-center gap-2 text-xs text-neo-light font-medium mb-3">
              <span>{car.brand}</span><span className="text-neo-border">·</span><span>{car.type}</span><span className="text-neo-border">·</span><span>{car.year}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-neo-text tracking-tight mb-4">{car.name}</h1>
            <div className="flex items-baseline gap-1.5 mb-8">
              <span className="text-3xl font-bold text-neo-text">{formatPrice(car.pricePerDay, currency, currencyLocale)}</span>
              <span className="text-sm text-neo-light">/ jour</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Users, label: "Places", value: car.seats },
                { icon: Zap, label: "Boîte", value: car.transmission === "AUTOMATIC" ? "Auto" : "Manuelle" },
                { icon: Fuel, label: "Carburant", value: car.fuel },
              ].map((s) => (
                <div key={s.label} className="bg-neo-surface rounded-2xl p-4 text-center">
                  <s.icon className="w-4 h-4 text-neo-green mx-auto mb-2" />
                  <p className="text-sm font-semibold text-neo-text">{s.value}</p>
                  <p className="text-[10px] text-neo-light font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-neo-muted leading-relaxed mb-8">{car.description}</p>

            {car.features?.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold text-neo-light uppercase tracking-wider mb-3">Équipements</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {car.features.map((f: string) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-neo-muted">
                      <Check className="w-3.5 h-3.5 text-neo-green shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <span className={cn("badge text-xs", car.available ? "bg-neo-green-light text-neo-green-dark" : "bg-red-50 text-red-500")}>
                <span className={cn("w-1.5 h-1.5 rounded-full", car.available ? "bg-neo-green" : "bg-red-500")} />
                {car.available ? "Disponible" : "Indisponible"}
              </span>
            </div>

            {car.available && <BookingForm car={car} />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
