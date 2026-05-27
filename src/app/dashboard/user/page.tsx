import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { UserDashboard } from "@/components/dashboard/UserDashboard"
import { serializeData } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mon Espace",
}

export default async function UserDashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const [allBookings, cars] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { car: true },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.car.findMany({ select: { id: true } }),
  ])

  const carIds = new Set(cars.map((c) => c.id))
  const bookings = allBookings.filter((b) => carIds.has(b.carId))

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { phone: true },
  })

  return <UserDashboard user={{ ...session.user, phone: userRecord?.phone ?? null }} bookings={serializeData(bookings)} />
}
