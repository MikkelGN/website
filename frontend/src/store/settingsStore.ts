import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'da' | 'en'

interface SettingsState {
  soundOn: boolean
  lang: Lang
  toggleSound: () => void
  setLang: (lang: Lang) => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      soundOn: true,
      lang: 'da',
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
      setLang: (lang) => set({ lang }),
    }),
    { name: 'migini-settings' },
  ),
)
