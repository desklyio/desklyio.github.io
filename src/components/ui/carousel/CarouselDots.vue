<script setup lang="ts">
import { useCarousel } from './useCarousel.ts';
import { cn } from '@/lib/utils';

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
});

const { scrollTo, selectedIndex, scrollSnaps } = useCarousel();
</script>

<template>
  <div class="w-full flex justify-center py-4 gap-0.5">
    <div
        v-for="(_, index) in scrollSnaps"
        :key="index"
        class="sm:mt-0 first:ml-0 border-1 w-2 h-2 mt-2 ml-2 border-white/20 rounded-full cursor-pointer"
        :class="[cn(props.class), index === selectedIndex ? 'border-none bg-white/30' : 'bg-transparent']"
        @click="scrollTo(index)"
    />
  </div>
</template>

<style scoped>

</style>
