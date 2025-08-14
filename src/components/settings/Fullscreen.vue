<script setup lang="ts">
import {computed} from "vue";

import {useFullscreen} from '@vueuse/core'
import {GlassButton} from "@/components/ui/button";

const {toggle, isFullscreen} = useFullscreen()

const icon = computed(() => isFullscreen.value ? 'bi-fullscreen-exit' : 'bi-fullscreen')
const tooltip = computed(() => isFullscreen.value ? 'Exit fullscreen' : 'Fullscreen')
</script>

<template>
  <GlassButton side="left" :icon="icon" @click="toggle" :tooltip="tooltip"/>
</template>

<style scoped>

</style>
