<script setup lang="ts">
import {type TooltipProviderProps, useForwardPropsEmits} from "reka-ui"
import { TooltipProvider } from "reka-ui"
import type {TooltipRootEmits} from "reka-ui";

const props = withDefaults(defineProps<TooltipProviderProps>(), {
  delayDuration: 0,
})
const emits = defineEmits<TooltipRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TooltipProvider v-bind="forwarded">
    <slot />
  </TooltipProvider>
</template>
