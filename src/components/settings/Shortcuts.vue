<script setup lang="ts">
import {GlassButton} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Shortcut} from "@/components/ui/shortcut";
import {ref, watchEffect} from "vue";
import {useMagicKeys} from "@vueuse/core";

const SHORTCUTS = {
  'Open shortcuts': 'Shift + Control + H',
  'Open background settings': 'Shift + Control + B',
  'Next background': 'Shift + Control + N',
  'Previous background': 'Shift + Control + P',
  'Switch fullscreen mode': 'Shift + Control + F',
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
      <GlassButton icon="bi-keyboard" tooltip="Shortcuts"/>
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

