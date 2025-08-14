import Dexie, {type EntityTable} from "dexie";
import {v4 as uuid} from 'uuid'


import {useQuery} from "./useQuery.ts";

interface Tab {
    uuid: string
}

const database = new Dexie('TabsDatabase') as Dexie & {
    tabs: EntityTable<
        Tab,
        'uuid'
    >;
};

database.version(1).stores({
    tabs: 'uuid, name',
})

database.on('populate', async () => {
    await database.tabs.put({
        uuid: uuid(),
    })
})


export function useTabs() {
    const tabs = useQuery(() => database.tabs.toArray())


    function add() {
        database.transaction('rw', [database.tabs], async () => {
            await database.tabs.put({uuid: uuid()})
        })
    }

    function remove(uuid: string) {
        database.transaction('rw', [database.tabs], async () => {
            await database.tabs.delete(uuid)
        })
    }

    return {
        tabs,
        add,
        remove,
    }
}
