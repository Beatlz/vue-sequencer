import type { Frequency, Time } from "tone/build/esm/core/type/Units";

export interface Pad {
  tone?: Frequency
  duration: Time
  velocity: number
  isActive: boolean
}

export const PAD = {
  tone: ``,
  duration: `8n`,
  velocity: 1,
  isActive: false
}
