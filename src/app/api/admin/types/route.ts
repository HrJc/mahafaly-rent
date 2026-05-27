import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const DEFAULT_TYPES = ["SEDAN", "SUV", "COUPE", "CONVERTIBLE", "VAN", "LUXURY"]

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
  }

  let types = await prisma.vehicleCategory.findMany({ orderBy: { name: "asc" } })

  // Auto-seed si la table est vide
  if (types.length === 0) {
    const existing = await prisma.car.findMany({ select: { type: true }, distinct: ["type"] })
    const names = existing.length > 0
      ? [...new Set(existing.map((c) => c.type))]
      : DEFAULT_TYPES
    await prisma.vehicleCategory.createMany({
      data: names.map((name) => ({ name })),
      skipDuplicates: true,
    })
    types = await prisma.vehicleCategory.findMany({ orderBy: { name: "asc" } })
  }

  return NextResponse.json(types)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
  }

  const { name } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ message: "Nom requis" }, { status: 400 })
  }

  try {
    const type = await prisma.vehicleCategory.create({ data: { name: name.trim().toUpperCase() } })
    return NextResponse.json(type, { status: 201 })
  } catch {
    return NextResponse.json({ message: "Ce type existe déjà" }, { status: 409 })
  }
}
