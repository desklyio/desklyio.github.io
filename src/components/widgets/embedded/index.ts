import Embedded from './Embedded.vue'

export default {
    meta: {
        name: 'Embedded',
        icon: 'bi-code',
        shortcut: 'Shift+Ctrl+E',
        initial: {
            width: 300,
            height: 200
        }
    },
    component: Embedded
} as WidgetComponent
