import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/TopBar'
import { stopSpeaking } from '@/lib/speech'
import type { Recipe } from './data'
import RecipePicker from './stages/RecipePicker'
import OrderStage from './stages/OrderStage'
import GatherStage from './stages/GatherStage'
import MixStage from './stages/MixStage'
import CookStage from './stages/CookStage'
import ServeStage from './stages/ServeStage'
import styles from './CookingGame.module.css'

// pick a dish -> the hungry friend orders it -> find ingredients -> mix -> cook -> serve
type Stage = 'pick' | 'order' | 'gather' | 'mix' | 'cook' | 'serve'

export default function CookingGame() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<Stage>('pick')
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  const go = (next: Stage) => {
    stopSpeaking()
    setStage(next)
  }

  const onBack = stage === 'pick' ? () => navigate('/') : () => go('pick')

  return (
    <div className={styles.game} data-stage={stage}>
      <TopBar onBack={onBack} />
      <main className={styles.stage} key={stage}>
        {stage === 'pick' || !recipe ? (
          <RecipePicker
            onPick={(r) => {
              setRecipe(r)
              go('order')
            }}
          />
        ) : stage === 'order' ? (
          <OrderStage recipe={recipe} onDone={() => go('gather')} />
        ) : stage === 'gather' ? (
          <GatherStage recipe={recipe} onDone={() => go('mix')} />
        ) : stage === 'mix' ? (
          <MixStage recipe={recipe} onDone={() => go(recipe.appliance ? 'cook' : 'serve')} />
        ) : stage === 'cook' ? (
          <CookStage recipe={recipe} onDone={() => go('serve')} />
        ) : (
          <ServeStage recipe={recipe} onAgain={() => go('pick')} onHome={() => navigate('/')} />
        )}
      </main>
    </div>
  )
}
