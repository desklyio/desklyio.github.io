<script setup lang="ts">
import {computed, onUnmounted, ref, watch} from "vue";
import {WidgetCard} from "@/components/ui/widgetcard";
import {useWidgets} from "@/composables/useWidgets.ts";
import {Slider} from "@/components/ui/slider";
import type {Duration} from "@/components/widgets/timer/index.ts";
import {useWebNotification} from "@vueuse/core";

interface Timer extends WidgetProps {
  duration: JSONString<Duration>
}

const props = defineProps<{ widget: Timer }>()
const {get, remove} = useWidgets()
const widget = get<Timer>(props.widget.uuid, props.widget)

const duration = computed({
  get: () => JSON.parse(widget.value.duration!),
  set: (value) => {
    widget.value.duration = JSON.stringify(value)
  }
})

const workDuration = computed({
  get: () => [duration.value.work],
  set: value => {
    duration.value = {...duration.value, work: value[0]}
  }
})
const shortDuration = computed({
  get: () => [duration.value.short],
  set: value => {
    duration.value = {...duration.value, short: value[0]}
  }
})
const longDuration = computed({
  get: () => [duration.value.long],
  set: value => {
    duration.value = {...duration.value, long: value[0]}
  }
})

/* ---------------- Timer Logic ---------------- */

type Phase = "work" | "short" | "long"
const phase = ref<Phase | null>(null)
const timeLeft = ref(0)
const isRunning = ref(false)
let interval: number | null = null

const delta = computed(() => {
  const m = Math.floor(timeLeft.value / 60).toString().padStart(2, "0")
  const s = Math.floor(timeLeft.value % 60).toString().padStart(2, "0")
  return `${m}:${s}`
})

const {
  isSupported,
  permissionGranted,
  show,
} = useWebNotification({
  title: 'Timer left',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'test',
})

function startPhase(p: Phase) {
  pauseTimer()
  phase.value = p
  timeLeft.value = duration.value[p] * 60
  startTimer()
}

function startTimer() {
  if (interval) return
  isRunning.value = true
  interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      pauseTimer()
    }
  }, 1000)
}

function pauseTimer() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
  isRunning.value = false
}

function togglePause() {
  if (isRunning.value) pauseTimer()
  else startTimer()
}

function resetTimer() {
  if (!phase.value) return
  timeLeft.value = duration.value[phase.value] * 60
  phase.value = null
  pauseTimer()
}


watch(duration, () => resetTimer())
onUnmounted(() => pauseTimer())

watch(timeLeft, (time) => {
  if (time > 0 || !isSupported.value || !permissionGranted.value) return
  show()
})
</script>

<template>
  <WidgetCard class="group" no-resize v-model:widget="widget" @delete="remove(props.widget.uuid)">
    <template #default>
      <div class="text-white flex justify-between text-2xl items-start">
        <div class="flex flex-col min-w-[100px] items-center justify-center">
          <span class="font-mono">{{ delta }}</span>
          <div v-if="phase" class="text-white/50 flex gap-2">
            <i class="bi-x cursor-pointer" @click="resetTimer" title="Reset"/>
            <i class=" cursor-pointer" :class="isRunning ? 'bi-pause': 'bi-play-fill'" @click="togglePause" title="Start Work"/>
          </div>
        </div>

        <div class="flex gap-3">
          <i class="bi-play cursor-pointer" @click="startPhase('work')" title="Start Work"/>
          <i class="bi-pause-fill cursor-pointer" @click="startPhase('short')" title="Short Pause"/>
          <i class="bi-controller cursor-pointer" @click="startPhase('long')" title="Long Pause"/>
        </div>
      </div>
    </template>

    <template #menu>
      <div class="w-full">
        <label>Work</label>
        <Slider :min="5" :max="120" :step="1" v-model="workDuration"/>
        <small>{{ duration.work }} min</small>
      </div>
      <div class="w-full">
        <label>Short pause</label>
        <Slider :min="1" :max="30" v-model="shortDuration"/>
        <small>{{ duration.short }} min</small>
      </div>
      <div class="w-full">
        <label>Long pause</label>
        <Slider :min="5" :max="120" v-model="longDuration"/>
        <small>{{ duration.long }} min</small>
      </div>
    </template>
  </WidgetCard>
</template>
