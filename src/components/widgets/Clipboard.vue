<script lang="ts">
export const meta: WidgetMeta = {
  name: 'Clipboard History',
  icon: 'bi-clipboard',
  initial: {
    history: '[]',
    width: 300,
    height: 170
  }
}
</script>

<script setup lang="ts">

import WidgetCard from "@/components/ui/WidgetCard.vue";
import {useWidgets, type Widget} from "@/composables/useWidgets.ts";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {toast} from "vue-sonner";
import {Button} from "@/components/ui/button";

interface ClipboardWidget extends Widget {
  history: string,
}

const props = defineProps<{ widget: ClipboardWidget }>()

const {get, remove} = useWidgets()

const widget = get<ClipboardWidget>(props.widget.uuid, props.widget)

const history = computed<string[]>({
  get: () => JSON.parse(widget.value.history ?? '[]'),
  set: (value) => widget.value.history = JSON.stringify(value)
})

const interval = ref<number>()

const currentCopied = ref()

async function copy(text: string) {

  window.navigator.clipboard.writeText(text).then(() => {
    toast('Successful copied from history')
    currentCopied.value = text
  }).catch(() => {})
}

onMounted(() => {
  interval.value = setInterval(() => {
    window.navigator.clipboard.readText().then(
        text => {
          if (!history.value.includes(text)) {
            history.value = [...history.value, text]
            currentCopied.value = text
          }
        }
    ).catch(() => {
    })
  }, 500)
})

onUnmounted(() => {
  clearInterval(interval.value)
})
</script>

<template>
  <widget-card v-model:widget="widget" @delete="remove(props.widget.uuid)">
    <template #default>
      <div class="h-full rounded-md not-hover:overflow-hidden hover:overflow-x-auto ">
        <div class="flex flex-col text-white ">
          <div :key="index" v-for="(item, index) in history" @click="copy(item)" class="hover:bg-white/10 cursor-pointer last:rounded-b-md not-last:border-b not-last:border-white/10 flex pt-2 px-2">
            <div class="w-[10px] h-full">
              <i v-if="currentCopied === item" class="bi-check text-white"/>
            </div>
            <pre class="text-wrap font-mono">
           {{ item.trim() }}
        </pre>
          </div>
        </div>
      </div>
    </template>
   <template #menu>
     <Button @click="history = []">Clear History</Button>
   </template>
  </widget-card>
</template>
