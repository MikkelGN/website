import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: number | null
  username: string | null
  avatarKey: string | null
  adminToken: string | null
  setPlayer: (token: string, userId: number, username: string, avatarKey: string) => void
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
      avatarKey: null,
      adminToken: null,
      setPlayer: (token, userId, username, avatarKey) => set({ token, userId, username, avatarKey }),
      setAdminToken: (adminToken) => set({ adminToken }),
      logout: () => set({ token: null, userId: null, username: null, avatarKey: null }),
      logoutAdmin: () => set({ adminToken: null }),
    }),
    {
      name: 'wordblitz-auth',
    }
  )
)
