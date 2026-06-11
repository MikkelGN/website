export const AVATARS: Record<string, string> = {
  star: '⭐',
  fox: '🦊',
  panda: '🐼',
  unicorn: '🦄',
  robot: '🤖',
  dino: '🦖',
  cat: '🐱',
  rocket: '🚀',
}

export const AVATAR_KEYS = Object.keys(AVATARS)

export function avatarEmoji(key: string | null | undefined): string {
  return (key && AVATARS[key]) || AVATARS.star
}
