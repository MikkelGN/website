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
  username: string
  totalScore: number
  correctAnswers: number
  maxStreak: number
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

export interface AppUser {
  id: number
  username: string
  createdAt: string
}

export interface Word {
  id: number
  text: string
  categoryId: number
}

export interface AppInfo {
  version: string
  llmModel: string
}

// --- Info ---
export const getInfo = () =>
  api.get<AppInfo>('/info')

// --- Auth ---
export const login = (username: string) =>
  api.post<{ token: string; userId: number; username: string }>('/auth/login', { username })

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
export const getLeaderboard = (limit = 20) =>
  api.get<LeaderboardEntry[]>(`/leaderboard?limit=${limit}`)

// --- Snake ---
export interface SnakeLeaderboardEntry {
  rank: number
  username: string
  score: number
}

export const submitSnakeScore = (score: number) =>
  api.post('/snake/scores', { score })

export const getSnakeLeaderboard = (limit = 20) =>
  api.get<SnakeLeaderboardEntry[]>(`/snake/leaderboard?limit=${limit}`)

// --- Tetris ---
export interface TetrisLeaderboardEntry {
  rank: number
  username: string
  score: number
  level: number
  lines: number
}

export const submitTetrisScore = (score: number, level: number, lines: number) =>
  api.post('/tetris/scores', { score, level, lines })

export const getTetrisLeaderboard = (limit = 20) =>
  api.get<TetrisLeaderboardEntry[]>(`/tetris/leaderboard?limit=${limit}`)

// --- LinkedIn Speech ---
export const convertToLinkedIn = (text: string, language?: string) =>
  api.post<{ post: string }>('/linkedin/convert', { text, language })

// --- Wordle ---
export interface WordleGuess {
  word: string
  colors: string[]
}

export const getWordleSuggestions = (guesses: WordleGuess[]) =>
  api.post<{ words: string[]; count: number }>('/wordle/suggestions', { guesses })

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

export const adminGetUsers = () => api.get<AppUser[]>('/admin/users')

export default api
