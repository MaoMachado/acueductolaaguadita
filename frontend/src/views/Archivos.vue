<script setup>
import { ref, onMounted } from 'vue';
import SubirImagenDialog from '../components/SubirImagenDialog.vue';
import TablaImagenes from '../components/TablaImagenes.vue';

const mostrarDialogo = ref(false);
const nuevoTitulo = ref('');
const activo = ref(false);
const archivo = ref(null);
const archivos = ref([]);
const cargando = ref(false)

//Salir de la ventana Modal
function cancelar() {
  mostrarDialogo.value = false;
  nuevoTitulo.value = '';
  activo.value = false;
  archivo.value = null;
};

function seleccionarArchivo(e) {
  archivo.value = e.target.files[0];
};

//Cargar la información del backend
async function cargarArchivos() {
  try {
    cargando.value = true;
    const res = await fetch('http://localhost:3000/documentos');

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const data = await res.json();
    archivos.value = data;
  } catch (error) {
    console.log("Error Cargando Los Archivos", error);
    alert('Error Al Cargar Los Archivos')
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarArchivos();
});

async function subirPDF() {
  if (!activo.value) {
    alert('Por favor selecciona un archivo');
    return;
  }

  if (!nuevoTitulo.value.trim()) {
    alert('Por favor escribir un titulo');
    return;
  }

  const formData = new FormData();
  formData.append('file', archivo.value);
  formData.append('titulo', nuevoTitulo.value.trim());

  try {
    cargando.value = true;

    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error el subir el archivo');
    }

    const data = await response.json();
    alert('Archivo subido exitosamente: ', data)

    await cargarArchivos();
    cancelar()
    alert('Archivo subido exitosamente: ', data)

  } catch (error) {
    console.error('Error al subir el PDF: ', error);
    alert('Hubo un problema al subir el archivo')
  } finally {
    cargando.value = false;
  }
};

