<script setup lang="ts">
import {ref} from "vue";

defineProps<{
  isDeleting: boolean,
  isEditing: boolean
}>()

const element = ref<InstanceType<typeof HTMLDivElement>>()

defineExpose({
  ref: element
})

</script>

<template>
  <div ref="element"
      class="bg-gradient-to-b from-transparent to-gray-900 w-screen bottom-0 absolute h-[100px] inline-flex justify-center"
      v-show="isEditing">
    <div class="w-1/3 inline-flex items-end justify-center pb-8" ref="trash">
      <div :style="{transform: isDeleting ? 'scale(1.5)' : ''}" class="text-4xl transition-transform">🗑️</div>
    </div>
  </div>
</template>
