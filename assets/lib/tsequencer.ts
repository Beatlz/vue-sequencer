import * as Tone from "tone"

import { getSortedNotes } from "./monterrey"

export interface SequencerSettings {
  tempo?: number
  scale?: string[]
  octaves?: number
  lowOctave?: number
  steps?: number
  sequence?: boolean[][]
}

export class Sequencer {
  private _sequence: boolean[][] = []
  private _stepLength = 16
  private _notes: string[] = []
  private _isPlaying = false
  private currentStep = 0
  private loop: Tone.Loop | null = null
  private _settings: SequencerSettings = {
    tempo: 120,
    scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    octaves: 3,
    lowOctave: 2,
    steps: 16,
  }

  constructor(options?: SequencerSettings) {
    this.settings = { ...this.settings, ...options }

    this.createEmptySequence()

    if (options?.sequence) {
      this.loadSequence(options.sequence)
    }
  }

  get stepLength(): string {
    return `${this._stepLength}n`
  }
  set stepLength(step: number) {
    this._stepLength = step
  }

  get notes(): string[] {
    return this._notes
  }
  private set notes(notes: string[]) {
    this._notes = notes
  }

  get isPlaying(): boolean {
    return this._isPlaying
  }
  private set isPlaying(isPlaying: boolean) {
    this._isPlaying = isPlaying
  }

  get settings(): SequencerSettings {
    return this._settings
  }
  set settings(settings: SequencerSettings) {
    let wasPlaying: boolean = this.isPlaying
    
    if (wasPlaying) this.pause()
    if (settings.scale) this.scale = settings.scale
    
    this._settings = settings

    if (wasPlaying) this.play()
  }

  get sequence(): boolean[][] {
    return this._sequence
  }
  private set sequence(sequence: boolean[][]) {
    this._sequence = sequence
  }

  set scale(scale: string[]) {
    const sequence = [...this.sequence]

    this.pause()
    this.settings.scale = scale
    this.createEmptySequence()
    this.sequence = sequence
  }

  createEmptySequence(): void {
    this.notes = this.getSortedSequence()
    this.sequence = this.notes.map(() => Array(this.settings.steps).fill(false))
  }

  loadSequence(sequence: boolean[][]): void {
    this.pause()
    this.sequence = sequence
    this.settings.steps = sequence[0].length
    this.settings.octaves = sequence.length / this.settings.scale!.length
  }

  play(): void {
    if (this.isPlaying) return

    const polySynth = new Tone.PolySynth(Tone.Synth).toDestination()

    Tone.Transport.bpm.value = this.settings.tempo!
    Tone.start()
    
    this.loop = new Tone.Loop(time => {
      this.sequence.forEach((note, index) => {
        if (note[this.currentStep]) {
          polySynth.triggerAttackRelease(this.notes[index], this.stepLength, time)
        }
      })

      this.currentStep = (this.currentStep + 1) % this.settings.steps!
    })

    this.loop.start(0)
    Tone.Transport.start()
    
    this.isPlaying = true
  }

  pause(): void {
    if (!this.loop) return

    Tone.Transport.stop()
    this.loop.stop(0)

    this.loop = null
    this.isPlaying = false
  }

  getSortedSequence(): string[] {
    return getSortedNotes(this.settings.scale!, this.settings.octaves!, this.settings.lowOctave!)
  }

  togglePadValue(noteIndex: number, beat: number): void {
    this.sequence[noteIndex][beat] = !this.sequence[noteIndex][beat]
  }
}

class SequencerControls {
  sequencer: Sequencer

  constructor (sequencer: Sequencer) {
    this.sequencer = sequencer
  }

  clear() {
    this.sequencer.pause()
    this.sequencer.createEmptySequence()
  }
}
