import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import NavBar from '../components/NavBar'
import { getWordleSuggestions } from '../api/client'
import styles from './WordlePage.module.css'

// ── Types ──────────────────────────────────────────────────────────────────
type TileColor = 'empty' | 'gray' | 'yellow' | 'green'

interface Row {
  word: string
  colors: TileColor[]
}

// ── Color cycle ────────────────────────────────────────────────────────────
const NEXT_COLOR: Record<TileColor, TileColor> = {
  empty: 'gray',
  gray: 'yellow',
  yellow: 'green',
  green: 'gray',
}

const TILE_BG: Record<TileColor, string> = {
  empty: 'var(--color-bg-card)',
  gray: '#3a3a3c',
  yellow: '#b59f3b',
  green: '#538d4e',
}

// ── Canvas color detection ─────────────────────────────────────────────────
const WORDLE_COLORS: { color: TileColor; rgb: [number, number, number][] }[] = [
  { color: 'green',  rgb: [[83,141,78],[106,170,100],[121,167,107],[79,139,73],[96,163,90]] },
  { color: 'yellow', rgb: [[181,159,59],[201,180,88],[198,182,90],[177,155,58],[200,182,62]] },
  { color: 'gray',   rgb: [[58,58,60],[129,131,132],[120,124,126],[136,136,136],[100,100,102],[58,58,60]] },
]
const COLOR_THRESHOLD = 48

function classifyPixel(r: number, g: number, b: number): TileColor {
  let best: TileColor = 'empty'
  let bestDist = COLOR_THRESHOLD
  for (const { color, rgb } of WORDLE_COLORS) {
    for (const [cr, cg, cb] of rgb) {
      const d = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2)
      if (d < bestDist) { bestDist = d; best = color }
    }
  }
  return best
}

function findPeakCenters(profile: number[], maxPeaks: number): number[] {
  const max = Math.max(...profile)
  if (max === 0) return []
  const threshold = max * 0.25

  const runs: { peak: number; peakVal: number }[] = []
  let inRun = false
  let peakIdx = 0
  let peakVal = 0

  for (let i = 0; i < profile.length; i++) {
    if (profile[i] >= threshold) {
      if (!inRun) { inRun = true; peakIdx = i; peakVal = profile[i] }
      if (profile[i] > peakVal) { peakIdx = i; peakVal = profile[i] }
    } else if (inRun) {
      runs.push({ peak: peakIdx, peakVal })
      inRun = false; peakVal = 0
    }
  }
  if (inRun) runs.push({ peak: peakIdx, peakVal })

  return runs
    .sort((a, b) => b.peakVal - a.peakVal)
    .slice(0, maxPeaks)
    .sort((a, b) => a.peak - b.peak)
    .map(r => r.peak)
}

function analyzeWordleImage(imgEl: HTMLImageElement): TileColor[][] | null {
  const MAX_DIM = 800
  const scale = Math.min(1, MAX_DIM / Math.max(imgEl.naturalWidth, imgEl.naturalHeight))
  const cw = Math.round(imgEl.naturalWidth * scale)
  const ch = Math.round(imgEl.naturalHeight * scale)

  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(imgEl, 0, 0, cw, ch)

  const { data, width, height } = ctx.getImageData(0, 0, cw, ch)

  const xProfile = new Array(width).fill(0)
  const yProfile = new Array(height).fill(0)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      if (classifyPixel(data[idx], data[idx + 1], data[idx + 2]) !== 'empty') {
        xProfile[x]++
        yProfile[y]++
      }
    }
  }

  const colCenters = findPeakCenters(xProfile, 5)
  const rowCenters = findPeakCenters(yProfile, 6)

  if (colCenters.length !== 5 || rowCenters.length === 0) return null

  const result: TileColor[][] = []
  for (const rowY of rowCenters) {
    const rowColors: TileColor[] = colCenters.map(colX => {
      const idx = (rowY * width + colX) * 4
      return classifyPixel(data[idx], data[idx + 1], data[idx + 2])
    })
    if (rowColors.some(c => c !== 'empty')) result.push(rowColors)
  }

  return result.length > 0 ? result : null
}

// ── Helpers ────────────────────────────────────────────────────────────────
function emptyRows(): Row[] {
  return Array.from({ length: 6 }, () => ({
    word: '',
    colors: ['empty', 'empty', 'empty', 'empty', 'empty'] as TileColor[],
  }))
}

