<script setup lang="ts">
import { ref, computed } from 'vue';
import { currentUser } from './authService.ts';

import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

import Home      from './layouts/Home.vue';
import Login     from './layouts/Login.vue';
import Register  from './layouts/Register.vue';
import Dashboard from './layouts/Dashboard.vue';

import NewsSVG    from '../assets/svg/header/news.svg';
import ArchiveSVG from '../assets/svg/header/archive.svg';
import UserSVG    from '../assets/svg/header/user.svg';

type RouteName = '/' | '/Login' | '/Register' | '/Dashboard';

const Routes: Record<RouteName, object> = {
    '/':          Home,
    '/Login':     Login,
    '/Register':  Register,
    '/Dashboard': Dashboard,
};

const currentPath = ref(window.location.hash);
window.addEventListener('hashchange', () => { currentPath.value = window.location.hash; });

const currentView = computed(() => {
    const path = currentPath.value.slice(1) || '/';
    return Routes[path as RouteName] ?? Home;
});

const Links = computed(() => {
    const base = [
        { text: 'Novedades',      path: '#/',         icon: NewsSVG    },
        { text: 'Actualizaciones',path: '#/',          icon: ArchiveSVG },
    ];
    if (currentUser.value) {
        base.push({ text: 'Mi Cuenta', path: '#/Dashboard', icon: UserSVG });
    } else {
        base.push({ text: 'Iniciar Sesión', path: '#/Login', icon: UserSVG });
    }
    return base;
});
</script>

<template>
    <Header :links="Links"></Header>
    <main>
        <component :is="currentView" />
    </main>
    <Footer></Footer>
</template>