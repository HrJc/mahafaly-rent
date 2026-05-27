"use client"

import { createContext, useContext } from "react"
import type { AppSettings } from "@/types"

const DEFAULT: AppSettings = {
  appName: "Mahafaly Rent",
  description: "Location de voitures de luxe à Madagascar",
  currency: "EUR",
  currencyLocale: "fr-MG",
  whatsappNumber: "261340000000",
  contactEmail: "contact@mahafaly.mg",
  phone: "+261 34 00 000",
  address: "Toliara, Madagascar",
}

const SettingsContext = createContext<AppSettings>(DEFAULT)

export function SettingsProvider({
  children,
  settings,
}: {
  children: React.ReactNode
  settings: AppSettings
}) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}

export function useSettings(): AppSettings {
  return useContext(SettingsContext)
}
