import Timer, {type TimerProps} from './Timer.vue'

export default {
    meta: {
        name: 'Pomodoro Timer',
        icon: 'bi-stopwatch',
        shortcut: 'Shift+Ctrl+R',
        initial: {
            durationWork: 25,
            durationShort: 5,
            durationLong: 30
        } as TimerProps
    },
    component: Timer
} as WidgetComponent
