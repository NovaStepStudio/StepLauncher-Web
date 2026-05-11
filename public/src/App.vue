<script setup lang="ts">
import { computed } from 'vue'
import { currentUser } from './authService.ts'

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

import NewsSVG    from '../assets/svg/header/news.svg'
import ArchiveSVG from '../assets/svg/header/archive.svg'
import UserSVG    from '../assets/svg/header/user.svg'

const Links = computed(() => {
  const base = [
    { text: 'Novedades',       path: '/',         icon: NewsSVG    },
    { text: 'Actualizaciones', path: '/',          icon: ArchiveSVG },
  ]
  if (currentUser.value) {
    base.push({ text: 'Mi Cuenta', path: '/Dashboard', icon: UserSVG })
  } else {
    base.push({ text: 'Iniciar Sesión', path: '/Login', icon: UserSVG })
  }
  return base
})
</script>

<template>
  <Header :links="Links" />
  <main>
    <router-view />
  </main>
  <Footer />
</template>