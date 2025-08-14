export function range(length: number): Array<number> {
    return Array.from(Array(length).keys())
}

export function localeMinutes(item: number) {
    return item === 1 ? 'minute' : 'minutes'
}
