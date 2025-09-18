import { Routes, Route } from "react-router-dom"
import MainLayout from "@/layouts/MainLayout"
import HomePage from "@/pages/home/Home"
import ExplorePage from "@/pages/Explore"

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/:category" element={<ExplorePage />} />
      </Route>
    </Routes>
  )
}
