"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Car, LayoutDashboard, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettings } from "@/components/providers/SettingsProvider"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/cars", label: "Véhicules" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()
  const isHome = pathname === "/"
  const { appName, logoUrl } = useSettings()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!userMenuOpen) return
    const handleClick = () => setUserMenuOpen(false)
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [userMenuOpen])

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled || !isHome ? "nav-scrolled" : "nav-transparent"
      )}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              {logoUrl ? (
                <Image src={logoUrl} alt={appName} width={36} height={36} className="rounded-xl object-contain" />
              ) : (
                <div className="w-9 h-9 bg-neo-green rounded-xl flex items-center justify-center">
                  <Car className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-lg font-bold text-neo-text tracking-tight">{appName}</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === link.href ? "text-neo-text" : "text-neo-muted hover:text-neo-text"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen) }}
                    className="flex items-center gap-2 rounded-2xl pr-2 pl-1 py-1 hover:bg-neo-surface transition-colors"
                  >
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="" width={28} height={28} className="rounded-xl" />
                    ) : (
                      <div className="w-7 h-7 rounded-xl bg-neo-green/10 flex items-center justify-center text-xs font-bold text-neo-green">
                        {session.user?.name?.[0]}
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-neo-light" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white border border-neo-border rounded-2xl shadow-xl py-2 overflow-hidden"
                      >
                        <Link href="/dashboard/user" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neo-muted hover:text-neo-text hover:bg-neo-surface transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <LayoutDashboard className="w-4 h-4" /> Mon espace
                        </Link>
                        {session.user?.role === "ADMIN" && (
                          <Link href="/dashboard/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neo-muted hover:text-neo-text hover:bg-neo-surface transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <Car className="w-4 h-4" /> Admin
                          </Link>
                        )}
                        <div className="my-1 border-t border-neo-border" />
                        <button onClick={() => signOut()} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                          <LogOut className="w-4 h-4" /> Déconnexion
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="btn-primary text-sm px-5 py-2">
                  Connexion
                </Link>
              )}
            </div>

            <button className="md:hidden text-neo-text" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-neo-border shadow-lg"
          >
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block px-4 py-3 text-sm font-medium text-neo-muted hover:text-neo-text hover:bg-neo-surface rounded-2xl transition-colors" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {session ? (
                <>
                  <Link href="/dashboard/user" className="block px-4 py-3 text-sm font-medium text-neo-muted hover:text-neo-text hover:bg-neo-surface rounded-2xl transition-colors" onClick={() => setMobileOpen(false)}>
                    Mon espace
                  </Link>
                  {session.user?.role === "ADMIN" && (
                    <Link href="/dashboard/admin" className="block px-4 py-3 text-sm font-medium text-neo-muted hover:text-neo-text hover:bg-neo-surface rounded-2xl transition-colors" onClick={() => setMobileOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/login" className="block px-4 py-3 text-sm font-bold text-neo-green hover:bg-neo-green-light rounded-2xl transition-colors" onClick={() => setMobileOpen(false)}>
                  Connexion
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
