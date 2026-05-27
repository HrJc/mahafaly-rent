import { Car, Booking, User, BookingStatus, Transmission } from "@prisma/client"

export interface AppSettings {
  appName: string
  description: string
  currency: string
  currencyLocale: string
  whatsappNumber: string
  contactEmail: string
  phone: string
  address: string
}

export type { Car, Booking, User, BookingStatus, Transmission }

export type BookingWithCar = Booking & {
  car: Car
}

export type BookingWithUser = Booking & {
  user: User
  car: Car
}

export type CarWithBookings = Car & {
  bookings: Booking[]
}

export interface BookingFormData {
  carId: string
  startDate: string
  endDate: string
}

export interface CarFilters {
  type?: string
  transmission?: Transmission | "ALL"
  minPrice?: number
  maxPrice?: number
  seats?: number
}

export interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  approvedBookings: number
  totalRevenue: number
  totalCars: number
  availableCars: number
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: "USER" | "ADMIN"
    }
  }
}

declare module "@auth/core/adapters" {
  interface User {
    role: "USER" | "ADMIN"
  }
}
