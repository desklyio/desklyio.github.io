<script setup lang="ts">
import {useFileDialog} from "@vueuse/core";
import {useConfig} from "../../composables/useConfig.ts";

const {open, onChange} = useFileDialog({accept: 'application/json'})

const {importStorage, exportStorage} = useConfig()

onChange((files) => {
  files!.item(0)!.text().then(json => {
    importStorage(json)
  })
})


function handleExport() {
  const json = exportStorage()
  const dateiName = "prodash.json";
  const blob = new Blob([json], {type: "application/json"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = dateiName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleImport() {
  open()
}
</script>

<template>
  <li class="cursor-pointer" @click="handleExport">Export</li>
  <li class="cursor-pointer" @click="handleImport">Import</li>
</template>

<style scoped>

</style>
