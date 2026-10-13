import { BrowserRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import CookingGame from '@/games/cooking/CookingGame'

// The Artifact build runs in a sandboxed frame whose URL we don't control
const Router = import.meta.env.MODE === 'artifact' ? MemoryRouter : BrowserRouter

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/koekken" element={<CookingGame />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
