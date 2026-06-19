<script setup>
import { ref, onMounted } from "vue";
import SubirArchivoDialog from "../components/SubirArchivoDialog.vue";
import TablaArchivos from "../components/TablaArchivos.vue";
import SubirImagenDialog from "../components/SubirImagenDialog.vue";
import TablaImagenes from "../components/TablaImagenes.vue";
import Login from "../components/Login.vue";

const cargando = ref(false);
const token = ref(localStorage.getItem("token"));

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

function manejarLogin() {
  token.value = localStorage.getItem("token");
}

// Función para manejar el logout (opcional pero recomendada)
function manejarLogout() {
  token.value = null;
  localStorage.removeItem("token");
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
    <Login v-if="!token" @login-exitoso="manejarLogin" />

    <section v-else class="py-6 px-3">
      <div class="flex flex-col gap-8">
        <header class="flex items-center gap-3">
          <h1 class="text-3xl font-semibold text-(--verde-oscuro) text-center bg-(--gris-suave) rounded-xl p-2">
            Gestión De Archivos
          </h1>
          <p class="text-lg text-(--marron-suave) text-center font-semibold w-xl">
            Consulta y administra los documentos oficiales de la Asociación
            Acueducto La Aguadita de forma segura y organizada.
          </p>
        </header>

        <div class="flex gap-4 justify-center btn_grupo">
          <button @click="mostrarDialogArchivo = true" :disabled="cargando">
            Subir PDF
          </button>

          <button @click="mostrarDialogImagen = true" :disabled="cargando">
            Subir IMG
          </button>

          <!-- Botón de logout opcional -->
          <button @click="manejarLogout">Cerrar Sesión</button>
        </div>

        <SubirArchivoDialog :token="token" :mostrar="mostrarDialogArchivo" @cerrar="mostrarDialogArchivo = false"
          @archivo-subido="recargarTablaArchivos" />

        <SubirImagenDialog :token="token" :mostrar="mostrarDialogImagen" @cerrar="mostrarDialogImagen = false"
          @imagen-subida="recargarTablaImagenes" />

        <!-- Tablas -->
        <TablaArchivos :recargar="recargarTablaArchivos" :token="token" />
        <TablaImagenes :recargar="recargarTablaImagenes" :token="token" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.btn_grupo>button {
  padding: 0.4rem;
  border-radius: 0.5rem;
  background: var(--gris-suave);
  color: var(--verde-principal);
  font-weight: 600;
  font-family: var(--fuente-titulo);
  cursor: pointer;
  transition: all 0.2s linear;
  border: none;
  /* Agregado para remover border por defecto */
}

.btn_grupo>button:hover {
  background: var(--verde-principal);
  color: var(--blanco);
  outline: 1px solid var(--marron-suave);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
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
</style>
