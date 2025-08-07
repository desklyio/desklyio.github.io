<script lang="ts">
export const meta: WidgetMeta = {
  name: 'Notice',
  initial: {
    content: '<h1>New Notice</h1>',
    width: 300,
    height: 200
  }
}
</script>

<script setup lang="ts">
import {EditorContent, useEditor} from "@tiptap/vue-3";
import {StarterKit} from "@tiptap/starter-kit";
import {TaskList} from "@tiptap/extension-task-list";
import {TaskItem} from "@tiptap/extension-task-item";
import {Link} from "@tiptap/extension-link";
import WidgetCard from "./base/WidgetCard.vue";
import {useWidgets, type Widget} from "../composables/useWidgets.ts";


interface NoticeData {
  content: string
}

const props = defineProps<{ widget: Widget & Partial<NoticeData> }>()

const {get, remove} = useWidgets()

const widget = get<NoticeData>(props.widget.uuid, props.widget)

const editor = useEditor({
  content: widget.value.content,
  editorProps: {
    attributes: {
      class: 'outline-0'
    },
  },
  onBlur() {
    widget.value.content = editor.value?.getHTML() ?? ''
  },
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      },
      bulletList: {
        HTMLAttributes: {
          class: 'pl-5 list-disc'
        }
      }
    }),
    Link.configure({
      HTMLAttributes: {
        class: 'cursor-pointer underline'
      }
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: 'task-item'
      }
    })
  ],
})


</script>

<template>
  <widget-card v-model:widget="widget" @delete="remove(props.widget.uuid)">
    <div class="text-white">
      <EditorContent :editor="editor"/>
    </div>
  </widget-card>
</template>
