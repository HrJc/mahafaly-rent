"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Car, Eye, EyeOff, AlertCircle } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (mode === "register") {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, phone: phone || undefined }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || "Erreur lors de l'inscription")
          return
        }
        await signIn("credentials", { email, password, redirect: false })
        router.push("/dashboard/user")
        router.refresh()
      } catch {
        setError("Erreur réseau")
      } finally {
        setLoading(false)
      }
      return
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError("Email ou mot de passe incorrect")
        return
      }
      router.push("/dashboard/user")
      router.refresh()
    } catch {
      setError("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neo-surface flex items-center justify-center px-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-neo-text rounded-2xl mb-5">
            <Car className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neo-text">Mahafaly Rent</h1>
          <p className="text-sm text-neo-muted mt-1">Espace Client</p>
        </div>

        <div className="bg-white rounded-3xl border border-neo-border p-8">
          <div className="flex gap-1 mb-6 bg-neo-surface rounded-xl p-1">
            <button onClick={() => { setMode("login"); setError(null) }} className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${mode === "login" ? "bg-neo-text text-white" : "text-neo-muted"}`}>
              Connexion
            </button>
            <button onClick={() => { setMode("register"); setError(null) }} className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${mode === "register" ? "bg-neo-text text-white" : "text-neo-muted"}`}>
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="text-[10px] font-semibold text-neo-muted mb-1 block">Nom complet</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Votre nom" className="input-field" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-neo-muted mb-1 block">
                    Téléphone <span className="text-neo-light font-normal">(utilisé pour vous contacter)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+261 34 00 000 00"
                    className="input-field"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] font-semibold text-neo-muted mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@email.com" className="input-field" />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-neo-muted mb-1 block">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••" className="input-field pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-light hover:text-neo-muted transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-50 rounded-2xl">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
              {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer un compte"}
            </button>
          </form>
        </div>

        <p className="text-center mt-5">
          <Link href="/" className="text-xs text-neo-light hover:text-neo-muted transition-colors">&larr; Accueil</Link>
        </p>
      </motion.div>
    </div>
  )
}
