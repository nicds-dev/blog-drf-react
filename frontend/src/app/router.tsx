import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/Home'
import ExplorePage from '@/pages/Explore'
import MainLayout from '@/layouts/MainLayout'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
      </Route>
    </Routes>
  );
};
