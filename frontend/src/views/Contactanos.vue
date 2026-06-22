<script setup>

import { ref } from 'vue';

import nombre from '../assets/images/nombre.png';
import email from '../assets/images/email.png';
import asunto from '../assets/images/asunto.png';
import mensaje from '../assets/images/mensaje.png';
import { useToast } from "../composables/useToast.js"

const nombreInput = ref('');
const emailInput = ref('');
const asuntoInput = ref('');
const mensajeInput = ref('');

const mensajeExito = ref('');
const cargando = ref(false);
const error = ref('');

const toast = useToast()

const enviarFormulario = async () => {

  if (!nombreInput.value.trim() || !emailInput.value.trim() || !asuntoInput.value.trim() || !mensajeInput.value.trim()) {
    error.value = '⚠️ Todos los campos son obligatorios';
    setTimeout(() => (error.value = ''), 5000);
    toast.mostrar("Todos los campos son obligatorios", "error")
    return;
  }

  if (nombreInput.value.trim().length < 3) {
    error.value = '🧾 El nombre debe tener al menos 3 caracteres';
    setTimeout(() => (error.value = ''), 5000);
    toast.mostrar("El nombre debe tener al menos 3 caracteres", "error")
    return;
  }

  // Validar correo electrónico simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    error.value = '📧 Correo inválido';
    setTimeout(() => (error.value = ''), 5000);
    toast.mostrar("Correo inválido", "error")
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
    toast.mostrar("Mensaje Enviado Con Exito", "success")
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
    toast.mostrar("Hubo un problema al enviar el mensaje.", "error")
    console.error(err)
  } finally {
    cargando.value = false;
  }
}

const headerTitle = [
  "text-2xl",
  "font-semibold",
  "text-balance",
  "text-transparent",
  "bg-clip-text",
  "bg-linear-to-r",
  "from-sky-600",
  "to-sky-400",
  "lg:font-bold",
  "lg:text-5xl"
];
</script>

<template>
  <article class="px-5 md:px-10 lg:px-15">
    <section class="flex flex-col gap-4">
      <header class="flex flex-col gap-4 items-center text-center justify-center h-50">
        <h2 :class="headerTitle">Contacto - Acueducto Acueducto La Aguadita</h2>
        <p class="text-lg text-cyan-800 dark:text-cyan-200 lg:text-xl">
          Asociación Acueducto Veredal La Aguadita - Fresno, Tolima
        </p>
      </header>

      <article class="w-lg mx-auto">
        <h2 class="text-center font-light text-3xl text-balance text-sky-900 dark:text-sky-200 mb-6">
          ¡Envíanos un correo electrónico, con tus inquietudes!
        </h2>
        <form @submit.prevent="enviarFormulario" class="flex flex-col gap-6 bg-cyan-200/20 p-7 rounded-md">
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
      </article>
    </section>
  </article>
</template>

<style scoped>
form {

  & .input_content {
    position: relative;

    & input,
    textarea {
      inline-size: 100%;
      outline: 2px solid var(--azul-profundo-40);
      border-radius: 1rem;
      padding: 0.8rem 1.5rem;
      font-size: 1em;

      &:focus {
        outline: 2px solid var(--azul-profundo-80);
      }

      &:focus~img {
        opacity: 1;
      }

      &:focus~label {
        transform: translateY(-28px);
        background: var(--azul-verdoso-80);
        padding: 1px 0.5rem;
        opacity: 1;
        transition: all 0.1s linear;
        border-radius: 10px;
      }
    }

    & label {
      position: absolute;
      top: 13px;
      left: 15px;
      font-size: 1em;
      opacity: 0.6;
      pointer-events: none;
    }

    & label.active {
      transform: translateY(-28px);
      background: var(--azul-verdoso-80);
      padding: 1px 3px;
      opacity: 1;
      transition: all 0.1s linear;
      border-radius: 10px;
      font-size: 0.7em;
    }

    & img {
      position: absolute;
      right: 15px;
      top: 10px;
      width: 30px;
      opacity: 0.2;
    }
  }

  &>button {
    background: var(--azul-claro-40);
    padding-block: 0.5rem;
    font-family: var(--fuente-titulo);
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.5s ease-in-out;

    &:hover {
      background: var(--azul-claro-60);
      outline: 2px solid var(--azul-verdoso-20);
    }
  }
}
</style>
