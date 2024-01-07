import type { Frequency } from "tone/build/esm/core/type/Units";
import { getSortedNotes, type Note } from "mutsica";
import type { Pad } from "./Pad";

export interface GridSettings {
  steps?: number
  tones?: Note[]
  lowOctave?: number
  octaves?: number
}

export class Grid {
  sequence: Pad[][] = []
  steps = 32
  tones: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  lowOctave = 2
  octaves = 3

  constructor(sequence?: Pad[][] | GridSettings) {
    if (sequence instanceof Array) {
      this.sequence = sequence
    } else {
      this.steps = sequence?.steps || this.steps
      this.tones = sequence?.tones || this.tones
      this.lowOctave = sequence?.lowOctave || this.lowOctave
      this.octaves = sequence?.octaves || this.octaves

      this.create()
    }
  }

  getPad(x: number, y: number): Pad {
    return this.sequence[x][y]
  }
  setPad(x: number, y: number, pad: Pad): void {
    this.sequence[x][y] = pad
  }

  togglePad(x: number, y: number, setAs?: boolean): void {
    this.getPad(x, y).isActive = setAs !== undefined ? setAs : !this.getPad(x, y).isActive  
  }

  create(): void {
    this.sequence = this.notes().map(note => Array(this.steps).fill({ note, duration: `4n`, isActive: false }))
  }

  clear(): void {
    for (const row of this.sequence) {
      row.forEach(pad => pad.isActive = false)
    }
  }

  invertX(): void {
    this.sequence = this.sequence.map(note => note.reverse())
  }

  invertY(): void {
    this.sequence = this.sequence.map((_, index) => this.sequence[this.sequence.length - index - 1])
  }

  random(randomThreshold = 0.05): void {
    for (const row of this.sequence) {
      row.forEach(pad => {
        pad.isActive = Math.random() < randomThreshold

        if (pad.isActive) {
          console.log(pad)
        }
      })
    }
  }

  notes(): Frequency[] {
    return getSortedNotes(this.tones!, this.octaves!, this.lowOctave!) as Frequency[]
  }
}
