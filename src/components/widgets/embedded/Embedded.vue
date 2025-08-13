<script setup lang="ts">
import {useWidgets} from "@/composables/useWidgets.ts";
import {computed, useTemplateRef, watch} from "vue";
import {WidgetCard} from "@/components/ui/widgetcard";
import {Textarea} from "@/components/ui/textarea";


interface EmbeddedWidget extends WidgetProps {
  embedded: string,
}

const props = defineProps<{ widget: EmbeddedWidget }>()

const {get, remove} = useWidgets()

const widget = get<EmbeddedWidget>(props.widget.uuid, props.widget)
const card = useTemplateRef<InstanceType<typeof WidgetCard>>('card')
const cardSize = computed(() => card.value?.size)
const cardResizing = computed(() => card.value?.resizing ?? false)
const cardDragging = computed(() => card.value?.isDragging ?? false)
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
    () => [embeddedSize.value, embeddedLink.value],
    () => {
      if (!widget.value.embedded?.startsWith('<iframe')) return

      const iframe = iframeRefContainer.value?.querySelector('iframe')
      if (!iframe) return

      iframe.width = embeddedSize.value.width
      iframe.height = embeddedSize.value.height
    }
)
</script>

<template>
  <WidgetCard ref="card" v-model:widget="widget" @delete="remove(props.widget.uuid)">
    <template #menu>
      <label :for="`${widget.uuid}-embedded-link`">Embedded Link</label>
    <Textarea :id="`${widget.uuid}-embedded-link`" v-model.lazy="widget.embedded" />
    </template>
    <template #default>
      <div v-show="cardResizing || cardDragging || (embeddedLink ?? '').trim().length == 0"
           style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 2; background: transparent;"
      />
      <div ref="iframeContainer" class="w-full, h-full" v-if="widget.embedded?.startsWith('<iframe')"
           v-html="embeddedLink"/>
      <iframe v-else style="border-radius:12px; background: transparent !important;"
              allowtransparency="true"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"
              frameBorder="0" :src="widget.embedded" :width="embeddedSize.width" :height="embeddedSize.height"/>
    </template>
  </WidgetCard>
</template>

<style scoped>

</style>
