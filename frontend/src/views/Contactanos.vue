<script setup>

import { ref } from 'vue';

import nombre from '../assets/images/nombre.png';
import email from '../assets/images/email.png';
import asunto from '../assets/images/asunto.png';
import mensaje from '../assets/images/mensaje.png';

const nombreInput = ref('');
const emailInput = ref('');
const asuntoInput = ref('');
const mensajeInput = ref('');

const mensajeExito = ref('');
const cargando = ref(false);
const error = ref('');

const enviarFomulario = async () => {

  if (!nombreInput.value.trim() || !emailInput.value.trim() || !asuntoInput.value.trim() || !mensajeInput.value.trim()) {
    error.value = '⚠️ Todos los campos son obligatorios';
    setTimeout(() => (error.value = ''), 5000);
    return;
  }

  if (nombreInput.value.trim().length < 3) {
    error.value = '🧾 El nombre debe tener al menos 3 caracteres';
    setTimeout(() => (error.value = ''), 5000);
    return;
  }

  // Validar correo electrónico simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    error.value = '📧 Correo inválido';
    setTimeout(() => (error.value = ''), 5000);
    return;
  }

  cargando.value = true;
  mensajeExito.value = '';
  error.value = '';

  const formData = new FormData();
  formData.append('Nombre', nombreInput.value);
  formData.append('Correo', emailInput.value);
  formData.append('Asunto', asuntoInput.value);
  formData.append('Mensaje', mensajeInput.value);

  formData.append('_captcha', 'false');

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/contacto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombreInput.value,
        correo: emailInput.value,
        asunto: asuntoInput.value,
        mensaje: mensajeInput.value
      })
    });

    if (!res.ok) throw new Error("Error al enviar el documento");
    mensajeExito.value = 'Mensaje Enviado Con Exito';
    setTimeout(() => {
      mensajeExito.value = '';
    }, 5000)

    //Limpiar campos
    nombreInput.value = '';
    emailInput.value = '';
    asuntoInput.value = '';
    mensajeInput.value = '';

  } catch (err) {
    error.value = 'Hubo un problema al enviar el mensaje.'
    setTimeout(() => {
      error.value = '';
    }, 5000)
    console.error(err)
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <main class="w-full h-screen content-center">
    <section class="flex flex-col gap-4">

      <h1 class="text-center text-3xl font-bold">Contacto - Acueducto Acueducto La Aguadita</h1>
      <form @submit.prevent="enviarFomulario" class="min-w-sm mx-auto shadow-sm p-4 rounded-xl flex flex-col gap-4">
        <div class="input_content">
          <input type="text" id="nombre" v-model="nombreInput">
          <label for="nombre" :class="{ active: nombreInput }">Nombre Y Apellido:</label>
          <img :src="nombre" alt="Icono nombre del correo">
        </div>
        <div class="input_content">
          <input type="text" id="correo" v-model="emailInput">
          <label for="correo" :class="{ active: emailInput }">Correo:</label>
          <img :src="email" alt="Icono email">

        </div>
        <div class="input_content">
          <input type="text" id="asunto" v-model="asuntoInput">
          <label for="asunto" :class="{ active: asuntoInput }">Asunto:</label>
          <img :src="asunto" alt="Icono asunto del correo">

        </div>
        <div class="input_content">
          <textarea name="mensaje" id="mensaje" v-model="mensajeInput"></textarea>
          <label for="mensaje" :class="{ active: mensajeInput }">Mensaje:</label>
          <img :src="mensaje" alt="Icono mensaje del correo">
        </div>

        <button type="submit" :disabled="cargando">{{ cargando ? 'Enviando...' : 'Enviar Correo' }}</button>
        <p class="text-center text-sm text-green-900 text-shadow-2xs" v-if="mensajeExito">{{ mensajeExito }}</p>
        <p class="text-center text-sm text-red-900 text-shadow-2xs" v-if="error">{{ error }}</p>
      </form>
    </section>
  </main>
</template>

<style scoped>
h1 {
  color: var(--verde-oscuro);
}

form {
  background: var(--crema);

  & .input_content {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    position: relative;

    & input,
    textarea {
      inline-size: 100%;
      outline: 2px solid var(--beige-oscuro);
      border-radius: 1rem;
      padding: 0.5rem;

      &:focus {
        outline: 2px solid var(--verde-principal);
      }

      &:focus~img {
        opacity: 1;
      }

      &:focus~label {
        transform: translateY(-22px);
        color: var(--verde-oscuro);
        background: var(--beige-oscuro);
        padding: 1px 0.5rem;
        opacity: 1;
        transition: all 0.1s linear;
        border-radius: 10px;
      }
    }

    & label {
      position: absolute;
      top: 10px;
      left: 15px;
      font-size: 0.8em;
    }

    & label.active {
      transform: translateY(-22px);
      color: var(--verde-oscuro);
      background: var(--beige-oscuro);
      padding: 1px 3px;
      opacity: 1;
      transition: all 0.1s linear;
      border-radius: 10px;
    }

    & img {
      position: absolute;
      right: 15px;
      top: 5px;
      width: 30px;
      opacity: 0.2;
    }
  }

  &>button {
    background: var(--verde-oscuro);
    color: var(--beige-principal);
    padding-block: 0.5rem;
    font-family: var(--fuente-titulo);
    border-radius: 1rem;
    cursor: pointer;
    transition: background 0.5s ease-in-out, outline 0.2 ease-in-out;

    &:hover {
      background: var(--verde-claro);
      outline: 2px solid var(--beige-oscuro);
    }
  }
}
</style>