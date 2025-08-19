<script setup lang="ts">
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {type TooltipContentProps} from "reka-ui";
import {Glass} from "@/components/ui/glass";

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
      <TooltipTrigger @click="emits('click')">
        <Glass rounded="full" class="cursor-pointer text-white overflow-hidden w-[35px] h-[35px] flex justify-center items-center">
          <span class="w-[16px]">
            <i :class="icon"/>
            </span>
        </Glass>

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
