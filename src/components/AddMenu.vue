<script setup lang="ts">
import {computed, watch} from "vue";
import {v4 as uuid} from 'uuid'
import {useMagicKeys, useWindowSize} from '@vueuse/core'
import {useWidgets} from "../composables/useWidgets.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {GlassButton} from "@/components/ui/button";

const props = defineProps<{
  widgets: Record<string, WidgetMeta>
  tabUuid: string
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
    if (v) addWidget(meta.name, Object.assign(meta.initial, {tabUuid: props.tabUuid}) as WidgetProps)
  })
})


function addWidget(name: string, widget: Partial<WidgetProps> & object) {
  const data: WidgetProps = {
    ...widget,
    uuid: uuid(),
    name: name,
    tabUuid: props.tabUuid,
    positionX: centerPosition.value.x,
    positionY: centerPosition.value.y,
    width: widget.width ?? 300,
    height: widget.height ?? 300
  }

  add(data)
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
