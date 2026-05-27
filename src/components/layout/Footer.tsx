import Link from "next/link"
import { Car, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neo-text text-white">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-neo-green rounded-xl flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Mahafaly</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Location de véhicules à Madagascar. Simple, rapide, fiable.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Liens</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Accueil" },
                { href: "/cars", label: "Véhicules" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Services</h4>
            <ul className="space-y-2.5">
              {["Courte durée", "Longue durée", "Avec chauffeur", "Transfert aéroport"].map((s) => (
                <li key={s}><span className="text-sm text-zinc-400">{s}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="text-sm text-zinc-400">Antananarivo</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <a href="tel:+261340000000" className="text-sm text-zinc-400 hover:text-white transition-colors">+261 34 00 000 00</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <a href="mailto:contact@mahafaly-rent.mg" className="text-sm text-zinc-400 hover:text-white transition-colors">contact@mahafaly-rent.mg</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">&copy; {currentYear} Mahafaly Rent</p>
          <div className="flex gap-5">
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Mentions légales</Link>
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">CGV</Link>
            <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
