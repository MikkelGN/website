import { useTranslation } from 'react-i18next'
import Character from '@/characters/Character'
import { CHARACTERS } from '@/characters/characters'
import SpeechBubble from '@/components/SpeechBubble'
import { sfx } from '@/lib/sound'
import type { Recipe } from '../data'
import styles from '../CookingGame.module.css'

export default function OrderStage({ recipe, onDone }: { recipe: Recipe; onDone: () => void }) {
  const { t, i18n } = useTranslation()
  const dish = t(`cooking.recipe.${recipe.id}`)
  const text = t('cooking.order', { name: CHARACTERS[recipe.eater].name, dish: dish.toLocaleLowerCase(i18n.language) })

  return (
    <div className={styles.center}>
      <SpeechBubble text={text}>
        <span className={`emoji ${styles.bubbleDish}`}>{recipe.dish}</span>
        <span>{text}</span>
      </SpeechBubble>
      <Character id={recipe.eater} mood="hungry" size="min(60vw, 38vh, 300px)" />
      <button
        className="btn btn-green"
        onClick={() => {
          sfx.pop()
          onDone()
        }}
      >
        {t('cooking.orderButton')}
      </button>
    </div>
  )
}
