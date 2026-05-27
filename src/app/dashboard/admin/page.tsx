import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"
import { serializeData } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Administration",
}

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/")

  const [cars, allBookings] = await Promise.all([
    prisma.car.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.booking.findMany({
      include: { car: true, user: true },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
  ])

  // Filtrer les réservations dont la voiture a été supprimée (orphelins en base)
  const carIds = new Set(cars.map((c) => c.id))
  const bookings = allBookings.filter((b) => carIds.has(b.carId))

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "PENDING").length,
    approvedBookings: bookings.filter((b) => b.status === "APPROVED").length,
    totalRevenue: bookings
      .filter((b) => b.status === "APPROVED")
      .reduce((acc, b) => acc + Number(b.totalPrice), 0),
    totalCars: cars.length,
    availableCars: cars.filter((c) => c.available).length,
  }

  return <AdminDashboard stats={stats} bookings={serializeData(bookings)} cars={serializeData(cars)} />
}
