<script setup>
import { ref, onMounted } from 'vue';

const imagenes = ref([]);

async function cargarImagenes() {
  try {
    const res = await fetch('http://localhost:3000/imagenes');
    if (!res.ok) throw new Error('Error cargando las imagenes');

    const data = await res.json();
    imagenes.value = data;

  } catch (error) {
    console.error('Error al cargar las imagenes:', error);
  }
}

onMounted(() => {
  cargarImagenes();
})
</script>

<template>
  <section class="max-w-6xl mx-auto p-6 space-y-8">
    <header class="text-center space-y-2">
      <h1 class="text-4xl font-bold ">Galeria De Evidencias Comunitarias</h1>
      <p class="text-lg mb-8">
        Fotografías y registros visuales de las actividades de la Asociación Acueducto La Aguadita.
      </p>
    </header>

    <span v-if="imagenes.length === 0" class="text-center">
      No Hay Imágenes Para Mostrar
    </span>

    <article v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      <div v-for="img in imagenes" :key="img.id"
        class="border rounded shadow hover:shadow-md transition-all overflow-hidden">
        <img :src="`http://localhost:3000${img.url}`" :alt="img.nombre" class="w-full h-40 object-cover">
        <div class="p-2 text-sm text-center font-medium truncate">
          {{ img.nombre }}
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  position: relative;

  &>h1 {
    color: var(--verde-oscuro);
  }

  &>p {
    color: var(--marron-suave);
    font-weight: 400;
  }
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
</style>