<script setup lang="ts">
import {inject} from "vue";
import {useWidgets,} from "../composables/useWidgets.ts";
import AddMenu from "../components/AddMenu.vue";

const widgetComponents = Object.fromEntries(Object.values(import.meta.glob<WidgetComponent>(['./widgets/**/index.ts'], {
      eager: true,
      base: './',
      import: 'default',
    })).map(widget => [widget.meta.name, {component: widget.component, meta: widget.meta}])
)

const isDeleting = inject('isDeleting')

const {widgets} = useWidgets()

const widgetsAdd = Object.fromEntries(Object.entries(widgetComponents).map(([name, w]) => [name, w.meta]));
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
