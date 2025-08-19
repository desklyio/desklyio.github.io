<script setup lang="ts">
import type {ClassValue} from "clsx";
import {cn} from "@/lib/utils.ts";
import {computed} from "vue";


const props = withDefaults(defineProps<{
  class?: ClassValue
  rounded?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}>(), {
  rounded: "md"
})

const roundedClass = computed(() => ({
  'xs': 'rounded-xs',
  'sm': 'rounded-sm',
  'md': 'rounded-md',
  'lg': 'rounded-lg',
  'xl': 'rounded-xl',
  '2xl': 'rounded-2xl',
  'full': 'rounded-full',
}))
</script>

<template>
    <div :class="cn('relative bg-white/5', roundedClass[props.rounded])">
      <div class="glass absolute w-full h-full top-0 start-0 z-0" :class="roundedClass[props.rounded]"/>
      <div class="edge absolute w-full h-full top-0 start-0 z-0" :class="roundedClass[props.rounded]"/>
      <div class="relative" :class="props.class">
        <slot/>
      </div>
  </div>

</template>

<style>
.glass {
  backdrop-filter: blur(3px);
  filter: url(#liquid-glass);
}

.edge {
  box-shadow: inset 1px 1px 3px rgba(255, 255, 255, 0.25), /* top-left glow */ inset -1px -1px 3px rgba(255, 255, 255, 0.15), /* bottom-right glow */ inset 0 4px 6px rgba(0, 0, 0, 0.1); /* subtle drop shadow for depth */
  inset: 0;
}
</style>
