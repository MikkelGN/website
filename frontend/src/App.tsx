import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import ProfilePickerPage from './pages/ProfilePickerPage'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminPage from './pages/AdminPage'
import SnakePage from './pages/SnakePage'
import TetrisPage from './pages/TetrisPage'
import MathBlitzPage from './pages/MathBlitzPage'

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
        <Route path="/login" element={<ProfilePickerPage />} />
        <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/play/word-blitz" element={<RequireAuth><GamePage /></RequireAuth>} />
        <Route path="/play/math-blitz" element={<RequireAuth><MathBlitzPage /></RequireAuth>} />
        <Route path="/play/snake" element={<RequireAuth><SnakePage /></RequireAuth>} />
        <Route path="/play/tetris" element={<RequireAuth><TetrisPage /></RequireAuth>} />
        <Route path="/leaderboard" element={<RequireAuth><LeaderboardPage /></RequireAuth>} />
        {/* Legacy routes */}
        <Route path="/game" element={<Navigate to="/play/word-blitz" replace />} />
        <Route path="/snake" element={<Navigate to="/play/snake" replace />} />
        <Route path="/tetris" element={<Navigate to="/play/tetris" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
