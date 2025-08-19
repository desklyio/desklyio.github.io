import Link from './Link.vue'

export default {
    meta: {
        name: 'Link',
        icon: 'bi-link-45deg',
        shortcut: 'Shift+Ctrl+L',
        initial: {
            width: 100,
            height: 60,
            text: 'Link'
        }
    },
    component: Link
} as WidgetComponent
