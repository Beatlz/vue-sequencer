import * as Tone from "tone"

import { getSortedNotes, type NoteName } from "mutsica"
import { Pads } from "./Pads"
import type { Time } from "tone/build/esm/core/type/Units"

export interface SequencerInitSettings {
  tempo?: number
  scale?: NoteName[]
  octaves?: number
  lowOctave?: number
  steps?: number
  sequence?: boolean[][]
  noteDuration?: Time
  stepLength?: number
}

export class PadsController {
  private _isPlaying = false
  private _currentStep = 0
  private _tempo = 120
  private _scale: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  private loop: Tone.Loop | null = null
  private _stepLength = 8

  pads: Pads
  octaves = 3
  lowOctave = 2
  steps = 16
  noteDuration: Time = `8n`

  constructor(init?: SequencerInitSettings) {
    if (init) Object.assign(this, init)

    this.pads = new Pads({ tones: this.sortTones(), steps: this.steps })
  }

  get isPlaying(): boolean {
    return this._isPlaying
  }
  private set isPlaying(isPlaying: boolean) {
    this._isPlaying = isPlaying
  }

  get scale(): NoteName[] {
    return this._scale
  }
  set scale(scale: NoteName[]) {
    this._scale = scale
    
    if (this.pads) this.pads.tones = this.sortTones()
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

  sortTones(): NoteName[] {
    return getSortedNotes(this.scale!, this.octaves!, this.lowOctave!) as NoteName[]
  }

  play(): void {
    if (this.isPlaying) {
      this.pause()

      return
    }
  
    const polySynth = new Tone.PolySynth(Tone.Synth).toDestination()

    Tone.Transport.bpm.value = this.tempo!
    Tone.start()
  
    this.loop = new Tone.Loop(time => {
      this.pads.matrix.forEach((row, index) => {
        const pad = row[this.currentStep]
        
        if (pad.isActive) {
          polySynth.triggerAttackRelease(pad.tone || this.pads.tones[index], pad.duration, time, pad.velocity)
        }
      })
  
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

  changeOctaves(change: number): void {
    const numsOnlyRegex = /\d+/g
    const lowestNote = this.pads.tones[0] as string

    if (lowestNote.match(numsOnlyRegex)![0] === '0' && change < 0) return

    this.pads.tones.forEach((_tone, index) => {
      const tone = _tone as string
      const octave = parseInt(tone.match(numsOnlyRegex)![0])

      this.pads.tones[index] = tone.replace(numsOnlyRegex, `${octave + change}`)
    })
  }
}
