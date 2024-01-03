<script setup lang="ts">
import * as Tone from 'tone'
import { sortNotes } from '~/assets/lib/monterrey'
import { Sequencer } from '~/assets/lib/tsequencer'

// Constants
const STEPS = 32
const OCTAVES = 3
const BASS_OCTAVE = 2
const RANDOM_THRESHOLD = 0.05
const INTERVAL = `16n`
const scale: string[] = ["A", "B", "C", "D", "E", "F", "G"]

const sequencer = ref<Sequencer>(new Sequencer({ scale }))

// References
const bpm = ref(120)
const sequence = ref<{ [key: string]: boolean[] }>({})
const isPlaying = ref(false)
const currentStep = ref(0);
const loop = ref<Tone.Loop | null>(null);
// Computed props
const sortedSequence = computed(() => sortNotes(Object.keys(sequence.value)))
// Methods
const createSequence = () => {
  for (let octave = BASS_OCTAVE; octave < OCTAVES + BASS_OCTAVE; octave++) {
    scale.forEach(note => {
      sequence.value[`${note}${octave}`] = new Array(STEPS).fill(false)
    })
  }
}
const play = () => {
  const polySynth = new Tone.PolySynth(Tone.Synth).toDestination()

  Tone.Transport.bpm.value = bpm.value
  Tone.start()
  
  loop.value = new Tone.Loop(time => {
    sortedSequence.value.forEach(noteWithOctave => {
      if (sequence.value[noteWithOctave] && sequence.value[noteWithOctave][currentStep.value]) {
        polySynth.triggerAttackRelease(noteWithOctave, INTERVAL, time)
      }
    })

    currentStep.value = (currentStep.value + 1) % STEPS
  }, INTERVAL)

  loop.value.start(0)
  Tone.Transport.start()
  
  isPlaying.value = true
}
const pause = () => {
  if (!loop.value) return

  Tone.Transport.stop()
  loop.value.stop(0)

  loop.value = null
  isPlaying.value = false
}
const updatePad = (note: string, step: number) => {
  sequence.value[note][step] = !(sequence.value[note][step])
}
const clean = () => {
  pause()

  for (const note of Object.keys(sequence.value)) {
    sequence.value[note] = new Array(STEPS).fill(false)
  }
}
const randomPattern = () => {
  for (const note of Object.keys(sequence.value)) {
    sequence.value[note] = new Array(STEPS).fill(false).map(() => Math.random() <= RANDOM_THRESHOLD)
  }
}
const invertVertically = () => {
  const notes = Object.keys(sequence.value)
  const notesLength = notes.length
  const halfNotesLength = Math.floor(notesLength / 2)

  for (let i = 0; i < halfNotesLength; i++) {
    const temp = sequence.value[notes[i]]
    sequence.value[notes[i]] = sequence.value[notes[notesLength - i - 1]]
    sequence.value[notes[notesLength - i - 1]] = temp
  }
}
const invertHorizontally = () => {
  for (const note of Object.keys(sequence.value)) {
    sequence.value[note] = sequence.value[note].reverse()
  }
}
// Implementation
createSequence()

watch(bpm, () => {
  Tone.Transport.bpm.value = bpm.value
})
</script>

<template>
  <div v-for="(note, index) in sequencer.notes" :key="`note_row_${note}`" class="flex h-10">
    <div class="w-12 flex items-center justify-center">
      {{ note }}
    </div>
    <div class="flex items-center justify-center">
      <div
        @click="sequencer.togglePadValue(index, step)"
        :id="`${note}_${step}`"
        :key="`pad_${note}_${step}`"
        :class="{ checked: beatValue }"
        :style="{ opacity: step === currentStep - 1 && isPlaying ? 0.7 : 1 }"
        class="pad w-8 h-8"
        v-for="(beatValue, step) in sequencer.sequence[index]"
      />
    </div>
  </div>
  <div class="mt-8">
    <primary-button text="Play ⏵" @click="sequencer.play()" v-if="!isPlaying" />
    <success-button text="Playing… ⏸" @click="sequencer.pause()" v-else />
    <dark-button text="Clean" @click="clean" />
    <dark-button text="Random" @click="randomPattern" />
    <dark-button text="Invert X" @click="invertHorizontally" />
    <dark-button text="Invert Y" @click="invertVertically" />
    <number-input :default-value="bpm" v-model="bpm"/>
  </div>
</template>

<style>
.pad {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #7b7b7b;
  border: 1px solid #7b7b7b;
  cursor: pointer;
  margin-left: 3px;
  border-radius: 3px;
  transition: background-color 0.1s linear, border-color 0.1s linear; 
}
.pad.checked {
  background-color: #b03137 !important;
  border-color: #b03137 !important;
}
.pad:first-of-type {
  margin-left: 0px;
}
.pad:nth-of-type(8n+1) {
  background-color: rgb(100, 167, 143);
  border-color: rgb(100, 167, 143);
}
.playhead {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px; /* Adjust width as needed */
  background-color: red; /* Choose a color that stands out */
  z-index: 10; /* Ensure it's above the pads */
}
</style>
