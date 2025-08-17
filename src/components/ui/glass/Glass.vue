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

const blendClass = computed(() => ({
  'xs':  'backdrop-blur-xs',
  'sm':  'backdrop-blur-sm',
  'md':  'backdrop-blur-md',
  'lg':  'backdrop-blur-lg',
}))

const roundedClass = computed(() => ({
  'xs':  'rounded-xs',
  'sm':  'rounded-sm',
  'md':  'rounded-md',
  'lg':  'rounded-lg',
  'xl':  'rounded-xl',
  '2xl':  'rounded-2xl',
  'full':  'rounded-full',
}))
</script>

<template>
    <div :class="cn('relative w-full h-full', props.class)">
      <div class="blend" :class="cn('absolute top-0 lef-0 w-full h-full', blendClass[props.blend], roundedClass[props.rounded])"/>
      <div class="edge" :class="cn('absolute top-0 lef-0 w-full h-full', roundedClass[props.rounded])"/>
      <div :class="cn('absolute top-0 left-0 w-full h-full bg-white/5', roundedClass[props.rounded])">
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
