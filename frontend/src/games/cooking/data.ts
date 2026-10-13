import type { CharacterId } from '@/characters/characters'

// Display names come from i18n: `cooking.ingredient.<id>` and `cooking.recipe.<id>`.

export const INGREDIENTS = {
  egg: '🥚',
  milk: '🥛',
  flour: '🌾',
  butter: '🧈',
  flatbread: '🫓',
  tomato: '🍅',
  cheese: '🧀',
  mushroom: '🍄',
  banana: '🍌',
  strawberry: '🍓',
  blueberry: '🫐',
  carrot: '🥕',
  potato: '🥔',
  onion: '🧅',
  broccoli: '🥦',
  chocolate: '🍫',
  lettuce: '🥬',
  cucumber: '🥒',
  corn: '🌽',
  orange: '🍊',
  honey: '🍯',
  apple: '🍎',
} as const

export type IngredientId = keyof typeof INGREDIENTS

// mix: stir in a bowl, blend: press the blender, then optionally cook in an appliance
export type Appliance = 'pan' | 'oven' | 'pot'

export interface Recipe {
  id: string
  dish: string
  ingredients: IngredientId[]
  mixer: 'bowl' | 'blender'
  appliance: Appliance | null
  // the character who ordered it; the other one is the chef
  eater: CharacterId
}

export const RECIPES: Recipe[] = [
  { id: 'pancakes', dish: '🥞', ingredients: ['egg', 'milk', 'flour', 'butter'], mixer: 'bowl', appliance: 'pan', eater: 'bao' },
  { id: 'pizza', dish: '🍕', ingredients: ['flatbread', 'tomato', 'cheese', 'mushroom'], mixer: 'bowl', appliance: 'oven', eater: 'kapi' },
  { id: 'smoothie', dish: '🥤', ingredients: ['banana', 'strawberry', 'blueberry', 'milk'], mixer: 'blender', appliance: null, eater: 'bao' },
  { id: 'soup', dish: '🍲', ingredients: ['carrot', 'potato', 'onion', 'broccoli'], mixer: 'bowl', appliance: 'pot', eater: 'kapi' },
  { id: 'cupcakes', dish: '🧁', ingredients: ['egg', 'flour', 'chocolate', 'butter'], mixer: 'bowl', appliance: 'oven', eater: 'bao' },
  { id: 'salad', dish: '🥗', ingredients: ['lettuce', 'cucumber', 'tomato', 'corn'], mixer: 'bowl', appliance: null, eater: 'kapi' },
  { id: 'juice', dish: '🧃', ingredients: ['orange', 'apple', 'honey'], mixer: 'blender', appliance: null, eater: 'kapi' },
]

export const PANTRY_SIZE = 7
export const STIRS_NEEDED = 8
export const COOK_MS = 3500

/** The recipe's ingredients plus random extras, shuffled. */
export function buildPantry(recipe: Recipe, random: () => number = Math.random): IngredientId[] {
  const all = Object.keys(INGREDIENTS) as IngredientId[]
  const extras = shuffle(
    all.filter((id) => !recipe.ingredients.includes(id)),
    random,
  ).slice(0, Math.max(0, PANTRY_SIZE - recipe.ingredients.length))
  return shuffle([...recipe.ingredients, ...extras], random)
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
