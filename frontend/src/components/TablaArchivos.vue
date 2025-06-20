<script setup>
import { ref, onMounted, watch, defineProps, defineExpose } from 'vue';

const archivos = ref([]);
const cargando = ref(false);
const error = ref(null);

const props = defineProps({
  recargar: Boolean
});

// => Cargar la información del backend
async function cargarArchivos() {
  try {
    error.value = '';
    cargando.value = true;

    const res = await fetch('http://localhost:3000/documentos');

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Formato de datos inválidos del servidor");
    }

    archivos.value = data;

  } catch (error) {
    console.log("Error Cargando Los Archivos", error);
    error.value = `Error al cargar los archivos: ${error.message}`;

  } finally {
    cargando.value = false;
  }
};

// => Eliminar el archivo del frontend y backend
async function eliminar(id) {
  if (!id) {
    error.value = 'ID de archivo no valido'
  }

  if (!confirm('¿Estás seguro que deseas eliminar este archivo?')) {
    return;
  }

  // => Guardar la referencia del archivo para restaurarlo en caso de error
  const archivoAEliminar = archivos.value.find(a => a.id === id);

  if (!archivoAEliminar) {
    error.value = 'Archivo no encontrado';
    return;
  }

  try {
    // 1. Actualizar UI optimizaste (antes de llamar al backend)
    archivos.value = archivos.value.filter(a => a.id !== id);

    // 2. Llamar al backend
    const response = await fetch(`http://localhost:3000/documentos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Si falla, restaurar el archivo en la UI
      archivos.value = [...archivos.value, archivoAEliminar];

      let errorMessage = 'Error al eliminar el archivo';

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (error) {
        error.value = 'Error al procesar la respuesta del servidor';
      }

      throw new Error(errorMessage);
    }

    // 3. Confirmar éxito
    alert('Archivo eliminado exitosamente');
    console.log(`Archivo ${archivoAEliminar.titulo} eliminado correctamente`);

  } catch (error) {
    console.error('Error eliminando archivo:', error);
    alert(`No se pudo eliminar el archivo: ${error.message}`);

    // Asegurar que el archivo esté restaurado si no estaba
    if (!archivos.value.find(a => a.id === id)) {
      archivos.value = [...archivos.value, archivoAEliminar];
    }
  }
}

// => Función helper para formatear el nombre del archivo
function formatearNombreArchivo(filename) {
  if (!filename) return 'Sin nombre';

  const partes = filename.split('-');
  return partes.length > 5 ? partes.slice(5).join('-') : filename;
}

// => Función helper para formatear la fecha
function formatearFecha(fecha) {
  if (!fecha) return 'Fecha no disponible';

  try {
    return new Date(fecha).toLocaleDateString('es-CO', {
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

// => Función para validar URL
function esUrlValida(url) {
  if (!url) return false;
  try {
    new URL(`http://localhost:3000${url}`);
    return true;
  } catch {
    return false;
  }
}

onMounted(() => {
  cargarArchivos();
});

watch(() => props.recargar, (nuevoValor, valorAnterior) => {
  if (nuevoValor && nuevoValor !== valorAnterior) {
    cargarArchivos();
  }
});

defineExpose({
  cargarArchivos,
  archivos: archivos.value,
  cargando: cargando.value,
  error: error.value
});

</script>

<template>
  <section class="mb-20">
    <h2 class="text-2xl text-center font-semibold mb-4">Documentos Subidos</h2>

    <!-- Mostrar mensaje de error -->
    <div v-if="error" class="error-message p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
      <button @click="cargarArchivos" class="ml-2 underline">Reintentar</button>
    </div>

    <!-- Indicador de carga -->
    <div v-if="cargando" class="text-center p-4">
      <span class="loading-text">Cargando archivos...</span>
    </div>

    <!-- Tabla de documentos -->
    <div v-else-if="!error" class="table-container">
      <table class="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th class="p-2">Título</th>
            <th class="p-2">Nombre PDF</th>
            <th class="p-2">Estado</th>
            <th class="p-2">Fecha</th>
            <th class="p-2 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="archivos.length === 0">
            <td colspan="5" class="p-4 text-center">
              No hay archivos disponibles
            </td>
          </tr>

          <tr v-else class="fila_content hover:bg-gray-50 border-b border-gray-200 transition-colors duration-200"
            v-for="item in archivos" :key="item.id">
            <td class="p-2" :title="item.titulo">
              {{ item.titulo || 'Sin título' }}
            </td>
            <td class="p-2" :title="item.filename">
              {{ formatearNombreArchivo(item.filename) }}
            </td>
            <td class="p-2 capitalize">
              {{ item.estado || 'Sin estado' }}
            </td>
            <td class="p-2 text-gray-600 text-sm">
              {{ formatearFecha(item.fecha_subida) }}
            </td>

            <td class=" p-3 btn_container">
              <div class="flex justify-center gap-2">
                <a v-if="esUrlValida(item.url)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm"
                  :href="`http://localhost:3000${item.url}`" target="_blank" rel="noopener noreferrer">
                  Descargar
                </a>
                <span v-else class="mr-3 p-1 text-gray-400">
                  No disponible
                </span>
                <button
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="eliminar(item.id)" :disabled="cargando">
                  Eliminar
                </button>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.error-message {
  animation: fadeIn 0.3s ease-in;
}

.loading-text {
  animation: pulse 1.5s ease-in-out infinite;
}

.table-container {
  overflow-x: auto;
  /* Para tablas responsivas */
}

table {
  border-collapse: collapse;
  width: 100%;

  thead {
    background: var(--gris-suave);
    font-family: var(--fuente-titulo);

    th {
      position: sticky;
      top: 0;
      font-weight: normal;
    }
  }

  tbody {
    font-family: var(--fuente-parrafo);

    &>.fila_content {
      text-align: center;

      &>td {
        border-block-end: 2px solid var(--verde-oscuro);
        max-width: 200px;
        /* Limitar ancho para evitar overflow */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.95em;
      }
    }
  }
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
  table {
    font-size: 0.8rem;
  }

  .btn_container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>