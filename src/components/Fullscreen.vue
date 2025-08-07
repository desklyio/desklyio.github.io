<script setup lang="ts">
import {computed} from "vue";

import {useFullscreen} from '@vueuse/core'

const fullscreen = useFullscreen(document.body)

const icon = computed(() => fullscreen.isFullscreen.value ? '◻' : '⛶')

function handleClick() {
  if (fullscreen.isFullscreen.value) {
    fullscreen.exit()
  } else {
    fullscreen.enter()
  }
}
</script>

<template>
  <button class="absolute bottom-8 right-8 text-white/20 text-3xl cursor-pointer w-[24px] h-[24px]" @click="handleClick">
    {{ icon }}
  </button>
</template>

<style scoped>

</style>
