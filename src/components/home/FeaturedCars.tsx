"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Users } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useSettings } from "@/components/providers/SettingsProvider"

interface FeaturedCarsProps {
  cars: any[]
}

export function FeaturedCars({ cars }: FeaturedCarsProps) {
  const { currency, currencyLocale } = useSettings()
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-label mb-3">Populaires</p>
            <h2 className="section-title">Nos véhicules</h2>
          </div>
          <Link href="/cars" className="group flex items-center gap-1.5 text-sm font-semibold text-neo-green hover:text-neo-green-dark transition-colors shrink-0">
            Tout voir <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car: any, i: number) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link href={`/cars/${car.id}`} className="group block card">
                <div className="relative aspect-[16/10] bg-neo-surface">
                  {car.images?.[0] && (
                    <Image src={car.images[0]} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="badge bg-white/90 text-neo-text font-semibold">{car.type}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs text-neo-light font-medium mb-0.5">{car.brand}</p>
                      <h3 className="text-base font-bold text-neo-text group-hover:text-neo-green transition-colors">{car.name}</h3>
                    </div>
                    <p className="text-lg font-bold text-neo-text shrink-0">
                      {formatPrice(car.pricePerDay, currency, currencyLocale)}
                      <span className="text-xs text-neo-light font-normal">/j</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neo-muted">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{car.seats}</span>
                    <span>{car.transmission === "AUTOMATIC" ? "Auto" : "Manuelle"}</span>
                    <span>{car.fuel}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
