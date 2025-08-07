import {computed, type ComputedRef, readonly, ref, watchEffect} from "vue"
import {useIDBKeyval} from "@vueuse/integrations/useIDBKeyval";
import {useBackgrounds} from "./useBackgrounds.ts";

export interface Position {
    x: number,
    y: number
}

interface WidgetConfig<T = Record<string, unknown>> {
    name: string
    id: string
    data: T & {
        position: Position,
    }
}

interface Options {
    backgroundSwitchMinutes: number
}

interface Config {
    options: Options
    widgets: WidgetConfig[]
}

const defaults: Config = {
    widgets: [],
    options: {
        backgroundSwitchMinutes: 30
    }
} as const

const configKey = `proDash.config${import.meta.env.DEV ? '.dev': ''}`

const storage = useIDBKeyval(configKey, JSON.stringify(defaults))
const {getBackgroundsRaw, setBackgroundsRaw} = useBackgrounds()

function getConfig() {
    const config = ref(defaults)

    watchEffect(() => {
        if (storage.isFinished.value) {
            config.value = JSON.parse(storage.data.value)
        }
    })

    return computed({
        get: () => config.value,
        set: (value) => {
            config.value = value
            storage.set(JSON.stringify(value))
        }
    })
}

export function useConfig() {
    async function importStorage(obj: string) {
        const {config, backgrounds} = JSON.parse(obj)
        getConfig().value = config
        setBackgroundsRaw(backgrounds)
    }

    function exportStorage(): string {
        return JSON.stringify({config: getConfig().value, backgrounds: getBackgroundsRaw().value}, null, 2)
    }

    function getOptions(): ComputedRef<Options> {
        const config = getConfig()

        return computed(() => new Proxy(config.value.options ?? {}, {
            get: (target, p) => target[p as keyof typeof target] ?? defaults.options[p as keyof typeof defaults.options],
            set(_, p, value) {
                const nOptions = config.value.options ?? {}

                nOptions[p as keyof typeof nOptions] = value

                config.value = {
                    widgets: [...config.value.widgets],
                    options: nOptions
                }

                return true
            }
        }))
    }

    return {
        storage: readonly(storage.data),
        importStorage,
        exportStorage,
        getOptions
    }
}
