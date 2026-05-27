import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const cars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const data = await request.json()
    const car = await prisma.car.create({ data })
    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
