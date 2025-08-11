import Dexie, {type EntityTable} from "dexie";
import {useQuery} from "@/composables/useQuery.ts";
import {ref, watch} from "vue";

export interface Background {
    uuid: string
    blob: Blob
}

export interface BackgroundOrder {
    uuid: string
    backgroundUuids: string[]
}

const database = new Dexie('BackgroundsDatabase') as Dexie & {
    backgrounds: EntityTable<Background, 'uuid'>
    backgroundOrder: EntityTable<BackgroundOrder, 'uuid'>
};

database.version(1).stores({
    backgrounds: 'uuid',
    backgroundOrder: 'uuid, backgroundUuids',
})

database.on('populate', async () => {
    await database.backgroundOrder.put({
        uuid: 'order',
        backgroundUuids: [],
    });
});


export function useBackground() {
    function getUrls() {
        const backgrounds = useQuery(async () => {
            const orderEntry = await database.backgroundOrder.get('order');
            if (!orderEntry) return [];

            return await database.backgrounds.bulkGet(orderEntry.backgroundUuids);
        });

        const urls = ref<{ id: string, url: string }[]>([])

        watch(backgrounds, () => {
            urls.value.forEach(url => URL.revokeObjectURL(url.url))
            urls.value = backgrounds.value.filter(background => !!background).map(background => ({
                id: background.uuid,
                url: URL.createObjectURL(background.blob)
            }))
        })

        return urls
    }

    function add(background: Background) {
        database.transaction('rw', [database.backgrounds, database.backgroundOrder], async () => {
            await database.backgrounds.put(background)

            await database.backgroundOrder
                .where('uuid').equals('order')
                .modify(entry => {
                    entry.backgroundUuids.push(background.uuid);
                })
        })
    }

    function remove(uuid: string) {
        database.transaction('rw', [database.backgrounds, database.backgroundOrder], async () => {
            await database.backgrounds.delete(uuid);
            await database.backgroundOrder
                .where('uuid').equals('order')
                .modify(entry => {
                    entry.backgroundUuids = entry.backgroundUuids.filter(id => id !== uuid);
                });
        })
    }

    function updateOrder(uuid: string, order: number) {
        database.transaction('rw', [database.backgroundOrder], async () => {
            await database.backgroundOrder
                .where('uuid').equals('order')
                .modify(entry => {
                    const currentIndex = entry.backgroundUuids.indexOf(uuid);
                    if (currentIndex === -1) return;

                    entry.backgroundUuids.splice(currentIndex, 1);
                    entry.backgroundUuids.splice(order, 0, uuid);
                });
        })
    }

    return {
        getUrls,
        add,
        remove,
        updateOrder
    }
}
