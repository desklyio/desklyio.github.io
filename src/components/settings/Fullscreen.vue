<script setup lang="ts">
import {computed} from "vue";

import {useFullscreen} from '@vueuse/core'
import {GlassButton} from "@/components/ui/button";

const fullscreen = useFullscreen(document.body)

const icon = computed(() => fullscreen.isFullscreen.value ? 'bi-fullscreen-exit' : 'bi-fullscreen')
const tooltip = computed(() => fullscreen.isFullscreen.value ? 'Exit fullscreen' : 'Fullscreen')

function handleClick() {
  if (fullscreen.isFullscreen.value) {
    fullscreen.exit()
  } else {
    fullscreen.enter()
  }
}
</script>

<template>
  <GlassButton :icon="icon" @click="handleClick" :tooltip="tooltip"/>
</template>

<style scoped>

</style>
