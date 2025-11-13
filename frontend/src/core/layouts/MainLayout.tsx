import { Outlet } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"
import { Toaster } from "@/components/ui/sonner"

export default function MainLayout() {
  return (
    <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent min-h-dvh">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  )
}
