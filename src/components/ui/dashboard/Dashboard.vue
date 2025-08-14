<script setup lang="ts">
import AddMenu from "@/components/AddMenu.vue";
import {Carousel, CarouselContent, CarouselDots, CarouselItem} from "@/components/ui/carousel";
import Tab from "./Tab.vue";
import {useTabs} from "@/composables/useTabs.ts";
import {computed, inject, provide, ref} from "vue";
import {useWidgets} from "@/composables/useWidgets.ts";

const widgetComponents = Object.fromEntries(Object.values(import.meta.glob<WidgetComponent>(['@/components/widgets/**/index.ts'], {
      eager: true,
      base: './',
      import: 'default',
    })).map(widget => [widget.meta.name, {component: widget.component, meta: widget.meta}])
)

const {tabs, add, remove: removeTab} = useTabs()
const {remove: removeWidget, widgets} = useWidgets()

const widgetsAdd = Object.fromEntries(Object.entries(widgetComponents).map(([name, w]) => [name, w.meta]));
const currentTabIndex = ref(0)

const currentTab = computed(() => (tabs.value ?? [])[currentTabIndex.value])

function handleRemoveTab(index: number) {
  const tabUuid = tabs.value[index].uuid
  removeTab(tabUuid);
 (widgets.value ?? []).filter(widget => widget.tabUuid  === tabUuid).forEach(widget => removeWidget(widget.uuid))
}
</script>

<template>
  <Carousel no-key :opts="{watchDrag: false}" @selected="(index) => currentTabIndex = index" class="absolute top-0 focus-visible:outline-0">
    <CarouselContent class="w-screen h-screen">
      <CarouselItem :key="tab.uuid" v-for="tab in tabs ?? []" class="relative">
        <Tab :tab-uuid="tab.uuid" :widget-components="widgetComponents"/>
      </CarouselItem>
    </CarouselContent>
    <div class="absolute bottom-4 flex w-full gap-2 items-center justify-center">
      <CarouselDots>
        <template v-if="(tabs ?? []).length > 1" #tooltip="{index}">
          <i class="cursor-pointer text-white bi-trash" @click="handleRemoveTab(index)"/>
        </template>
      </CarouselDots>
      <div>
        <i class="cursor-pointer text-white bi-plus" @click="add"/>
      </div>
    </div>
  </Carousel>
  <add-menu :tab-uuid="currentTab?.uuid ?? ''" :widgets="widgetsAdd"/>
</template>
