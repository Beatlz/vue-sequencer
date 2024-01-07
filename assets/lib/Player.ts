import {
  Sequence,
  Synth,
  Transport
} from "tone"
import { Grid } from "./Grid"
import type { Time } from "tone/build/esm/core/type/Units"

export class Player {
  private _isPlaying = false
  private _tempo = 120
  private _currentStep = 0
  
  grid: Grid
  sequences: Sequence[] = []
  synths: Synth[] = []
  stepLength: Time = `4n`

  constructor(grid?: Grid) {
    this.grid = grid || new Grid()
    
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

  createSequences(): void {
    this.sequences = this.grid.sequence.map((pads, index) => {
      this.synths[index] = new Synth().toDestination()
      
      return new Sequence((time, tone) => {
        this.synths[index].triggerAttackRelease(tone.note, tone.duration, time)
      }, pads, this.stepLength)
    })
  }

  play(at: number = 0): void  {
    if (this.isPlaying) {
      this.pause(at)

      return
    }

    Transport.start()
    Transport.bpm.value = this.tempo
    
    this.sequences.forEach(sequence => sequence.start(at))
  }

  pause(at: number = 0): void {
    if (!this.isPlaying) {
      return
    }

    Transport.stop()
    this.sequences.forEach(sequence => sequence.stop(at))
  }
}
