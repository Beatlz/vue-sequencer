<script setup lang="ts">
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
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
