import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { submitMathScore } from '../api/client'
import NavBar from '../components/NavBar'
import TimerBar from '../components/TimerBar'
import GameOver from '../components/GameOver'
import {
  Difficulty,
  MathProblem,
  generateProblem,
  calculatePoints,
  nextTimeLimit,
  startingTimeLimit,
} from '../lib/mathProblemGenerator'
import styles from './MathBlitzPage.module.css'

type Phase = 'select' | 'playing' | 'gameover'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

export default function MathBlitzPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<Phase>('select')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [timeLimit, setTimeLimit] = useState(startingTimeLimit())
  const [flashState, setFlashState] = useState<'correct' | 'wrong' | null>(null)
  const [timerKey, setTimerKey] = useState(0)
  const [answering, setAnswering] = useState(false)

  const remainingRef = useRef(timeLimit)

  useEffect(() => {
    remainingRef.current = timeLimit
    setTimerKey((k) => k + 1)
    setAnswering(false)
  }, [problem, timeLimit])

  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => {
      remainingRef.current = Math.max(0, remainingRef.current - 0.1)
    }, 100)
    return () => clearInterval(id)
  }, [timerKey, phase])

  function startGame(d: Difficulty) {
    setDifficulty(d)
    setScore(0)
    setStreak(0)
    setCorrectCount(0)
    setMaxStreak(0)
    setTimeLimit(startingTimeLimit())
    setProblem(generateProblem(d))
    setPhase('playing')
  }

  const endGame = useCallback(
    (finalScore: number) => {
      if (finalScore > 0) {
        submitMathScore(finalScore, difficulty).catch(() => {})
      }
      setPhase('gameover')
    },
    [difficulty]
  )

  function handleChoice(choice: number) {
    if (!problem || answering) return
    setAnswering(true)

    if (choice === problem.answer) {
      const points = calculatePoints(remainingRef.current, timeLimit, streak)
      const newStreak = streak + 1
      setScore((s) => s + points)
      setStreak(newStreak)
      setCorrectCount((c) => c + 1)
      setMaxStreak((m) => Math.max(m, newStreak))
      setFlashState('correct')
      setTimeout(() => setFlashState(null), 500)
      setTimeLimit((tl) => nextTimeLimit(tl))
      setProblem(generateProblem(difficulty))
    } else {
      setFlashState('wrong')
      setTimeout(() => setFlashState(null), 500)
      endGame(score)
    }
  }

  const handleTimeout = useCallback(() => {
    if (answering) return
    setFlashState('wrong')
    setTimeout(() => setFlashState(null), 500)
    endGame(score)
  }, [answering, endGame, score])

  function handlePlayAgain() {
    setPhase('select')
    setProblem(null)
  }

  return (
    <div className={`page ${flashState === 'correct' ? 'animate-flash-green' : ''} ${flashState === 'wrong' ? 'animate-flash-red' : ''}`}>
      <NavBar />

      {phase === 'select' && (
        <div className={styles.selectPhase}>
          <h2>{t('mathBlitz.chooseDifficulty')}</h2>
          <div className={styles.difficultyGrid}>
            {DIFFICULTIES.map((d) => (
              <button key={d} className={`${styles.difficultyCard} ${styles[d]}`} onClick={() => startGame(d)}>
                <span className={styles.difficultyIcon}>
                  {d === 'easy' ? '🌱' : d === 'medium' ? '🌟' : '🔥'}
                </span>
                <span className={styles.difficultyName}>{t(`mathBlitz.${d}`)}</span>
                <span className={styles.difficultyDesc}>{t(`mathBlitz.${d}Desc`)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'playing' && problem && (
        <div className={styles.board}>
          <div className={styles.hud}>
            <span className={styles.hudItem}>
              <span className={styles.hudLabel}>{t('game.score', { score: '' })}</span>
              <span className={styles.hudValue}>{score.toLocaleString()}</span>
            </span>
            <span className={styles.hudItem}>
              <span className={styles.hudLabel}>{t('game.streak', { streak: '' })}</span>
              <span className={styles.hudValue}>x{streak}</span>
            </span>
          </div>

          <TimerBar key={timerKey} duration={timeLimit} onTimeout={handleTimeout} running={!answering} />

          <div className={styles.problemCard}>
            <p className={styles.prompt}>{t('mathBlitz.prompt')}</p>
            <h1 className={styles.problem}>{problem.text} = ?</h1>
          </div>

          <div className={styles.choiceGrid}>
            {problem.choices.map((choice) => (
              <button key={choice} className={styles.choiceBtn} onClick={() => handleChoice(choice)}>
                {choice}
              </button>
            ))}
          </div>
        </div>
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
