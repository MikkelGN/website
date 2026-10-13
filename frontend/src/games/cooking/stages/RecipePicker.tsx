import { useTranslation } from 'react-i18next'
import Character from '@/characters/Character'
import SpeechBubble from '@/components/SpeechBubble'
import { useProgress } from '@/store/progressStore'
import { sfx } from '@/lib/sound'
import { RECIPES } from '../data'
import type { Recipe } from '../data'
import styles from '../CookingGame.module.css'

export default function RecipePicker({ onPick }: { onPick: (recipe: Recipe) => void }) {
  const { t } = useTranslation()
  const dishesCooked = useProgress((s) => s.dishesCooked)

  return (
    <div className={styles.pick}>
      <div className={styles.pickHeader}>
        <Character id="kapi" hat mood="happy" size="min(22vw, 16vh, 120px)" />
        <SpeechBubble text={t('cooking.pickSpeak')}>{t('cooking.pickTitle')}</SpeechBubble>
        <Character id="bao" hat mood="happy" size="min(22vw, 16vh, 120px)" />
      </div>
      <div className={styles.recipeGrid}>
        {RECIPES.map((r) => {
          const count = dishesCooked[r.id] ?? 0
          return (
            <button
              key={r.id}
              className={styles.recipeCard}
              onClick={() => {
                sfx.pop()
                onPick(r)
              }}
            >
              <span className={`emoji ${styles.recipeDish}`}>{r.dish}</span>
              <span className={styles.recipeName}>{t(`cooking.recipe.${r.id}`)}</span>
              <span className={styles.recipeMeta}>
                <Character id={r.eater} mood="idle" size={34} />
                {count > 0 && (
                  <span aria-label={t('cooking.cookedTimes', { count })}>
                    <span className="emoji">⭐</span>
                    {count}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
