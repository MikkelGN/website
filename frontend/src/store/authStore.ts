import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: number | null
  username: string | null
  adminToken: string | null
  setPlayer: (token: string, userId: number, username: string) => void
  setAdminToken: (token: string) => void
  logout: () => void
  logoutAdmin: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      username: null,
      adminToken: null,
      setPlayer: (token, userId, username) => set({ token, userId, username }),
      setAdminToken: (adminToken) => set({ adminToken }),
      logout: () => set({ token: null, userId: null, username: null }),
      logoutAdmin: () => set({ adminToken: null }),
    }),
    {
      name: 'wordblitz-auth',
    }
  )
)
