"use client"

import { motion } from "framer-motion"
import { Shield, Clock, MapPin, Headphones, Award, Zap } from "lucide-react"

const features = [
  { icon: Shield, title: "Assurance incluse", desc: "Tous nos véhicules sont assurés tous risques." },
  { icon: Clock, title: "Disponible 24/7", desc: "Notre équipe répond à toute heure." },
  { icon: MapPin, title: "Livraison", desc: "On livre directement à votre adresse ou à l'aéroport." },
  { icon: Headphones, title: "Assistance", desc: "Un conseiller vous accompagne en permanence." },
  { icon: Award, title: "Flotte entretenue", desc: "Véhicules récents et parfaitement entretenus." },
  { icon: Zap, title: "Réservation rapide", desc: "Réservez en quelques clics, c'est fait." },
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-neo-surface">
      <div className="max-w-6xl mx-auto px-5">
        <div className="max-w-xl mb-14">
          <p className="section-label mb-3">Avantages</p>
          <h2 className="section-title">Pourquoi nous choisir ?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-3xl p-7 border border-neo-border hover:border-neo-green/30 transition-colors"
            >
              <div className="w-11 h-11 bg-neo-green-light rounded-2xl flex items-center justify-center mb-5">
                <f.icon className="w-5 h-5 text-neo-green" />
              </div>
              <h3 className="text-sm font-bold text-neo-text mb-2">{f.title}</h3>
              <p className="text-sm text-neo-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
