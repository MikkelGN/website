import { useSettings } from '@/store/settingsStore'

// Reads text aloud with the device's built-in voice so children who can't read yet can play.
// Uses the browser's speech synthesis: no network, no recordings to maintain.

const LOCALES = { da: 'da-DK', en: 'en-GB' } as const

function pickVoice(lang: string): SpeechSynthesisVoice | null | undefined {
  const voices = window.speechSynthesis.getVoices()
  // Some browsers load voices lazily; an empty list means "unknown yet", so let the
  // engine choose from the lang attribute.
  if (voices.length === 0) return undefined
  const prefix = lang.slice(0, 2)
  return voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.startsWith(prefix)) ?? null
}

export function speak(text: string) {
  const { soundOn, lang } = useSettings.getState()
  if (!soundOn || typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const locale = LOCALES[lang]
  const voice = pickVoice(locale)
  // No voice for this language installed: stay quiet rather than read Danish with an English accent
  if (voice === null) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = locale
  if (voice) utterance.voice = voice
  utterance.rate = 0.95
  utterance.pitch = 1.15
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
}
