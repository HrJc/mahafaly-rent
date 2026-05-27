import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { id } = await params

  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return NextResponse.json({ message: "Réservation introuvable" }, { status: 404 })
  if (booking.userId !== session.user.id) return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
  if (booking.status !== "PENDING") return NextResponse.json({ message: "Seules les réservations en attente peuvent être annulées" }, { status: 400 })

  const updated = await prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } })
  return NextResponse.json(updated)
}
