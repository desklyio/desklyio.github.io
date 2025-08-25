<script setup lang="ts">
import BellUrl from '@public/bell.mp3?url'
import {computed, onUnmounted, ref, useTemplateRef, watch} from "vue";
import {WidgetCard} from "@/components/ui/widgetcard";
import {useWidgets} from "@/composables/useWidgets.ts";
import {Slider} from "@/components/ui/slider";
import {useWebNotification} from "@vueuse/core";

type Phase = "work" | "short" | "long"

export interface TimerProps extends WidgetProps {
  durationWork: number,
  durationShort: number,
  durationLong: number,
}

const props = defineProps<{ widget: TimerProps }>()
const {get, remove} = useWidgets()
const widget = get<TimerProps>(props.widget.uuid, props.widget)

const audio = useTemplateRef<InstanceType<typeof HTMLAudioElement>>('audio')

const workDuration = computed({
  get: () => [widget.value.durationWork],
  set: value => {
    widget.value.durationWork = value[0]
  }
})
const shortDuration = computed({
  get: () => [widget.value.durationShort],
  set: value => {
    widget.value.durationShort = value[0]
  }
})
const longDuration = computed({
  get: () => [widget.value.durationLong],
  set: value => {
    widget.value.durationLong = value[0]
  }
})

/* ---------------- Timer Logic ---------------- */

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

const phaseDuration = computed( () =>({
  work: widget.value.durationWork!,
  short: widget.value.durationShort!,
  long: widget.value.durationLong!,
}))

function startPhase(p: Phase) {
  pauseTimer()
  phase.value = p
  timeLeft.value = phaseDuration.value[p] * 60
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
  timeLeft.value = phaseDuration.value[phase.value] * 60
  phase.value = null
  pauseTimer()
}


watch(phaseDuration, () => resetTimer())
onUnmounted(() => pauseTimer())

watch(timeLeft, (time) => {
  if (time > 0 || !isSupported.value || !permissionGranted.value) return
  show()
  audio.value?.play()
})
</script>

<template>
  <WidgetCard class="group" no-resize v-model:widget="widget" @delete="remove(props.widget.uuid)">
    <template #default>
      <div class="w-[256px]">
        <audio :src="BellUrl" class="d-none" ref="audio"/>
        <div class="text-white flex justify-between text-2xl items-start">
          <div class="flex flex-col min-w-[100px] items-center justify-center">
            <span class="font-mono">{{ delta }}</span>
            <div class="h-[30px]">
              <div v-if="phase" class="text-white/50 flex gap-2">
                <i class="bi-x cursor-pointer" @click="resetTimer" title="Reset"/>
                <i class=" cursor-pointer" :class="isRunning ? 'bi-pause': 'bi-play-fill'" @click="togglePause" title="Start Work"/>
              </div>
            </div>

          </div>

          <div class="flex gap-3 px-4">
            <i class="bi-play cursor-pointer" @click="startPhase('work')" title="Start Work"/>
            <i class="bi-pause-fill cursor-pointer" @click="startPhase('short')" title="Short Pause"/>
            <i class="bi-controller cursor-pointer" @click="startPhase('long')" title="Long Pause"/>
          </div>
        </div>
      </div>
    </template>

    <template #menu>
      <div class="w-full">
        <label>Work</label>
        <Slider :min="5" :max="120" :step="1" v-model="workDuration"/>
        <small>{{ $t( 'message.minute',  widget.durationWork!) }}</small>
      </div>
      <div class="w-full">
        <label>Short pause</label>
        <Slider :min="1" :max="30" v-model="shortDuration"/>
        <small>{{ $t( 'message.minute',  widget.durationShort!) }}</small>
      </div>
      <div class="w-full">
        <label>Long pause</label>
        <Slider :min="5" :max="120" v-model="longDuration"/>
        <small>{{ $t( 'message.minute',  widget.durationLong!) }}</small>
      </div>
    </template>
  </WidgetCard>
</template>
