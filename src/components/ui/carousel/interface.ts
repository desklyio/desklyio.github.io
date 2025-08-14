import type useEmblaCarousel from "embla-carousel-vue"
import type {
  EmblaCarouselVueType,
} from "embla-carousel-vue"
import type { HTMLAttributes, UnwrapRef } from "vue"

type CarouselApi = EmblaCarouselVueType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

export type UnwrapRefCarouselApi = UnwrapRef<CarouselApi>

export interface CarouselProps {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  noKey?: boolean
}

export interface CarouselEmits {
  (e: "init-api", payload: UnwrapRefCarouselApi): void
  (e: "selected", index: number): void
}

export interface WithClassAsProps {
  class?: HTMLAttributes["class"]
}
