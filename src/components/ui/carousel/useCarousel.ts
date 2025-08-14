import type {CarouselEmits, CarouselProps, UnwrapRefCarouselApi as CarouselApi} from "./interface"
import {createInjectionState} from "@vueuse/core"
import emblaCarouselVue from "embla-carousel-vue"
import {onMounted, ref, unref} from "vue"
import {WheelGesturesPlugin} from 'embla-carousel-wheel-gestures'


const [useProvideCarousel, useInjectCarousel] = createInjectionState(
    ({
         opts,
         orientation,
         plugins,
     }: CarouselProps, emits: CarouselEmits) => {
        const optsUnwrapped = unref(opts) ?? {}

        const [emblaNode, emblaApi] = emblaCarouselVue({
            ...optsUnwrapped,
            watchDrag: (_, mutations) => {
                if ('watchDrag' in optsUnwrapped) {
                    return typeof optsUnwrapped.watchDrag === 'function' ? optsUnwrapped.watchDrag(_, mutations) : optsUnwrapped.watchDrag;
                }
                return !mutations.isTrusted
            },
            axis: orientation === "horizontal" ? "x" : "y",
        }, [...unref(plugins ?? []), WheelGesturesPlugin()])

        function scrollPrev() {
            emblaApi.value?.scrollPrev()
        }

        function scrollNext() {
            emblaApi.value?.scrollNext()
        }

        function scrollTo(index: number) {
            emblaApi.value?.scrollTo(index)
        }

        const canScrollNext = ref(false)
        const canScrollPrev = ref(false)
        const selectedIndex = ref(0);
        const scrollSnaps = ref<number[]>([])

        function onSelect(api: CarouselApi) {
            canScrollNext.value = api?.canScrollNext() || false
            canScrollPrev.value = api?.canScrollPrev() || false
            selectedIndex.value = api?.selectedScrollSnap() || 0;
            scrollSnaps.value = api?.scrollSnapList() || [];
            emits('selected', selectedIndex.value)
        }

        onMounted(() => {
            if (!emblaApi.value)
                return

            emblaApi.value?.on("init", onSelect)
            emblaApi.value?.on("reInit", onSelect)
            emblaApi.value?.on("select", onSelect)

            emits("init-api", emblaApi.value)
        })

        return {
            carouselRef: emblaNode,
            carouselApi: emblaApi,
            canScrollPrev,
            canScrollNext,
            selectedIndex,
            scrollSnaps,
            scrollPrev,
            scrollNext,
            scrollTo,
            orientation
        }
    },
)

function useCarousel() {
    const carouselState = useInjectCarousel()

    if (!carouselState)
        throw new Error("useCarousel must be used within a <Carousel />")

    return carouselState
}

export {useCarousel, useProvideCarousel}
