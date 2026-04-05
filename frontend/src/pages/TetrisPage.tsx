import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NavBar from '../components/NavBar'
import styles from './TetrisPage.module.css'
import { submitTetrisScore } from '../api/client'

// ── Constants ──────────────────────────────────────────────────────────────
const COLS = 10
const ROWS = 20
const CELL = 26
const BOARD_W = COLS * CELL   // 260
const BOARD_H = ROWS * CELL   // 520
const PANEL = 110
const CW = BOARD_W + PANEL * 2

const LINE_SCORES = [0, 100, 300, 500, 800]

// ── Tetromino definitions ──────────────────────────────────────────────────
const PIECES = {
  I: [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ],
  O: [
    [[1,1],[1,1]], [[1,1],[1,1]], [[1,1],[1,1]], [[1,1],[1,1]],
  ],
  T: [
    [[0,1,0],[1,1,1],[0,0,0]], [[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]], [[0,1,0],[1,1,0],[0,1,0]],
  ],
  S: [
    [[0,1,1],[1,1,0],[0,0,0]], [[0,1,0],[0,1,1],[0,0,1]],
    [[0,0,0],[0,1,1],[1,1,0]], [[1,0,0],[1,1,0],[0,1,0]],
  ],
  Z: [
    [[1,1,0],[0,1,1],[0,0,0]], [[0,0,1],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,0],[0,1,1]], [[0,1,0],[1,1,0],[1,0,0]],
  ],
  J: [
    [[1,0,0],[1,1,1],[0,0,0]], [[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]], [[0,1,0],[0,1,0],[1,1,0]],
  ],
  L: [
    [[0,0,1],[1,1,1],[0,0,0]], [[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]], [[1,1,0],[0,1,0],[0,1,0]],
  ],
} as const

const PIECE_KEYS = ['I','O','T','S','Z','J','L'] as const
type PieceKey = typeof PIECE_KEYS[number]

const COLORS: Record<PieceKey, string> = {
  I: '#00ffff', O: '#ffff00', T: '#cc00ff',
  S: '#00ff88', Z: '#ff2244', J: '#4488ff', L: '#ff8800',
}
const GLOWS: Record<PieceKey, string> = {
  I: 'rgba(0,255,255,0.7)', O: 'rgba(255,255,0,0.7)', T: 'rgba(200,0,255,0.7)',
  S: 'rgba(0,255,136,0.7)', Z: 'rgba(255,34,68,0.7)', J: 'rgba(68,136,255,0.7)', L: 'rgba(255,136,0,0.7)',
}

// ── Types ──────────────────────────────────────────────────────────────────
type Board = (PieceKey | null)[][]
type GameState = 'idle' | 'playing' | 'paused' | 'gameover'
interface Piece { key: PieceKey; rot: number; x: number; y: number }

// ── Pure helpers ───────────────────────────────────────────────────────────
function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function makePiece(key: PieceKey): Piece {
  return { key, rot: 0, x: key === 'O' ? 4 : 3, y: 0 }
}

function randomPiece(): Piece {
  return makePiece(PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)])
}

function matrix(piece: Piece) {
  return PIECES[piece.key][piece.rot]
}

function valid(board: Board, piece: Piece, dx = 0, dy = 0, rot?: number): boolean {
  const m = rot !== undefined ? PIECES[piece.key][rot] : matrix(piece)
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      if (!m[r][c]) continue
      const nx = piece.x + c + dx
      const ny = piece.y + r + dy
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false
      if (ny >= 0 && board[ny][nx]) return false
    }
  }
  return true
}

function place(board: Board, piece: Piece): Board {
  const b = board.map(r => [...r])
  const m = matrix(piece)
  for (let r = 0; r < m.length; r++)
    for (let c = 0; c < m[r].length; c++)
      if (m[r][c] && piece.y + r >= 0) b[piece.y + r][piece.x + c] = piece.key
  return b
}

function clearLines(board: Board): { board: Board; cleared: number } {
  const kept = board.filter(row => row.some(c => !c))
  const cleared = ROWS - kept.length
  return { board: [...Array.from({ length: cleared }, () => Array(COLS).fill(null)), ...kept], cleared }
}

function ghost(board: Board, piece: Piece): Piece {
  let g = { ...piece }
  while (valid(board, g, 0, 1)) g = { ...g, y: g.y + 1 }
  return g
}

