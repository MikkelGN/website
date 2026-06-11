export type Difficulty = 'easy' | 'medium' | 'hard'

export interface MathProblem {
  text: string
  answer: number
  choices: number[]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeChoices(answer: number): number[] {
  const choices = new Set<number>([answer])
  const offsets = [1, -1, 2, -2, 10, -10, 3, -3, 5, -5]
  for (const off of shuffle(offsets)) {
    if (choices.size >= 4) break
    const candidate = answer + off
    if (candidate >= 0) choices.add(candidate)
  }
  // Pathological cases (answer 0/1): fill upwards
  let filler = answer + 4
  while (choices.size < 4) {
    choices.add(filler)
    filler += 1
  }
  return shuffle([...choices])
}

function additionOrSubtraction(max: number): { text: string; answer: number } {
  if (Math.random() < 0.5) {
    const a = randInt(1, max - 1)
    const b = randInt(1, max - a)
    return { text: `${a} + ${b}`, answer: a + b }
  }
  const a = randInt(2, max)
  const b = randInt(1, a)
  return { text: `${a} − ${b}`, answer: a - b }
}

function multiplication(maxFactor: number): { text: string; answer: number } {
  const a = randInt(2, maxFactor)
  const b = randInt(2, 10)
  return { text: `${a} × ${b}`, answer: a * b }
}

function division(): { text: string; answer: number } {
  const divisor = randInt(2, 10)
  const answer = randInt(2, 10)
  return { text: `${divisor * answer} ÷ ${divisor}`, answer }
}

export function generateProblem(difficulty: Difficulty): MathProblem {
  let p: { text: string; answer: number }
  switch (difficulty) {
    case 'easy':
      p = additionOrSubtraction(20)
      break
    case 'medium':
      p = Math.random() < 0.6 ? additionOrSubtraction(100) : multiplication(5)
      break
    case 'hard':
      p = Math.random() < 0.6 ? multiplication(10) : division()
      break
  }
  return { ...p, choices: makeChoices(p.answer) }
}

// Local scoring, same formula as the backend ScoreCalculator for Word Blitz
const BASE_POINTS = 100
const STARTING_TIME = 10.0
const MIN_TIME = 2.0
const TIME_REDUCTION_FACTOR = 0.9

export function calculatePoints(timeRemaining: number, timeLimit: number, streak: number): number {
  const streakMultiplier = 1.0 + streak * 0.1
  const timeBonus = timeRemaining / timeLimit
  return Math.round(BASE_POINTS * streakMultiplier * timeBonus)
}

export function nextTimeLimit(current: number): number {
  return Math.max(current * TIME_REDUCTION_FACTOR, MIN_TIME)
}

export function startingTimeLimit(): number {
  return STARTING_TIME
}
