<script setup lang="ts">

import {WidgetCard} from "@/components/ui/widgetcard";
import {useWidgets} from "@/composables/useWidgets.ts";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {toast} from "vue-sonner";
import {Button} from "@/components/ui/button";
import ClipboardItem from "@/components/widgets/clipboard/ClipboardItem.vue";
import {ScrollArea} from "@/components/ui/scroll-area";

interface ClipboardWidget extends WidgetProps {
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
  }).catch(() => {
  })
}

onMounted(() => {
  interval.value = setInterval(() => {
    window.navigator.clipboard.readText().then(
        text => {
          if (!history.value.includes(text)) {
            history.value = [...history.value, text].filter(s => s.trim().length > 0)
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
  <WidgetCard v-model:widget="widget" @delete="remove(props.widget.uuid)">
    <template #default>
      <ScrollArea class="h-full rounded-md">
        <div class="flex flex-col pr-2 text-white ">
          <ClipboardItem :key="index" v-for="(text, index) in history" :copied="text === currentCopied" :text="text"
                         @copied="copy"/>
        </div>
      </ScrollArea>
    </template>
    <template #menu>
      <Button @click="history = []">Clear History</Button>
    </template>
  </WidgetCard>
</template>
