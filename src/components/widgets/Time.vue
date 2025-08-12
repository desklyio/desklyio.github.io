<script lang="ts">
export const meta: WidgetMeta = {
  name: 'Time',
  icon: 'bi-clock',
  shortcut: 'Shift+Ctrl+Z',
  initial: {
    width: 300,
    height: 170
  }
}
</script>

<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import {useDateFormat} from "@vueuse/core";
import {WidgetCard} from "@/components/ui/widgetcard";
import {useWidgets, type Widget} from "@/composables/useWidgets.ts";

const props = defineProps<{ widget: Widget }>()

const {get, remove} = useWidgets()

const widget = get<Widget>(props.widget.uuid, props.widget)

const rawdate = ref(new Date)
let timer: number | null = null

const time = useDateFormat(rawdate, 'HH:mm')
const date = useDateFormat(rawdate, 'ddd, DD MMM YYYY')

onMounted(() => {
  timer = setInterval(() => {
    rawdate.value = new Date
  }, 1000)
})

onUnmounted(() => {
  if (typeof timer === 'number') clearInterval(timer)
})
</script>

<template>
  <widget-card no-resize v-model:widget="widget" @delete="remove(props.widget.uuid)">
    <div class="text-center">
      <h1 class="text-8xl text-white">{{ time }}</h1>
      <h3 class="text-2xl text-center text-white/50">{{ date }}</h3>
    </div>
  </widget-card>
</template>
