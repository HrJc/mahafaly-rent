import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSettings } from "@/lib/settings"
import fs from "fs"
import path from "path"

const SETTINGS_PATH = path.join(process.cwd(), "src/data/settings.json")

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.json(getSettings())
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const updated = { ...getSettings(), ...body }
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(updated, null, 2), "utf-8")
  return NextResponse.json(updated)
}
