"use client"

import { motion } from "framer-motion"

const testimonials = [
  { name: "Andry R.", role: "Commercial", text: "Service impeccable, véhicule livré à l'heure. Je recommande !", initial: "A" },
  { name: "Sophie M.", role: "Touriste", text: "Super expérience. SUV parfait pour les routes de Madagascar.", initial: "S" },
  { name: "Jean-Pierre R.", role: "Entrepreneur", text: "Réservation en 2 minutes. Mon prestataire de confiance à Tana.", initial: "J" },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Avis</p>
          <h2 className="section-title">Ce qu&apos;en disent nos clients</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-neo-surface rounded-3xl p-7"
            >
              <p className="text-sm text-neo-muted leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-neo-green rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neo-text">{t.name}</p>
                  <p className="text-xs text-neo-light">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
