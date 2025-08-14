<script setup lang="ts">
  import {useWidgets} from "@/composables/useWidgets.ts";
  import {computed, inject} from "vue";

  const props = defineProps<{
    widgetComponents: Record<string, WidgetComponent>,
    tabUuid: string
  }>()

  const {widgets} = useWidgets()

  const tabWidgets = computed(() => (widgets.value ?? []).filter(widget => widget.tabUuid === props.tabUuid))
  const isDeleting = inject('isDeleting')
</script>

<template>
  <div class="absolute w-screen h-screen top-0" :class="{'cursor-s-resize': isDeleting}">
    <Component :key="widget.uuid" v-for="widget in tabWidgets"
               :is="widgetComponents[widget.name].component"
               :widget="widget"/>
  </div>
</template>

<style scoped>

</style>
