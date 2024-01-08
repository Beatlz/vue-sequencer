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
  private _sequence: Pad[][] = []

  steps = 32
  tones: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  lowOctave = 2
  octaves = 3

  constructor(sequence?: Pad[][] | GridSettings) {
    if (sequence instanceof Array) {
      this._sequence = sequence
    } else {
      this.steps = sequence?.steps || this.steps
      this.tones = sequence?.tones || this.tones
      this.lowOctave = sequence?.lowOctave || this.lowOctave
      this.octaves = sequence?.octaves || this.octaves

      this.create()
    }
  }

  get sequence(): Pad[][] {
    return this._sequence
  }
  set sequence(sequence: Pad[][]) {
    this._sequence = sequence
  }

  togglePad(x: number, y: number, setAs?: boolean): void {
    this.sequence[x][y].isActive = setAs !== undefined
      ? setAs
      : !this.sequence[x][y].isActive
  }

  create(): void {
    this.sequence = this.notes().map(note =>
      Array.from({ length: this.steps }, () => ({
        note,
        duration: `16n`,
        isActive: false,
        velocity: 0.5
      }))
    );
  }

  clear(): void {
    this.sequence.forEach((_, row) => {
      this.sequence[row].forEach((__, beat) => {
        this.togglePad(row, beat, false)
      })
    })
  }

  random(threshold = 0.05): void {
    this.sequence.forEach((pads, x) => {
      pads.forEach((_, y) => {
        this.togglePad(x, y, Math.random() < threshold)
      })
    })
  }

  invertX(): void {
    this.sequence = this.sequence.map(note => note.reverse())
  }

  invertY(): void {
    this.sequence = this.sequence.map((_, index) => this.sequence[this.sequence.length - index - 1])
  }

  notes(): Frequency[] {
    return getSortedNotes(this.tones!, this.octaves!, this.lowOctave!) as Frequency[]
  }
}
