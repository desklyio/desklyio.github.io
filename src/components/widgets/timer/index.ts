import Timer from './Timer.vue'

export type ActivityType = 'work' | 'short' | 'long'
export type Duration = Record<ActivityType, number>

export const DEFAULT_DURATION: Duration = {
    work: 25,
    short: 5,
    long: 30
}

export default {
    meta: {
        name: 'Pomodoro Timer',
        icon: 'bi-stopwatch',
        shortcut: 'Shift+Ctrl+R',
        initial: {
            width: 320,
            height: 100,
            activities: '[]',
            duration: JSON.stringify(DEFAULT_DURATION)
        }
    },
    component: Timer
} as WidgetComponent
