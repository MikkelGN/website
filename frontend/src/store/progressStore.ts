import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Progress lives only on the device. No accounts, no server, nothing leaves the browser.
interface ProgressState {
  // how many times each dish has been cooked, keyed by recipe id
  dishesCooked: Record<string, number>
  recordDish: (recipeId: string) => void
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      dishesCooked: {},
      recordDish: (recipeId) =>
        set((s) => ({
          dishesCooked: { ...s.dishesCooked, [recipeId]: (s.dishesCooked[recipeId] ?? 0) + 1 },
        })),
    }),
    { name: 'migini-progress' },
  ),
)

export function totalStars(dishesCooked: Record<string, number>): number {
  return Object.values(dishesCooked).reduce((sum, n) => sum + n, 0)
}
