<script setup>

import { ref, onMounted, watch, defineProps, defineExpose } from 'vue';

const props = defineProps({
  recargar: Boolean
});

const API = import.meta.env.VITE_API_URL;

const imagenes = ref([]);
const cargando = ref(false);
const error = ref(null);

// Cargar imágenes del backend
async function cargarImagenes() {
  try {
    error.value = null;
    cargando.value = true;

    const res = await fetch(`${API}/imagenes`);

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    // Validar que data es un array
    if (!Array.isArray(data)) {
      throw new Error('Formato de datos inválido del servidor');
    }

    imagenes.value = data;
  } catch (error) {
    console.error('Error al cargar las imágenes:', error);
    error.value = `Error al cargar las imágenes: ${error.message}`;
  } finally {
    cargando.value = false;
  }
}

// Eliminar imagen del frontend y backend
async function eliminar(id) {
  // Validar que el ID existe
  if (!id) {
    alert('ID de imagen inválido');
    return;
  }

  if (!confirm('¿Seguro que deseas eliminar esta imagen?')) {
    return;
  }

  // Guardar referencia a la imagen por si necesitamos restaurarla
  const imagenAEliminar = imagenes.value.find(img => img.id === id);

  if (!imagenAEliminar) {
    alert('Imagen no encontrada');
    return;
  }

  try {
    // 1. Actualizar UI optimistamente (antes de llamar al backend)
    imagenes.value = imagenes.value.filter(img => img.id !== id);

    // 2. Llamar al backend
    const res = await fetch(`${API}/imagenes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      // Si falla, restaurar la imagen en la UI
      imagenes.value = [...imagenes.value, imagenAEliminar];

      let errorMessage = 'Error al eliminar la imagen';
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Si no puede parsear el JSON, usar mensaje genérico
      }

      throw new Error(errorMessage);
    }

    console.log(`Imagen ${imagenAEliminar.nombre} eliminada correctamente`);

  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    alert(`No se pudo eliminar la imagen: ${error.message}`);

    // Asegurar que la imagen esté restaurada si no estaba
    if (!imagenes.value.find(img => img.id === id)) {
      imagenes.value = [...imagenes.value, imagenAEliminar];
    }
  }
}

// Función helper para formatear fecha (corregida)
function formatearFecha(fecha) {
  if (!fecha) return 'Fecha no disponible';

  try {
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return 'Fecha inválida';
  }
}

// Función para validar URL de imagen
function esUrlImagenValida(url) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Función para manejar errores de carga de imagen
function manejarErrorImagen(event) {
  console.error('Error al cargar imagen:', event.target.src);
  event.target.src = '/placeholder-image.png'; // Imagen de respaldo
  event.target.alt = 'Imagen no disponible';
}

onMounted(() => {
  cargarImagenes();
})

// Mejorar el watch para evitar bucles infinitos
watch(() => props.recargar, (nuevoValor, valorAnterior) => {
  if (nuevoValor && nuevoValor !== valorAnterior) {
    cargarImagenes();
  }
});

defineExpose({
  cargarImagenes,
  imagenes: imagenes.value,
  cargando: cargando.value,
  error: error.value
});
</script>

<template>
  <section class="mt-20">
    <h2 class="text-2xl font-semibold mb-4 text-center">Imagenes Subidas</h2>

    <!-- Mostrar mensaje de error -->
    <div v-if="error" class="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
      {{ error }}
      <button @click="cargarImagenes" class="ml-2 underline">Reintentar</button>
    </div>

    <!-- Indicador de carga -->
    <div v-if="cargando" class="text-center p-4">
      <span class="loading-text">Cargando imágenes...</span>
    </div>

    <!-- Mensaje cuando no hay imágenes -->
    <div v-else-if="!error && imagenes.length === 0" class="text-center p-8 bg-gray-50 rounded">
      <p class="text-gray-600">No hay imágenes cargadas</p>
    </div>

    <div v-else-if="!error" class="table-container">
      <table class="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-3 text-left">Nombre</th>
            <th class="p-3 text-center">Miniatura</th>
            <th class="p-3 text-left">Fecha</th>
            <th class="p-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="img in imagenes" :key="img.id"
            class="hover:bg-gray-50 border-b border-gray-200 transition-colors duration-200">
            <td class="p-3" :title="img.nombre">
              <div>
                {{ img.nombre || 'Sin nombre' }}
              </div>
            </td>

            <td class="p-3 text-center">
              <div class="flex justify-center">
                <img v-if="esUrlImagenValida(img.url)" :src="img.url" :alt="img.nombre || 'Imagen'"
                  class="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition-transform duration-200"
                  @error="manejarErrorImagen" @click="abrirImagenCompleta(`${API}${img.url}`, img.nombre)" />
                <div v-else class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span class="text-gray-400 text-xs">No disponible</span>
                </div>
              </div>
            </td>

            <td class="p-3">
              <div class="text-gray-600 text-sm">
                {{ formatearFecha(img.fecha_subida) }}
              </div>
            </td>

            <td class="p-3 text-center">
              <div class="btn-grupo flex justify-center gap-2">
                <a v-if="esUrlImagenValida(img.url)" :href="img.url" download target="_blank" rel="noopener noreferrer"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm">
                  Descargar
                </a>
                <span v-else class="px-3 py-1 bg-gray-300 text-gray-500 rounded text-sm">
                  No disponible
                </span>

                <button @click="eliminar(img.id)" :disabled="cargando"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para imagen completa (opcional) -->
    <div v-if="imagenModalAbierta" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="cerrarModal">
      <div class="max-w-4xl max-h-4xl p-4">
        <img :src="imagenModalSrc" :alt="imagenModalAlt" class="max-w-full max-h-full object-contain rounded-lg">
        <button @click="cerrarModal" class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300">
          ✕
        </button>
      </div>
    </div>
  </section>
</template>

<script>
// Variables para el modal de imagen
const imagenModalAbierta = ref(false);
const imagenModalSrc = ref('');
const imagenModalAlt = ref('');

function abrirImagenCompleta(src, alt) {
  imagenModalSrc.value = src;
  imagenModalAlt.value = alt;
  imagenModalAbierta.value = true;
}

function cerrarModal() {
  imagenModalAbierta.value = false;
  imagenModalSrc.value = '';
  imagenModalAlt.value = '';
}
</script>

<style scoped>
.error-message {
  animation: fadeIn 0.3s ease-in;
}

.loading-text {
  animation: pulse 1.5s ease-in-out infinite;
}

.table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

th {
  font-weight: normal;
  font-family: var(--fuente-titulo);
}

td {
  font-family: var(--fuente-parrafo);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .table-container {
    font-size: 0.875rem;
  }

  .btn-grupo {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-grupo a,
  .btn-grupo button {
    width: 100%;
    text-align: center;
  }
}

/* Estilos para el modal */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}
</style>