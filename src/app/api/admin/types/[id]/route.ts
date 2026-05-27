import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params
  const { name } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ message: "Nom requis" }, { status: 400 })
  }

  const newName = name.trim().toUpperCase()
  const current = await prisma.vehicleCategory.findUnique({ where: { id } })
  if (!current) return NextResponse.json({ message: "Introuvable" }, { status: 404 })

  try {
    // Renommer la catégorie ET mettre à jour toutes les voitures qui l'utilisent
    const [type] = await prisma.$transaction([
      prisma.vehicleCategory.update({ where: { id }, data: { name: newName } }),
      prisma.car.updateMany({ where: { type: current.name }, data: { type: newName } }),
    ])
    return NextResponse.json(type)
  } catch {
    return NextResponse.json({ message: "Ce nom existe déjà" }, { status: 409 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params
  const current = await prisma.vehicleCategory.findUnique({ where: { id } })
  if (!current) return NextResponse.json({ message: "Introuvable" }, { status: 404 })

  const usageCount = await prisma.car.count({ where: { type: current.name } })
  if (usageCount > 0) {
    return NextResponse.json(
      { message: `Impossible : ${usageCount} véhicule(s) utilisent ce type.` },
      { status: 409 }
    )
  }

  await prisma.vehicleCategory.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
