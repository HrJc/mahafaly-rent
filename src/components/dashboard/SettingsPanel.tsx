"use client"

import { useState, useEffect, useRef } from "react"
import { Save, Globe, MessageCircle, Mail, MapPin, Phone, Type, FileText, Upload, Loader2, X } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { AppSettings } from "@/types"

const CURRENCIES = [
  { code: "EUR", label: "Euro (€)", locale: "fr-FR" },
  { code: "USD", label: "Dollar US ($)", locale: "en-US" },
  { code: "MGA", label: "Ariary malgache (Ar)", locale: "fr-MG" },
  { code: "GBP", label: "Livre sterling (£)", locale: "en-GB" },
]

const DEFAULT: AppSettings = {
  appName: "Mahafaly Rent",
  description: "Location de voitures de luxe à Madagascar",
  currency: "MGA",
  currencyLocale: "fr-MG",
  whatsappNumber: "261340000000",
  contactEmail: "contact@mahafaly.mg",
  phone: "+261 34 00 000",
  address: "Toliara, Madagascar",
  logoUrl: "",
}

type SaveState = "idle" | "saving" | "saved" | "error"

function Field({
  label,
  value,
  onChange,
  icon: Icon,
  type = "text",
  placeholder = "",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  icon: React.ElementType
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neo-muted pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-9 text-xs w-full"
        />
      </div>
    </div>
  )
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT)
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [loading, setLoading] = useState(true)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((s) => ({ ...s, ...data }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const set = (key: keyof AppSettings) => (value: string) =>
    setSettings((s) => ({ ...s, [key]: value }))

  const handleCurrencyChange = (code: string) => {
    const found = CURRENCIES.find((c) => c.code === code)
    setSettings((s) => ({
      ...s,
      currency: code,
      currencyLocale: found?.locale ?? s.currencyLocale,
    }))
  }

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok && data.url) {
        setSettings((s) => ({ ...s, logoUrl: data.url }))
      }
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSave = async () => {
    setSaveState("saving")
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      setSaveState(res.ok ? "saved" : "error")
    } catch {
      setSaveState("error")
    }
    setTimeout(() => setSaveState("idle"), 2500)
  }

  const previewPrice = (() => {
    try {
      return new Intl.NumberFormat(settings.currencyLocale, {
        style: "currency",
        currency: settings.currency,
        minimumFractionDigits: 0,
      }).format(250)
    } catch {
      return "—"
    }
  })()

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-neo-border p-10 text-center text-xs text-neo-muted">
        Chargement des paramètres...
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

      {/* Logo */}
      <div className="bg-white rounded-2xl border border-neo-border p-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-4">Logo</p>
        <div className="flex items-center gap-5">
          {/* Preview */}
          <div className="w-20 h-20 rounded-2xl border border-neo-border bg-neo-surface flex items-center justify-center overflow-hidden shrink-0">
            {settings.logoUrl ? (
              <Image src={settings.logoUrl} alt="Logo" width={80} height={80} className="w-full h-full object-contain p-1" />
            ) : (
              <span className="text-[10px] text-neo-light text-center px-2">Aucun logo</span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleLogoUpload(file)
                e.target.value = ""
              }}
            />
            <button
              type="button"
              disabled={uploadingLogo}
              onClick={() => logoInputRef.current?.click()}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-neo-border text-neo-muted hover:text-neo-text hover:border-neo-text transition-colors disabled:opacity-50"
            >
              {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploadingLogo ? "Upload en cours…" : "Choisir un logo"}
            </button>
            {settings.logoUrl && (
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, logoUrl: "" }))}
                className="flex items-center gap-1.5 text-[10px] font-semibold text-neo-muted hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" /> Supprimer le logo
              </button>
            )}
            <p className="text-[10px] text-neo-light">PNG, JPG ou SVG — max 10 Mo. Affiché dans la barre de navigation et le pied de page.</p>
          </div>
        </div>
      </div>

      {/* Général */}
      <div className="bg-white rounded-2xl border border-neo-border p-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-4">Général</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nom de l'application" value={settings.appName} onChange={set("appName")} icon={Type} placeholder="Mahafaly Rent" />
          <Field label="Description courte" value={settings.description} onChange={set("description")} icon={FileText} placeholder="Description…" />
        </div>
      </div>

      {/* Devise */}
      <div className="bg-white rounded-2xl border border-neo-border p-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-4">Affichage & Devise</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-1.5 block">Devise</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neo-muted pointer-events-none" />
              <select
                value={settings.currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="input-field pl-9 text-xs w-full appearance-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
            <p className="text-[10px] text-neo-light mt-1.5">
              Aperçu : <span className="font-semibold text-neo-text">{previewPrice}</span> / jour
            </p>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-1.5 block">Locale (format)</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neo-muted pointer-events-none" />
              <input
                type="text"
                value={settings.currencyLocale}
                onChange={(e) => setSettings((s) => ({ ...s, currencyLocale: e.target.value }))}
                placeholder="fr-MG"
                className="input-field pl-9 text-xs w-full"
              />
            </div>
            <p className="text-[10px] text-neo-light mt-1.5">Ex : fr-MG, fr-FR, en-US</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-neo-border p-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-4">Contact & Coordonnées</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Numéro WhatsApp" value={settings.whatsappNumber} onChange={set("whatsappNumber")} icon={MessageCircle} placeholder="261340000000" />
          <Field label="Email de contact" value={settings.contactEmail} onChange={set("contactEmail")} icon={Mail} type="email" placeholder="contact@example.mg" />
          <Field label="Téléphone" value={settings.phone} onChange={set("phone")} icon={Phone} type="tel" placeholder="+261 34 00 000" />
          <Field label="Adresse" value={settings.address} onChange={set("address")} icon={MapPin} placeholder="Toliara, Madagascar" />
        </div>
      </div>

      {/* Bouton sauvegarder */}
      <div className="flex items-center justify-end gap-3">
        {saveState === "error" && (
          <p className="text-[10px] text-red-500 font-medium">Erreur lors de la sauvegarde.</p>
        )}
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className={cn(
            "flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all",
            saveState === "saved"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-neo-text text-white hover:opacity-80 disabled:opacity-50"
          )}
        >
          <Save className="w-3.5 h-3.5" />
          {saveState === "saving" ? "Sauvegarde…" : saveState === "saved" ? "Sauvegardé !" : "Sauvegarder"}
        </button>
      </div>
    </motion.div>
  )
}
