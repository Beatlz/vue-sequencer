<template>
  <a class="block w-48 p-6 bg-gray-700 color-white border border-gray-200 rounded-lg shadow hover:bg-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      <slot/>
    </h5>
    <p class="font-normal text-violet-400 dark:text-gray-400">
      <slot name="secondary"/>
    </p>
  </a>
</template>

<style scoped>
a {
  cursor: pointer;
}
</style>
