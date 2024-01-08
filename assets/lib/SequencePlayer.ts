import {
  Sequence,
  Synth,
  Transport
} from "tone"
import type { Frequency, Time } from "tone/build/esm/core/type/Units"
import type { Pad } from "./Pad"
import { getSortedNotes, type Note } from "mutsica"

export interface GridSettings {
  steps?: number
  tones?: Note[]
  lowOctave?: number
  octaves?: number
}

export class SequencePlayer {
  private _isPlaying = false
  private _tempo = 120
  private _currentStep = 0
  private _sequences: Sequence[] = []
  private _sequence: Pad[][] = []

  lowOctave = 2
  octaves = 3
  steps = 32
  stepLength: Time = `4n`
  synths: Synth[] = []
  tones: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

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
    this.createSequences()
  }

  get isPlaying(): boolean {
    return this._isPlaying
  }
  private set isPlaying(isPlaying: boolean) {
    this._isPlaying = isPlaying
  }

  get tempo(): number {
    return this._tempo
  }
  set tempo(tempo: number) {
    this._tempo = tempo
    Transport.bpm.value = tempo
  }

  get currentStep(): number {
    return this._currentStep
  }
  private set currentStep(step: number) {
    this._currentStep = step
  }

  get sequences(): Sequence[] {
    this.createSequences()

    return this._sequences
  }
  set sequences(sequences: Sequence[]) {
    this._sequences = sequences
  }

  createSequences(): void {
    this.killSynths()
    
    this.sequences = this.sequence.map((pads, index) => {
      const padsToPlay = pads.map((pad) => pad.isActive ? pad : null)
      this.synths[index] = new Synth().toDestination()
      
      return new Sequence((time, tone) => {
        if (tone) this.synths[index].triggerAttackRelease(tone.note, tone.duration, time)
      }, padsToPlay, this.stepLength)
    })
  }

  play(at: number = 0): void  {
    if (this.isPlaying) {
      this.pause(at)

      return
    }

    this.createSequences()

    Transport.start()
    Transport.bpm.value = this.tempo
    this.isPlaying = true    
    this.sequences.forEach(sequence => sequence.start(at))
  }

  pause(at: number = 0): void {
    if (!this.isPlaying) {
      return
    }

    Transport.stop()
    this.sequences.forEach(sequence => sequence.stop(at))
    this.isPlaying = false
  }

  pauseAndPlay(callback: Function): void {
    const wasPlaying = this.isPlaying
    
    if (wasPlaying) this.pause()
    callback()
    if (wasPlaying) this.play()
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

  killSynths(): void {
    this.synths.forEach(synth => synth.dispose())
  }

  random(threshold = 0.05): void {
    this.sequence.forEach((pads, x) => {
      pads.forEach((_, y) => {
        this.togglePad(x, y, Math.random() < threshold)
      })
    })
  }

  invertX(): void {
    this.pauseAndPlay(() => {
      this.sequence = this.sequence.map(note => note.reverse())
    })
  }

  invertY(): void {
    this.sequence = this.sequence.map((_, index) => this.sequence[this.sequence.length - index - 1])
  }

  notes(): Frequency[] {
    return getSortedNotes(this.tones!, this.octaves!, this.lowOctave!) as Frequency[]
  }
}
