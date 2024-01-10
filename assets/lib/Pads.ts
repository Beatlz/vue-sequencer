import type { Frequency } from "tone/build/esm/core/type/Units";
import { PAD, type Pad } from "./Pad";

const DEFAULT_TONES = 21

export interface PadSettings {
  steps: number
  tones: Frequency[]
}

export class Pads {
  private _matrix: Pad[][] = []
  private _steps = 32
  private _tones: Frequency[] = []

  constructor(settings: PadSettings) {
    this._steps = settings.steps
    this._tones = settings.tones
    
    this.createMatrix()
  }

  get matrix(): Pad[][] {
    return this._matrix
  }
  set matrix(sequence: Pad[][]) {
    this._matrix = sequence
  }

  get steps(): number {
    return this._steps
  }
  set steps(steps: number) {
    this._steps = steps
  }

  get tones(): Frequency[] {
    return this._tones
  }
  set tones(tones: Frequency[]) {
    this._tones = tones

    if (this.matrix) this.updateTones()
  }

  togglePad(x: number, y: number, setAs?: boolean): void {
    this.matrix[x][y].isActive = setAs !== undefined
      ? setAs
      : !this.matrix[x][y].isActive
  }

  createMatrix(): void {
    this.matrix = this.tones.map((_) => {
      const matrixRow: Pad[] = []

      for (let step = 0; step < this.steps; step++) {
        matrixRow.push({ ...PAD })
      }

      return matrixRow
    })
  }

  updateTones() {
    this.tones.forEach((tone, row) => {
      this.matrix[row].forEach(pad => pad.tone = tone)
    })
  }

  clear(): void {
    this.matrix.forEach((_, row) => {
      this.matrix[row].forEach((__, beat) => {
        this.togglePad(row, beat, false)
      })
    })
  }

  random(threshold = 0.05): void {
    this.matrix.forEach((pads, x) => {
      pads.forEach((pad, y) => {
        this.togglePad(x, y, Math.random() < threshold)
      })
    })
  }

  invertX(): void {
    this.matrix = this.matrix.map(note => note.reverse())
  }

  invertY(): void {
    this.matrix = this.matrix.map((_, index) => this.matrix[this.matrix.length - index - 1])
  }

  changeOctaves(octaves: number): void {
    const onlyNumberRegex = /\d+/g
    const lowestOctave = Number((<string>this.tones[0]).match(onlyNumberRegex))
    const highestOctave = Number((<string>this.tones[this.tones.length - 1]).match(onlyNumberRegex))

    if (lowestOctave + octaves < 0) return
    if (highestOctave + octaves > 8) return

    this.tones = this.tones.map(tone => {
      const octave = Number((<string>tone).match(onlyNumberRegex))

      return (<string>tone).replace(onlyNumberRegex, String(octave + octaves))
    })
  }
}

