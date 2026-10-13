import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Character from '@/characters/Character'
import { CHARACTERS, otherCharacter } from '@/characters/characters'
import type { Mood } from '@/characters/characters'
import SpeechBubble from '@/components/SpeechBubble'
import Celebration from '@/components/Celebration'
import { sfx } from '@/lib/sound'
import { useLater } from '@/lib/useLater'
import { useProgress } from '@/store/progressStore'
import type { Recipe } from '../data'
import styles from '../CookingGame.module.css'

type Phase = 'waiting' | 'eating' | 'thanks'

interface Props {
  recipe: Recipe
  onAgain: () => void
  onHome: () => void
}

export default function ServeStage({ recipe, onAgain, onHome }: Props) {
  const { t } = useTranslation()
  const later = useLater()
  const recordDish = useProgress((s) => s.recordDish)
  const [phase, setPhase] = useState<Phase>('waiting')
  const name = CHARACTERS[recipe.eater].name
  const eaterMood: Mood = phase === 'waiting' ? 'hungry' : phase === 'eating' ? 'yum' : 'happy'

  const serve = () => {
    if (phase !== 'waiting') return
    setPhase('eating')
    sfx.munch()
    later(() => sfx.munch(), 700)
    later(() => {
      setPhase('thanks')
      recordDish(recipe.id)
      sfx.fanfare()
    }, 1800)
  }

  return (
    <div className={styles.center}>
      {phase === 'thanks' ? (
        <SpeechBubble text={`${t('cooking.thanks')} ${t('cooking.starEarned')}`}>
          {t('cooking.thanks')}
          <br />
          <span className="emoji">⭐</span> {t('cooking.starEarned')}
        </SpeechBubble>
      ) : (
        <SpeechBubble text={t('cooking.serve', { name })} />
      )}

      <div className={styles.table}>
        <Character id={otherCharacter(recipe.eater)} hat mood={phase === 'waiting' ? 'idle' : 'happy'} size="min(26vw, 20vh, 150px)" />
        <Character id={recipe.eater} mood={eaterMood} size="min(44vw, 32vh, 240px)" />
        {phase !== 'thanks' && (
          <button
            className={`${styles.plate} ${phase === 'eating' ? styles.eaten : ''}`}
            aria-label={t('cooking.serve', { name })}
            data-testid="plate"
            onClick={serve}
          >
            <span className="emoji">{recipe.dish}</span>
          </button>
        )}
      </div>

      {phase === 'thanks' && (
        <>
          <Celebration />
          <div className={styles.actions}>
            <button className="btn btn-green" onClick={() => { sfx.tap(); onAgain() }}>
              <span className="emoji">🍳</span> {t('cooking.again')}
            </button>
            <button className="btn btn-blue" onClick={() => { sfx.tap(); onHome() }}>
              <span className="emoji">🏠</span> {t('cooking.home')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
