<script setup lang="ts">
import {GlassButton} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Shortcut} from "@/components/ui/shortcut";
import {ref, watchEffect} from "vue";
import {useMagicKeys} from "@vueuse/core";

const SHORTCUTS = {
  'Next background': 'Shift+Ctrl+N',
  'Previous background': 'Shift+Ctrl+P',
  'Next Tab': 'Shift+Ctrl+→',
  'Previous Tab': 'Shift+Ctrl+←',
}


const openDialog = ref(false)

const {Shift_Ctrl_h} = useMagicKeys()

watchEffect(() => {
  if (Shift_Ctrl_h.value) {
    openDialog.value = true
  }
})

</script>

<template>
  <Dialog v-model:open="openDialog">
    <DialogTrigger>
      <GlassButton side="left" icon="bi-keyboard">
        <template #tooltip>
          <div class="flex gap-2">
            <span>Shortcuts</span>
            <span class="text-white/20">Shift+Ctrl+H</span>
          </div>
        </template>
      </GlassButton>
    </DialogTrigger>

    <DialogContent as="div">
      <DialogHeader>
        <DialogTitle>Shortcuts</DialogTitle>
      </DialogHeader>
      <table>
        <tbody>
        <tr v-for="(shortcut, name) in SHORTCUTS">
          <td>{{ name }}</td>
          <td>
            <Shortcut>{{ shortcut }}</Shortcut>
          </td>
        </tr>
        </tbody>
      </table>
    </DialogContent>
  </Dialog>
</template>

