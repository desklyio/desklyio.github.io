import {computed, type Ref, type WritableComputedRef} from "vue";

export function useSimpleSliderRef<T>(v: Ref<T> | WritableComputedRef<T>) {
    return computed({
        get: () => [v.value],
        set: value => {
            v.value = value[0]
        }
    })
}
