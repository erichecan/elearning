const FIXED_LONG_PRESS_GUARD_KEY = 'fixedLongPressGuardEnabled'
const CORE_GRID_DENSITY_KEY = 'coreGridDensity'
const EMOTION_ZONE_KEY = 'emotionZone'

export type CoreGridDensity = '4x4' | '6x6' | '8x8'
export type EmotionZone = 'blue' | 'green' | 'yellow' | 'red'

function readBoolean(key: string, fallback: boolean) {
  if (typeof window === 'undefined') return fallback
  const raw = localStorage.getItem(key)
  if (raw === null) return fallback
  return raw === 'true'
}

export function getFixedLongPressGuardEnabled() {
  return readBoolean(FIXED_LONG_PRESS_GUARD_KEY, true)
}

export function setFixedLongPressGuardEnabled(value: boolean) {
  if (typeof window === 'undefined') return
  localStorage.setItem(FIXED_LONG_PRESS_GUARD_KEY, String(value))
}

export function getCoreGridDensity(): CoreGridDensity {
  if (typeof window === 'undefined') return '6x6'
  const raw = localStorage.getItem(CORE_GRID_DENSITY_KEY)
  if (raw === '4x4' || raw === '6x6' || raw === '8x8') return raw
  return '6x6'
}

export function setCoreGridDensity(value: CoreGridDensity) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CORE_GRID_DENSITY_KEY, value)
}

export function getEmotionZone(): EmotionZone {
  if (typeof window === 'undefined') return 'green'
  const raw = localStorage.getItem(EMOTION_ZONE_KEY)
  if (raw === 'blue' || raw === 'green' || raw === 'yellow' || raw === 'red') return raw
  return 'green'
}

export function setEmotionZone(zone: EmotionZone) {
  if (typeof window === 'undefined') return
  localStorage.setItem(EMOTION_ZONE_KEY, zone)
}
