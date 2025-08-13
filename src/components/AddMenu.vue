<script setup lang="ts">
import {computed, watch, watchEffect} from "vue";
import {v4 as uuid} from 'uuid'
import {useMagicKeys, useWindowSize} from '@vueuse/core'
import {useWidgets, type WidgetProps} from "../composables/useWidgets.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {GlassButton} from "@/components/ui/button";

const props = defineProps<{
  widgets: Record<string, WidgetMeta>
}>()

const window = useWindowSize()
const {add} = useWidgets()

const centerPosition = computed(() => ({
  x: Math.floor(window.width.value / 2),
  y: Math.floor(window.height.value / 2),
}))

const keys = useMagicKeys()

Object.values(props.widgets).map(meta => {
  const key = keys[meta.shortcut]
  watch(key, (v) => {
    if (v) addWidget(meta.name, meta.initial)
  })
})


function addWidget(name: string, widget: WidgetProps & object) {
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
        <GlassButton @click="addWidget(name, widget.initial)" :icon="widget.icon">
          <template #tooltip>
            <div class="flex gap-2">
              <span>{{ widget.name }}</span>
              <span class="text-white/20">{{ widget.shortcut }}</span>
            </div>
          </template>
        </GlassButton>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
