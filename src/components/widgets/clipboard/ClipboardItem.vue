<script setup lang="ts">
defineProps<{
  copied: boolean,
  text: string
}>()

defineEmits(['copied'])
</script>

<template>
  <div @click="$emit('copied', text)"
       class="hover:bg-white/10 cursor-pointer last:rounded-b-md not-last:border-b not-last:border-white/10 flex pt-2 px-2">
    <div class="w-[10px] h-full">
      <i v-if="copied" class="bi-check text-white"/>
    </div>
    <pre class="text-wrap font-mono">
           {{ text.trim() }}
        </pre>
  </div>
</template>

<style scoped>

</style>
