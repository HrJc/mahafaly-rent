import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="text-center">
        <p className="text-8xl font-bold text-neo-border select-none">404</p>
        <h1 className="text-2xl font-bold text-neo-text -mt-4 mb-3">Page introuvable</h1>
        <p className="text-sm text-neo-muted mb-8">Cette page n&apos;existe pas.</p>
        <Link href="/" className="btn-primary">Retour à l&apos;accueil</Link>
      </div>
    </div>
  )
}
