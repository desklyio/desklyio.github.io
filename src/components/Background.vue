<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {watchOnce} from "@vueuse/core";
import {useConfig} from "../composables/useConfig.ts";
import {useBackgrounds} from "../composables/useBackgrounds.ts";

const {getBackgroundUrls} = useBackgrounds()
const {getOptions} = useConfig()

const urls = getBackgroundUrls()
const options = getOptions()

const counter = ref(0)
const next = computed(() => urls.value[counter.value]?.url)

const primary = ref()
const secondary = ref()

const active = ref<'primary' | 'secondary'>('primary')

const primaryActive = computed(() => active.value === 'primary')

const id = ref(0)

async function loadVideo() {
  if ('primary' === active.value) {
    secondary.value!.src = next.value
    active.value = 'secondary'
  } else {
    primary.value!.src = next.value
    active.value = 'primary'
  }
}

watchOnce(urls, () => {
  loadVideo()
})

watch(counter, () => {
  loadVideo()
}, {flush: 'post'});

function getSwitchInterval() {
  return setInterval(() => {
    if (urls.value.length > 0) {
      counter.value = (counter.value + 1) % urls.value.length
    }
  }, options.value.backgroundSwitchMinutes * 1000 * 60)
}

watch(() => options.value.backgroundSwitchMinutes, () => {
  clearInterval(id.value)
  id.value = getSwitchInterval()
})

onMounted(() => {
  primary.value!.src = next.value

  id.value = getSwitchInterval()
})

onUnmounted(() => clearInterval(id.value))

</script>

<template>
  <div class="bg-black h-screen w-screen overflow-hidden">
    <video ref="primary"
           class="h-screen w-screen absolute top-0 object-cover transition-opacity ease-in duration-500" autoplay muted
           loop
           :class="{'opacity-0': !primaryActive, 'opacity-100': primaryActive}"/>
    <video ref="secondary"
           class="h-screen w-screen absolute top-0 object-cover transition-opacity ease-in duration-500" autoplay muted
           loop
           :class="{'opacity-0': primaryActive, 'opacity-100': !primaryActive}"/>
  </div>
</template>
