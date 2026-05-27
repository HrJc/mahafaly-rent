"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "261340000000"
  const url = `https://wa.me/${phone}?text=${encodeURIComponent("Bonjour Mahafaly Rent, je souhaite des infos.")}`

  return (
    <motion.a href={url} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-neo-text rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 hover:bg-white hover:text-neo-text border border-transparent hover:border-neo-border transition-colors"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label="WhatsApp"
    >
      <MessageCircle className="w-5 h-5 text-white fill-white" />
    </motion.a>
  )
}
