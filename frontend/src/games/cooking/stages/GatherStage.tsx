import { useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Character from '@/characters/Character'
import { otherCharacter } from '@/characters/characters'
import type { Mood } from '@/characters/characters'
import SpeechBubble from '@/components/SpeechBubble'
import { sfx } from '@/lib/sound'
import { speak } from '@/lib/speech'
import { useLater } from '@/lib/useLater'
import { INGREDIENTS, buildPantry } from '../data'
import type { IngredientId, Recipe } from '../data'
import styles from '../CookingGame.module.css'

const DRAG_THRESHOLD = 12

interface Drag {
  id: IngredientId
  x: number
  y: number
  startX: number
  startY: number
  moved: boolean
}

export default function GatherStage({ recipe, onDone }: { recipe: Recipe; onDone: () => void }) {
  const { t, i18n } = useTranslation()
  const later = useLater()
  const pantry = useMemo(() => buildPantry(recipe), [recipe])
  const [added, setAdded] = useState<IngredientId[]>([])
  const [shaking, setShaking] = useState<IngredientId | null>(null)
  const [chefMood, setChefMood] = useState<Mood>('idle')
  const [drag, setDrag] = useState<Drag | null>(null)
  const bowlRef = useRef<HTMLDivElement>(null)
  const suppressClick = useRef(false)
  const chef = otherCharacter(recipe.eater)
  const dish = t(`cooking.recipe.${recipe.id}`).toLocaleLowerCase(i18n.language)

  const choose = (id: IngredientId) => {
    if (added.includes(id)) return
    if (!recipe.ingredients.includes(id)) {
      sfx.oops()
      speak(t('cooking.wrong'))
      setShaking(id)
      setChefMood('no')
      later(() => {
        setShaking(null)
        setChefMood('idle')
      }, 900)
      return
    }
    const next = [...added, id]
    setAdded(next)
    sfx.pop()
    speak(t(`cooking.ingredient.${id}`))
    setChefMood('happy')
    if (next.length === recipe.ingredients.length) {
      later(() => sfx.fanfare(), 300)
      later(onDone, 1400)
    } else {
      later(() => setChefMood('idle'), 800)
    }
  }

  const onPointerDown = (id: IngredientId) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    suppressClick.current = false
    if (added.includes(id)) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ id, x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, moved: false })
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag) return
    const moved = drag.moved || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > DRAG_THRESHOLD
    setDrag({ ...drag, x: e.clientX, y: e.clientY, moved })
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag) return
    if (drag.moved) {
      // a drag ends here; the click event that follows must not count as a tap
      suppressClick.current = true
      const box = bowlRef.current?.getBoundingClientRect()
      const pad = 30
      if (
        box &&
        e.clientX > box.left - pad &&
        e.clientX < box.right + pad &&
        e.clientY > box.top - pad &&
        e.clientY < box.bottom + pad
      ) {
        choose(drag.id)
      }
    }
    setDrag(null)
  }

  return (
    <div className={styles.gather}>
      <div className={styles.gatherTop}>
        <SpeechBubble text={t('cooking.gather', { dish })} />
        <div className={styles.recipeSlots} aria-label={t(`cooking.recipe.${recipe.id}`)}>
          <span className={`emoji ${styles.slotDish}`}>{recipe.dish}</span>
          <span className={styles.slotEquals}>=</span>
          {recipe.ingredients.map((id) => (
            <span
              key={id}
              className={`emoji ${styles.slot} ${added.includes(id) ? styles.slotFilled : ''}`}
              data-testid={`slot-${id}`}
              data-filled={added.includes(id)}
            >
              {INGREDIENTS[id]}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.workbench}>
        <Character id={chef} hat mood={chefMood} size="min(30vw, 22vh, 170px)" />
        <div
          ref={bowlRef}
          className={`${styles.bowl} ${drag?.moved ? styles.bowlTarget : ''}`}
          aria-label={t('cooking.dropHere')}
          data-testid="bowl"
        >
          <div className={styles.bowlContents}>
            {added.map((id) => (
              <span key={id} className={`emoji ${styles.inBowl}`}>
                {INGREDIENTS[id]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.shelf}>
        {pantry.map((id) => {
          const used = added.includes(id)
          return (
            <button
              key={id}
              className={[
                styles.ingredient,
                used ? styles.used : '',
                shaking === id ? styles.shake : '',
                drag?.id === id && drag.moved ? styles.dragging : '',
              ].join(' ')}
              aria-label={t(`cooking.ingredient.${id}`)}
              disabled={used}
              onPointerDown={onPointerDown(id)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => setDrag(null)}
              onClick={() => {
                if (suppressClick.current) {
                  suppressClick.current = false
                  return
                }
                choose(id)
              }}
            >
              <span className="emoji">{INGREDIENTS[id]}</span>
            </button>
          )
        })}
      </div>

      {drag?.moved && (
        <span className={`emoji ${styles.ghost}`} style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          {INGREDIENTS[drag.id]}
        </span>
      )}
    </div>
  )
}
