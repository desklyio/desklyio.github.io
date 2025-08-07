<script setup lang="ts">
import {useFileDialog} from "@vueuse/core";
import {useTemplateRef} from "vue";
import {useBackgrounds} from "../../composables/useBackgrounds.ts";
import {useSortable} from '@vueuse/integrations/useSortable'
import {v4 as uuid} from "uuid";
import {useConfig} from "../../composables/useConfig.ts";

const dialogRef = useTemplateRef<InstanceType<typeof HTMLDialogElement>>('dialogRef')
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


const openDialog = () => {
  dialogRef.value?.showModal()
}

const {open, onChange} = useFileDialog({accept: 'video/mp4'})

onChange((files) => {
  for (let fileIndex = 0; fileIndex < (files?.length ?? 0); fileIndex++) {
    addBackground(files!.item(fileIndex)!)
  }
})


function handleImport() {
  open()
}

function onBackdropClick(event: Event) {
  const dialog = dialogRef.value!
  if (event.target === dialog) {
    dialog.close()
  }
}

</script>

<template>
  <dialog
      ref="dialogRef"
      @click="onBackdropClick"
      class="absolute outline-0 left-1/2 top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent shadow-lg backdrop:bg-black/50 open:flex open:items-center open:justify-center"
  >
    <div class="bg-black/50 backdrop-blur-sm rounded-lg max-w-[50vw] h-full p-4 text-white flex flex-col gap-4">
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
      <div class="w-1/2">
        <label class="text-white/50">Duration in minutes</label>
        <input type="number" class="outline-0 w-full border border-white/20 rounded-md px-3 py-2" min="1" v-model="options.backgroundSwitchMinutes"/>
      </div>
    </div>
  </dialog>

  <li class="cursor-pointer" @click="openDialog">Backgrounds</li>
</template>

