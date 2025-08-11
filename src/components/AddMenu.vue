<script setup lang="ts">
import {computed} from "vue";
import {v4 as uuid} from 'uuid'
import {useWindowSize} from '@vueuse/core'
import {useWidgets, type Widget} from "../composables/useWidgets.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {GlassButton} from "@/components/ui/button";

defineProps<{
  widgets: Record<string, WidgetMeta>
}>()

const window = useWindowSize()
const {add} = useWidgets()

const centerPosition = computed(() => ({
  x: Math.floor(window.width.value / 2),
  y: Math.floor(window.height.value / 2),
}))


function addWidget(name: string, widget: Widget & object) {
  add({
    ...widget,
    uuid: uuid(),
    name: name,
    positionX: centerPosition.value.x,
    positionY: centerPosition.value.y,
  })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="absolute bottom-4 left-4">
      <GlassButton icon="bi-plus"/>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="center" side="top" class="bg-transparent border-none pl-2 shadow-none">
      <DropdownMenuItem :key="name" v-for="(widget, name) in widgets" class="focus:bg-transparent hover:bg-transparent">
        <GlassButton @click="addWidget(name, widget.initial)" :tooltip="widget.name" :icon="widget.icon"/>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
