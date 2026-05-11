<template>
    <div class="BGBase BGRegister"></div>
    <div class="auth-container">
        <div class="auth-card">
            <h1 class="auth-title">Crear Cuenta</h1>
            <p class="auth-subtitle">Únete a StepLauncher</p>

            <form @submit.prevent="handleRegister" class="auth-form">
                <div class="input-group">
                    <label>Usuario</label>
                    <input type="text" v-model="username" placeholder="Nombre de usuario" required />
                </div>
                <div class="input-group">
                    <label>Correo Electrónico</label>
                    <input type="email" v-model="email" placeholder="tu@correo.com" required />
                </div>
                <div class="input-group">
                    <label>Contraseña</label>
                    <input type="password" v-model="password" placeholder="Mínimo 8 caracteres" required />
                </div>

                <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
                <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

                <button type="submit" class="auth-button" :disabled="loading">
                    {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
                </button>
            </form>

            <p class="auth-footer">
                ¿Ya tienes una cuenta?
                <a href="/Login">Iniciar Sesión</a>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../authService.ts';

const username = ref('');
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const successMsg = ref('');
const loading = ref(false);
const router = useRouter();

async function handleRegister() {
    loading.value = true;
    errorMsg.value = '';
    successMsg.value = '';
    if (password.value.length < 8) {
        errorMsg.value = 'La contraseña debe tener al menos 8 caracteres.';
        loading.value = false;
        return;
    }
    const result = await register(username.value, email.value, password.value);
    loading.value = false;
    if (result.success) {
        successMsg.value = '¡Cuenta creada con éxito! Redirigiendo...';
        setTimeout(() => { router.push('/Login'); }, 2000);
    } else {
        errorMsg.value = result.error ?? 'Error desconocido';
    }
}
</script>

<style scoped lang="scss" src="../styles/panelLogin.scss"></style>