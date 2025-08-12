<script setup lang="ts">
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {type TooltipContentProps} from "reka-ui";

defineProps<{
  icon: string,
  tooltip?: string,
  side?: TooltipContentProps['side']
}>()

const emits = defineEmits(['click'])
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger
          class="cursor-pointer text-white rounded-full w-[35px] h-[35px] bg-white/10 border border-white/10 flex justify-center items-center" @click="emits('click')">
              <span class="w-[16px]">
                <i :class="icon"/>
              </span>
      </TooltipTrigger>
      <TooltipContent v-if="tooltip || 'tooltip' in $slots" :side="side ?? 'right'">
        <slot name="tooltip">
          {{ tooltip }}
        </slot>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped>

</style>
