import { prisma } from "@/lib/prisma"
import type { AppSettings } from "@/types"

export const DEFAULT_SETTINGS: AppSettings = {
  appName: "Mahafaly Rent",
  description: "Location de voitures de luxe à Madagascar",
  currency: "MGA",
  currencyLocale: "fr-MG",
  whatsappNumber: "261340000000",
  contactEmail: "contact@mahafaly.mg",
  phone: "+261 34 00 000",
  address: "Toliara, Madagascar",
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const rows = await prisma.setting.findMany()
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    return { ...DEFAULT_SETTINGS, ...map } as AppSettings
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export async function saveSettings(data: Partial<AppSettings>): Promise<void> {
  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  )
}
