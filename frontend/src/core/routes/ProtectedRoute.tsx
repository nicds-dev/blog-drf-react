import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/useAuth"

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} /> // Redirect to login if not authenticated
  }

  return <>{children}</>
}