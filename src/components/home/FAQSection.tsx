"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqs = [
  { q: "Quels documents sont nécessaires ?", a: "Permis de conduire valide (2 ans min), pièce d'identité et carte bancaire. Permis international accepté pour les étrangers." },
  { q: "Comment réserver ?", a: "Créez un compte, choisissez votre véhicule, sélectionnez vos dates et envoyez. On confirme sous 24h via WhatsApp." },
  { q: "Livrez-vous à l'aéroport ?", a: "Oui ! Livraison à l'aéroport d'Ivato et dans toutes les grandes villes de Madagascar." },
  { q: "Politique d'annulation ?", a: "Gratuite jusqu'à 48h avant le début. Au-delà, frais d'une journée. On reste flexibles." },
  { q: "Les véhicules sont-ils assurés ?", a: "Oui, assurance responsabilité civile incluse. Option tous risques disponible." },
  { q: "Je peux rouler hors d'Antananarivo ?", a: "Absolument. Nos véhicules peuvent circuler partout à Madagascar." },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-neo-border">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-5 text-left group">
        <span className="text-sm font-semibold text-neo-text pr-4">{q}</span>
        <span className="shrink-0 w-7 h-7 rounded-full border border-neo-border flex items-center justify-center group-hover:border-neo-green transition-colors">
          {open ? <Minus className="w-3 h-3 text-neo-green" /> : <Plus className="w-3 h-3 text-neo-muted" />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="text-sm text-neo-muted leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  return (
    <section className="py-20 lg:py-28 bg-neo-surface">
      <div className="max-w-2xl mx-auto px-5">
        <div className="text-center mb-14">
          <p className="section-label mb-3">FAQ</p>
          <h2 className="section-title">Questions fréquentes</h2>
        </div>
        {faqs.map((faq) => (
          <FAQItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </section>
  )
}
