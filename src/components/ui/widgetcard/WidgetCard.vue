<script setup lang="ts">
import {onClickOutside, onLongPress, useDraggable, useMouse} from "@vueuse/core";
import {computed, inject, onMounted, onUnmounted, type Ref, ref, useTemplateRef, watch} from "vue";
import type DeleteTrash from "@/components/DeleteTrash.vue";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

interface Props {
  widget: WidgetProps,
  noResize?: true
}

interface Emits {
  (e: 'update:widget', v: WidgetProps): void

  (e: 'delete'): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const target = useTemplateRef<InstanceType<typeof PopoverTrigger>>('widget-card')
const targetEl = computed(() => target.value?.$el)
const menuEl = useTemplateRef<InstanceType<typeof HTMLDivElement>>('menu')

const isDeleting = inject<Ref<boolean>>('isDeleting')
const isEditing = inject<Ref<boolean>>('isEditing')
const mouse = useMouse()

const {
  x, y,
  isDragging,
  isDraggingDisabled,
  transitionActive
} = useWidgetDragging(
    targetEl,
    props,
    emits
)

const {isWidgetEditing} = useLongPressEdit(targetEl, menuEl, isDraggingDisabled)
useTrashCollision(x, y)
const {size, resizing} = useResize(targetEl)

defineExpose({
  size,
  resizing,
  isDragging
})

function updateWidget(data: Partial<WidgetProps>) {
  emits('update:widget', Object.assign(props.widget, data))
}

const style = computed(() => ({
  top: `${y.value}px`,
  left: `${x.value}px`,
  transform: isDragging.value ? 'scale(1.01)' : '',
  transition: 'transform 0.2s ease ' + (transitionActive.value ? 'left 0.2s ease, top 0.2s ease' : ''),
  width: (props.noResize ? props.widget.width : size.value?.width ?? props.widget.width) + 'px',
  height: (props.noResize ? props.widget.height : size.value?.height ?? props.widget.height) + 'px',
}))

const classes = computed(() => ({
  resize: !props.noResize && isWidgetEditing.value,
  'outline-2 outline-offset-2 outline-solid': isWidgetEditing.value
}))


function useWidgetDragging(targetRef: Ref<HTMLElement | null>, props: Props, emits: Emits) {
  const isDraggingDisabled = ref(true)
  const transitionActive = ref(false)

  const {x, y, isDragging} = useDraggable(targetRef, {
    disabled: computed(() => isDraggingDisabled.value),
    initialValue: {
      x: props.widget.positionX,
      y: props.widget.positionY,
    },
    onEnd() {
      isDraggingDisabled.value = true
      isEditing!.value = false

      updateWidget({
        positionX: x.value,
        positionY: y.value,
      })

      if (isDeleting!.value) {
        emits('delete')
        isDeleting!.value = false
      }
    },
  })

  watch(isDragging, (dragging) => {
    if (!dragging) {
      transitionActive.value = true

      setTimeout(() => {
        transitionActive.value = false
      }, 500)
    }
  })

  return {
    x, y, isDragging,
    isDraggingDisabled,
    transitionActive,
  }
}


function useTrashCollision(x: Ref<number>, y: Ref<number>) {
  const trash = inject<Ref<InstanceType<typeof DeleteTrash>>>('trash')

  watch(() => [x.value, y.value], () => {
    if (!isEditing!.value) return

    const trashBounding = trash!.value?.ref?.getBoundingClientRect()

    if (!trashBounding) {
      return
    }

    isDeleting!.value = !(
        mouse.x.value < trashBounding.x ||
        mouse.y.value < trashBounding.y ||
        mouse.x.value > trashBounding.x + trashBounding.width ||
        mouse.y.value > trashBounding.y + trashBounding.height
    )
  })
}

function useLongPressEdit(
    targetRef: Ref<HTMLElement | null>,
    menuRef: Ref<HTMLElement | null>,
    isDraggingDisabled: Ref<boolean>,
) {
  const isWidgetEditing = ref(false)

  onClickOutside(targetRef, (e) => {
    if (!menuRef.value?.contains(e.target as HTMLElement)) {
      isWidgetEditing.value = false
    }
  })

  onLongPress(targetRef, () => {
    isDraggingDisabled.value = false
    isEditing!.value = true

    targetRef.value?.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      pointerType: 'mouse',
      clientX: mouse.x.value,
      clientY: mouse.y.value,
    }))

    const initialX = x.value
    const initialY = y.value

    const OFFSET = 7

    function mouseUp() {

      if (initialX - OFFSET <= x.value && initialX + OFFSET >= x.value
          && initialY - OFFSET <= y.value && initialY + OFFSET >= y.value
      ) {
        isDraggingDisabled.value = true
        isWidgetEditing.value = true
      }

      window.removeEventListener('mouseup', mouseUp)
    }

    window.addEventListener('mouseup', mouseUp)
  }, {delay: 300})

  return {
    isWidgetEditing
  }
}

function useResize(targetRef: Ref<HTMLElement | null>) {
  const resizing = ref(false);

  const size = ref<null | DOMRect>(null)

  const observer = new ResizeObserver(() => {
    if (!targetRef.value) return

    resizing.value = true
    size.value = targetRef.value.getBoundingClientRect()
  })

  const handleMouseUp = () => {
    if (!resizing.value || !targetRef.value) return

    resizing.value = false;

    size.value = targetRef.value.getBoundingClientRect();

    updateWidget({
      width: size.value.width,
      height: size.value.height,
    });
  }

  onMounted(() => {
    window.addEventListener('mouseup', handleMouseUp);
    size.value = targetRef.value!.getBoundingClientRect()
    observer.observe(targetRef.value!)
  });

  onUnmounted(() => {
    window.removeEventListener('mouseup', handleMouseUp);
  });

  return {size, resizing}
}

</script>

<template>
  <popover :open="isWidgetEditing">
    <popover-trigger ref="widget-card" as="div"
                     class="absolute w-full h-full select-none border border-white/10 bg-white/5 p-4 backdrop-blur-lg rounded-lg overflow-hidden"
                     :class="classes" v-bind="$attrs" :style="style">
      <slot :isDragging="isDragging" :isEditing="isWidgetEditing"/>
    </popover-trigger>
    <popover-content v-if="'menu' in $slots" :side-offset="5" side-flip class="min-w-96" :data-uuid="widget.uuid">
      <div ref="menu">
        <slot name="menu"/>
      </div>
    </popover-content>
  </popover>
</template>