//Eliminar el archivo del frontend y backend
async function eliminar(id) {
  if (!confirm('¿Estás seguro que deseas eliminar este archivo?')) {
    return;
  }

  // Guardar copia por si falla
  const backup = [...archivos.value];

  // Guardar referencia al archivo por si necesitamos restaurarlo
  const archivoAEliminar = archivos.value.find(a => a.id === id);

  if (!archivoAEliminar) {
    alert('Archivo no encontrado');
    return;
  }

  try {
    // 1. Actualizar UI optimistamente (antes de llamar al backend)
    archivos.value = archivos.value.filter(a => a.id !== id);

    // 2. Llamar al backend
    const response = await fetch(`http://localhost:3000/documentos/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      // Si falla, restaurar el archivo en la UI
      archivos.value = [...archivos.value, archivoAEliminar];
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar el archivo');
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

//Parte de manipulación de las imagenes
const mostrarDialogImagen = ref(false);

function imagenSubida(data) {
  console.log('Imagen subida', data)
}

const recargarTabla = ref(false);
function actualizarTabla() {
  recargarTabla.value = !recargarTabla.value;
}
</script>

<template>
  <section class="max-w-6xl mx-auto p-6 space-y-8">
    <header class="text-center space-y-2">
      <h1 class="text-4xl font-bold ">Gestión De Archivos</h1>
      <p class="text-lg mb-8">
        Consulta y administra los documentos oficiales de la Asociación Acueducto La Aguadita de forma segura y
        organizada.
      </p>
    </header>

    <div class="flex gap-4 ml-4 btn_grupo">
      <button @click="mostrarDialogo = true" :disabled="cargando">
        Crear Enlace
      </button>

      <button @click="mostrarDialogImagen = true" :disabled="cargando">
        Cargar Imagen
      </button>

      <SubirImagenDialog :mostrar="mostrarDialogImagen" @cerrar="mostrarDialogImagen = false"
        @imagenSubida="imagenSubida" @imagen-subida="actualizarTabla" />
    </div>

    <!-- Tabla PDF -->
    <article>
      <h2 class="text-2xl text-center font-semibold mb-4">Documentos Subidos</h2>

      <span v-if="cargando" class="text-center p-4">
        Cargando Archivos...
      </span>

      <table v-else class="w-full text-sm">
        <thead>
          <tr>
            <th class="p-2">Titulo</th>
            <th class="p-2">Nombre PDF</th>
            <th class="p-2">Estado</th>
            <th class="p-2">Fecha</th>
            <th class="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="archivos.length === 0">
            <td colspan="5" class="p-4 text-center">
              No Hay Archivos Disponibles
            </td>
          </tr>
          <tr class="fila_content" v-for="item in archivos" :key="item.id">
            <td class="p-2">{{ item.titulo }}</td>
            <td class="p-2">{{ item.filename.split('-').slice(5).join('-') }}</td>
            <td class="p-2 capitalize">{{ item.estado }}</td>
            <td>{{
              new Date(item.fecha_subida).toLocaleDateString('es-CO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
            }}</td>
            <td class="h-full p-2 btn_container">
              <a class="mr-3 rounded-2xl p-1" :href="`http://localhost:3000${item.url}`" target="_blank">Descargar</a>
              <button class="cursor-pointer rounded-2xl p-1" @click="eliminar(item.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </article>

    <!-- Tabla Imagenes -->
    <TablaImagenes :recargar="recargarTabla" />

    <!-- Modal -->
    <div v-if="mostrarDialogo"
      class="fixed inset-0 bg-black/50 backdrop-blur-xs backdrop-grayscale  flex items-center justify-center z-50">
      <div class="dialog p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4">
        <h2 class="text-xl font-bold text-center">Crear Enlace Con Documento</h2>

        <input v-model="nuevoTitulo" type="text" placeholder="Titulo Del Archivo"
          class="w-full p-2 rounded-xl titulo_archivo" :disabled="cargando" />

        <div class="flex items-center justify-center gap-2 check_grupo">
          <input type="checkbox" id="checkActivo" v-model="activo" class="form-checkbox" :disabled="cargando" />
          <label for="checkActivo">Activar para subir el documento</label>
        </div>

        <div v-if="activo" class="inp_archivo">
          <input type="file" @change="seleccionarArchivo" accept=".pdf" :disabled="cargando" />
        </div>
        <div v-if="archivo" class="text-sm">
          Archivo Seleccionado: {{ archivo.name }}
        </div>
        <div v-else class="texto_pendiente">
          Estado del archivo es pendiente
        </div>

        <div class="flex justify-end gap-2 btn_grupo">
          <button @click="cancelar" class="px-4 py-2 rounded" :disabled="cargando">Cancelar</button>
          <button @click="subirPDF" :disabled="!archivo || !activo || !nuevoTitulo.trim() || cargando"
            class="px-4 py-2 rounded disabled:opacity-50">{{ cargando ? 'Subiendo...' : 'Subir Documento' }}</button>
        </div>
      </div>
    </div>


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

table {

  &>thead {
    background: var(--gris-suave);
    border-block-end: 1px solid var(--beige-oscuro);
    font-family: var(--fuente-titulo);
    font-size: 1.2em;
  }

  &>tbody {
    font-family: var(--fuente-parrafo);
    font-size: 1.1em;

    &>.fila_content {
      text-align: center;
      transition: all 0.2s ease-in-out;

      &:hover {
        background: var(--verde-claro);
        color: var(--crema);
      }

      &>td {
        border-block-end: 2px solid var(--verde-oscuro);
      }

      &>.btn_container {

        & a:hover,
        button:hover {
          background: var(--crema);
          color: var(--verde-oscuro);
          transition: all 0.2s ease-in-out;
        }
      }
    }
  }
}

.btn_grupo {
  &>button {
    padding: 0.4rem;
    border-radius: 0.5rem;
    background: var(--verde-claro);
    color: var(--blanco);
    font-weight: 600;
    font-family: var(--fuente-titulo);
    cursor: pointer;
    transition: all 0.2s linear;

    &:hover {
      background: var(--verde-oscuro);
      outline: 1px solid var(--marron-suave);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(-2px);
    }
  }
}

.dialog {
  background: var(--crema);
  border: 2px solid rgba(0, 0, 0, 0.5);

  & h2 {
    color: var(--verde-oscuro);
  }

  & .titulo_archivo {
    font-family: var(--fuente-parrafo);
    border: 2px solid var(--verde-principal);
  }

  & .check_grupo {
    font-family: var(--fuente-titulo);
    font-size: 1em;
    font-weight: 300;
  }

  & .inp_archivo {
    color: var(--verde-oscuro);
    text-align: center;
    font-family: var(--fuente-titulo);

    &>input[type="file"] {
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 1rem;
      transition: background 0.2s ease-in-out, color 0.2s ease;

      &:hover {
        background: var(--verde-claro);
        color: var(--blanco);
      }
    }
  }

  & .texto_pendiente {
    color: red;
    font-family: var(--fuente-titulo);
    text-align: center;
  }

  & .btn_grupo {
    & button:first-child {
      background-color: red;
    }
  }
}
</style>