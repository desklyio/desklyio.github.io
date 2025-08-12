<script setup lang="ts">
import Background from "./components/Background.vue";
import {provide, ref} from "vue";
import DeleteTrash from "./components/DeleteTrash.vue";
import WidgetDashboard from "./components/WidgetDashboard.vue";
import SettingsMenu from "@/components/SettingsMenu.vue";
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'


const isDeleting = ref(false)
const isEditing = ref(false)
const trash = ref<InstanceType<typeof DeleteTrash>>()

provide('isDeleting', isDeleting)
provide('isEditing', isEditing)
provide('trash', trash)

</script>

<template>
  <background/>
  <widget-dashboard/>
  <delete-trash ref="trash" :is-deleting="isDeleting" :is-editing="isEditing"/>
  <SettingsMenu/>
  <Toaster />
</template>
