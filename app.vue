<script setup lang="ts">
import { initFlowbite } from 'flowbite';
import Sequencer from '~/layouts/Sequencer.vue';

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
  initFlowbite()
})
</script>

<template>
  <div>
    <sequencer v-if="isMounted" />
  </div>
</template>

<style>
@import url("~/assets/css/input.css");
</style>
