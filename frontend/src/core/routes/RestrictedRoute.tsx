import { Navigate } from "react-router-dom"
import { useAuth } from "@/features/auth/useAuth"

interface Props {
  children: React.ReactNode
}

export default function RestrictedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace /> // Redirect to home if authenticated
  }

  return <>{children}</>
}