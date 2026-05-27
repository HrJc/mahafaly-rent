"use client"

import Link from "next/link"
import Image from "next/image"
import { Car, Phone, Mail, MapPin } from "lucide-react"
import { useSettings } from "@/components/providers/SettingsProvider"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { appName, logoUrl, phone, contactEmail, address } = useSettings()

  return (
    <footer className="bg-neo-text text-white">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              {logoUrl ? (
                <Image src={logoUrl} alt={appName} width={36} height={36} className="rounded-xl object-contain" />
              ) : (
                <div className="w-9 h-9 bg-neo-green rounded-xl flex items-center justify-center">
                  <Car className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-lg font-bold tracking-tight">{appName}</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Location de véhicules à Madagascar. Simple, rapide, fiable.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Liens</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Accueil" },
                { href: "/cars", label: "Véhicules" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Services</h4>
            <ul className="space-y-2.5">
              {["Courte durée", "Longue durée", "Avec chauffeur", "Transfert aéroport"].map((s) => (
                <li key={s}><span className="text-sm text-zinc-400">{s}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Contact</h4>
            <ul className="space-y-3">
              {address && (
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="text-sm text-zinc-400">{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-sm text-zinc-400 hover:text-white transition-colors">{phone}</a>
                </li>
              )}
              {contactEmail && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                  <a href={`mailto:${contactEmail}`} className="text-sm text-zinc-400 hover:text-white transition-colors">{contactEmail}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">&copy; {currentYear} {appName}</p>
          <div className="flex gap-5">
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Mentions légales</Link>
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">CGV</Link>
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
