<script setup lang="ts">
// `text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800`
import { NOTE_NAMES, SCALES, scaleNames, calculateNotes } from 'mutsica'

import { PadsController } from "~/assets/lib/PadsController"
import type { Pads } from "~/assets/lib/Pads"
import { BUTTONS } from '~/assets/style';

const rootIndex = ref(0)
const scaleIndex = ref(0)
const stepLength = ref(2)
const noteDuration = ref(2)
const root = computed(() => NOTE_NAMES[rootIndex.value])
const scale = computed(() => {
  const scaleName = scaleNames[scaleIndex.value]
  const template = SCALES[scaleName].template

  return calculateNotes(root.value, template)
})

const sequencer = ref<PadsController>(new PadsController({ scale: scale.value }))
const pads = ref<Pads>(sequencer.value.pads as Pads)

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
  <div v-for="(tone, row) in pads.tones" :key="`note_row_${tone}`" class="flex h-10">
    <div class="w-12 flex items-center justify-center">
      {{ tone }}
    </div>
    <div class="flex items-center justify-center">
      <div
        v-for="(pad, step) in pads.matrix[row]"
        @click="pads.togglePad(row, step)"
        :id="`${tone}_${step}`"
        :key="`pad_${tone}_${step}`"
        :class="{
          'bg-gray-700': (<string>tone).includes(root),
          'bg-violet-400': !(step % (pads.steps / 4)) && !pad.isActive,
          'bg-purple-900': pad.isActive,
          'bg-red-600': pad.tone && pad.tone !== tone,
        }"
        :style="{ opacity: (step === sequencer.currentStep - 1 || step - sequencer.currentStep === sequencer.steps - 1) && sequencer.isPlaying ? 0.7 : 1 }"
        class="pad w-8 h-8 bg-gray-500 border border-gray-300"
      >
        {{ row === pads.tones.length - 1 ? step + 1 : '' }}
      </div>
    </div>
  </div>
  <div class="mt-8">
    <button :class="!sequencer.isPlaying ? BUTTONS.primary : BUTTONS.secondary" class="w-36" @click="sequencer.play()">
      {{ !sequencer.isPlaying ? `Play ⏵` : `Playing… ⏸` }}
    </button>
    <button :class="BUTTONS.dark" class="w-36" @click="pads.clear()">
      Clear
    </button>
    <button :class="BUTTONS.dark" class="w-36" @click="pads.random()">
      Random
    </button>
    <button :class="BUTTONS.dark" class="w-36" @click="pads.invertX()">
      InvertX
    </button>
    <button :class="BUTTONS.dark" class="w-36" @click="pads.invertY()">
      InvertY
    </button>
    <input-number class="ml-2" :default-value="sequencer.tempo" v-model="sequencer.tempo"/>
  </div>
  <div class="mt-8">
    <input-select
      class="w-36 inline-block"
      name="note-input"
      :options="(<unknown>NOTE_NAMES as string[])"
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
