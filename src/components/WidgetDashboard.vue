<script setup lang="ts">
import {type Component, inject} from "vue";
import {useWidgets, type Widget} from "../composables/useWidgets.ts";
import AddMenu from "../components/AddMenu.vue";

const widgetComponents = Object.fromEntries(Object.values(import.meta.glob<{
      default: Component<{ widget: Widget }>
      meta: WidgetMeta
    }>(['../widgets/*.vue'], {
      eager: true,
      base: './'
    })).map(widget => [widget.meta.name, {component: widget.default, meta: widget.meta}])
)

const isDeleting = inject('isDeleting')

const {widgets} = useWidgets()

const widgetsAdd = Object.fromEntries(Object.entries(widgetComponents).map(([name, w]) => [name, w.meta.initial]));
</script>

<template>
  <div class="w-screen h-screen absolute top-0 overflow-hidden" :class="{'cursor-s-resize': isDeleting}">
    <Component :key="widget.uuid" v-for="widget in widgets"
               :is="widgetComponents[widget.name].component"
               :widget="widget"/>
  </div>
  <add-menu :widgets="widgetsAdd"/>
</template>

<style scoped>

</style>
