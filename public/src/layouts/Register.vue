<template>
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
        <a href="#/Login">Iniciar Sesión</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { register } from '../authService.ts';

const username   = ref('');
const email      = ref('');
const password   = ref('');
const errorMsg   = ref('');
const successMsg = ref('');
const loading    = ref(false);

async function handleRegister() {
    loading.value    = true;
    errorMsg.value   = '';
    successMsg.value = '';
    if (password.value.length < 8) {
        errorMsg.value  = 'La contraseña debe tener al menos 8 caracteres.';
        loading.value = false;
        return;
    }
    const result = await register(username.value, email.value, password.value);
    loading.value = false;
    if (result.success) {
        successMsg.value = '¡Cuenta creada con éxito! Redirigiendo...';
        setTimeout(() => { window.location.hash = '#/Login'; }, 2000);
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
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
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
    border-color: #00cec9;
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(0, 206, 201, 0.2);
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

.success-msg {
    color: #55efc4;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    text-align: center;
    background: rgba(85, 239, 196, 0.1);
    padding: 0.5rem;
    border-radius: 8px;
}

.auth-button {
    background: linear-gradient(135deg, #00cec9, #81ecec);
    color: #000;
    border: none;
    border-radius: 10px;
    padding: 1rem;
    font-family: 'Lexend', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.auth-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 206, 201, 0.4);
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
    color: #00cec9;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
}

.auth-footer a:hover {
    color: #81ecec;
}
</style>
