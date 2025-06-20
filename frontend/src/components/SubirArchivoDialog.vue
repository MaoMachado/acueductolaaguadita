<script setup>

import { ref, watch, defineProps, defineEmits, onMounted, onBeforeUnmount, computed } from 'vue';

const nuevoTitulo = ref('');
const archivo = ref(null);
const cargando = ref(false);
const error = ref('');

const props = defineProps({
  mostrar: Boolean
});

const emit = defineEmits(['cerrar', 'archivo-subido']);

//Para validar si el formulario esta completo
const formularioValido = computed(() => {
  return archivo.value && nuevoTitulo.value.trim().length > 0 && !cargando.value;
});

//Para obtener información del archivo
const infoArchivo = computed(() => {
  if (!archivo.value) return null

  const tamaño = (archivo.value.size / 1024 / 1024).toFixed(2);
  return {
    nombre: archivo.value.name,
    tamaño: `${tamaño} MB`,
    tipo: archivo.value.type
  }
})

function seleccionarArchivo(e) {
  archivo.value = e.target.files[0];
  error.value = '';

  if (!file) {
    archivo.value = null;
    return;
  }

  //Validar tipo de archivo
  if (file.type !== 'application/pdf') {
    error.value = 'Solo se permiten archivos PDF';
    archivo.value = null;
    return;
  }

  //Validar por tamaño
  const maxSizeMB = 10 * 1024 * 1024
  if (file.size > maxSizeMB) {
    erro.value = 'El archivo es demasiado grande. Maximo 10 MB';
    archivo.value = null;
    return;
  }

  archivo.value = file;
};

//Cargar los archivos al backend
async function subirPDF() {

  if (!formularioValido.value) {
    error.value = 'Por favor completar todos los campos';
    return;
  }

  const formData = new FormData();
  formData.append('file', archivo.value);
  formData.append('titulo', nuevoTitulo.value.trim());

  try {
    cargando.value = true;
    error.value = '';

    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    alert('Archivo subido exitosamente: ', data);
    emit('archivo-subido', data);
    limpiarFormulario();
    cancelar();

  } catch (error) {
    console.error('Error al subir el PDF: ', error);
    alert('Hubo un problema al subir el archivo');
    error.value = error.message || 'Hubo un problema al subir el archivo';

  } finally {
    cargando.value = false;
  }
};

const limpiarFormulario = () => {
  nuevoTitulo.value = '';
  archivo.value = null;
  error.value = '';
}

//Salir de la ventana Modal
const cancelar = () => {
  if (cargando.value) {
    return;
  }

  limpiarFormulario();
  emit('cerrar');
}

function handleClickOutside(e) {
  if (e.target.classList.contains('modal-overlay') && !cargando.value) {
    cancelar();
  }
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && !cargando.value) {
    cancelar();
  }
}

watch(nuevoTitulo, () => {
  if (error.value) error.value = '';
});

watch(archivo, () => {
  if (error.value && archivo.value) error.value = '';
});

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
})

</script>

<template>
  <section v-if="mostrar"
    class="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-xs backdrop-grayscale flex items-center justify-center z-50"
    @click="handleClickOutside">
    <div class="dialog p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4">

      <h2 class="text-2xl font-bold text-gray-800 text-center">Crear Enlace Con Documento</h2>

      <!-- Campo Titulo -->
      <div class="campo-grupo">
        <label for="titulo" class="block text-sm font-medium text-gray-700">Título del documento:</label>
        <input id="titulo" v-model="nuevoTitulo" type="text" placeholder="Ingresa el título del archivo"
          class="w-full p-3 rounded-xl titulo_archivo" :disabled="cargando" maxlength="100" />
        <small class="text-gray-500 text-center">{{ nuevoTitulo.length }}/100 caracteres</small>
      </div>

      <!-- Selector del archivo -->
      <div class="campo-grupo">
        <label for="archivo" class="block text-sm font-medium text-gray-700">Seleccionar archivo PDF:</label>
        <div class="inp_archivo">
          <input id="archivo" type="file" @change="seleccionarArchivo" accept=".pdf,application/pdf"
            :disabled="cargando" />
        </div>
      </div>

      <!-- Información del archivo seleccionado -->
      <div v-if="infoArchivo" class="archivo-info p-3 bg-green-50 rounded-2xl">
        <p class="text-sm font-medium">Archivo seleccionado:</p>
        <p class="text-sm">{{ infoArchivo.nombre }}</p>
        <p class="text-xs">Tamaño: {{ infoArchivo.tamaño }}</p>
      </div>

      <div v-else-if="!archivo && !error" class="texto_pendiente">
        No hay archivo seleccionado
      </div>

      <!-- Mostrar errores -->
      <div v-if="error" class="error-message p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end gap-3 btn_grupo">
        <button @click="cancelar" class="px-4 py-2 rounded-lg btn-cancelar">Cancelar</button>
        <button @click="subirPDF" :disabled="!formularioValido"
          class="px-4 py-2 rounded-lg btn-subir disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="cargando" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Subiendo...
          </span>

          <span v-else>Subir Documento</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dialog {
  background: var(--crema);
  border: 2px solid rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.campo-grupo {
  display: flex;
  flex-direction: column;
}

.campo-grupo label {
  font-family: var(--fuente-titulo, sans-serif);
  font-weight: 500;
}

.titulo_archivo {
  font-family: var(--fuente-parrafo, sans-serif);
  border: 2px solid var(--verde-principal, #4a9d7a);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.titulo_archivo:focus {
  outline: none;
  border-color: var(--verde-claro);
  box-shadow: 0 0 0 3px rgba(77, 157, 122, 0.1);
}

.inp_archivo {
  color: var(--verde-oscuro, #2d5a4a);
  font-family: var(--fuente-titulo, sans-serif);
}

.inp_archivo input[type="file"] {
  width: 100%;
  cursor: pointer;
  padding: 0.75rem;
  border: 2px dashed var(--verde-principal, #4a9d7a);
  border-radius: 0.75rem;
  background: transparent;
  transition: all 0.2s ease;
}

.inp_archivo input[type="file"]:hover:not(:disabled) {
  background: var(--verde-claro, #e8f5f0);
  border-color: var(--verde-oscuro, #2d5a4a);
}

.inp_archivo input[type="file"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.archivo-info {
  border: 1px solid #d1fae5;
}

.texto_pendiente {
  color: #6b7280;
  font-family: var(--fuente-titulo, sans-serif);
  text-align: center;
  font-style: italic;
}

.error-message {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }
}

.btn-cancelar {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

.btn-cancelar:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.btn-subir {
  background-color: var(--verde-principal, #4a9d7a);
  color: white;
  transition: all 0.2s ease;
}

.btn-subir:hover:not(:disabled) {
  background-color: var(--verde-oscuro, #2d5a4a);
  transform: translateY(-1px);
}

.btn-subir:disabled {
  background-color: #9ca3af;
}
</style>