<script setup lang="ts">
import {GlassButton} from "@/components/ui/button";
import Fullscreen from "@/components/settings/Fullscreen.vue";
import Backgrounds from "@/components/settings/Backgrounds.vue";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Shortcuts from "@/components/settings/Shortcuts.vue";
import {ref, useTemplateRef} from "vue";
import {onClickOutside} from "@vueuse/core";

const showPopover = ref(false)
const popovercontent = useTemplateRef<InstanceType<typeof HTMLDivElement>>('popoverContent')

onClickOutside(popovercontent, () => {
  showPopover.value = false
})

</script>

<template>
  <div ref="popoverContent" class="absolute bottom-4 right-4">
    <Popover>
      <PopoverTrigger @click="showPopover = !showPopover">
        <GlassButton icon="bi-gear-wide-connected"/>
      </PopoverTrigger>
      <PopoverContent align="center" side="top" force-mount
                      class="bg-transparent border-none pb-2 shadow-none mr-8 w-[35px]">
        <div  v-show="showPopover" class="flex flex-col justify-end gap-3">
          <Fullscreen/>
          <Backgrounds/>
          <Shortcuts/>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
