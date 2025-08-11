<script setup lang="ts">
import {useFileDialog} from "@vueuse/core";
import {computed, useTemplateRef} from "vue";
import {useBackgrounds} from "@/composables/useBackgrounds.ts";
import {useSortable} from '@vueuse/integrations/useSortable'
import {v4 as uuid} from "uuid";
import {useConfig} from "@/composables/useConfig.ts";
import {GlassButton} from "@/components/ui/button";
import {Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader} from "@/components/ui/dialog";
import {Slider} from "@/components/ui/slider";

const {getBackgroundUrls, getBackgrounds} = useBackgrounds()
const {getOptions} = useConfig()

const urls = getBackgroundUrls()
const backgrounds = getBackgrounds()
const options = getOptions()


function addBackground(content: Blob) {
  backgrounds.value = [...backgrounds.value, {id: uuid(), content}]
}

function deleteBackground(id: string) {
  backgrounds.value = [...backgrounds.value.filter(background => background.id !== id)]
}


const {option} = useSortable(useTemplateRef('sort'), urls, {
  handle: '.handle',
  direction: 'horizontal',
  onUpdate: (e: { oldIndex: number, newIndex: number }) => {
    const result = [...backgrounds.value]
    const [movedItem] = result.splice(e.oldIndex, 1)
    result.splice(e.newIndex, 0, movedItem);

    backgrounds.value = result
  }
})
option('animation', 200)


const {open, onChange} = useFileDialog({accept: 'video/mp4'})

onChange((files) => {
  for (let fileIndex = 0; fileIndex < (files?.length ?? 0); fileIndex++) {
    addBackground(files!.item(fileIndex)!)
  }
})


function handleImport() {
  open()
}

const minutes = computed(() => options.value.backgroundSwitchMinutes[0] === 1 ? 'minute' : 'minutes')

</script>

<template>
  <Dialog
      class="absolute outline-0 left-1/2 top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent shadow-lg backdrop:bg-black/50 open:flex open:items-center open:justify-center"
  >
    <DialogTrigger>
      <GlassButton icon="bi-camera-video" tooltip="Background settings"/>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Background Settings</DialogTitle>
      </DialogHeader>
      <div ref="sort" class="flex flex-row gap-4 w-full">
        <div
            class="w-[500px] group"
            v-for="url in urls"
            :key="url.id"
        >
          <div class="relative rounded-md overflow-hidden handle transition-all duration-200">
            <video
                class="w-full object-cover"
                autoplay
                loop
                muted
                :src="url.url"
            ></video>
            <div
                class="absolute cursor-pointer inset-0 hidden group-hover:flex items-center justify-center bg-gray-900/40"
                @click="deleteBackground(url.id)">
              <span>🗑️</span>
            </div>
          </div>
        </div>
        <button
            type="button"
            class="text-white/60 hover:text-white text-3xl cursor-pointer"
            @click="handleImport"
        >
          +
        </button>
      </div>
      <div class="w-full">
        <label>Duration</label>
        <Slider :min="1" :max="120" v-model="options.backgroundSwitchMinutes"/>
        <small>in {{options.backgroundSwitchMinutes[0]}} {{minutes}}</small>
      </div>
    </DialogContent>
  </Dialog>
</template>

