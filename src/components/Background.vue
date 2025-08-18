<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch, watchEffect} from "vue";
import {useMagicKeys, watchOnce} from "@vueuse/core";
import {useBackground} from "@/composables/useBackground.ts";
import {useOptions} from "@/composables/useOptions.ts";

const {getUrls} = useBackground()
const {get} = useOptions()

const urls = getUrls()
const backgroundDuration = get('backgroundDuration')

const counter = ref(0)
const next = computed(() => urls.value[counter.value]?.url)

const primary = ref()
const secondary = ref()

const active = ref<'primary' | 'secondary'>('primary')

const primaryActive = computed(() => active.value === 'primary')

const id = ref(0)

const { Shift_Ctrl_n, Shift_Ctrl_p} = useMagicKeys()


async function loadVideo() {
  if ('primary' === active.value) {
    secondary.value!.src = next.value
    active.value = 'secondary'
  } else {
    primary.value!.src = next.value
    active.value = 'primary'
  }
}

function nextVideo(next = 1) {
  counter.value = Math.max(counter.value + next, 0) % urls.value.length
}

function getSwitchInterval() {
  return setInterval(() => {
    if (urls.value.length > 0) {
      nextVideo()
    }
  }, backgroundDuration.value * 1000 * 60)
}

watchEffect(() => {
  if(Shift_Ctrl_n.value) nextVideo()
  if(Shift_Ctrl_p.value) nextVideo(-1)
})

watchOnce(urls, () => {
  loadVideo()
})

watch(counter, () => {
  loadVideo()
}, {flush: 'post'});

watch(() => backgroundDuration.value, () => {
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
  <div class="bg-black h-screen w-screen overflow-hidden brightness-[80%]">
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
