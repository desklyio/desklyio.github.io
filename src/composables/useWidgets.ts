import Dexie, {type EntityTable} from "dexie";

import {useQuery} from "./useQuery.ts";
import {computed} from "vue";

const database = new Dexie('WidgetsDatabase') as Dexie & {
    widgets: EntityTable<
        WidgetProps,
        'uuid'
    >;
};

database.version(1).stores({
    widgets: 'uuid, name',
})


export function useWidgets() {
    const widgets = useQuery(() => database.widgets.toArray())

    function get<Data>(uuid: string, def: (WidgetProps & Partial<Data>) | null = null) {
        const widget = useQuery(() => database.widgets.get(uuid))


        return computed({
            get: () => new Proxy((widget.value ?? def ?? {}) as WidgetProps & Partial<Data>, {
                set: (_, p, value) => {
                    const newWidget = Object.assign(widget.value ?? {}, {[p]: value}) as WidgetProps
                    update(newWidget)
                    return true
                }
            }),

            set(newWidget) {
                update(newWidget)
            }
        })
    }

    function add<T>(widget: WidgetProps & T) {
        database.transaction('rw', [database.widgets], async () => {
            await database.widgets.put(widget)
        })
    }

    function remove(uuid: string) {
        database.transaction('rw', [database.widgets], async () => {
            await database.widgets.delete(uuid)
        })
    }

    function update(widget: WidgetProps) {
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
