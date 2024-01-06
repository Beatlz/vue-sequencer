<script lang="ts" setup>
import { BUTTONS } from '~/assets/style';

const attrs = useAttrs()
const props = defineProps({
  options: {
    required: true,
    type: Array as PropType<string[]>,
  },
})

const emit = defineEmits([`update:modelValue`])
const selected = ref<number>(attrs.modelValue as number)
const selectOption = (option: number) => {
  selected.value = option

  emit(`update:modelValue`, selected.value)
}
</script>

<template>
  <div>
    <div>
      <slot />
    </div>
    <button
      v-for="(item, index) in options"
      @click="selectOption(index)"
      :class="`w-20 ${index === selected ? BUTTONS.secondary : BUTTONS.dark}`"
      class="mt-2"
    >
      {{ item }}
    </button>
  </div>
</template>
