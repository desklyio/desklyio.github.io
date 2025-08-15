<script setup lang="ts">
import type {ClassValue} from "clsx";
import {cn} from "@/lib/utils.ts";
import {computed} from "vue";



const props = withDefaults(defineProps<{
  class?: ClassValue
  blend?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}>(), {
  blend: "xs",
  rounded: "md"
})

const glassClasses = computed(() => [
  'backdrop-blur-' + props.blend,
  'rounded-' + props.rounded
])
</script>

<template>
    <div :class="cn('relative w-full h-full', props.class)">
      <div class="'absolute top-0 lef-0 w-full h-full" :class="glassClasses"/>
      <div class="blend absolute top-0 lef-0 w-full h-full" :class="glassClasses"/>
      <div class="edge" :class="cn('absolute top-0 lef-0 w-full h-full', 'rounded-' + (rounded ?? 'sm'))"/>
      <div :class="cn('absolute top-0 left-0 w-full h-full bg-white/5', 'rounded-' + (rounded ?? 'sm'))">
        <slot/>
      </div>
    </div>
</template>

<style>
.edge {
  box-shadow:
      inset 1px 1px 3px rgba(255, 255, 255, 0.25),  /* top-left glow */
      inset -1px -1px 3px rgba(255, 255, 255, 0.15), /* bottom-right glow */
      inset 0 4px 6px rgba(0, 0, 0, 0.1); /* subtle drop shadow for depth */
  inset: 0;
}

.blend {
  filter: url(#liquid-glass);
}
</style>
