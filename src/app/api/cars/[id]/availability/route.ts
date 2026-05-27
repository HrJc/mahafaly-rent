import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const bookings = await prisma.booking.findMany({
    where: {
      carId: id,
      status: { in: ["PENDING", "APPROVED"] },
    },
    select: {
      startDate: true,
      endDate: true,
      status: true,
    },
    orderBy: { startDate: "asc" },
  })

  return NextResponse.json(
    bookings.map((b) => ({
      startDate: b.startDate.toISOString().split("T")[0],
      endDate: b.endDate.toISOString().split("T")[0],
      status: b.status,
    }))
  )
}
