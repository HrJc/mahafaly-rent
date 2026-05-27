import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CarDetail } from "@/components/cars/CarDetail"
import { serializeData } from "@/lib/utils"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const car = await prisma.car.findUnique({ where: { id } })
  if (!car) return { title: "Véhicule introuvable" }
  return {
    title: `${car.name} — Location`,
    description: car.description.slice(0, 160),
  }
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params
  const car = await prisma.car.findUnique({ where: { id } })
  if (!car) notFound()
  return <CarDetail car={serializeData(car)} />
}
