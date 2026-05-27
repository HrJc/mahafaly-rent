import fs from "fs"
import path from "path"
import type { AppSettings } from "@/types"

const SETTINGS_PATH = path.join(process.cwd(), "src/data/settings.json")

export const DEFAULT_SETTINGS: AppSettings = {
  appName: "Mahafaly Rent",
  description: "Location de voitures de luxe à Madagascar",
  currency: "EUR",
  currencyLocale: "fr-MG",
  whatsappNumber: "261340000000",
  contactEmail: "contact@mahafaly.mg",
  phone: "+261 34 00 000",
  address: "Toliara, Madagascar",
}

export function getSettings(): AppSettings {
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, "utf-8")
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}
