import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { speak } from '@/lib/speech'
import styles from './SpeechBubble.module.css'

interface Props {
  // read aloud when it appears or changes, and again when tapped
  text: string
  children?: ReactNode
  tail?: 'left' | 'right' | 'down'
}

export default function SpeechBubble({ text, children, tail = 'down' }: Props) {
  useEffect(() => {
    speak(text)
  }, [text])

  return (
    <button className={`${styles.bubble} ${styles[tail]}`} onClick={() => speak(text)} data-testid="speech">
      {children ?? text}
    </button>
  )
}
