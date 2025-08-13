/// <reference types="vite/client" />

declare type WidgetProps<T = unknown> = {
    uuid: string
    name: string
    positionX: number
    positionY: number
    width: number
    height: number
} & T

declare interface WidgetMeta {
    icon: string
    name: string
    initial: Partial<WidgetProps>
    shortcut: string
}

declare interface WidgetComponent {
    meta: WidgetMeta,
    component: unknown
}

declare type JSONString<T> = T & string

declare interface JSON {
    parse<T>(s: JSONString<T>): T
    stringify<T>(s: T): JSONString<T>
}

declare type LiteralToPrimitive<T> =
    T extends number ? number :
        T extends string ? string :
            T extends boolean ? boolean :
                T;
