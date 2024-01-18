import { type NoteName, Scale, Chord } from "mutsica";

export class ChordProgression {
  scale: Scale
  chords: Chord[] = []
  progression: number[] = [2, 5, 1]
  
  constructor(scale?: Scale) {
    this.scale = scale || new Scale(`C`, `maj`)

    this.addChords()
  }
  
  addChords() {
    this.chords = this.progression.map(degree => this.scale.chords[degree - 1])
  }

  progChordsNotes(): NoteName[][] {
    return this.progression.map((degree): NoteName[] => {
      return this.scale?.chords[degree - 1].notes || []
    })
  }
}
