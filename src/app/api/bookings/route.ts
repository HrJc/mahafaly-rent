import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { calculateTotalPrice, formatPrice } from "@/lib/utils"
import { sendBookingConfirmationToUser, sendNewBookingToAdmin } from "@/lib/email"
import { getSettings } from "@/lib/settings"

const bookingSchema = z.object({
  carId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const data = bookingSchema.parse(body)

    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    if (endDate <= startDate) {
      return NextResponse.json(
        { message: "La date de fin doit être après la date de début" },
        { status: 400 }
      )
    }

    const car = await prisma.car.findUnique({ where: { id: data.carId } })
    if (!car || !car.available) {
      return NextResponse.json({ message: "Ce véhicule n'est pas disponible" }, { status: 400 })
    }

    const overlapping = await prisma.booking.findFirst({
      where: {
        carId: data.carId,
        status: { in: ["PENDING", "APPROVED"] },
        OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
      },
    })

    if (overlapping) {
      return NextResponse.json(
        { message: "Ce véhicule est déjà réservé pour ces dates" },
        { status: 409 }
      )
    }

    const totalPrice = calculateTotalPrice(Number(car.pricePerDay), startDate, endDate)

    const booking = await prisma.booking.create({
      data: { userId: session.user.id, carId: data.carId, startDate, endDate, totalPrice, status: "PENDING" },
      include: { car: true, user: true },
    })

    // Emails (non-bloquants)
    const [settings] = await Promise.all([getSettings()])
    const fmt = (d: Date) => d.toLocaleDateString("fr-FR")
    const emailData = {
      userName: booking.user.name ?? "Client",
      userEmail: booking.user.email ?? "",
      carName: car.name,
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      totalPrice: formatPrice(Number(totalPrice), settings.currency, settings.currencyLocale),
      bookingId: booking.id,
    }
    sendBookingConfirmationToUser(emailData)
    if (settings.contactEmail) sendNewBookingToAdmin(emailData, settings.contactEmail)

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Données invalides", errors: error.errors }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { car: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
