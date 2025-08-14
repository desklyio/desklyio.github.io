<script setup lang="ts">
import {useCarousel} from './useCarousel.ts';
import {cn} from '@/lib/utils';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
});

const {scrollTo, selectedIndex, scrollSnaps} = useCarousel();
</script>

<template>
  <TooltipProvider>
    <Tooltip class="inline-flex justify-center gap-0.5" v-for="(_, index) in scrollSnaps">
      <TooltipTrigger
          :key="index"
          class="sm:mt-0 first:ml-0 border-1 w-2 h-2 mt-2 ml-2 border-white/20 rounded-full cursor-pointer"
          :class="[cn(props.class), index === selectedIndex ? 'border-none bg-white/30' : 'bg-transparent']"
          @click="scrollTo(index)"
      />
      <TooltipContent v-if="'tooltip' in $slots" side="top">
        <slot name="tooltip" :index="index"/>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped>

</style>
