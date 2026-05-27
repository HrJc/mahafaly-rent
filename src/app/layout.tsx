import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { SettingsProvider } from "@/components/providers/SettingsProvider"
import { getSettings } from "@/lib/settings"
import { auth } from "@/auth"

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Mahafaly Rent — Location de Voitures à Madagascar",
    template: "%s | Mahafaly Rent",
  },
  description:
    "Location de voitures à Madagascar. Flotte variée, service fiable. Réservez en ligne.",
  keywords: [
    "location voiture Madagascar",
    "car rental Madagascar",
    "location Antananarivo",
    "Mahafaly Rent",
  ],
  openGraph: {
    title: "Mahafaly Rent — Location de Voitures",
    description: "Location de voitures à Madagascar",
    siteName: "Mahafaly Rent",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahafaly Rent",
    description: "Location de voitures à Madagascar",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [session, settings] = await Promise.all([auth(), getSettings()])
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${dmSans.variable} antialiased bg-white text-neo-text`}>
        <SessionProvider session={session}>
          <SettingsProvider settings={settings}>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </SettingsProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
