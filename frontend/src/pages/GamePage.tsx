import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  getCategories,
  startSession,
  getNextWord,
  submitAnswer,
  completeSession,
  Category,
  NextWordResponse,
} from '../api/client'
import NavBar from '../components/NavBar'
import CategorySelector from '../components/CategorySelector'
import GameBoard from '../components/GameBoard'
import GameOver from '../components/GameOver'
import styles from './GamePage.module.css'

type GamePhase = 'select' | 'playing' | 'gameover'

export default function GamePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<GamePhase>('select')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [currentWord, setCurrentWord] = useState<NextWordResponse | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLimit, setTimeLimit] = useState(10)
  const [correctCount, setCorrectCount] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [flashState, setFlashState] = useState<'correct' | 'wrong' | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data))
  }, [])

  async function handleStartGame() {
    if (selectedIds.length < 2) return
    setLoading(true)
    try {
      const res = await startSession(selectedIds)
      setSessionId(res.data.sessionId)
      setTimeLimit(res.data.startingTimeLimit)
      setScore(0)
      setStreak(0)
      setCorrectCount(0)
      setMaxStreak(0)
      await fetchNextWord(res.data.sessionId)
      setPhase('playing')
    } finally {
      setLoading(false)
    }
  }

  const fetchNextWord = useCallback(async (sid: number) => {
    const res = await getNextWord(sid)
    setCurrentWord(res.data)
  }, [])

  async function handleAnswer(categoryId: number, remaining: number) {
    if (!sessionId || !currentWord) return

    const res = await submitAnswer(sessionId, currentWord.wordId, categoryId, remaining)
    const data = res.data

    setScore(data.totalScore)
    setStreak(data.streak)
    setCorrectCount((c) => c + (data.correct ? 1 : 0))
    setMaxStreak((m) => Math.max(m, data.streak))

    if (data.correct) {
      setFlashState('correct')
      setTimeLimit(data.nextTimeLimit)
    } else {
      setFlashState('wrong')
    }

    setTimeout(() => setFlashState(null), 500)

    if (data.gameOver) {
      await completeSession(sessionId)
      setPhase('gameover')
    } else {
      await fetchNextWord(sessionId)
    }
  }

  async function handleTimeout() {
    if (!sessionId) return
    await completeSession(sessionId)
    setFlashState('wrong')
    setTimeout(() => setFlashState(null), 500)
    setPhase('gameover')
  }

  function handlePlayAgain() {
    setPhase('select')
    setCurrentWord(null)
    setSessionId(null)
  }

  return (
    <div className={`page ${flashState === 'correct' ? 'animate-flash-green' : ''} ${flashState === 'wrong' ? 'animate-flash-red' : ''}`}>
      <NavBar />

      {phase === 'select' && (
        <div className={styles.selectPhase}>
          <h2>{t('game.selectCategories')}</h2>
          <CategorySelector
            categories={categories}
            selected={selectedIds}
            onChange={setSelectedIds}
          />
          {selectedIds.length < 2 && (
            <p className={styles.hint}>{t('game.selectMin')}</p>
          )}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleStartGame}
            disabled={selectedIds.length < 2 || loading}
          >
            {loading ? '...' : t('game.startGame')}
          </button>
        </div>
      )}

      {phase === 'playing' && currentWord && (
        <GameBoard
          word={currentWord.wordText}
          categories={categories.filter((c) => currentWord.categoryIds.includes(c.id))}
          timeLimit={timeLimit}
          score={score}
          streak={streak}
          onAnswer={handleAnswer}
          onTimeout={handleTimeout}
        />
      )}

      {phase === 'gameover' && (
        <GameOver
          score={score}
          correctAnswers={correctCount}
          maxStreak={maxStreak}
          onPlayAgain={handlePlayAgain}
          onMenu={() => navigate('/')}
        />
      )}
    </div>
  )
}
