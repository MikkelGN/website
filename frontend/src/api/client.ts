import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const { token, adminToken } = useAuthStore.getState()
  const t = adminToken || token
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

// --- Types ---
export interface Category {
  id: number
  nameDa: string
  nameEn: string
  color: string
}

export interface LeaderboardEntry {
  rank: number
  displayName: string
  score: number
  metadata: Record<string, string | number>
}

export interface PlayerProgress {
  displayName: string
  gameType: string
  plays: number
  bestScore: number
}

export interface SessionResponse {
  sessionId: number
  startingTimeLimit: number
}

export interface NextWordResponse {
  wordId: number
  wordText: string
  categoryIds: number[]
}

export interface AnswerResponse {
  correct: boolean
  pointsEarned: number
  totalScore: number
  streak: number
  nextTimeLimit: number
  gameOver: boolean
}

export interface PlayerSummary {
  id: number
  displayName: string
  avatarKey: string
}

export interface AdminPlayer {
  id: number
  displayName: string
  avatarKey: string
  createdAt: string
}

export interface Word {
  id: number
  text: string
  categoryId: number
}

export interface AppInfo {
  buildTime: string
}

// --- Info ---
export const getInfo = () =>
  api.get<AppInfo>('/info')

// --- Auth ---
export const getPlayers = () =>
  api.get<PlayerSummary[]>('/auth/players')

export const loginPlayer = (playerId: number, pin: string) =>
  api.post<{ token: string; playerId: number; displayName: string; avatarKey: string }>(
    `/auth/players/${playerId}/login`, { pin })

export const adminLogin = (username: string, password: string) =>
  api.post<{ token: string }>('/admin/auth', { username, password })

// --- Game ---
export const getCategories = () => api.get<Category[]>('/categories')

export const startSession = (categoryIds: number[]) =>
  api.post<SessionResponse>('/sessions', { categoryIds })

export const getNextWord = (sessionId: number) =>
  api.get<NextWordResponse>(`/sessions/${sessionId}/next-word`)

export const submitAnswer = (
  sessionId: number,
  wordId: number,
  chosenCategoryId: number,
  timeRemaining: number
) =>
  api.post<AnswerResponse>(`/sessions/${sessionId}/answers`, {
    wordId,
    chosenCategoryId,
    timeRemaining,
  })

export const completeSession = (sessionId: number) =>
  api.post(`/sessions/${sessionId}/complete`)

// --- Leaderboard ---
export type GameType = 'word-blitz' | 'math-blitz' | 'snake' | 'tetris'

export const getLeaderboard = (gameType: GameType, limit = 20) =>
  api.get<LeaderboardEntry[]>(`/leaderboard/${gameType}?limit=${limit}`)

// --- Score submission ---
export const submitSnakeScore = (score: number) =>
  api.post('/snake/scores', { score })

export const submitMathScore = (score: number, difficulty: string) =>
  api.post('/math/scores', { score, difficulty })

export const submitTetrisScore = (score: number, level: number, lines: number) =>
  api.post('/tetris/scores', { score, level, lines })

// --- Admin ---
export const adminGetCategories = () => api.get<Category[]>('/admin/categories')
export const adminCreateCategory = (data: { nameDa: string; nameEn: string; color: string }) =>
  api.post<Category>('/admin/categories', data)
export const adminUpdateCategory = (id: number, data: { nameDa: string; nameEn: string; color: string }) =>
  api.put<Category>(`/admin/categories/${id}`, data)
export const adminDeleteCategory = (id: number) => api.delete(`/admin/categories/${id}`)

export const adminGetWords = (categoryId: number) =>
  api.get<Word[]>(`/admin/words?categoryId=${categoryId}`)
export const adminCreateWord = (data: { text: string; categoryId: number }) =>
  api.post<Word>('/admin/words', data)
export const adminUpdateWord = (id: number, data: { text: string; categoryId: number }) =>
  api.put<Word>(`/admin/words/${id}`, data)
export const adminDeleteWord = (id: number) => api.delete(`/admin/words/${id}`)

export const adminGetPlayers = () => api.get<AdminPlayer[]>('/admin/players')
export const adminCreatePlayer = (data: { displayName: string; avatarKey: string; pin: string }) =>
  api.post<AdminPlayer>('/admin/players', data)
export const adminUpdatePlayer = (id: number, data: { displayName: string; avatarKey: string }) =>
  api.put<AdminPlayer>(`/admin/players/${id}`, { ...data, pin: null })
export const adminResetPin = (id: number, pin: string) =>
  api.post(`/admin/players/${id}/pin`, { pin })
export const adminDeletePlayer = (id: number) => api.delete(`/admin/players/${id}`)

export const adminGetProgress = () => api.get<PlayerProgress[]>('/admin/progress')

export default api
