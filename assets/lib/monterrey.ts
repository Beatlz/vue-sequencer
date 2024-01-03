const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const sortNotes = (notes: string[]): string[] => {
  const noteToNumber = (note: string): number => {
      let octave = parseInt(note.slice(-1));
      let noteName = note.slice(0, -1);
      
      return octave * 12 + NOTES.indexOf(noteName);
  };

  return notes.sort((a, b) => noteToNumber(b) - noteToNumber(a));
}

export const getNextNoteWithOctave = (firstNoteWithOctave: string, secondNote: string) => {
  const firstNote = firstNoteWithOctave.slice(0, -1);
  const firstOctave = parseInt(firstNoteWithOctave.slice(-1), 10);
  const firstNoteIndex = NOTES.findIndex(n => n === firstNote);
  const secondNoteIndex = NOTES.findIndex(n => n === secondNote);

  if (secondNoteIndex <= firstNoteIndex || !secondNoteIndex) {
    return `${secondNote}${firstOctave + 1}`
  }

  return `${secondNote}${firstOctave}`
}

export const getSortedNotes = (scale: string[], octaves: number, firstOctave: number) => {
  const notes: string[] = []
  
  let currentNoteIndex = 0

  for (let currentOctave = firstOctave; currentOctave < firstOctave + octaves; currentOctave++) {
    scale.forEach((note, index) => {
      if (index < 1) {
        notes.push(`${note}${currentOctave}`)
      } else {
        const previousNote = notes[currentNoteIndex - 1] as string

        notes.push(getNextNoteWithOctave(previousNote, note))
      }

      currentNoteIndex++
    })
  }

  return notes.reverse()
}
