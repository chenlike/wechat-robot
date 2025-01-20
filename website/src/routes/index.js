import { createWebHashHistory, createRouter } from 'vue-router'
import Layout from '../Layout.vue'

const routes = [

    {
        path: '/layout',
        component: Layout,
        children: [
            { path: '/', redirect: "/plugin" },

            {
                path: "/plugin", component: () => import("../views/Plugin.vue"), meta: {
                    keepAlive: false
                }
            },
            {
                path: "/plugin-editor",
                component: () => import("../views/PluginEditor.vue"),
                meta: {
                    keepAlive: false
                }
            },

            {
                path: "/chatroom", component: () => import("../views/Chatroom.vue"),
                meta: {
                    keepAlive: false
                }
            },

        ]
    },

]




const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router