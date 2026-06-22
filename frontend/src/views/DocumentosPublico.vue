<script setup>
import { ref, onMounted } from 'vue';

const API = import.meta.env.VITE_API_URL;
const documentos = ref([]);
const cargando = ref(true);
const error = ref(null);
const urlSeleccionada = ref(null)

async function cargarDocumentos() {
  try {
    const res = await fetch(`${API}/documentos`);
    if (!res.ok) throw new Error('Error al cargar el documento');

    const data = await res.json();
    documentos.value = data;
  } catch (err) {
    error.value = err.message || 'Error inesperado';
  } finally {
    cargando.value = false;
  }
}

const verDocumento = (url) => {
  urlSeleccionada.value = url;
}

onMounted(() => {
  cargarDocumentos();
})
</script>

<template>
  <section class="flex flex-col gap-3 px-5 md:px-10 lg:px-15">
    <header class="flex flex-col gap-4 items-center text-center justify-center h-50">
      <h1
        class="text-2xl font-semibold lg:font-bold lg:text-5xl text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-sky-400 text-shadow-sm text-shadow-white/10">
        Documentos Públicos Acueducto La Aguadita
      </h1>
      <p class="text-lg text-cyan-800 dark:text-cyan-200 lg:text-xl">
        Asociación Acueducto Veredal La Aguadita - Fresno, Tolima
      </p>
    </header>

    <section class="p-6 flex flex-col gap-4">
      <div v-if="cargando" class="text-center text-gray-500">Cargando Documentos...</div>

      <div v-if="documentos.length === 0 && !cargando" class="text-center text-gray-500">
        No hay documentos disponibles.
      </div>

      <article v-else class="">
        <ul class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <li v-for="doc in documentos" :key="doc.id" class="flex items-center gap-4 bg-blue-800/20 p-4 rounded-2xl">
            <div>
              <p class="text-md font-semibold">{{ doc.titulo || 'Sin título' }}</p>
              <p class="text-sm text-gray-500">{{ new Date(doc.fecha_subida).toLocaleString() }}</p>
            </div>
            <div class="flex-1 flex flex-col items-end gap-4">
              <a :href="doc.url" v-target="_blank" rel="noopener noreferrer"
                class="cursor-pointer w-30 text-center border-2 border-cyan-600/50 px-3 py-1 rounded-full hover:border-teal-500 hover:bg-teal-500/50 transition-all duration-300">
                Descargar
              </a>
              <button @click="verDocumento(doc.url)"
                class="cursor-pointer w-30 text-center border-2 border-cyan-600/50 px-3 py-1 rounded-full hover:border-teal-500 hover:bg-teal-500/50 transition-all duration-300">
                Ver PDF
              </button>
            </div>
          </li>
        </ul>
      </article>

      <div v-if="urlSeleccionada" class="mt-10">
        <h2 class="text-xl font-bold mb-4 text-emerald-700 text-center">Visor de Documento</h2>

        <button @click="urlSeleccionada = null"
          class="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition block mx-auto">
          Cerrar visor
        </button>

        <iframe :src="`https://docs.google.com/gview?url=${encodeURIComponent(urlSeleccionada)}&embedded=true`"
          width="100%" height="600" frameborder="0" class="border rounded" />
      </div>
    </section>

  </section>
</template>
