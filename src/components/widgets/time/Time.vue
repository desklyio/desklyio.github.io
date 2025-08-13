<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import {useDateFormat} from "@vueuse/core";
import {WidgetCard} from "@/components/ui/widgetcard";
import {useWidgets} from "@/composables/useWidgets.ts";

const props = defineProps<{ widget: WidgetProps }>()

const {get, remove} = useWidgets()

const widget = get<WidgetProps>(props.widget.uuid, props.widget)

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
  <WidgetCard no-resize v-model:widget="widget" @delete="remove(props.widget.uuid)">
    <div class="text-center">
      <h1 class="text-8xl text-white">{{ time }}</h1>
      <h3 class="text-2xl text-center text-white/50">{{ date }}</h3>
    </div>
  </WidgetCard>
</template>
