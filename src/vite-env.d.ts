/// <reference types="vite/client" />

declare interface WidgetMeta {
    icon: string
    name: string
    initial: Widget
}


declare type LiteralToPrimitive<T> =
    T extends number ? number :
        T extends string ? string :
            T extends boolean ? boolean :
                T;
