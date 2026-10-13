import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Character from '@/characters/Character'
import { otherCharacter } from '@/characters/characters'
import SpeechBubble from '@/components/SpeechBubble'
import { sfx } from '@/lib/sound'
import { useLater } from '@/lib/useLater'
import { COOK_MS } from '../data'
import type { Recipe } from '../data'
import styles from '../CookingGame.module.css'

type Phase = 'ready' | 'cooking' | 'done'

export default function CookStage({ recipe, onDone }: { recipe: Recipe; onDone: () => void }) {
  const { t } = useTranslation()
  const later = useLater()
  const [phase, setPhase] = useState<Phase>('ready')
  const appliance = recipe.appliance ?? 'pan'

  const onTap = () => {
    if (phase === 'ready') {
      setPhase('cooking')
      sfx.sizzle()
      for (let i = 1; i < COOK_MS / 600; i++) later(() => sfx.sizzle(), i * 600)
      later(() => {
        setPhase('done')
        sfx.ding()
      }, COOK_MS)
    } else if (phase === 'done') {
      sfx.pop()
      onDone()
    }
  }

  const text =
    phase === 'ready' ? t(`cooking.cookStart.${appliance}`) : phase === 'cooking' ? t('cooking.cooking') : t('cooking.cookDone')

  return (
    <div className={styles.center}>
      <SpeechBubble text={text} />
      <div className={styles.workbench}>
        <Character
          id={otherCharacter(recipe.eater)}
          hat
          mood={phase === 'done' ? 'happy' : 'idle'}
          size="min(30vw, 22vh, 170px)"
        />
        <button
          className={`${styles.appliance} ${styles[appliance]} ${styles[phase]}`}
          style={{ ['--cook-ms' as string]: `${COOK_MS}ms` }}
          aria-label={phase === 'done' ? t('cooking.takeOut') : text}
          data-testid="appliance"
          data-phase={phase}
          disabled={phase === 'cooking'}
          onClick={onTap}
        >
          <span className={styles.applianceInner}>
            {phase === 'done' ? (
              <span className={`emoji ${styles.cookedDish}`}>{recipe.dish}</span>
            ) : (
              <span className={styles.batter} />
            )}
          </span>
          {phase === 'cooking' && (
            <span className={styles.steam} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          )}
        </button>
      </div>
      {phase === 'done' && (
        <button className="btn btn-green" onClick={onTap}>
          {t('cooking.takeOut')}
        </button>
      )}
    </div>
  )
}
