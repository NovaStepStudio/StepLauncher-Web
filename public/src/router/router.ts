import { createRouter, createWebHistory } from 'vue-router'
import Home from '../layouts/Home.vue'
import Login from '../layouts/Login.vue'
import Register from '../layouts/Register.vue'
import Dashboard from '../layouts/Dashboard.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/Login', component: Login },
    { path: '/Register', component: Register },
    { path: '/Dashboard', component: Dashboard },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router