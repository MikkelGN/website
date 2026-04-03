import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NavBar from '../components/NavBar'
import styles from './SnakePage.module.css'
import { submitSnakeScore } from '../api/client'

const COLS = 20
const ROWS = 20
const CELL = 20
const W = COLS * CELL
const H = ROWS * CELL

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Pt = { x: number; y: number }
type GameState = 'idle' | 'playing' | 'paused' | 'gameover'

const OPPOSITE: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }

function randomPt(snake: Pt[]): Pt {
  let p: Pt
  do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) } }
  while (snake.some(s => s.x === p.x && s.y === p.y))
  return p
}

function getSpeed(score: number): number {
  return Math.max(60, 150 - Math.floor(score / 50) * 10)
}

export default function SnakePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const stateRef = useRef<GameState>('idle')
  const snakeRef = useRef<Pt[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }])
  const dirRef = useRef<Dir>('RIGHT')
  const nextDirRef = useRef<Dir>('RIGHT')
  const foodRef = useRef<Pt>({ x: 15, y: 10 })
  const scoreRef = useRef(0)
  const lastTickRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const [uiState, setUiState] = useState<GameState>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('snakeHighScore') || '0', 10)
  )

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, W, H)

    // Grid dots
    ctx.fillStyle = '#15152a'
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2)

    // Food
    const f = foodRef.current
    ctx.shadowBlur = 20
    ctx.shadowColor = '#ff00ff'
    ctx.fillStyle = '#ff00ff'
    ctx.fillRect(f.x * CELL + 3, f.y * CELL + 3, CELL - 6, CELL - 6)

    // Snake
    snakeRef.current.forEach((seg, i) => {
      const isHead = i === 0
      ctx.shadowBlur = isHead ? 25 : 12
      ctx.shadowColor = isHead ? '#00ffff' : '#00ff88'
      ctx.fillStyle = isHead
        ? '#00ffff'
        : `rgba(0,255,136,${Math.max(0.4, 1 - i * 0.025)})`
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
    })
    ctx.shadowBlur = 0
  }, [])

  const endGame = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    stateRef.current = 'gameover'
    setUiState('gameover')
    const finalScore = scoreRef.current
    setHighScore(prev => {
      const n = Math.max(prev, finalScore)
      localStorage.setItem('snakeHighScore', String(n))
      return n
    })
    if (finalScore > 0) submitSnakeScore(finalScore).catch(() => {})
    draw()
  }, [draw])

  const tick = useCallback(() => {
    dirRef.current = nextDirRef.current
    const snake = snakeRef.current
    const { x, y } = snake[0]
    const d = dirRef.current
    const head: Pt = {
      x: d === 'LEFT' ? x - 1 : d === 'RIGHT' ? x + 1 : x,
      y: d === 'UP' ? y - 1 : d === 'DOWN' ? y + 1 : y,
    }

    if (
      head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
      snake.slice(0, -1).some(s => s.x === head.x && s.y === head.y)
    ) {
      endGame()
      return
    }

    const ateFood = head.x === foodRef.current.x && head.y === foodRef.current.y
    const newSnake = [head, ...snake]
    if (!ateFood) newSnake.pop()
    snakeRef.current = newSnake

    if (ateFood) {
      const newScore = scoreRef.current + 10
      scoreRef.current = newScore
      setScore(newScore)
      foodRef.current = randomPt(newSnake)
    }

    draw()
  }, [draw, endGame])

  const gameLoop = useCallback((timestamp: number) => {
    if (stateRef.current !== 'playing') return
    if (timestamp - lastTickRef.current >= getSpeed(scoreRef.current)) {
      lastTickRef.current = timestamp
      tick()
    }
    rafRef.current = requestAnimationFrame(gameLoop)
  }, [tick])

  const startGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
    dirRef.current = 'RIGHT'
    nextDirRef.current = 'RIGHT'
    scoreRef.current = 0
    foodRef.current = randomPt(snakeRef.current)
    lastTickRef.current = 0
    setScore(0)
    stateRef.current = 'playing'
    setUiState('playing')
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(gameLoop)
  }, [gameLoop])

  // Initial draw + cleanup
  useEffect(() => { draw() }, [draw])
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'UP', w: 'UP', W: 'UP',
        ArrowDown: 'DOWN', s: 'DOWN', S: 'DOWN',
        ArrowLeft: 'LEFT', a: 'LEFT', A: 'LEFT',
        ArrowRight: 'RIGHT', d: 'RIGHT', D: 'RIGHT',
      }
      if (map[e.key] && map[e.key] !== OPPOSITE[dirRef.current]) {
        nextDirRef.current = map[e.key]
        e.preventDefault()
      }
      if (e.key === ' ') {
        e.preventDefault()
        if (stateRef.current === 'playing') {
          stateRef.current = 'paused'
          setUiState('paused')
          if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
        } else if (stateRef.current === 'paused') {
          stateRef.current = 'playing'
          setUiState('playing')
          lastTickRef.current = 0
          rafRef.current = requestAnimationFrame(gameLoop)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gameLoop])

  // Touch/swipe controls
  useEffect(() => {
    let sx = 0, sy = 0
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      const d = dirRef.current
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20 && d !== 'LEFT') nextDirRef.current = 'RIGHT'
        else if (dx < -20 && d !== 'RIGHT') nextDirRef.current = 'LEFT'
      } else {
        if (dy > 20 && d !== 'UP') nextDirRef.current = 'DOWN'
        else if (dy < -20 && d !== 'DOWN') nextDirRef.current = 'UP'
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [])

  const resumeGame = useCallback(() => {
    stateRef.current = 'playing'
    setUiState('playing')
    lastTickRef.current = 0
    rafRef.current = requestAnimationFrame(gameLoop)
  }, [gameLoop])

  return (
    <div className="page">
      <NavBar />
      <div className={styles.content}>
        <div className={styles.hud}>
          <span className={styles.hudItem}>
            {t('snake.score')}: <strong className={styles.scoreVal}>{score}</strong>
          </span>
          <span className={styles.hudItem}>
            {t('snake.best')}: <strong className={styles.highVal}>{highScore}</strong>
          </span>
        </div>

        <div className={styles.canvasWrapper}>
          <canvas ref={canvasRef} width={W} height={H} className={styles.canvas} />

          {uiState === 'idle' && (
            <div className={styles.overlay}>
              <h2 className={styles.overlayTitle}>{t('snake.title')}</h2>
              <p className={styles.overlayHint}>{t('snake.hint')}</p>
              <button className="btn btn-primary btn-lg" onClick={startGame}>
                {t('snake.start')}
              </button>
            </div>
          )}

          {uiState === 'paused' && (
            <div className={styles.overlay}>
              <h2 className={styles.overlayTitle}>{t('snake.paused')}</h2>
              <button className="btn btn-secondary btn-lg" onClick={resumeGame}>
                {t('snake.resume')}
              </button>
            </div>
          )}

          {uiState === 'gameover' && (
            <div className={styles.overlay}>
              <h2 className={`${styles.overlayTitle} ${styles.gameoverTitle}`}>
                {t('snake.gameover')}
              </h2>
              <p className={styles.finalScore}>
                {t('snake.score')}: <span className={styles.scoreVal}>{score}</span>
              </p>
              {score > 0 && score >= highScore && (
                <p className={styles.newHigh}>★ {t('snake.newHigh')} ★</p>
              )}
              <div className={styles.overlayButtons}>
                <button className="btn btn-primary" onClick={startGame}>
                  {t('snake.playAgain')}
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                  {t('snake.menu')}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className={styles.controlsHint}>{t('snake.controlsHint')}</p>
      </div>
    </div>
  )
}
