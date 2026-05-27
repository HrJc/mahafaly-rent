import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializeData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export function formatPrice(
  price: number | string | { toNumber: () => number },
  currency = "EUR",
  locale = "fr-MG"
): string {
  const value = typeof price === "number"
    ? price
    : typeof price === "string"
      ? Number(price)
      : price.toNumber()
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(value)
  } catch {
    return new Intl.NumberFormat("fr-MG", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(value)
  }
}

export function calculateDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays || 1
}

export function calculateTotalPrice(
  pricePerDay: number | string | { toNumber: () => number },
  startDate: Date,
  endDate: Date
): number {
  const price = typeof pricePerDay === "number"
    ? pricePerDay
    : typeof pricePerDay === "string"
      ? Number(pricePerDay)
      : pricePerDay.toNumber()
  const days = calculateDays(startDate, endDate)
  return price * days
}

export function generateWhatsAppMessage(
  booking: {
    carName: string
    startDate: Date
    endDate: Date
    totalPrice: number | string | { toNumber: () => number }
  },
  currency = "EUR",
  locale = "fr-MG"
): string {
  const start = booking.startDate.toLocaleDateString("fr-FR")
  const end = booking.endDate.toLocaleDateString("fr-FR")
  const price = formatPrice(booking.totalPrice, currency, locale)
  const message = `Bonjour Mahafaly Rent, je souhaite confirmer ma réservation :\n\nVoiture : ${booking.carName}\nDate début : ${start}\nDate fin : ${end}\nPrix : ${price}`
  return encodeURIComponent(message)
}

export function getWhatsAppUrl(message: string, phone?: string): string {
  const number = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "261340000000"
  return `https://wa.me/${number}?text=${message}`
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "APPROVED":
      return "text-neo-green-dark bg-neo-green-light border border-neo-green/20"
    case "PENDING":
      return "text-amber-700 bg-amber-50 border border-amber-200"
    case "CANCELLED":
      return "text-red-600 bg-red-50 border border-red-200"
    case "COMPLETED":
      return "text-blue-600 bg-blue-50 border border-blue-200"
    default:
      return "text-neo-muted bg-neo-surface border border-neo-border"
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "APPROVED":
      return "Approuvée"
    case "PENDING":
      return "En attente"
    case "CANCELLED":
      return "Annulée"
    case "COMPLETED":
      return "Terminée"
    default:
      return status
  }
}
