import { NextResponse } from "next/server"
import { auth } from "@/auth"
import nodemailer from "nodemailer"

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const config = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    from: process.env.SMTP_FROM,
    passLength: process.env.SMTP_PASS?.length ?? 0,
  }

  if (!config.host || !config.user || !config.passLength) {
    return NextResponse.json({ error: "Variables SMTP manquantes", config })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: process.env.SMTP_PASS },
    })

    await transporter.verify()

    await transporter.sendMail({
      from: config.from ?? config.user,
      to: config.user,
      subject: "Test email Mahafaly Rent",
      text: "Si vous recevez cet email, la configuration SMTP fonctionne.",
    })

    return NextResponse.json({ success: true, sentTo: config.user, config })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message, config }, { status: 500 })
  }
}
