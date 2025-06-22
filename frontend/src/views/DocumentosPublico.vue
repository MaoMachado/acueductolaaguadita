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
  <main class="max-w-6xl mx-auto p-6 space-y-8">
    <header class="text-center space-y-2">
      <h1 class="text-4xl font-bold text-center mb-8 text-emerald-600">Documentos Públicos Acueducto La Aguadita</h1>
    </header>

    <div v-if="cargando" class="text-center text-gray-500">Cargando Documentos...</div>

    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded text-center mb-6">
      {{ error }}
    </div>

    <div v-if="documentos.length === 0 && !cargando" class="text-center text-gray-500">
      No hay documentos disponibles.
    </div>

    <ul v-else class="space-y-4 w-2xl mx-auto">
      <li v-for="doc in documentos" :key="doc.id" class="bg-white p-4 shadow rounded flex justify-between items-center">
        <div>
          <p class="text-lg font-semibold text-gray-800">{{ doc.titulo || 'Sin título' }}</p>
          <p class="text-sm text-gray-500">{{ new Date(doc.fecha_subida).toLocaleString() }}</p>
        </div>
        <div class="flex gap-4">
          <a :href="doc.url" target="_blank"
            class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition">
            Descargar
          </a>
          <button @click="verDocumento(doc.url)"
            class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition">
            Ver PDF
          </button>
        </div>
      </li>
    </ul>

    <div v-if="urlSeleccionada" class="mt-10">
      <h2 class="text-xl font-bold mb-4 text-emerald-700 text-center">Visor de Documento</h2>

      <button @click="urlSeleccionada = null"
        class="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition block mx-auto">
        Cerrar visor
      </button>

      <iframe :src="`https://docs.google.com/gview?url=${encodeURIComponent(urlSeleccionada)}&embedded=true`"
        width="100%" height="600" frameborder="0" class="border rounded" />
    </div>
  </main>
</template>

<style scoped>
header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--verde-principal), var(--verde-claro));
  }

  &>h1 {
    color: var(--verde-oscuro);
  }

  &>p {
    color: var(--marron-suave);
    font-weight: 400;
  }
}
</style>