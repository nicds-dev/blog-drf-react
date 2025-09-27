import { Outlet } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"
import { Toaster } from "@/components/ui/sonner"

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Toaster 
        toastOptions={{
          duration: 4000,
          classNames: {
            toast: "!bg-slate-900 !text-foreground !border !border-border",
            description: "text-foreground/90",
            title: "text-foreground",
          }
        }}
      />
    </div>
  )
}
