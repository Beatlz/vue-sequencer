<script setup lang="ts">
const props = defineProps({
  defaultValue: {
    type: Number,
    required: false,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.defaultValue || 0)

const changeValue = (amount: number) => {
  inputValue.value = amount
}

watch(inputValue, (value) => {
  inputValue.value = parseInt(value.toString())

  emit('update:modelValue', inputValue.value)
})
</script>


<template> 
  <div class="inline-block">
    <div class="relative flex items-center max-w-[8rem]">
      <button
        type="button"
        id="decrement-button"
        @click="changeValue(inputValue - 1)"
        class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
          <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
          </svg>
      </button>
      <input 
        type="text"
        class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="BPM"
        v-model="inputValue"
      />
      <button
        type="button"
        @click="changeValue(inputValue + 1)"
        id="increment-button"
        class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
          <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
          </svg>
      </button>
    </div>
  </div>
</template>
