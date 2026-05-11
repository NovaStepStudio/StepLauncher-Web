<template>
    <div class="BGBase BGAuth"></div>
    <div class="auth-container">
        <div class="auth-card">
            <h1 class="auth-title">Iniciar Sesión</h1>
            <p class="auth-subtitle">Bienvenido de nuevo a StepLauncher</p>

            <form @submit.prevent="handleLogin" class="auth-form">
                <div class="input-group">
                    <label>Usuario</label>
                    <input type="text" v-model="username" placeholder="Nombre de usuario" required />
                </div>
                <div class="input-group">
                    <label>Contraseña</label>
                    <input type="password" v-model="password" placeholder="Tu contraseña" required />
                </div>

                <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

                <button type="submit" class="auth-button" :disabled="loading">
                    {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
                </button>
            </form>

            <p class="auth-footer">¿No tienes una cuenta? <br> <a href="/Register">Crear cuenta</a></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../authService.ts';

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);
const router = useRouter();

async function handleLogin() {
    loading.value = true;
    errorMsg.value = '';
    const result = await login(username.value, password.value);
    loading.value = false;
    if (result.success) {
        router.push('/Dashboard');
    } else {
        errorMsg.value = result.error ?? 'Error desconocido';
    }
}
</script>

<style scoped lang="scss" src="../styles/panelLogin.scss"></style>