import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSettings, saveSettings } from "@/lib/settings"

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.json(await getSettings())
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  await saveSettings(body)
  return NextResponse.json(await getSettings())
}
