<script setup>
import { ref, onMounted, watch } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  recargar: Boolean
});

const imagenes = ref([]);

async function cargarImagenes() {
  try {
    const res = await fetch('http://localhost:3000/imagenes');
    if (!res.ok) throw new Error('Error en la respuesta del servidor');

    const data = await res.json();
    imagenes.value = data;

  } catch (error) {
    console.error('Error al cargar las imagenes', error)
  }
};

async function eliminar(id) {
  const confirmar = confirm('¿Seguro que deseas eliminar esta imagen?');
  if (!confirmar) return;

  try {
    const res = await fetch(`http://localhost:3000/imagenes/${id}`, {
      method: 'DELETE'
    })


    if (!res.ok) throw new Error('Error al eliminar la imagen');
    await cargarImagenes();
  } catch (err) {
    console.error('Error al eliminar la imagen.', err);
    alert('No se pudo eliminar la imagen')
  }

}

onMounted(() => {
  cargarImagenes();
})

watch(() => props.recargar, () => {
  cargarImagenes();
})
</script>

<template>
  <section class="mt-8">
    <h2 class="text-xl font-bold mb-4">Imagenes Subidas</h2>

    <div v-if="imagenes.length === 0" class="text-center">
      No Hay Imagenes Cargadas
    </div>

    <table v-else class="w-full border">
      <thead>
        <tr>
          <th class="p-2">Nombre</th>
          <th class="p-2">Miniatura</th>
          <th class="p-2">Fecha</th>
          <th class="p-2 text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="img in imagenes" :key="img.id" class="hover:bg-gray-100">
          <td class="p-2">{{ img.nombre }}</td>
          <td class="p-2">
            <img :src="`http://localhost:3000${img.url}`" :alt="img.nombre" class="w-24 h-auto rounded">
          </td>
          <td class="p-2">
            {{ new Date(img.fecha_subida).toLocaleString('es-CO'), {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            } }}
          </td>
          <td class="p-2 text-center btn-grupo">
            <a :href="`http://localhost:3000${img.url}`" download target="_blank">Descargar</a>
            <button @click="eliminar(img.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>