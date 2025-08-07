import {useIDBKeyval} from "@vueuse/integrations/useIDBKeyval";
import {computed, ref, watch} from "vue";

type Backgrounds = { content: string, id: string }[]

const defaults: Backgrounds = []

const storage = useIDBKeyval('proDash.backgrounds', JSON.stringify(defaults))

function blobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function base64ToBlob(base64DataUrl: string) {
    const [meta, base64] = base64DataUrl.split(',');
    const mime = meta!.match(/:(.*?);/)![1];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], {type: mime});
}

function getBackgrounds() {
    const backgrounds = ref(defaults)

    if (storage.isFinished.value) {
        backgrounds.value = JSON.parse(storage.data.value)
    }

    watch(() => [storage.data.value, storage.isFinished.value], () => {
        backgrounds.value = JSON.parse(storage.data.value)
    })

    return computed({
        get: () => backgrounds.value.map(background => ({id: background.id, content: base64ToBlob(background.content)})),
        set: (value) => {
            Promise.all(value.map(async background => ({id: background.id, content: await blobToBase64(background.content)}))).then(nValue => {
                storage.set(JSON.stringify(nValue))
            })
        }
    })
}

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
    function getBackgroundUrls() {
        const urls = ref<{id: string, url: string}[]>([])

        const backgrounds = getBackgrounds()

        watch(backgrounds, () => {
            urls.value.forEach(url => URL.revokeObjectURL(url.url))
            urls.value = backgrounds.value.map(background => ({id: background.id, url: URL.createObjectURL(background.content)}))
        })

        return urls
    }


    return {
        getBackgrounds,
        getBackgroundsRaw,
        setBackgroundsRaw,
        getBackgroundUrls,
    }
}
