<script setup lang="ts">
import Background from "./components/Background.vue";
import {provide, ref} from "vue";
import DeleteTrash from "./components/DeleteTrash.vue";
import SettingsMenu from "@/components/SettingsMenu.vue";
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import {Dashboard} from "@/components/ui/dashboard";


const isDeleting = ref(false)
const isEditing = ref(false)
const trash = ref<InstanceType<typeof DeleteTrash>>()

provide('isDeleting', isDeleting)
provide('isEditing', isEditing)
provide('trash', trash)

</script>

<template>
  <div  :class="{'cursor-s-resize': isDeleting}">
    <background/>
    <Dashboard/>
    <DeleteTrash ref="trash" :is-deleting="isDeleting" :is-editing="isEditing"/>
    <SettingsMenu/>
    <Toaster />
  </div>

</template>
