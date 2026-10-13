import type { CharacterId, Mood } from './characters'
import { CHARACTERS } from './characters'
import styles from './Character.module.css'

interface Props {
  id: CharacterId
  mood?: Mood
  size?: number | string
  hat?: boolean
  className?: string
}

const INK = '#2b1d14'

export default function Character({ id, mood = 'idle', size = 160, hat = false, className }: Props) {
  const Body = id === 'kapi' ? Capybara : Panda
  return (
    <svg
      viewBox="0 0 200 210"
      width={size}
      height={size}
      role="img"
      aria-label={CHARACTERS[id].name}
      data-character={id}
      data-mood={mood}
      className={[styles.character, styles[mood], className].filter(Boolean).join(' ')}
    >
      <g className={styles.body}>
        <Body mood={mood} hat={hat} />
      </g>
    </svg>
  )
}

interface PartProps {
  mood: Mood
  hat: boolean
}

function Capybara({ mood, hat }: PartProps) {
  const fur = '#b98457'
  const furDark = '#94643e'
  const furDeep = '#6f4628'
  return (
    <>
      {/* body + paws */}
      <ellipse cx="100" cy="160" rx="64" ry="44" fill={fur} />
      <ellipse cx="100" cy="168" rx="38" ry="28" fill="#c99a6e" />
      <ellipse cx="70" cy="200" rx="18" ry="9" fill={furDark} />
      <ellipse cx="130" cy="200" rx="18" ry="9" fill={furDark} />
      {/* ears */}
      <circle cx="56" cy="52" r="13" fill={furDark} />
      <circle cx="56" cy="52" r="6" fill={furDeep} />
      <circle cx="144" cy="52" r="13" fill={furDark} />
      <circle cx="144" cy="52" r="6" fill={furDeep} />
      {/* head */}
      <rect x="44" y="40" width="112" height="100" rx="46" fill={fur} />
      {/* snout */}
      <rect x="58" y="88" width="84" height="52" rx="26" fill={furDark} />
      <ellipse cx="88" cy="102" rx="5" ry="4" fill={furDeep} />
      <ellipse cx="112" cy="102" rx="5" ry="4" fill={furDeep} />
      <Cheeks show={mood === 'happy' || mood === 'yum'} y={92} left={62} right={138} />
      <Eyes mood={mood} y={72} left={76} right={124} />
      <Mouth mood={mood} y={120} color={furDeep} />
      {hat ? (
        <ChefHat y={20} />
      ) : (
        // Kapi's signature: a little orange balanced on the head
        <g>
          <circle cx="100" cy="34" r="14" fill="#f7a23b" />
          <circle cx="96" cy="30" r="4" fill="#fcc777" />
          <path d="M100 20 q8 -8 14 -2 q-8 4 -14 2z" fill="#5bb55b" />
        </g>
      )}
    </>
  )
}

function Panda({ mood, hat }: PartProps) {
  const white = '#fffdf7'
  const black = '#2a2a2e'
  return (
    <>
      {/* body, arms, feet */}
      <ellipse cx="100" cy="162" rx="58" ry="44" fill={white} stroke="#e7e1d3" strokeWidth="2" />
      <ellipse cx="50" cy="156" rx="16" ry="26" fill={black} transform="rotate(20 50 156)" />
      <ellipse cx="150" cy="156" rx="16" ry="26" fill={black} transform="rotate(-20 150 156)" />
      <ellipse cx="72" cy="200" rx="19" ry="10" fill={black} />
      <ellipse cx="128" cy="200" rx="19" ry="10" fill={black} />
      {/* ears */}
      <circle cx="52" cy="44" r="19" fill={black} />
      <circle cx="148" cy="44" r="19" fill={black} />
      {/* head */}
      <circle cx="100" cy="88" r="58" fill={white} stroke="#e7e1d3" strokeWidth="2" />
      {/* eye patches */}
      <ellipse cx="76" cy="86" rx="16" ry="21" fill={black} transform="rotate(30 76 86)" />
      <ellipse cx="124" cy="86" rx="16" ry="21" fill={black} transform="rotate(-30 124 86)" />
      <Cheeks show={mood === 'happy' || mood === 'yum'} y={104} left={64} right={136} />
      <Eyes mood={mood} y={84} left={78} right={122} light />
      <ellipse cx="100" cy="108" rx="9" ry="6" fill={black} />
      <Mouth mood={mood} y={122} color={black} />
      {hat ? (
        <ChefHat y={8} />
      ) : (
        // Bao's signature: a bamboo leaf tucked behind the ear
        <path d="M150 30 q22 -16 36 -6 q-18 12 -36 6z" fill="#5bb55b" />
      )}
    </>
  )
}

function Eyes({ mood, y, left, right, light = false }: { mood: Mood; y: number; left: number; right: number; light?: boolean }) {
  const ink = light ? '#ffffff' : INK
  if (mood === 'happy' || mood === 'yum') {
    // closed, smiling eyes: ^ ^
    const arc = (x: number) => `M${x - 8} ${y + 3} q8 -10 16 0`
    return (
      <g fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round">
        <path d={arc(left)} />
        <path d={arc(right)} />
      </g>
    )
  }
  return (
    <g className={styles.eyes}>
      {[left, right].map((x) => (
        <g key={x}>
          <circle cx={x} cy={y} r={light ? 7 : 6.5} fill={ink} />
          <circle cx={x} cy={y} r={light ? 4 : 0} fill={INK} />
          <circle cx={x + 2} cy={y - 2.5} r="2" fill={light ? '#ffffff' : '#ffffff'} />
        </g>
      ))}
    </g>
  )
}

function Mouth({ mood, y, color }: { mood: Mood; y: number; color: string }) {
  switch (mood) {
    case 'happy':
      return <path d={`M86 ${y - 2} q14 14 28 0`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    case 'yum':
      return (
        <g className={styles.munch}>
          <path d={`M84 ${y - 3} q16 18 32 0z`} fill="#7a2e2e" />
          <ellipse cx="100" cy={y + 4} rx="7" ry="4" fill="#f27c8e" />
        </g>
      )
    case 'hungry':
      return (
        <g>
          <ellipse cx="100" cy={y + 1} rx="9" ry="7" fill="#7a2e2e" />
          <ellipse cx="100" cy={y + 5} rx="6" ry="3" fill="#f27c8e" />
        </g>
      )
    case 'no':
      return <path d={`M90 ${y + 2} h20`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    default:
      return <path d={`M92 ${y - 1} q4 5 8 0 q4 5 8 0`} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
  }
}

function Cheeks({ show, y, left, right }: { show: boolean; y: number; left: number; right: number }) {
  if (!show) return null
  return (
    <g fill="#ff8fa3" opacity="0.55">
      <ellipse cx={left} cy={y} rx="9" ry="5.5" />
      <ellipse cx={right} cy={y} rx="9" ry="5.5" />
    </g>
  )
}

function ChefHat({ y }: { y: number }) {
  return (
    <g stroke="#e3d7c0" strokeWidth="2" fill="#ffffff">
      <circle cx="80" cy={y + 2} r="15" />
      <circle cx="120" cy={y + 2} r="15" />
      <circle cx="100" cy={y - 6} r="19" />
      <rect x="72" y={y + 6} width="56" height="20" rx="5" />
    </g>
  )
}
