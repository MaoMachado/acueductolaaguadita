<script setup>
import { ref, watch } from 'vue';
import { defineEmits } from 'vue';
// import { useEmit } from '@vueuse/core';

const props = defineProps({
  mostrar: Boolean
});

const emit = defineEmits(['cerrar', 'imagenSubida', 'imagen-subida'])

const nombre = ref('');
const archivo = ref(null);

function seleccionarImagen(e) {
  archivo.value = e.target.files[0];
};

function cancelar() {
  nombre.value = ''
  archivo.value = null
  emit('cerrar')
};

async function subirImagen() {
  const formData = new FormData();
  formData.append('file', archivo.value);
  formData.append('nombre', nombre.value);

  try {
    const res = await fetch('http://localhost:3000/upload-image', {
      method: 'POST',
      body: formData
    })

    emit('imagen-subida')

    if (!res.ok) throw new Error('Error al subir la imagen');

    const data = await res.json();
    emit('imagenSubida', data);
    cancelar();

  } catch (error) {
    console.error('Error: ', error)
    alert('No se pudo subir la imagen')
  }
}
</script>

<template>
  <section v-if="mostrar" class="fixed inset-0 bg-black/50 grid place-content-center z-50">
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
      <h2 class="text-xl font-bold">Subir Imagen</h2>

      <input type="text" v-model="nombre" placeholder="Nombre De La Imagen" class="w-full p-2 border rounded" />
      <input type="file" @change="seleccionarImagen" accept="image/*" />

      <div class="flex justify-end gap-2">
        <button @click="cancelar" class="px-4 py-2 rounded bg-gray-400">Cancelar</button>
        <button @click="subirImagen" :disabled="!archivo || !nombre"
          class="px-4 py-2 bg-blue-700 rounded disabled:opacity-50">Subir Imagen</button>
      </div>
    </div>
  </section>
</template>