import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const { id } = await params
    const data = await request.json()
    const car = await prisma.car.update({
      where: { id },
      data,
    })

    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const { id } = await params
    // Supprimer les réservations liées avant la voiture (MySQL ignore onDelete: Cascade sans FK migré)
    await prisma.booking.deleteMany({ where: { carId: id } })
    await prisma.car.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
