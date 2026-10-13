// The recurring cast of the Migini universe. Every game uses these two.
// Names live here (and in the i18n files) so they can be changed in one place.

export type CharacterId = 'kapi' | 'bao'

export type Mood = 'idle' | 'happy' | 'hungry' | 'yum' | 'no'

export interface CharacterInfo {
  id: CharacterId
  name: string
  species: 'capybara' | 'panda'
}

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  kapi: { id: 'kapi', name: 'Kapi', species: 'capybara' },
  bao: { id: 'bao', name: 'Bao', species: 'panda' },
}

export function otherCharacter(id: CharacterId): CharacterId {
  return id === 'kapi' ? 'bao' : 'kapi'
}
