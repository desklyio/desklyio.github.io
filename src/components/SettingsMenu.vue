<script setup lang="ts">
import {GlassButton} from "@/components/ui/button";
import Fullscreen from "@/components/settings/Fullscreen.vue";
import Backgrounds from "@/components/settings/Backgrounds.vue";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
</script>

<template>
  <Popover>
    <PopoverTrigger class="absolute bottom-4 right-4">
      <GlassButton icon="bi-gear-wide-connected"/>
    </PopoverTrigger>
    <PopoverContent align="center" side="top" class="bg-transparent border-none pb-2 shadow-none mr-8 w-[35px] flex flex-col justify-end gap-3">
      <Fullscreen/>
      <Backgrounds/>
    </PopoverContent>
  </Popover>
</template>

<style scoped>

</style>
