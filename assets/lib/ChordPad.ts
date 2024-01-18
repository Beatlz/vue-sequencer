import { PolySynth, Transport } from "tone"
import type { Time } from "tone/build/esm/core/type/Units"
import type { Pad } from "./Pad"

export interface ChordPadSettings {
  pads: Pad[]
  velocity?: number
  duration?: Time
  snyth?: PolySynth
  time?: number
}

export interface ChordPlaySettings {
  roll?: {
    delay: number
    direction?: `up` | `down` | `random`
  }
}

export class ChordPad {
  pads: Pad[] = []
  duration: Time = `8n`
  time: number = 0
  velocity: number = 0.3
  synth: PolySynth | null = null

  constructor(settings: ChordPadSettings) {
    Object.assign(this, settings)
  }

  play(settings: ChordPlaySettings  = {}): void {
    if (!this.synth) this.synth = new PolySynth().toDestination()

    const { roll } = settings
    const tones: Pad[] = roll?.direction === 'down'
      ? this.pads
      : roll?.direction === 'random'
        ? this.pads.sort(() => Math.random() - 0.5)
        : [...this.pads].reverse()

    tones.forEach((pad, index) => {
      const delay = roll ? roll.delay : 0
      const timeDelay = (Transport.seconds || this.time) + index * delay

      this.synth?.triggerAttackRelease(pad.tone!, pad.duration, timeDelay, pad.velocity);
    })

    if (Transport.state !== `started`) Transport.start()
  }
}
