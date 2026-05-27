"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-neo-text">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-neo-green mb-4">Prêt ?</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Votre prochaine voiture vous attend
          </h2>
          <p className="text-base text-zinc-400 mb-10 max-w-md mx-auto">
            Choisissez, réservez, roulez. C&apos;est aussi simple que ça.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cars" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-neo-text font-semibold text-sm rounded-2xl hover:bg-neo-surface transition-colors">
              Explorer la flotte <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 text-zinc-300 font-semibold text-sm rounded-2xl hover:border-zinc-500 hover:text-white transition-colors">
              Nous contacter
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
