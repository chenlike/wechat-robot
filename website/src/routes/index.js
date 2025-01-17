import { createWebHashHistory, createRouter } from 'vue-router'
import Layout from '../Layout.vue'

const routes = [

    {
        path: '/layout', 
        component: Layout,
        children: [
            { path: '/', redirect:"/plugin" },

            { path:"/plugin" ,component:()=>import("../views/Plugin.vue") },
            { path:"/plugin-editor" ,component:()=>import("../views/PluginEditor.vue") },

            { path:"/chatroom" ,component:()=>import("../views/Chatroom.vue") },

        ]
    },

]




const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router