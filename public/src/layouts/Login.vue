<template>
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
            
            <p class="auth-footer">
                ¿No tienes una cuenta? 
                <a href="#/Register">Crear cuenta</a>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../authService.ts';

const username = ref('');
const password = ref('');
const errorMsg = ref('');
const loading  = ref(false);

async function handleLogin() {
    loading.value  = true;
    errorMsg.value = '';
    const result = await login(username.value, password.value);
    loading.value = false;
    if (result.success) {
        window.location.hash = '#/Dashboard';
    } else {
        errorMsg.value = result.error ?? 'Error desconocido';
    }
}
</script>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
}

.auth-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 3rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.auth-title {
    font-family: 'Lexend', sans-serif;
    font-size: 2rem;
    margin: 0;
    font-weight: 600;
    color: #fff;
}

.auth-subtitle {
    font-family: 'Inter', sans-serif;
    color: #aaa;
    margin-top: 0.5rem;
    margin-bottom: 2rem;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-group label {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #ccc;
    font-weight: 500;
}

.input-group input {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 0.8rem 1rem;
    color: white;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.input-group input:focus {
    outline: none;
    border-color: #6c5ce7;
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
}

.error-msg {
    color: #ff7675;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    text-align: center;
    background: rgba(255, 118, 117, 0.1);
    padding: 0.5rem;
    border-radius: 8px;
}

.auth-button {
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 1rem;
    font-family: 'Lexend', sans-serif;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.auth-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
}

.auth-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.auth-footer {
    text-align: center;
    margin-top: 2rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #888;
}

.auth-footer a {
    color: #a29bfe;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
}

.auth-footer a:hover {
    color: #6c5ce7;
}
</style>