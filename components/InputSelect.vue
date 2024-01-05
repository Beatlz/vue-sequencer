<script lang="ts" setup>
const attrs = useAttrs()
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    required: false,
    type: String,
    default: `Choose an option`
  }
})

const selectedItem = ref<number>(attrs.modelValue as number)

watch(selectedItem, () => {
  emit('update:modelValue', selectedItem.value)
})
</script>

<template>
  <div>
    <label for="countries" class="block mb-2 text-sm font-medium text-white dark:text-white">
      <slot />
    </label>
    <select
      :id="name"
      v-model="selectedItem"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option selected disabled>{{ placeholder }}</option>
      <option v-for="(item, index) in options" :value="index">{{ item }}</option>
    </select>
  </div>
</template>