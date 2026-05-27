import { prisma } from "@/lib/prisma"
import { CarsGrid } from "@/components/cars/CarsGrid"
import { serializeData } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nos Véhicules",
  description: "Découvrez notre flotte de véhicules premium disponibles à la location à Madagascar.",
}

export default async function CarsPage() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="border-b border-neo-border">
        <div className="max-w-6xl mx-auto px-5 py-14 lg:py-20">
          <p className="section-label mb-3">Notre flotte</p>
          <h1 className="section-title">Nos véhicules</h1>
          <p className="mt-4 text-base text-neo-muted">
            {cars.length} véhicules disponibles pour vos trajets.
          </p>
        </div>
      </div>
      <CarsGrid cars={serializeData(cars)} />
    </div>
  )
}
