import { LoginForm } from "@/components/auth/LoginForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace Mahafaly Rent",
}

export default function LoginPage() {
  return <LoginForm />
}
