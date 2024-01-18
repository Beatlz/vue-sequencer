<script setup lang="ts">
// node modules
import { initFlowbite } from 'flowbite';
import { Scale } from 'mutsica';
// Vue layouts and components
import Sequencer from '~/layouts/Sequencer.vue';
// Modules
import { ChordProgression } from './assets/lib/ChordProgression';

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
  initFlowbite()
})

const scale = new Scale('C', 'm')

scale.createChords(4)

const prog = new ChordProgression(scale)

</script>

<template>
  <div>
    <sequencer v-if="isMounted" />
    <chord-pad v-for="chord in prog.chords" :chord="chord" v-if="isMounted" />
  </div>
</template>

<style>
@import url("~/assets/css/input.css");
</style>
