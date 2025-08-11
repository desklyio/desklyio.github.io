import {useIDBKeyval} from "@vueuse/integrations/useIDBKeyval";
import { ref, watch} from "vue";

type Backgrounds = { content: string, id: string }[]

const defaults: Backgrounds = []

const storage = useIDBKeyval('proDash.backgrounds', JSON.stringify(defaults))

function getBackgroundsRaw() {
    const backgrounds = ref(defaults)

    if (storage.isFinished.value) {
        backgrounds.value = JSON.parse(storage.data.value)
    }

    watch(() => storage.data.value, () => {
        backgrounds.value = JSON.parse(storage.data.value)
    })

    return backgrounds
}

function setBackgroundsRaw(backgrounds: string[]) {
    storage.set(JSON.stringify(backgrounds))
}

export function useBackgrounds() {
    return {
        getBackgroundsRaw,
        setBackgroundsRaw,
    }
}
