<script setup lang="ts">
// `text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800`
import { NOTES, SCALES, scaleNames, calculateNotes } from 'mutsica'
import { Sequencer } from '~/assets/lib/tsequencer'
import { BUTTONS } from '~/assets/style';

const rootIndex = ref(0)
const scaleIndex = ref(0)
const stepLength = ref(2)
const noteDuration = ref(2)
const root = computed(() => NOTES[rootIndex.value])
const scale = computed(() => {
  const scaleName = scaleNames[scaleIndex.value]
  const template = SCALES[scaleName].template

  return calculateNotes(root.value, template)
})

const sequencer = ref<Sequencer>(new Sequencer({ scale: scale.value, steps: 32 }))


watch(scale, () => {
  sequencer.value.scale = scale.value
})
watch(stepLength, () => {
  sequencer.value.stepLength = [1, 2, 4, 8, 16][stepLength.value].toString()
})
watch(noteDuration, () => {
  sequencer.value.noteDuration = [1, 2, 4, 8, 16][noteDuration.value].toString()
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
        :class="{
          'bg-gray-700': note.slice(0, -1) === root,
          'bg-violet-400': !(step % (sequencer.steps / 4)) && !beatValue,
          'bg-purple-900': beatValue,
        }"
        :style="{ opacity: (step === sequencer.currentStep - 1 || step - sequencer.currentStep === sequencer.steps - 1) && sequencer.isPlaying ? 0.7 : 1 }"
        class="pad w-8 h-8"
        v-for="(beatValue, step) in sequencer.sequence[index]"
      >
        {{ index === sequencer.notes.length - 1 ? step + 1 : '' }}
      </div>
    </div>
  </div>
  <div class="mt-8">
    <button :class="!sequencer.isPlaying ? BUTTONS.primary : BUTTONS.secondary" class="w-36" @click="sequencer.play()">
      {{ !sequencer.isPlaying ? `Play ⏵` : `Playing… ⏸` }}
    </button>
    <button :class="BUTTONS.dark" class="w-36" @click="sequencer.clear()">
      Clear
    </button>
    <button :class="BUTTONS.dark" class="w-36" @click="sequencer.random()">
      Random
    </button>
    <button :class="BUTTONS.dark" class="w-36" @click="sequencer.invertX()">
      InvertX
    </button>
    <button :class="BUTTONS.dark" class="w-36" @click="sequencer.invertY()">
      InvertY
    </button>
    <input-number class="ml-2" :default-value="sequencer.tempo" v-model="sequencer.tempo"/>
  </div>
  <div class="mt-8">
    <input-select
      class="w-36 inline-block"
      name="note-input"
      :options="(<unknown>NOTES as string[])"
      placeholder="Select a root note"
      v-model="rootIndex"
    >
      Root note:
    </input-select>
    <input-select
      class="w-72 ml-2 inline-block"
      name="scale-input"
      :options="scaleNames"
      placeholder="Select a scale"
      v-model="scaleIndex"
    >
      Scale:
    </input-select>
  </div>
  <div class="mt-8">
    <button-selector
      :options="[`1`, `1/2`, `1/4`, `1/8`, `1/16`]"
      v-model="stepLength"
    >Step length:</button-selector>
  </div>
  <div class="mt-8">
    <button-selector
      :options="[`1`, `1/2`, `1/4`, `1/8`, `1/16`]"
      v-model="noteDuration"
    >
      Note duration:
    </button-selector>
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
.pad:first-of-type {
  margin-left: 0px;
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
