<script setup lang="ts">
import { Sequencer } from '~/assets/lib/tsequencer'
import { CHORDS, NOTES, type Note } from 'mutsica'

const scale: Note[] = ["A", "B", "C", "D", "E", "F", "G"]
const sequencer = ref<Sequencer>(new Sequencer({ scale }))
const root = ref<Note>(scale[0])
const chords = ref(Object.entries(CHORDS).map(([name, template]) => ({ name, template })))
const chordNames = computed(() => chords.value.map(chord => chord.name))
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
        :style="{ opacity: step === sequencer.currentStep - 1 && sequencer.isPlaying ? 0.7 : 1 }"
        class="pad w-8 h-8"
        v-for="(beatValue, step) in sequencer.sequence[index]"
      />
    </div>
  </div>
  <div class="mt-8">
    <primary-button text="Play ⏵" @click="sequencer.play()" v-if="!sequencer.isPlaying" />
    <success-button text="Playing… ⏸" @click="sequencer.pause()" v-else />
    <dark-button text="Clean" @click="sequencer.clear()" />
    <dark-button text="Random" @click="sequencer.random()" />
    <dark-button text="Invert X" @click="sequencer.invertX()" />
    <dark-button text="Invert Y" @click="sequencer.invertY()" />
    <number-input :default-value="sequencer.tempo" v-model="sequencer.tempo"/>
  </div>
  <div class="mt-8">
    
  </div>
  <div>
    {{ root }}
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
