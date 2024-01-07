import type { Frequency } from "tone/build/esm/core/type/Units"

export interface Pad {
  note: Frequency
  duration: string
  isActive: boolean
  velocity?: number
  modulation?: number
  glide?: number
  attack?: number
  decay?: number
  sustain?: number
  release?: number
  pan?: number
  detune?: number
  oscillatorType?: string
  filterFrequency?: number
  filterQ?: number
  filterEnvAttack?: number
  filterEnvDecay?: number
  filterEnvSustain?: number
  filterEnvRelease?: number
  reverbLevel?: number
  delayTime?: number
  delayFeedback?: number
}
