<script setup lang="ts">
import {EditorContent, useEditor} from "@tiptap/vue-3";
import {StarterKit} from "@tiptap/starter-kit";
import {TaskList} from "@tiptap/extension-task-list";
import {TaskItem} from "@tiptap/extension-task-item";
import {Link} from "@tiptap/extension-link";
import {WidgetCard} from "@/components/ui/widgetcard";
import {useWidgets} from "@/composables/useWidgets.ts";
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import php from 'highlight.js/lib/languages/php'
import {all, createLowlight} from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

interface NoticeData {
  content: string
}

const props = defineProps<{ widget: WidgetProps & Partial<NoticeData> }>()

const {get, remove} = useWidgets()

const widget = get<NoticeData>(props.widget.uuid, props.widget)

const lowlight = createLowlight(all)

// you can also register languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)
lowlight.register('php', php)

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
    CodeBlockLowlight.configure({lowlight}),
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
  <WidgetCard v-model:widget="widget" @delete="remove(props.widget.uuid)">
    <div class="text-white">
      <EditorContent :editor="editor"/>
    </div>
  </WidgetCard>
</template>

<style lang="css">
@import "tailwindcss";

.tiptap {
  h1 {
    @apply text-2xl;
  }

  h2 {
    @apply text-xl;
  }

  h3 {
    @apply text-lg;
  }

  hr {
    @apply border-white/20 my-1;
  }

  blockquote {
    @apply border-l-white/20 border-l-2 pl-2;
  }

  strong {
    @apply text-shadow-xs text-shadow-white/50;
  }

  & .task-item {
    @apply flex gap-2;

    & label {
      @apply inline-flex pt-1;
    }

    & input[type=checkbox] {
      @apply appearance-none relative w-4 h-4 border border-white rounded-full disabled:bg-white/10 after:bg-transparent
      checked:after:text-white disabled:after:bg-white/10 cursor-pointer;

      &::after {
        content: '';
        @apply block w-full h-full z-10
        opacity-0
        absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        bg-current pointer-events-none;

        mask-size: 100%;
        mask-position: center;
        mask-repeat: no-repeat;
        mask-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
      }

      &:checked::after {
        @apply opacity-100 pointer-events-none;
      }
    }
  }

  p {
    code {
      @apply bg-white/20 rounded-sm px-1 font-mono text-white/80 text-sm;
    }
  }

  pre {
    @apply border border-white/20 rounded-md font-mono m-1.5 px-1 py-0.5;
    font-family: 'JetBrainsMono', monospace;

    code {
      @apply bg-none text-sm p-0;

      .hljs-comment,
      .hljs-quote {
        color: #616161;
      }

      .hljs-variable,
      .hljs-template-variable,
      .hljs-attribute,
      .hljs-tag,
      .hljs-name,
      .hljs-regexp,
      .hljs-link,
      .hljs-name,
      .hljs-selector-id,
      .hljs-selector-class {
        color: #f98181;
      }

      .hljs-number,
      .hljs-meta,
      .hljs-built_in,
      .hljs-builtin-name,
      .hljs-literal,
      .hljs-type,
      .hljs-params {
        color: #fbbc88;
      }

      .hljs-string,
      .hljs-symbol,
      .hljs-bullet {
        color: #b9f18d;
      }

      .hljs-title,
      .hljs-section {
        color: #faf594;
      }

      .hljs-keyword,
      .hljs-selector-tag {
        color: #70cff8;
      }

      .hljs-emphasis {
        font-style: italic;
      }

      .hljs-strong {
        font-weight: 700;
      }
    }
  }
}
</style>
