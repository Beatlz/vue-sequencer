import { PolySynth, Transport } from "tone"
import type { Frequency, Time } from "tone/build/esm/core/type/Units"

export interface ChordPadSettings {
  tones: Frequency[]
  velocity?: number
  duration?: Time
  snyth?: PolySynth
  time?: number
}

export class ChordPad {
  tones: Frequency[] = []
  duration: Time = `8n`
  time: number = 0
  velocity: number = 0.75
  synth: PolySynth | null = null

  constructor(settings: ChordPadSettings) {
    Object.assign(this, settings)
  }

  play(): void {
    if (!this.synth) this.synth = new PolySynth().toDestination()

    const { duration, velocity } = this

    this.synth?.triggerAttackRelease(this.tones, duration, undefined, velocity)

    if (Transport.state !== `started`) Transport.start()
  }
}
