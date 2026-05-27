"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"

const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false, loading: () => <div className="w-full h-full bg-neo-surface flex items-center justify-center"><span className="text-xs text-neo-light">Carte...</span></div> })

const infos = [
  { icon: MapPin, label: "Adresse", value: "Antananarivo, Madagascar", sub: "Livraison dans toute l'île" },
  { icon: Phone, label: "Téléphone", value: "+261 34 00 000 00", href: "tel:+261340000000" },
  { icon: Mail, label: "Email", value: "contact@mahafaly-rent.mg", href: "mailto:contact@mahafaly-rent.mg" },
  { icon: Clock, label: "Horaires", value: "Lun – Sam : 8h – 19h", sub: "Urgence 24h/24" },
]

export function ContactPageClient() {
  const waUrl = `https://wa.me/261340000000?text=${encodeURIComponent("Bonjour Mahafaly Rent, je souhaite des infos.")}`

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="border-b border-neo-border">
        <div className="max-w-6xl mx-auto px-5 py-14 lg:py-20">
          <p className="section-label mb-3">Contact</p>
          <h1 className="section-title">Nous trouver</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-sm text-neo-muted leading-relaxed mb-10 max-w-md">Notre équipe est disponible pour toute question sur nos services et véhicules.</p>
            <div className="space-y-6 mb-10">
              {infos.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neo-green-light rounded-2xl flex items-center justify-center shrink-0"><item.icon className="w-4 h-4 text-neo-green" /></div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neo-light mb-0.5">{item.label}</p>
                    {item.href ? <a href={item.href} className="text-sm text-neo-text hover:text-neo-green transition-colors">{item.value}</a> : <p className="text-sm text-neo-text">{item.value}</p>}
                    {item.sub && <p className="text-xs text-neo-light mt-0.5">{item.sub}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"><MessageCircle className="w-4 h-4 fill-white" /> WhatsApp</a>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-neo-border">
            <LocationMap />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
