"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, ArrowRight, SlidersHorizontal, X } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useSettings } from "@/components/providers/SettingsProvider"

interface CarsGridProps { cars: any[] }

const transmissions = ["ALL", "AUTOMATIC", "MANUAL"]

export function CarsGrid({ cars }: CarsGridProps) {
  const [selectedType, setSelectedType] = useState("ALL")
  const [selectedTransmission, setSelectedTransmission] = useState("ALL")
  const [showFilters, setShowFilters] = useState(false)
  const { currency, currencyLocale } = useSettings()

  const maxCarPrice = useMemo(
    () => Math.max(...cars.map((c: any) => Number(c.pricePerDay)), 0),
    [cars]
  )
  const [maxPrice, setMaxPrice] = useState(() =>
    Math.max(...cars.map((c: any) => Number(c.pricePerDay)), 0)
  )

  // Catégories dérivées des voitures réelles, triées alphabétiquement
  const carTypes = useMemo(() => {
    const types = Array.from(new Set(cars.map((c: any) => c.type as string))).sort()
    return ["ALL", ...types]
  }, [cars])

  // Nombre de voitures par type (sans tenir compte du filtre type)
  const countByType = useMemo(() => {
    const counts: Record<string, number> = { ALL: cars.length }
    cars.forEach((c: any) => {
      counts[c.type] = (counts[c.type] || 0) + 1
    })
    return counts
  }, [cars])

  const filtered = useMemo(() => {
    return cars.filter((car: any) => {
      if (selectedType !== "ALL" && car.type !== selectedType) return false
      if (selectedTransmission !== "ALL" && car.transmission !== selectedTransmission) return false
      if (Number(car.pricePerDay) > maxPrice) return false
      return true
    })
  }, [cars, selectedType, selectedTransmission, maxPrice])

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {carTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border transition-all",
              selectedType === type
                ? "bg-neo-text text-white border-neo-text"
                : "border-neo-border text-neo-muted hover:border-neo-text hover:text-neo-text"
            )}
          >
            {type === "ALL" ? "Tous" : type}
            <span className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
              selectedType === type ? "bg-white/20 text-white" : "bg-neo-surface text-neo-light"
            )}>
              {countByType[type] ?? 0}
            </span>
          </button>
        ))}
        <button onClick={() => setShowFilters(!showFilters)} className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-neo-muted hover:text-neo-text transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filtres
        </button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8 p-5 bg-neo-surface rounded-2xl border border-neo-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-neo-muted mb-2 block">Transmission</label>
              <div className="flex gap-2">
                {transmissions.map((t) => (
                  <button key={t} onClick={() => setSelectedTransmission(t)}
                    className={cn("text-xs font-semibold px-4 py-2 rounded-full border transition-all",
                      selectedTransmission === t ? "bg-neo-text text-white border-neo-text" : "border-neo-border text-neo-muted hover:border-neo-text"
                    )}>
                    {t === "ALL" ? "Toutes" : t === "AUTOMATIC" ? "Auto" : "Manuel"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-neo-muted mb-2 block">Max : {formatPrice(maxPrice, currency, currencyLocale)}/j</label>
              <input type="range" min={50} max={maxCarPrice} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-neo-green" />
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-xs text-neo-light mb-6">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neo-muted mb-4">Aucun véhicule trouvé</p>
          <button onClick={() => { setSelectedType("ALL"); setSelectedTransmission("ALL"); setMaxPrice(maxCarPrice) }} className="text-xs font-semibold text-neo-text hover:underline flex items-center gap-1 mx-auto">
            <X className="w-3 h-3" /> Réinitialiser
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car: any, i: number) => (
            <motion.div key={car.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
              <Link href={`/cars/${car.id}`} className="group block card">
                <div className="relative aspect-[16/10] bg-neo-surface">
                  {car.images?.[0] && <Image src={car.images[0]} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />}
                  <div className="absolute top-3 right-3">
                    <span className={cn("badge text-[10px]", car.available ? "bg-neo-green-light text-neo-green-dark" : "bg-red-50 text-red-500")}>
                      {car.available ? "Dispo" : "Indispo"}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs text-neo-light font-medium">{car.brand} · {car.year}</p>
                      <h2 className="text-base font-bold text-neo-text group-hover:text-neo-green transition-colors">{car.name}</h2>
                    </div>
                    <p className="text-lg font-bold text-neo-text shrink-0">{formatPrice(car.pricePerDay, currency, currencyLocale)}<span className="text-xs text-neo-light font-normal">/j</span></p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neo-muted">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{car.seats}</span>
                    <span>{car.transmission === "AUTOMATIC" ? "Auto" : "Manuelle"}</span>
                    <span>{car.fuel}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-neo-green opacity-0 group-hover:opacity-100 transition-opacity">
                    Voir <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
