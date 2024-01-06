import * as Tone from "tone"

import { getSortedNotes, type Note } from "mutsica"

export interface SequencerInitSettings {
  tempo?: number
  scale?: Note[]
  octaves?: number
  lowOctave?: number
  steps?: number
  sequence?: boolean[][]
  noteDuration?: number
  stepLength?: number
}

export class Sequencer {
  private _sequence: boolean[][] = []
  private _noteDuration = 8
  private _notes: string[] = []
  private _isPlaying = false
  private _currentStep = 0
  private _tempo = 120
  private _scale: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  private loop: Tone.Loop | null = null
  private _stepLength = 4

  octaves = 3
  lowOctave = 2
  steps = 16
  

  constructor(options?: SequencerInitSettings) {
    this._tempo = options?.tempo || this._tempo
    this._scale = options?.scale || this._scale
    this._noteDuration = options?.noteDuration || this._noteDuration
    this._stepLength = options?.stepLength || this._stepLength

    this.octaves = options?.octaves || this.octaves
    this.lowOctave = options?.lowOctave || this.lowOctave
    this.steps = options?.steps || this.steps
    

    this.createEmptySequence()

    if (options?.sequence) {
      this.sequence = options.sequence
    }
  }

  get noteDuration(): string {
    return `${this._noteDuration}n`
  }
  set noteDuration(step: number) {
    this._noteDuration = step
  }

  get notes(): string[] {
    return this._notes
  }
  private set notes(notes: string[]) {
    this._notes = notes

    const currentSequencePlusNewNotes = this.sequence.map(note => [...note, ...Array(this.steps).fill(false)])
  }

  get isPlaying(): boolean {
    return this._isPlaying
  }
  private set isPlaying(isPlaying: boolean) {
    this._isPlaying = isPlaying
  }

  get sequence(): boolean[][] {
    return this._sequence
  }
  set sequence(sequence: boolean[][]) {
    this._sequence = sequence
    this.steps = sequence[0].length
    this.octaves = sequence.length / this.scale!.length
  }

  get scale(): Note[] {
    return this._scale
  }
  set scale(scale: Note[]) {
    this._scale = scale
    this.notes = this.getSortedSequence()
  }

  get currentStep(): number {
    return this._currentStep
  }
  private set currentStep(step: number)  {
    this._currentStep = step
  }

  get tempo(): number {
    return this._tempo
  }
  set tempo(tempo: number) {
    this._tempo = tempo
    Tone.Transport.bpm.value = tempo
  }

  get stepLength(): string {
    return `${this._stepLength}n`
  }
  set stepLength(stepLength: string) {
    this.pausePlay(() => {
      this._stepLength = parseInt(stepLength)
    })
  }

  createEmptySequence(): void {
    this.notes = this.getSortedSequence()
    
    this.clear()
  }

  getSortedSequence(): string[] {
    return getSortedNotes(this.scale!, this.octaves!, this.lowOctave!)
  }

  togglePadValue(noteIndex: number, beat: number): void {
    this.sequence[noteIndex][beat] = !this.sequence[noteIndex][beat]
  }

  play(): void {
    if (this.isPlaying) {
      this.pause()

      return
    }
  
    const polySynth = new Tone.PolySynth(Tone.Synth).toDestination()

    Tone.Transport.bpm.value = this.tempo!
    Tone.start()
  
    // Calculate the loop interval based on stepLength.
    // For instance, '4n' for quarter note, '8n' for eighth note, etc.
  
    this.loop = new Tone.Loop(time => {
      this.sequence.forEach((note, index) => {
        if (note[this.currentStep]) {
          polySynth.triggerAttackRelease(this.notes[index], this.noteDuration, time)
        }
      })
  
      // Update currentStep based on stepLength.
      this.currentStep = (this.currentStep + 1) % this.steps;
    }, this.stepLength)
  
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

  pausePlay(callback: Function) {
    const wasPlaying = this.isPlaying

    if (wasPlaying) this.pause()

    callback()

    if (wasPlaying) this.play()
  }

  clear(): void {
    this.pause()
    this.sequence = this.notes.map(() => Array(this.steps).fill(false))
  }

  random(randomThreshold = 0.05): void {
    for (const note in this.sequence) {
      this.sequence[note] = new Array(this.steps).fill(false).map(() => Math.random() <= randomThreshold)
    }
  }

  invertX() {
    this.sequence = this.sequence.map(note => note.reverse())
  }

  invertY() {
    this.sequence = this.sequence.map((_, index) => this.sequence[this.sequence.length - index - 1])
  }
}
