<script setup lang="ts">
import {WidgetCard} from "@/components/ui/widgetcard";
import {useWidgets} from "@/composables/useWidgets.ts";
import {cn} from "@/lib/utils.ts";
import {Input} from "@/components/ui/input";
import {Combobox, ComboboxList, ComboboxGroup, ComboboxItem, ComboboxItemIndicator, ComboboxEmpty, ComboboxAnchor, ComboboxInput} from "@/components/ui/combobox";

interface LinkProps extends WidgetProps {
  href: string,
  text: string,
  icon: string
}

const props = defineProps<{ widget: LinkProps }>()

const {get, remove} = useWidgets()

const icons = Object.keys(import.meta.glob('@icons/*', {base: '/node_modules/bootstrap-icons/icons/'})).map(icon => icon.replace(/\.\/(.*)\.svg$/, '$1'))

const widget = get<LinkProps>(props.widget.uuid, {...props.widget, icon: 'link-45deg'})

function handleClick () {
  if (!widget.value.href) return

  window?.open(widget.value.href, '_blank')?.focus();
}
</script>

<template>
  <WidgetCard class="p-0" no-resize v-model:widget="widget" @delete="remove(props.widget.uuid)">
    <template #default>
    <button type="button" @dblclick="handleClick" :class="cn('flex justify-between gap-2 text-white items-center-safe p-4 cursor-pointer')">
      <span>
      {{ widget.text }}
      </span>
      <i :class="cn('bi text-white/50 text-2xl bi-' + widget.icon)"/>
    </button>
    </template>
    <template #menu>
      <label for="Icon">Icon</label>
      <Combobox by="label" v-model="widget.icon">
          <ComboboxAnchor >
            <div class="relative w-full items-center rounded-md">
              <ComboboxInput :show-search="false" />
            </div>
          </ComboboxAnchor>
        <ComboboxList>
          <ComboboxEmpty>
            Nothing found.
          </ComboboxEmpty>

          <ComboboxGroup>
            <ComboboxItem
                v-for="icon in icons"
                :key="icon"
                :value="icon"
                @select="() => {
                  widget.icon = icon
                }"
            >
              {{ icon }} <i :class="['bi text-gray-500', 'bi-' + icon]"/>

              <ComboboxItemIndicator>
                <i class="bi bi-check"/>
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
      </Combobox>
      <br/>
      <label :for="`${widget.uuid}-text`">Text</label>
      <Input :id="`${widget.uuid}-text`" rows="1"  v-model="widget.text" />
      <br/>
      <label :for="`${widget.uuid}-link`">Link</label>
      <Input :id="`${widget.uuid}-link`" v-model="widget.href" />
    </template>
  </WidgetCard>
</template>
