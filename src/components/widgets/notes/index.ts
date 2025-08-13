import Notes from './Notes.vue'

export default {
    meta: {
        name: 'Notes',
        icon: 'bi-text-indent-left',
        shortcut: 'Shift+Ctrl+T',
        initial: {
            content: '<h1>Hello World</h1>',
            width: 300,
            height: 200
        }
    },
    component: Notes
} as WidgetComponent
