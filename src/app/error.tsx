"use client"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="text-center">
        <p className="text-8xl font-bold text-neo-border select-none">500</p>
        <h1 className="text-2xl font-bold text-neo-text -mt-4 mb-3">Erreur</h1>
        <p className="text-sm text-neo-muted mb-8">{error.message || "Une erreur est survenue."}</p>
        <button onClick={reset} className="btn-primary">Réessayer</button>
      </div>
    </div>
  )
}
