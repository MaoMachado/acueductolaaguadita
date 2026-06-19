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
  <main class="flex flex-col gap-3">
    <header class="flex flex-col gap-4 items-center text-center shadow">
      <h1 class="text-2xl font-semibold lg:font-bold lg:text-5xl text-transparent bg-clip-text bg-linear-to-r from-(--verde-oscuro-60) to-(--verde-oscuro)">
        Documentos Públicos Acueducto La Aguadita
      </h1>
      <p class="text-lg text-(--marron-suave) lg:text-xl">
        Asociación Acueducto Veredal La Aguadita - Fresno, Tolima
      </p>
    </header>

    <section class="p-6 flex flex-col gap-4">
      <div v-if="cargando" class="text-center text-gray-500">Cargando Documentos...</div>

      <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded text-center mb-6">
        {{ error }}
      </div>

      <div v-if="documentos.length === 0 && !cargando" class="text-center text-gray-500">
        No hay documentos disponibles.
      </div>

      <article v-else class="flex justify-center">
        <ul class="max-w-5xl container flex flex-col gap-2">
          <li v-for="doc in documentos" :key="doc.id"
            class="bg-(--gris-suave) p-4 shadow rounded-xl flex justify-between items-center border-2 border-(--beige-oscuro-80)">
            <div>
              <p class="text-lg font-semibold text-gray-800">{{ doc.titulo || 'Sin título' }}</p>
              <p class="text-sm text-gray-500">{{ new Date(doc.fecha_subida).toLocaleString() }}</p>
            </div>
            <div class="flex gap-4">
              <a :href="doc.url" v-target="_blank" rel="noopener noreferrer"
                class="bg-(--verde-claro) text-(--blanco) px-4 py-2 rounded-md hover:bg-(--verde-principal) transition cursor-pointer">
                Descargar
              </a>
              <button @click="verDocumento(doc.url)"
                class="bg-(--verde-claro) text-(--blanco) px-4 py-2 rounded-md hover:bg-(--verde-principal) transition cursor-pointer">
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

  </main>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  padding-block: 5rem;
  border-bottom: 2px solid var(--beige-oscuro-40);
  background: var(--beige-principal-20);
}
</style>
