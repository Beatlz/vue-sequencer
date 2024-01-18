<script lang="ts" setup>
import type { Chord } from 'mutsica';
import { ChordPad } from '~/assets/lib/ChordPad';
import type { Pad } from '~/assets/lib/Pad';

const props = defineProps({
  chord: {
    type: Object as PropType<Chord>,
    required: true,
  },
})

props.chord.open({ bassNote: 3, brilliance: 2 })

const pads: Pad[] = props.chord.tones.map(tone => {
  return {
    tone,
    duration: `4n`,
    isActive: true,
    velocity: 0.5,
  }
})

const pad = new ChordPad({ pads })
</script>

<template>
  <card-simple @click="pad.play({ roll: { delay: 0.1 } })">
    <template #default>
      {{ `${chord.root}${chord.name}` }}
    </template>
    <template #secondary>
      <span v-for="(note, index) in chord.notes">
        <span :class="{
          'text-gray-100': chord.root === note,
          'text-yellow-400': !chord.notes.includes(note),
        }">
          {{ note }}
        </span>
        <span v-if="index !== chord.notes.length - 1" >
          |
        </span>
      </span>
    </template>
  </card-simple>
</template>
