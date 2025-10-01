import { Outlet } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"
import { Toaster } from "@/components/ui/sonner"

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  )
}
