<script setup lang="ts">
import { initFlowbite } from 'flowbite';

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
  initFlowbite()
})
</script>

<template>
  <div>
    <note-grid v-if="isMounted" />
  </div>
</template>

<style>
@import url("~/assets/css/input.css");
</style>