function speed(level: number) {
  return Math.max(80, 800 - (level - 1) * 70)
}

// ── Component ──────────────────────────────────────────────────────────────
export default function TetrisPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const stateRef   = useRef<GameState>('idle')
  const boardRef   = useRef<Board>(emptyBoard())
  const curRef     = useRef<Piece>(randomPiece())
  const nextRef    = useRef<Piece>(randomPiece())
  const holdRef    = useRef<PieceKey | null>(null)
  const canHoldRef = useRef(true)
  const scoreRef   = useRef(0)
  const levelRef   = useRef(1)
  const linesRef   = useRef(0)
  const lastRef    = useRef(0)
  const rafRef     = useRef<number | null>(null)

  const [uiState,   setUiState]   = useState<GameState>('idle')
  const [score,     setScore]     = useState(0)
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('tetrisHighScore') || '0', 10)
  )

  // ── Drawing ──────────────────────────────────────────────────────────────
  const drawMini = useCallback((
    ctx: CanvasRenderingContext2D,
    key: PieceKey,
    ox: number,
    oy: number,
    dim = false,
  ) => {
    const m = PIECES[key][0]
    const mw = m[0].length
    const mh = m.length
    const cs = 20
    const startX = ox + (PANEL - mw * cs) / 2
    const startY = oy
    ctx.globalAlpha = dim ? 0.35 : 1
    for (let r = 0; r < mh; r++) {
      for (let c = 0; c < mw; c++) {
        if (!m[r][c]) continue
        ctx.shadowBlur = 6
        ctx.shadowColor = GLOWS[key]
        ctx.fillStyle = COLORS[key]
        ctx.fillRect(startX + c * cs, startY + r * cs, cs - 2, cs - 2)
        ctx.fillStyle = 'rgba(255,255,255,0.18)'
        ctx.fillRect(startX + c * cs, startY + r * cs, cs - 2, 3)
      }
    }
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, CW, BOARD_H)

    // Board bg + grid
    ctx.fillStyle = '#0c0c18'
    ctx.fillRect(PANEL, 0, BOARD_W, BOARD_H)
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 1
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath(); ctx.moveTo(PANEL + c * CELL, 0); ctx.lineTo(PANEL + c * CELL, BOARD_H); ctx.stroke()
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(PANEL, r * CELL); ctx.lineTo(PANEL + BOARD_W, r * CELL); ctx.stroke()
    }

    // Placed cells
    const board = boardRef.current
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const key = board[r][c]
        if (!key) continue
        const x = PANEL + c * CELL, y = r * CELL
        ctx.shadowBlur = 6
        ctx.shadowColor = GLOWS[key]
        ctx.fillStyle = COLORS[key]
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2)
        ctx.fillStyle = 'rgba(255,255,255,0.15)'
        ctx.fillRect(x + 2, y + 2, CELL - 4, 4)
        ctx.shadowBlur = 0
      }
    }

    if (stateRef.current === 'playing' || stateRef.current === 'paused') {
      const cur = curRef.current

      // Ghost
      const g = ghost(board, cur)
      const gm = matrix(g)
      ctx.globalAlpha = 0.2
      for (let r = 0; r < gm.length; r++) {
        for (let c = 0; c < gm[r].length; c++) {
          if (!gm[r][c]) continue
          const x = PANEL + (g.x + c) * CELL, y = (g.y + r) * CELL
          if (y < 0) continue
          ctx.strokeStyle = COLORS[cur.key]
          ctx.lineWidth = 1
          ctx.strokeRect(x + 1, y + 1, CELL - 2, CELL - 2)
        }
      }
      ctx.globalAlpha = 1

      // Current piece
      const m = matrix(cur)
      for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[r].length; c++) {
          if (!m[r][c]) continue
          const x = PANEL + (cur.x + c) * CELL, y = (cur.y + r) * CELL
          if (y < 0) continue
          ctx.shadowBlur = 10
          ctx.shadowColor = GLOWS[cur.key]
          ctx.fillStyle = COLORS[cur.key]
          ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2)
          ctx.fillStyle = 'rgba(255,255,255,0.2)'
          ctx.fillRect(x + 2, y + 2, CELL - 4, 4)
          ctx.shadowBlur = 0
        }
      }
    }

    // Board border
    ctx.strokeStyle = 'rgba(255,0,255,0.35)'
    ctx.lineWidth = 1
    ctx.strokeRect(PANEL, 0, BOARD_W, BOARD_H)

    // ── Left panel: HOLD ──
    ctx.font = '7px "Press Start 2P", monospace'
    ctx.fillStyle = '#5050a0'
    ctx.fillText('HOLD', 8, 18)
    if (holdRef.current) drawMini(ctx, holdRef.current, 0, 26, !canHoldRef.current)

    // ── Right panel: NEXT + stats ──
    const rx = PANEL + BOARD_W
    ctx.font = '7px "Press Start 2P", monospace'
    ctx.fillStyle = '#5050a0'
    ctx.fillText('NEXT', rx + 8, 18)
    drawMini(ctx, nextRef.current.key, rx, 26)

    const stats: Array<[string, string, string]> = [
      ['SCORE', String(scoreRef.current), '#ff00ff'],
      ['LEVEL', String(levelRef.current), '#00ffff'],
      ['LINES', String(linesRef.current), '#00ff88'],
    ]
    let sy = 130
    for (const [label, value, color] of stats) {
      ctx.font = '6px "Press Start 2P", monospace'
      ctx.fillStyle = '#5050a0'
      ctx.fillText(label, rx + 8, sy)
      ctx.font = '10px "Press Start 2P", monospace'
      ctx.fillStyle = color
      ctx.fillText(value, rx + 8, sy + 18)
      sy += 52
    }
  }, [drawMini])

  // ── Game logic ────────────────────────────────────────────────────────────
  const endGame = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    stateRef.current = 'gameover'
    setUiState('gameover')
    const s = scoreRef.current
    setHighScore(prev => { const n = Math.max(prev, s); localStorage.setItem('tetrisHighScore', String(n)); return n })
    if (s > 0) submitTetrisScore(s, levelRef.current, linesRef.current).catch(() => {})
    draw()
  }, [draw])

  const spawn = useCallback(() => {
    curRef.current = { ...nextRef.current }
    nextRef.current = randomPiece()
    canHoldRef.current = true
    if (!valid(boardRef.current, curRef.current)) endGame()
  }, [endGame])

  const lock = useCallback(() => {
    const { board: cleared, cleared: n } = clearLines(place(boardRef.current, curRef.current))
    boardRef.current = cleared
    if (n > 0) {
      scoreRef.current += LINE_SCORES[n] * levelRef.current
      linesRef.current += n
      levelRef.current = Math.floor(linesRef.current / 10) + 1
      setScore(scoreRef.current)
    }
    spawn()
  }, [spawn])

  const loop = useCallback((ts: number) => {
    if (stateRef.current !== 'playing') return
    if (ts - lastRef.current >= speed(levelRef.current)) {
      lastRef.current = ts
      if (valid(boardRef.current, curRef.current, 0, 1)) {
        curRef.current = { ...curRef.current, y: curRef.current.y + 1 }
      } else {
        lock()
      }
    }
    draw()
    rafRef.current = requestAnimationFrame(loop)
  }, [draw, lock])

  const startGame = useCallback(() => {
    boardRef.current = emptyBoard()
    curRef.current = randomPiece()
    nextRef.current = randomPiece()
    holdRef.current = null
    canHoldRef.current = true
    scoreRef.current = 0; levelRef.current = 1; linesRef.current = 0
    lastRef.current = 0
    setScore(0)
    stateRef.current = 'playing'
    setUiState('playing')
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  const resume = useCallback(() => {
    stateRef.current = 'playing'
    setUiState('playing')
    lastRef.current = 0
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  useEffect(() => { draw() }, [draw])
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const playing = stateRef.current === 'playing'

      if (e.key === ' ') {
        e.preventDefault()
        if (playing) {
          // Hard drop
          const g = ghost(boardRef.current, curRef.current)
          const dropped = g.y - curRef.current.y
          curRef.current = g
          scoreRef.current += dropped * 2
          setScore(scoreRef.current)
          lock()
        } else if (stateRef.current === 'paused') {
          resume()
        }
        return
      }

      if (!playing) return
      const p = curRef.current
      const b = boardRef.current

      switch (e.key) {
        case 'ArrowLeft':  case 'a': case 'A':
          if (valid(b, p, -1)) curRef.current = { ...p, x: p.x - 1 }
          e.preventDefault(); break
        case 'ArrowRight': case 'd': case 'D':
          if (valid(b, p, 1))  curRef.current = { ...p, x: p.x + 1 }
          e.preventDefault(); break
        case 'ArrowDown':  case 's': case 'S':
          if (valid(b, p, 0, 1)) { curRef.current = { ...p, y: p.y + 1 }; scoreRef.current += 1; setScore(scoreRef.current) }
          else lock()
          e.preventDefault(); break
        case 'ArrowUp': case 'w': case 'W': case 'x': case 'X': {
          const rot = (p.rot + 1) % 4 as 0|1|2|3
          const kicks = [0, 1, -1, 2, -2]
          for (const k of kicks) {
            if (valid(b, p, k, 0, rot)) { curRef.current = { ...p, x: p.x + k, rot }; break }
          }
          e.preventDefault(); break
        }
        case 'z': case 'Z': {
          const rot = (p.rot + 3) % 4 as 0|1|2|3
          const kicks = [0, 1, -1, 2, -2]
          for (const k of kicks) {
            if (valid(b, p, k, 0, rot)) { curRef.current = { ...p, x: p.x + k, rot }; break }
          }
          break
        }
        case 'c': case 'C': case 'Shift': {
          if (!canHoldRef.current) break
          const prev = holdRef.current
          holdRef.current = p.key
          canHoldRef.current = false
          if (prev) curRef.current = makePiece(prev)
          else spawn()
          break
        }
        case 'Escape': case 'p': case 'P':
          stateRef.current = 'paused'
          setUiState('paused')
          if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
          break
      }
      draw()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [draw, lock, spawn, resume])

  // ── Touch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let sx = 0, sy = 0, lastTap = 0
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      if (stateRef.current !== 'playing') return
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      const p = curRef.current, b = boardRef.current
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20 && valid(b, p, 1)) curRef.current = { ...p, x: p.x + 1 }
        else if (dx < -20 && valid(b, p, -1)) curRef.current = { ...p, x: p.x - 1 }
      } else if (dy > 40) {
        const g = ghost(b, p)
        curRef.current = g
        lock()
      } else if (dy < -20) {
        const rot = (p.rot + 1) % 4 as 0|1|2|3
        for (const k of [0, 1, -1]) if (valid(b, p, k, 0, rot)) { curRef.current = { ...p, x: p.x + k, rot }; break }
      }
      const now = Date.now()
      if (now - lastTap < 300 && canHoldRef.current) {
        const prev = holdRef.current
        holdRef.current = p.key; canHoldRef.current = false
        if (prev) curRef.current = makePiece(prev); else spawn()
      }
      lastTap = now
      draw()
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd) }
  }, [draw, lock, spawn])

  return (
    <div className="page">
      <NavBar />
      <div className={styles.content}>
        <div className={styles.hud}>
          <span>{t('tetris.best')}: <strong className={styles.highVal}>{highScore.toLocaleString()}</strong></span>
        </div>

        <div className={styles.canvasWrapper}>
          <canvas ref={canvasRef} width={CW} height={BOARD_H} className={styles.canvas} />

          {uiState === 'idle' && (
            <div className={styles.overlay}>
              <h2 className={styles.overlayTitle}>{t('tetris.title')}</h2>
              <p className={styles.overlayHint}>{t('tetris.hint')}</p>
              <button className="btn btn-primary btn-lg" onClick={startGame}>{t('tetris.start')}</button>
            </div>
          )}
          {uiState === 'paused' && (
            <div className={styles.overlay}>
              <h2 className={styles.overlayTitle}>{t('tetris.paused')}</h2>
              <button className="btn btn-secondary btn-lg" onClick={resume}>{t('tetris.resume')}</button>
            </div>
          )}
          {uiState === 'gameover' && (
            <div className={styles.overlay}>
              <h2 className={`${styles.overlayTitle} ${styles.gameoverTitle}`}>{t('tetris.gameover')}</h2>
              <p className={styles.finalScore}>{t('tetris.score')}: <span className={styles.scoreVal}>{score.toLocaleString()}</span></p>
              {score > 0 && score >= highScore && <p className={styles.newHigh}>★ {t('tetris.newHigh')} ★</p>}
              <div className={styles.overlayButtons}>
                <button className="btn btn-primary" onClick={startGame}>{t('tetris.playAgain')}</button>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>{t('tetris.menu')}</button>
              </div>
            </div>
          )}
        </div>

        <p className={styles.controlsHint}>{t('tetris.controlsHint')}</p>
      </div>
    </div>
  )
}
