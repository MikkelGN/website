import { useSettings } from '@/store/settingsStore'

// All sound effects are synthesised with Web Audio, so there are no audio files to load
// and everything works offline.

let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (!useSettings.getState().soundOn) return null
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  ctx ??= new AudioContext()
  // iOS starts the context suspended until a user gesture; every call here comes from one
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', volume = 0.25, slideTo?: number) {
  const ac = audio()
  if (!ac) return
  const t0 = ac.currentTime + start
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

export const sfx = {
  tap: () => tone(660, 0, 0.08, 'triangle', 0.15),
  pop: () => tone(420, 0, 0.14, 'sine', 0.3, 900),
  oops: () => {
    tone(300, 0, 0.16, 'triangle', 0.2, 220)
    tone(240, 0.14, 0.2, 'triangle', 0.18, 180)
  },
  stir: () => tone(180 + Math.random() * 80, 0, 0.12, 'triangle', 0.12, 120),
  ding: () => {
    tone(1318, 0, 0.9, 'sine', 0.25)
    tone(1976, 0, 0.6, 'sine', 0.08)
  },
  sizzle: () => tone(90, 0, 0.3, 'sawtooth', 0.04, 70),
  fanfare: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.22))
  },
  munch: () => {
    tone(160, 0, 0.08, 'square', 0.06, 110)
    tone(150, 0.18, 0.08, 'square', 0.06, 100)
    tone(170, 0.36, 0.08, 'square', 0.06, 110)
  },
}
