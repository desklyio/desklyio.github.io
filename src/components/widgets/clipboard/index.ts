import Clipboard from './Clipboard.vue'

export default {
    meta: {
        name: 'Clipboard History',
        icon: 'bi-clipboard',
        shortcut: 'Shift+Ctrl+C',
        initial: {
            history: '[]',
            width: 300,
            height: 170
        }
    },
    component: Clipboard
} as WidgetComponent
