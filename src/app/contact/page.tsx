import { ContactPageClient } from "@/components/maps/ContactPageClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Mahafaly Rent — Location de voitures premium à Antananarivo, Madagascar.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
