<script setup>

import { ref, watch, defineEmits, defineProps, onMounted, onBeforeUnmount, computed } from 'vue';

const API = import.meta.env.VITE_API_URL;

const props = defineProps({
  mostrar: Boolean
});

const emit = defineEmits(['cerrar', 'imagen-subida'])

const nombre = ref('');
const archivo = ref(null);
const cargando = ref(false);
const error = ref('');

// => Computed para validar si el formulario esta completo
const formularioValido = computed(() => {
  return archivo.value && nombre.value.trim().length > 0 && !cargando.value;
})

// => Computed para obtener info de la imagen
const infoImagen = computed(() => {
  if (!archivo.value) return null;

  const tamaño = (archivo.value.size / 1024 / 1024).toFixed(2); // Tamaño en MB
  return {
    nombre: archivo.value.name,
    tamaño: `${tamaño} MB`,
    tipo: archivo.value.type
  };
});

// => Computed para generar una preview de la imagen
const previewUrl = computed(() => {
  if (!archivo.value) return null;
  return URL.createObjectURL(archivo.value);
})

// => Función para seleccionar la imagen
function seleccionarImagen(e) {
  const file = e.target.files[0];
  error.value = '';

  if (!file) {
    archivo.value = null;
    return;
  }

  // => Validar tipo de archivo (Imagen)
  if (!file.type.startsWith('image/')) {
    error.value = 'Solo se permiten archivos de imagen';
    archivo.value = null;
    return;
  }

  // => Validar tamaño de archivo (Max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    error.value = 'El archivo debe ser menor a 5MB';
    archivo.value = null;
    return;
  }

  // => Validar la resolución de la imagen
  const img = new Image();
  img.onload = function () {
    const maxWidth = 4000;
    const maxHeight = 4000;

    if (this.width > maxWidth || this.height > maxHeight) {
      error.value = `Resolución demasiada alta. Máximo ${maxWidth}x${maxHeight} píxeles`;
      archivo.value = null;
      return;
    }
  };

  img.src = URL.createObjectURL(file);
  archivo.value = file;
};

// => Función para subir la imagen
async function subirImagen() {

  if (!formularioValido.value) {
    error.value = 'Por favor completa todos los campos';
    return;
  }

  const formData = new FormData();
  formData.append('file', archivo.value);
  formData.append('titulo', nombre.value.trim());

  try {
    cargando.value = true;
    error.value = '';

    const response = await fetch(`${API}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    emit('imagen-subida', data);
    limpiarFormulario();
    emit('cerrar');

  } catch (error) {
    console.error('Error al subir la imagen: ', error);
    error.value = error.message || 'No se pudo subir la imagen';
  } finally {
    cargando.value = false;
  }
}

// => Función para limpiar el formulario
const limpiarFormulario = () => {
  nombre.value = '';
  archivo.value = null;
  error.value = '';
}

// => Función para cancelar la subida
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

watch(nombre, () => {
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
    class="h-screen fixed inset-0 bg-black/50 backdrop-blur-sm backdrop-grayscale flex items-center justify-center z-50"
    @click="handleClickOutside">
    <div class="dialog p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">

      <h2 class="text-2xl font-bold text-gray-800 text-center">Subir Imagen</h2>

      <!-- Campo del nombre -->
      <div class="campo-grupo">
        <label for="nombre" class="block text-sm font-medium text-gray-700">
          Nombre de la imagen
        </label>
        <input id="nombre" type="text" v-model="nombre" placeholder="Ingrese El Nombre De La Imagen"
          class="w-full p-3 rounded-lg titulo_archivo" :disabled="cargando" maxlength="50" />
        <small class="text-gray-500">{{ nombre.length }}/50 caracteres</small>
      </div>

      <!-- Campo del archivo -->
      <div class="campo-grupo">
        <label for="imagen" class="block text-sm font-medium text-gray-700">
          Seleccionar imagen
        </label>
        <input id="imagen" type="file" @change="seleccionarImagen" accept="image/*" :disabled="cargando"
          class="hidden" />
        <label for="imagen"
          class="upload-label cursor-pointer block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-400 hover:bg-green-50 transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': cargando }">
          <svg class="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-sm text-gray-600">
            {{ archivo ? 'Cambiar imagen' : 'Haz clic para seleccionar una imagen' }}
          </span>
          <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF hasta 5MB</p>
        </label>
      </div>

      <!-- Preview de la imagen -->
      <div v-if="previewUrl" class="preview-container">
        <p class="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
        <div class="preview-wrapper">
          <img :src="previewUrl" :alt="nombre || 'Vista previa'" class="preview-image rounded-lg shadow-sm" />
        </div>
      </div>

      <!-- Información del archivo seleccionado -->
      <div v-if="infoImagen" class="archivo-info p-3 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-sm font-medium text-green-800">Imagen seleccionada:</p>
        <p class="text-sm text-green-700">{{ infoImagen.nombre }}</p>
        <p class="text-xs text-green-600">Tamaño: {{ infoImagen.tamaño }}</p>
      </div>

      <div v-else-if="!archivo && !error" class="texto-pendiente text-center text-gray-500 italic">
        No hay imagen seleccionada
      </div>

      <!-- Mostrar errores -->
      <div v-if="error" class="error-message p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end gap-3 pt-4">
        <button @click="cancelar"
          class="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
          :disabled="cargando">
          Cancelar
        </button>
        <button @click="subirImagen" :disabled="!formularioValido"
          class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
          <span v-if="cargando" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Subiendo...
          </span>
          <span v-else>Subir Imagen</span>
        </button>
      </div>

    </div>
  </section>
</template>

<style scoped>
.dialog {
  max-height: 90vh;
  overflow-y: auto;
  background-color: var(--crema);
}

.campo-grupo {
  display: flex;
  flex-direction: column;
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

.upload-area input[type="file"] {
  display: none;
}

.upload-label:hover:not(.opacity-50) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-container {
  margin: 1rem 0;
}

.preview-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 200px;
  overflow: hidden;
  border-radius: 0.5rem;
  background: #f9fafb;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid #e5e7eb;
}

.archivo-info {
  animation: slideIn 0.3s ease-out;
}

.error-message {
  animation: shake 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* Responsive */
@media (max-width: 640px) {
  .dialog {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }

  .preview-image {
    max-height: 150px;
  }
}
</style>