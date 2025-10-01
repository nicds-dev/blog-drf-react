import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import HomePage from "@/pages/home/Home"
import ExplorePage from "@/pages/Explore"
import SignupPage from "@/pages/auth/Signup"
import LoginPage from "@/pages/auth/Login"
import ProtectedRoute from "./routes/ProtectedRoute"
import RestrictedRoute from "./routes/RestrictedRoute"

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/:category" element={<ExplorePage />} />

        {/* Restricted: unauthenticated users */}
        <Route
          path="/login"
          element={
            <RestrictedRoute>
              <LoginPage />
            </RestrictedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RestrictedRoute>
              <SignupPage />
            </RestrictedRoute>
          }
        />

        {/* Protected: authenticated users */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  )
}
