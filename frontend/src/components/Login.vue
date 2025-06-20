<script setup>
import { ref, defineEmits } from 'vue';

const API = import.meta.env.VITE_API_URL;

const usuario = ref('');
const password = ref('');
const error = ref('');
const emit = defineEmits(['login-exitoso']);

async function login() {
  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: usuario.value,
        password: password.value
      })
    })

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Error de autenticación');
    }

    localStorage.setItem('logueado', 'true');
    emit('login-exitoso')
  } catch (error) {
    error.value = error.message;
  }
}
</script>

<template>
  <section class="flex flex-col gap-4 max-w-xs p-6 bg-white rounded-2xl shadow">
    <h2 class="text-2xl font-bold text-center">Inicio De Sesión</h2>

    <form @submit.prevent="login">
      <input type=" text" v-model="usuario" placeholder="Usuario" class="input mb-4">
      <input type="password" v-model="password" placeholder="Contraseña" class="input mb-4">

      <button type="submit"
        class="w-full mt-4 bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded">Iniciar Sesión</button>

      <p v-if="error" class="text-red-600 mt-2 text-sm">{{ error }}</p>
    </form>
  </section>
</template>

<style scoped>
.input {
  inline-size: 100%;
  padding: 0.5rem;
  border-radius: 1rem;
  border: 2px solid var(--beige-oscuro);
  font-family: var(--fuente-parrafo);
  padding-inline-start: 1rem;
}

button {
  font-family: var(--fuente-titulo);
}
</style>