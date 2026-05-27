import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { Transmission } from "@prisma/client"

const carsQuerySchema = z.object({
  type: z.string().optional(),
  transmission: z.nativeEnum(Transmission).optional(),
  available: z.enum(["true", "false"]).optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const transmission = searchParams.get("transmission")
    const available = searchParams.get("available")

    const parsed = carsQuerySchema.safeParse({
      type: type ?? undefined,
      transmission: transmission ?? undefined,
      available: available ?? undefined,
    })

    const where: Record<string, unknown> = {}
    if (parsed.success) {
      if (type && type !== "ALL") where.type = type
      if (transmission && transmission !== "ALL") where.transmission = transmission
      if (available === "true") where.available = true
    }

    const cars = await prisma.car.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
