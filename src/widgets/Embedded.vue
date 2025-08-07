<script lang="ts">
export const meta: WidgetMeta = {
  name: 'Embedded',
  initial: {
    width: 300,
    height: 200
  }
}
</script>

<script setup lang="ts">
import {useWidgets, type Widget} from "../composables/useWidgets.ts";
import WidgetCard from "./base/WidgetCard.vue";
import {computed, useTemplateRef, watch} from "vue";


interface EmbeddedWidget extends Widget {
  embedded: string,
}

const props = defineProps<{ widget: EmbeddedWidget }>()

const {get, remove} = useWidgets()

const widget = get<EmbeddedWidget>(props.widget.uuid, props.widget)
const card = useTemplateRef<InstanceType<typeof WidgetCard>>('card')
const cardSize = computed(() => card.value?.size)
const cardResizing = computed(() => card.value?.resizing ?? false)
const embeddedSize = computed(() => ({
  width: ((cardSize?.value?.width ?? 0) - 32) + 'px',
  height: ((cardSize?.value?.height ?? 0) - 32) + 'px'
}))

const iframeRefContainer = useTemplateRef('iframeContainer')

const embeddedLink = computed(() => {
  if (!widget.value.embedded?.startsWith('<iframe')) return widget.value.embedded
  const wrapper = document.createElement('div')

  wrapper.innerHTML = widget.value.embedded

  const iframe = wrapper.firstElementChild as HTMLIFrameElement

  iframe.style.borderRadius = '12px'
  iframe.style.background = 'transparent'

  return iframe.outerHTML
})

watch(
    () => embeddedSize.value,
    (size) => {
      if (!widget.value.embedded?.startsWith('<iframe')) return

      const iframe = iframeRefContainer.value?.querySelector('iframe')
      if (!iframe) return

      iframe.width = size.width
      iframe.height = size.height
    }
)
</script>

<template>
  <widget-card ref="card" :width="500" :height="0" v-model:widget="widget" @delete="remove(props.widget.uuid)"
               v-slot="{isEditing}">
    <div class="text-white" v-if="isEditing">
      <v-textarea label="Embedded Link" variant="outlined" v-model="widget.embedded" no-resize/>
    </div>
    <div v-else>
      <div v-show="cardResizing"
           style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 2; background: transparent;"
      />
      <div ref="iframeContainer" class="w-full, h-full" v-if="widget.embedded?.startsWith('<iframe')" v-html="embeddedLink"/>
      <iframe v-else style="border-radius:12px; background: transparent !important;"
              allowtransparency="true"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"
              frameBorder="0" :src="widget.embedded" :width="embeddedSize.width" :height="embeddedSize.height"/>
    </div>

  </widget-card>
</template>

<style scoped>

</style>
