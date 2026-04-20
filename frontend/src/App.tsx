import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminPage from './pages/AdminPage'
import SnakePage from './pages/SnakePage'
import TetrisPage from './pages/TetrisPage'
import WordlePage from './pages/WordlePage'
import LinkedInPage from './pages/LinkedInPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const adminToken = useAuthStore((s) => s.adminToken)
  return adminToken ? <>{children}</> : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/game" element={<RequireAuth><GamePage /></RequireAuth>} />
        <Route path="/leaderboard" element={<RequireAuth><LeaderboardPage /></RequireAuth>} />
        <Route path="/snake" element={<RequireAuth><SnakePage /></RequireAuth>} />
        <Route path="/tetris" element={<RequireAuth><TetrisPage /></RequireAuth>} />
        <Route path="/wordle" element={<RequireAuth><WordlePage /></RequireAuth>} />
        <Route path="/linkedin" element={<RequireAuth><LinkedInPage /></RequireAuth>} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
