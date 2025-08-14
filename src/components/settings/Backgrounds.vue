<script setup lang="ts">
import {useFileDialog, useMagicKeys} from "@vueuse/core";
import {computed, ref, watchEffect} from "vue";
import {v4 as uuid} from "uuid";
import {Button, GlassButton} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Slider} from "@/components/ui/slider";
import {useBackground} from "@/composables/useBackground.ts";
import {useOptions} from "@/composables/useOptions.ts";

const {add, getUrls, remove, updateOrder} = useBackground()
const {get} = useOptions()

const urls = getUrls()
const backgroundDuration = get('backgroundDuration')
const backgroundDurationRef = computed({
  get: () => [backgroundDuration.value],
  set: value => {
    backgroundDuration.value = value[0]
  }
})

const {open, onChange} = useFileDialog({accept: 'video/mp4'})

onChange((files) => {
  for (let fileIndex = 0; fileIndex < (files?.length ?? 0); fileIndex++) {
    add({
      uuid: uuid(),
      blob: files!.item(fileIndex)!.slice()
    })
  }
})


function handleImport() {
  open()
}
const openDialog = ref(false)

const {Shift_Ctrl_b} = useMagicKeys()

watchEffect(() => {
  if (Shift_Ctrl_b.value) {
    openDialog.value = true
  }
})

</script>

<template>
  <Dialog v-model:open="openDialog">
    <DialogTrigger>
      <GlassButton icon="bi-camera-video">
        <template #tooltip>
          <div class="flex gap-2">
            <span>Background settings</span>
            <span class="text-white/20">Shift+Ctrl+B</span>
          </div>
        </template>
      </GlassButton>
    </DialogTrigger>

    <DialogContent as="div">
      <DialogHeader>
        <DialogTitle>Background Settings</DialogTitle>
      </DialogHeader>
      <div class="overflow-x-scroll">
        <div class="flex w-fit gap-4">
          <div class="relative group rounded-md overflow-hidden h-[300px] w-[150px]"
               v-for="(url, index) in urls"
               :key="url.id"
          >
            <video
                class="h-[300px] w-[150px] object-cover"
                autoplay
                loop
                muted
                :src="url.url"
            ></video>
            <div class="absolute inset-0 hidden group-hover:flex items-center justify-center gap-2 bg-gray-900/40">
              <i class="cursor-pointer text-white bi-arrow-left" @click="updateOrder(url.id, Math.max(index - 1, 0))"/>
              <i class="cursor-pointer text-white bi-trash" @click="remove(url.id)"/>
              <i class="cursor-pointer text-white bi-arrow-right"
                 @click="updateOrder(url.id, Math.min(index + 1, urls.length - 1))"/>
            </div>
          </div>
        </div>

      </div>
      <Button variant="outline" class="cursor-pointer" @click="handleImport">
        <i class="bi-plus"/>
      </Button>
      <div class="w-full">
        <label>Duration</label>
        <Slider :min="1" :max="120" v-model="backgroundDurationRef"/>
        <small>in {{ $t('message.minute', backgroundDuration) }}</small>
      </div>
    </DialogContent>
  </Dialog>
</template>

