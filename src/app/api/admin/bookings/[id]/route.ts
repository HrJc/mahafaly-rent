import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { sendBookingStatusUpdate } from "@/lib/email"
import { getSettings } from "@/lib/settings"

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
    const { status } = await request.json()

    if (!["APPROVED", "CANCELLED", "COMPLETED"].includes(status)) {
      return NextResponse.json({ message: "Statut invalide" }, { status: 400 })
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { user: true, car: true },
    })

    // Email au client (non-bloquant)
    const settings = await getSettings()
    const fmt = (d: Date) => new Date(d).toLocaleDateString("fr-FR")
    sendBookingStatusUpdate({
      userName: booking.user.name ?? "Client",
      userEmail: booking.user.email ?? "",
      carName: booking.car.name,
      startDate: fmt(booking.startDate),
      endDate: fmt(booking.endDate),
      totalPrice: formatPrice(Number(booking.totalPrice), settings.currency, settings.currencyLocale),
      bookingId: booking.id,
      status,
    })

    return NextResponse.json(booking)
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }
    const { id } = await params
    await prisma.booking.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
