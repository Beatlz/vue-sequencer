<script lang="ts" setup>
import type { Chord } from 'mutsica';
import { ChordPad } from '~/assets/lib/ChordPad';

const props = defineProps({
  chord: {
    type: Object as PropType<Chord>,
    required: true,
  },
})

const pad = new ChordPad({ tones: props.chord.open({ bassNote: 3, brilliance: 2 }), duration: `4n` })
</script>

<template>
  <card-simple @click="pad.play()">
    <template #default>
      {{ chord.root }}{{ chord.name }}
    </template>
    <template v-slot:secondary>
      <span v-for="(note, index) in chord.notes">
        {{ note }} <span v-if="index !== chord.notes.length - 1" >|&nbsp;</span>
      </span>
    </template>
  </card-simple>
</template>