// ── Component ──────────────────────────────────────────────────────────────
export default function WordlePage() {
  const { t } = useTranslation()
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<Row[]>(emptyRows)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggCount, setSuggCount] = useState(0)
  const [loadingSugg, setLoadingSugg] = useState(false)
  const [analyzeMsg, setAnalyzeMsg] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  // ── Word input ─────────────────────────────────────────────────────────
  const updateWord = (rowIdx: number, raw: string) => {
    const word = raw.toUpperCase().replace(/[^A-ZÆØÅ]/g, '').slice(0, 5)
    setRows(prev => prev.map((r, i) => {
      if (i !== rowIdx) return r
      const colors = r.colors.map((c, j) =>
        j < word.length ? (c === 'empty' ? 'gray' : c) : 'empty'
      ) as TileColor[]
      return { word, colors }
    }))
  }

  // ── Tile color cycle ───────────────────────────────────────────────────
  const cycleColor = (rowIdx: number, tileIdx: number) => {
    setRows(prev => prev.map((r, i) => {
      if (i !== rowIdx || !r.word[tileIdx]) return r
      const colors = [...r.colors] as TileColor[]
      const next = NEXT_COLOR[colors[tileIdx]]
      colors[tileIdx] = next === 'empty' ? 'gray' : next
      return { ...r, colors }
    }))
  }

  // ── Screenshot upload ──────────────────────────────────────────────────
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setAnalyzeMsg(t('wordle.analyzing'))

    const img = new Image()
    img.onload = () => {
      const detected = analyzeWordleImage(img)
      if (!detected) {
        setAnalyzeMsg(t('wordle.analyzeNoGrid'))
        return
      }
      setRows(prev => prev.map((r, i) => {
        const detectedColors = detected[i]
        if (!detectedColors) return r
        return { ...r, colors: detectedColors }
      }))
      setAnalyzeMsg(t('wordle.analyzeFound', { count: detected.length }))
    }
    img.onerror = () => setAnalyzeMsg(t('wordle.analyzeError'))
    img.src = url
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  // ── Suggestions ────────────────────────────────────────────────────────
  const fetchSuggestions = useCallback(async (currentRows: Row[]) => {
    const guesses = currentRows
      .filter(r => r.word.length === 5 && r.colors.every(c => c !== 'empty'))
      .map(r => ({ word: r.word, colors: r.colors as string[] }))

    if (guesses.length === 0) {
      setSuggestions([])
      setSuggCount(0)
      return
    }
    setLoadingSugg(true)
    try {
      const res = await getWordleSuggestions(guesses)
      setSuggestions(res.data.words)
      setSuggCount(res.data.count)
    } catch {
      // ignore
    } finally {
      setLoadingSugg(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(rows), 400)
    return () => clearTimeout(timer)
  }, [rows, fetchSuggestions])

  // ── Reset ──────────────────────────────────────────────────────────────
  const reset = () => {
    setRows(emptyRows())
    setSuggestions([])
    setSuggCount(0)
    setAnalyzeMsg('')
    setPreview(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────
  const completedRows = rows.filter(r => r.word.length === 5 && r.colors.every(c => c !== 'empty'))

  return (
    <div className="page">
      <NavBar />
      <div className={styles.layout}>

        {/* ── Left: input ── */}
        <div className={styles.inputPanel}>
          <h2 className={styles.title}>{t('wordle.title')}</h2>
          <p className={styles.subtitle}>{t('wordle.subtitle')}</p>

          {/* Upload zone */}
          <div
            className={styles.dropZone}
            onClick={() => fileRef.current?.click()}
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
          >
            {preview
              ? <img src={preview} className={styles.preview} alt="screenshot" />
              : <span className={styles.dropHint}>📷 {t('wordle.uploadHint')}</span>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" className={styles.fileInput} onChange={onFileChange} />

          {analyzeMsg && <p className={styles.analyzeMsg}>{analyzeMsg}</p>}

          {/* Grid */}
          <div className={styles.grid}>
            {rows.map((row, ri) => (
              <div key={ri} className={styles.rowWrap}>
                <input
                  className={styles.wordInput}
                  value={row.word}
                  onChange={e => updateWord(ri, e.target.value)}
                  maxLength={5}
                  placeholder={`${t('wordle.guess')} ${ri + 1}`}
                  spellCheck={false}
                  autoCapitalize="characters"
                />
                <div className={styles.tileRow}>
                  {row.colors.map((color, ti) => (
                    <div
                      key={ti}
                      className={styles.tile}
                      style={{ background: TILE_BG[color] }}
                      onClick={() => cycleColor(ri, ti)}
                      title={t('wordle.clickToCycle')}
                    >
                      {row.word[ti] ?? ''}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.colorLegend}>
            <span><span className={styles.dot} style={{ background: TILE_BG.green }} /> {t('wordle.green')}</span>
            <span><span className={styles.dot} style={{ background: TILE_BG.yellow }} /> {t('wordle.yellow')}</span>
            <span><span className={styles.dot} style={{ background: TILE_BG.gray }} /> {t('wordle.gray')}</span>
          </div>

          <button className={`btn btn-secondary ${styles.resetBtn}`} onClick={reset}>
            🔄 {t('wordle.reset')}
          </button>
        </div>

        {/* ── Right: suggestions ── */}
        <div className={styles.suggPanel}>
          <div className={styles.suggHeader}>
            <span className={styles.suggTitle}>{t('wordle.suggestions')}</span>
            {completedRows.length > 0 && !loadingSugg && (
              <span className={styles.suggCount}>
                {suggCount} {t('wordle.words')}
              </span>
            )}
          </div>

          {completedRows.length === 0 && (
            <p className={styles.suggHint}>{t('wordle.suggHint')}</p>
          )}

          {loadingSugg && <p className={styles.loading}>...</p>}

          {!loadingSugg && suggestions.length > 0 && (
            <div className={styles.wordGrid}>
              {suggestions.map(w => (
                <span key={w} className={styles.wordChip}>{w}</span>
              ))}
            </div>
          )}

          {!loadingSugg && completedRows.length > 0 && suggestions.length === 0 && (
            <p className={styles.noWords}>{t('wordle.noWords')}</p>
          )}
        </div>

      </div>
    </div>
  )
}
