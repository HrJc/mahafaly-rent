import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2, "Nom requis (2 caractères min)").optional(),
  phone: z.string().min(6).optional().or(z.literal("")),
})

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const body = await req.json()
  const data = schema.parse(body)

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(data.name ? { name: data.name } : {}),
      phone: data.phone || null,
    },
    select: { id: true, name: true, email: true, phone: true, image: true },
  })

  return NextResponse.json(updated)
}
