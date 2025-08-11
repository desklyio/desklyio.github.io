import Dexie, {type EntityTable} from "dexie";
import {useQuery} from "@/composables/useQuery.ts";
import {computed} from "vue";

const OPTIONS = {
    backgroundDuration: 30
} as const

type Options = {
    [key in keyof typeof OPTIONS]: LiteralToPrimitive<typeof OPTIONS[key]>
}

export interface Option {
    name: keyof Options
    value: Options[keyof Options];
}

const database = new Dexie('OptionsDatabase') as Dexie & {
    options: EntityTable<
        Option,
        'name'
    >;
};

database.version(1).stores({
    options: 'name',
})

database.on('populate', async () => {
    for (const [key, value] of Object.entries(OPTIONS)) {
        await database.options.put({
            name: key as keyof Options,
            value: value as Options[keyof Options]
        })
    }
})

export function useOptions() {
    function get<T extends keyof Options>(name: keyof typeof OPTIONS, def: Options[T] | null = null) {
        const option = useQuery(() => database.options.where({name}).first())

        return computed({
            get: () => (option.value?.value ?? def ?? null) as Options[T],
            set: (value) => {
                set(name, value)
            }
        })
    }

    function set<T extends keyof Options>(name: T, value: Options[T]) {
        database.transaction('rw', [database.options], async () => {
            database.options.where('name').equals(name)
                .modify(entry => {
                    entry.value = value
                })
                .catch(async () => {
                    await database.options.put({
                        name,
                        value
                    })
                })
        })
    }

    return {
        get, set
    }
}
