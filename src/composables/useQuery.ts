import type {Ref} from "vue";
import {useObservable} from "@vueuse/rxjs";
import {liveQuery} from "dexie";
import {Observable} from "rxjs";

type QueryResult<T> = Readonly<Ref<T extends () => Promise<infer AR> ? AR : T extends () => infer SR ? SR : never>>

export function useQuery<T extends () => unknown>(getter: T): QueryResult<T> {
    const observable = liveQuery(getter) as unknown as Observable<T>
    return useObservable(observable) as QueryResult<T>
}
