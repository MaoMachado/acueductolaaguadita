<script setup>
import { ref, defineEmits } from "vue";
import userIcon from "../assets/images/user-svg.png";
import passIcon from "../assets/images/pass-svg.png";

const API = import.meta.env.VITE_API_URL;

const usuario = ref("");
const password = ref("");
const error = ref("");
const cargando = ref(false);
const emit = defineEmits(["login-exitoso"]);

async function login() {
  cargando.value = true;
  error.value = "";

  if (!usuario.value.trim() || !password.value.trim()) {
    error.value = "⚠️ Todos los campos son obligatorios";
    setTimeout(() => (error.value = ""), 5000);
    cargando.value = false;
    return;
  }

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usuario.value,
        password: password.value,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error de autenticación");
    }

    // localStorage.setItem("logueado", "true");
    const data = await res.json();
    localStorage.setItem("token", data.token);
    emit("login-exitoso");
  } catch (err) {
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <main class="flex gap-3  bg-(--gris-suave) rounded-xl">
    <header class="h-full place-content-center p-6">
      <h2 class="text-3xl font-semibold text-center text-(--verde-claro) mb-4">
        Inicio De Sesión
      </h2>
    </header>
    <section class="p-6">
      <form @submit.prevent="login" class="flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <label for="usuario" class="w-10 h-10  bg-(--crema) p-1 rounded-full">
            <img :src="userIcon" alt="Usuario" class="w-full h-full object-cover" />
          </label>
          <input type=" text" v-model="usuario" id="usuario"
            class="text-xl bg-(--blanco) border-2 border-(--beige-oscuro-60) rounded-md px-4 py-1 focus:outline-none focus:border-(--verde-claro) focus:ring-1 focus:ring-(--verde-claro-60) transition-all duration-300" />
        </div>

        <div class="flex gap-2 items-center">
          <label for="password" class="w-10 h-10  bg-(--crema) p-1 rounded-full">
            <img :src="passIcon" alt="Contraseña" class="w-full h-full object-cover" />
          </label>
          <input type="password" v-model="password" id="password" autocomplete="off"
            class="text-xl bg-(--blanco) border-2 border-(--beige-oscuro-60) rounded-md px-4 py-1 focus:outline-none focus:border-(--verde-claro) focus:ring-1 focus:ring-(--verde-claro-60) transition-all duration-300" />
        </div>

        <button type="submit" :disabled="cargando"
          class="w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed bg-(--verde-claro-40) hover:bg-(--verde-claro) font-bold py-2 rounded cursor-pointer">
          <span v-if="cargando" class="flex items-center gap-2 justify-center">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span class="text-center">Iniciando Sesión...</span>
          </span>
          <span v-else class="flex items-center gap-2 justify-center">Iniciar Sesión</span>
        </button>

        <p v-if="error"
          class="py-2 px-4 rounded-lg bg-red-50 border border-red-200 text-red-700 mt-2 text-xl text-center">
          {{ error }}
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
header {
  border-right: 2px solid var(--beige-oscuro-40);
}
</style>
