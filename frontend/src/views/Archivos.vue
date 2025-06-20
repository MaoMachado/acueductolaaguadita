<script setup>

import { ref, onMounted } from 'vue';
import SubirArchivoDialog from '../components/SubirArchivoDialog.vue';
import TablaArchivos from '../components/TablaArchivos.vue';
import SubirImagenDialog from '../components/SubirImagenDialog.vue';
import TablaImagenes from '../components/TablaImagenes.vue';
import Login from '../components/Login.vue';

const cargando = ref(false);

// Dialog Subir Archivos
const mostrarDialogArchivo = ref(false);
const recargarTablaArchivos = ref(false);
function cargarTabla() {
  recargarTablaArchivos.value = !recargarTablaArchivos.value;
}

//Dialog Subir Imagenes
const mostrarDialogImagen = ref(false);
const recargarTablaImagenes = ref(false);
function actualizarTabla() {
  recargarTablaImagenes.value = !recargarTablaImagenes.value;
}

//Código Manejo del login
const logueado = ref(false);
onMounted(() => {
  logueado.value = localStorage.getItem('logueado') === 'true';
})

function manejarLogin() {
  logueado.value = true;
  localStorage.setItem('logueado', 'true');
}

// Función para manejar el logout (opcional pero recomendada)
function manejarLogout() {
  logueado.value = false;
  localStorage.removeItem('logueado');
}

// Corregidas las funciones de callback para los eventos
function manejarArchivoSubido() {
  mostrarDialogArchivo.value = false;
  cargarTabla();
}

function manejarImagenSubida() {
  mostrarDialogImagen.value = false;
  actualizarTabla();
}
</script>

<template>
  <main class="h-full grid place-content-center">
    <Login v-if="!logueado" @login-exitoso="manejarLogin" />

    <section v-else class="space-y-8 p-6">
      <header class="text-center space-y-2">
        <h1 class="text-4xl font-bold ">Gestión De Archivos</h1>
        <p class="text-lg mb-8">
          Consulta y administra los documentos oficiales de la Asociación Acueducto La Aguadita de forma segura y
          organizada.
        </p>
      </header>

      <div class="flex gap-4 ml-4 btn_grupo">
        <button @click="mostrarDialogArchivo = true" :disabled="cargando">
          Subir PDF
        </button>

        <button @click="mostrarDialogImagen = true" :disabled="cargando">
          Subir IMG
        </button>

        <!-- Botón de logout opcional -->
        <button @click="manejarLogout" class="btn-logout">
          Cerrar Sesión
        </button>

      </div>

      <SubirArchivoDialog :mostrar="mostrarDialogArchivo" @cerrar="mostrarDialogArchivo = false"
        @archivo-subido="recargarTablaArchivos" />

      <SubirImagenDialog :mostrar="mostrarDialogImagen" @cerrar="mostrarDialogImagen = false"
        @imagen-subida="recargarTablaImagenes" />

      <!-- Tablas -->
      <TablaArchivos :recargar="recargarTablaArchivos" />
      <TablaImagenes :recargar="recargarTablaImagenes" />

    </section>
  </main>
</template>

<style scoped>
header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  position: relative;
}

header::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--verde-principal), var(--verde-claro));
}

header>h1 {
  color: var(--verde-oscuro);
}

header>p {
  color: var(--marron-suave);
  font-weight: 400;
}

.btn_grupo>button {
  padding: 0.4rem;
  border-radius: 0.5rem;
  background: var(--verde-claro);
  color: var(--blanco);
  font-weight: 600;
  font-family: var(--fuente-titulo);
  cursor: pointer;
  transition: all 0.2s linear;
  border: none;
  /* Agregado para remover border por defecto */
}

.btn_grupo>button:hover {
  background: var(--verde-oscuro);
  outline: 1px solid var(--marron-suave);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.btn_grupo>button:active {
  transform: translateY(-2px);
}

.btn_grupo>button:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn_grupo>button:disabled:hover {
  background: #ccc;
  outline: none;
  box-shadow: none;
  transform: none;
}

/* Estilo específico para el botón de logout */
.btn-logout {
  background: var(--marron-suave) !important;
}

.btn-logout:hover {
  background: #8B4513 !important;
}
</style>