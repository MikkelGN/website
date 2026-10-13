import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import CookingGame from '@/games/cooking/CookingGame'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/koekken" element={<CookingGame />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
