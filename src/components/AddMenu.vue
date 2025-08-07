<script setup lang="ts">
import {computed, ref, useTemplateRef} from "vue";
import {v4 as uuid} from 'uuid'

import {onClickOutside, useWindowSize} from '@vueuse/core'
import {useWidgets, type Widget} from "../composables/useWidgets.ts";

defineProps<{
  widgets: Record<string, Widget & object>
}>()

const window = useWindowSize()
const {add} = useWidgets()
const showMenu = ref(false)
const menu = useTemplateRef('menu')

onClickOutside(menu, () => showMenu.value = false)

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
  <button class="absolute bottom-4 left-4 text-white/20 text-3xl cursor-pointer" @click="showMenu = true">+</button>
  <div v-show="showMenu"
       class="absolute bottom-16 left-4 border border-white/10 bg-white/5 p-4 backdrop-blur-sm rounded-lg text-white"
       ref="menu">
    <ul>
      <li class="cursor-pointer" :key="name" v-for="(widget, name) in widgets"
          @click="addWidget(name, widget)">{{ name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
