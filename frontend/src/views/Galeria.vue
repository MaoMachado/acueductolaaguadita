<script setup>
import { ref, onMounted, computed } from 'vue';

const imagenes = ref([]);
const cargando = ref(false);
const error = ref('');
const imagenSeleccionada = ref(null);
const modalAbierto = ref(false);
const filtroTexto = ref('');
const API = import.meta.env.VITE_API_URL;

// Función para cargar las imagenes
async function cargarImagenes() {
  cargando.value = true;
  error.value = '';

  try {
    const res = await fetch(`${API}/imagenes`);
    if (!res.ok) throw new Error('Error cargando las imagenes');

    const data = await res.json();
    imagenes.value = data;

  } catch (error) {
    error.value = 'No se pudieron cargar las imágenes. Por favor, intenta de nuevo.';
    console.error('Error al cargar las imagenes:', error);
  } finally {
    cargando.value = false;
  }
}

//Filtrar imagenes por nombre
const imagenesFiltradas = computed(() => {
  if (!imagenes.value) return imagenes.value;

  return imagenes.value.filter(img => img.nombre.toLowerCase().includes(filtroTexto.value.toLowerCase()));
})

//Función para el modal
function abrirModal(imagen) {
  imagenSeleccionada.value = imagen;
  modalAbierto.value = true;
  documento.body.style.overflow = 'hidden';
}

//Función para cerrar el modal
function cerrarModal() {
  modalAbierto.value = false;
  imagenSeleccionada.value = null;
  document.body.style.overflow = 'auto';
}

//Navegación en el modal
function imagenAnterior() {
  const indiceActual = imagenes.value.findIndex(img => img.id === imagenSeleccionada.value.id);
  const indiceAnterior = indiceActual > 0 ? indiceActual - 1 : imagenes.value.length - 1;
  imagenSeleccionada.value = imagenes.value[indiceAnterior];
}

function imagenSiguiente() {
  const indiceActual = imagenes.value.findIndex(img => img.id === imagenSeleccionada.value.id);
  const indiceSiguiente = indiceActual < imagenes.value.length - 1 ? indiceActual + 1 : 0;
  imagenSeleccionada.value = imagenes.value[indiceSiguiente];
}

// Event listeners para teclado
function manejarTeclado(event) {
  if (!modalAbierto.value) return;

  switch (event.key) {
    case 'Escape':
      cerrarModal();
      break;
    case 'ArrowLeft':
      imagenAnterior();
      break;
    case 'ArrowRight':
      imagenSiguiente();
      break;
  }
}

onMounted(() => {
  cargarImagenes();
  document.addEventListener('keydown', manejarTeclado);
})
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
    <header class="backdrop-blur-md bg-white/80 shadow-lg sticky top-0 z-40 border-b border-emerald-100">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="text-center space-y-4">
          <h1 class="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Galería De Evidencias Comunitarias</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Fotografías y registros visuales de las actividades de la Asociación Acueducto La Aguadita.
          </p>

          <!-- Barra de busqueda -->
          <article class="max-w-md mx-auto mt-6">
            <div class="relative">
              <input type="text" v-model="filtroTexto" placeholder="Buscar Imagenes"
                class="w-full pl-12 pr-4 py-3 rounded-full border-2 border-emerald-200 focus:border-emerald-400 focus:outline-none transition-colors bg-white/90 backdrop-blur-sm">
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </article>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Estado de cargar y error -->
      <div v-if="cargando" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent"></div>
        <span class="ml-4 text-lg text-emerald-600 font-medium">Cargando imágenes...</span>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-700 mb-4">{{ error }}</p>
          <button @click="cargarImagenes"
            class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
            Reintentar
          </button>
        </div>
      </div>

      <!-- Mensaje cuando no hay imágenes -->
      <div v-else-if="imagenesFiltradas.length === 0 && imagenes.length === 0" class="text-center py-10">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-2xl font-semibold text-gray-400 mb-2">No hay imágenes disponibles</h3>
        <p class="text-gray-500">Las imágenes se mostrarán aquí cuando estén disponibles</p>
      </div>

      <!-- Mensaje cuando no hay resultados de búsqueda -->
      <div v-else-if="imagenesFiltradas.length === 0" class="text-center py-10">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-500">No se encontraron imágenes</h3>
        <p class="text-gray-400">Intenta con otros términos de búsqueda</p>
      </div>

      <!-- Grid de imágenes con efectos modernos -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <article v-for="(img, index) in imagenesFiltradas" :key="img.id" class="group cursor-pointer"
          @click="abrirModal(img)">
          <figure
            class="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <!-- Contenedor de imagen con overlay -->
            <div class="relative overflow-hidden aspect-square">
              <img :src="`http://localhost:3000${img.url}`" :alt="img.nombre"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy">

              <!-- Overlay con efectos -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="flex items-center justify-between text-white">
                    <span class="text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                      Ver imagen
                    </span>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Indicador de posición -->
              <div
                class="absolute top-4 right-4 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {{ index + 1 }}/{{ imagenesFiltradas.length }}
              </div>
            </div>

            <!-- Caption mejorado -->
            <figcaption class="p-4">
              <h3
                class="font-semibold text-gray-800 text-center group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                {{ img.nombre }}
              </h3>
            </figcaption>
          </figure>
        </article>
      </div>
    </main>

    <!-- Modal mejorado para ver imágenes -->
    <teleport to="body">
      <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="modalAbierto"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          @click.self="cerrarModal">
          <!-- Contenedor del modal -->
          <div class="relative max-w-7xl max-h-[90vh] mx-4">
            <!-- Botón cerrar -->
            <button @click="cerrarModal"
              class="absolute -top-12 right-0 text-white hover:text-emerald-400 transition-colors z-10"
              aria-label="Cerrar modal">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Navegación izquierda -->
            <button @click="imagenAnterior"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10 backdrop-blur-sm"
              aria-label="Imagen anterior">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Navegación derecha -->
            <button @click="imagenSiguiente"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10 backdrop-blur-sm"
              aria-label="Imagen siguiente">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Imagen principal -->
            <div class="text-center">
              <img :src="`http://localhost:3000${imagenSeleccionada?.url}`" :alt="imagenSeleccionada?.nombre"
                class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl">

              <!-- Información de la imagen -->
              <div class="mt-6 text-white">
                <h2 class="text-2xl font-bold mb-2">{{ imagenSeleccionada?.nombre }}</h2>
                <p class="text-emerald-400">
                  {{imagenes.findIndex(img => img.id === imagenSeleccionada?.id) + 1}} de {{ imagenes.length }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </section>
</template>

<style scoped>
/* Añadir line-clamp para truncar texto */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth scroll para mejor UX */
html {
  scroll-behavior: smooth;
}

/* Animaciones personalizadas */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
</style>