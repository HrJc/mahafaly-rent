import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { createHash } from "crypto"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary non configuré. Ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET." },
      { status: 500 }
    )
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)" }, { status: 400 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = "mahafaly-rent"
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const signature = createHash("sha1").update(toSign).digest("hex")

  const upload = new FormData()
  upload.append("file", file)
  upload.append("api_key", apiKey)
  upload.append("timestamp", String(timestamp))
  upload.append("signature", signature)
  upload.append("folder", folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: upload,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: (err as { error?: { message?: string } }).error?.message ?? "Échec de l'upload" }, { status: 500 })
  }

  const data = await res.json() as { secure_url: string }
  return NextResponse.json({ url: data.secure_url })
}
