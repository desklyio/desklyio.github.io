import Dexie, {type EntityTable} from "dexie";
import 'dexie-observable'

import {useQuery} from "./useQuery.ts";
import {computed} from "vue";

export interface Widget {
    uuid: string
    name: string
    positionX: number
    positionY: number
    width: number
    height: number
}

const database = new Dexie('WidgetsDatabase') as Dexie & {
    widgets: EntityTable<
        Widget,
        'uuid'
    >;
};

database.version(1).stores({
    widgets: '$$uuid, name',
})


export function useWidgets() {
    const widgets = useQuery(() => database.widgets.toArray())

    function get<Data>(uuid: string, def: (Widget & Partial<Data>) | null = null) {
        const widget = useQuery(() => database.widgets.get(uuid))


        return computed({
            get: () => new Proxy((widget.value ?? def ?? {}) as Widget & Partial<Data>, {
                set: (_, p, value) => {
                    const newWidget = Object.assign(widget.value ?? {}, {[p]: value}) as Widget
                    update(newWidget)
                    return true
                }
            }),

            set(newWidget) {
                update(newWidget)
            }
        })
    }

    function add<T>(widget: Widget & T) {
        database.transaction('rw', [database.widgets], async () => {
            await database.widgets.put(widget)
        })
    }

    function remove(uuid: string) {
        database.transaction('rw', [database.widgets], async () => {
            await database.widgets.delete(uuid)
        })
    }

    function update(widget: Widget) {
        database.transaction('rw', [database.widgets], async () => {
            await database.widgets.update(widget.uuid, widget)
        })
    }

    return {
        widgets,
        get,
        add,
        remove,
        update
    }
}
