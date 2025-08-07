<script setup lang="ts">
import {ref, useTemplateRef} from "vue";

import {onClickOutside} from '@vueuse/core'
import ImportExportOptions from "./ImportExportOptions.vue";
import BackgroundsOptions from "./BackgroundsOptions.vue";

const showMenu = ref(false)
const menu = useTemplateRef('menu')

onClickOutside(menu, () => showMenu.value = false)


</script>

<template>
  <button class="absolute top-8 right-8 text-white/20 text-3xl cursor-pointer" @click="showMenu = true">&#9881;</button>
  <div v-show="showMenu"
       class="absolute top-20 right-8 border border-white/10 bg-white/5 p-4 backdrop-blur-sm rounded-lg text-white"
       ref="menu">
    <ul>
      <ImportExportOptions/>
      <BackgroundsOptions/>
    </ul>
  </div>
</template>

<style scoped>

</style>
