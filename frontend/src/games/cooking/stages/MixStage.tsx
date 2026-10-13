import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Character from '@/characters/Character'
import { otherCharacter } from '@/characters/characters'
import SpeechBubble from '@/components/SpeechBubble'
import { sfx } from '@/lib/sound'
import { useLater } from '@/lib/useLater'
import { INGREDIENTS, STIRS_NEEDED } from '../data'
import type { Recipe } from '../data'
import styles from '../CookingGame.module.css'

// distance a finger must travel over the bowl to count as one stir
const STIR_DISTANCE = 120

export default function MixStage({ recipe, onDone }: { recipe: Recipe; onDone: () => void }) {
  const { t } = useTranslation()
  const later = useLater()
  const [stirs, setStirs] = useState(0)
  const travel = useRef<{ x: number; y: number; dist: number } | null>(null)
  const done = stirs >= STIRS_NEEDED
  const blender = recipe.mixer === 'blender'

  const stir = () => {
    if (done) return
    const next = stirs + 1
    setStirs(next)
    sfx.stir()
    if (next >= STIRS_NEEDED) {
      later(() => sfx.pop(), 150)
      later(onDone, 1200)
    }
  }

  // tapping stirs once; rubbing round and round stirs too
  const onPointerDown = (e: ReactPointerEvent) => {
    travel.current = { x: e.clientX, y: e.clientY, dist: 0 }
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    const t0 = travel.current
    if (!t0) return
    t0.dist += Math.hypot(e.clientX - t0.x, e.clientY - t0.y)
    t0.x = e.clientX
    t0.y = e.clientY
    if (t0.dist > STIR_DISTANCE) {
      t0.dist = 0
      stir()
    }
  }
  const onPointerEnd = () => {
    travel.current = null
  }

  return (
    <div className={styles.center}>
      <SpeechBubble text={t(blender ? 'cooking.mixBlender' : 'cooking.mixBowl')} />
      <div className={styles.workbench}>
        <Character id={otherCharacter(recipe.eater)} hat mood={done ? 'happy' : 'idle'} size="min(30vw, 22vh, 170px)" />
        <button
          className={`${blender ? styles.blender : styles.mixBowl} ${done ? styles.mixed : ''}`}
          style={{ ['--turn' as string]: `${stirs * 50}deg` }}
          aria-label={t(blender ? 'cooking.mixBlender' : 'cooking.mixBowl')}
          data-testid="mixer"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onPointerLeave={onPointerEnd}
          onClick={stir}
        >
          <span className={styles.mixContents}>
            {done ? (
              recipe.appliance ? (
                <span className={styles.batter} />
              ) : (
                <span className={`emoji ${styles.mixResult}`}>{recipe.dish}</span>
              )
            ) : (
              recipe.ingredients.map((id) => (
                <span key={id} className="emoji">
                  {INGREDIENTS[id]}
                </span>
              ))
            )}
          </span>
          {!blender && <span className={`emoji ${styles.spoon}`}>🥄</span>}
        </button>
      </div>
      <Progress value={stirs} max={STIRS_NEEDED} />
    </div>
  )
}

export function Progress({ value, max }: { value: number; max: number }) {
  return (
    <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div className={styles.progressFill} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </div>
  )
}
