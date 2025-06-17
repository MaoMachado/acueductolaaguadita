<script setup>
import { fundadores } from '../../data/fundadores.js';
import { juntaDirectiva } from '../../data/juntaDirectiva.js'
</script>

<template>
  <article class="m-auto rounded-xl overflow-hidden">
    <h2 class="text-xl font-semibold mb-2 text-center p-5">
      SOCIOS FUNDADORES DE LA ASOCIACION USUARIOS ACUEDUCTO LA
      AGUADITA
    </h2>

    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th>Cedula</th>
          <th colspan="2">Apellido</th>
          <th colspan="2">Nombres</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fundador in fundadores" :key="fundador.cedula" class="border-b">
          <td>{{ fundador.cedula }}</td>
          <td>{{ fundador.apellidoUno }}</td>
          <td>{{ fundador.apellidoDos }}</td>
          <td>{{ fundador.nombreUno }}</td>
          <td>{{ fundador.nombreDos }}</td>
        </tr>
      </tbody>
    </table>

    <h2 class="text-xl font-semibold mb-2 text-center p-5">
      MIEMBROS DE LA JUNTA DIRECTIVA AÑO 2025
    </h2>

    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th>Cedula</th>
          <th colspan="2">Apellido</th>
          <th colspan="2">Nombres</th>
          <th>Cargo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="directivo in juntaDirectiva" :key="directivo.cedula" class="border-b">
          <td>{{ directivo.cedula }}</td>
          <td>{{ directivo.apellidoUno }}</td>
          <td>{{ directivo.apellidoDos }}</td>
          <td>{{ directivo.nombreUno }}</td>
          <td>{{ directivo.nombreDos }}</td>
          <td>{{ directivo.cargo }}</td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<style scoped>
table {
  background-color: var(--blanco);
  border-radius: 1rem;
  overflow: hidden;
}

th {
  padding: 15px 12px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-bottom: 3px solid var(--beige-oscuro);
}

td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid var(--beige-oscuro);
  font-weight: 500;
}

tr:hover {
  background-color: var(--verde-claro);
  transform: scale(1.005);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}
</style>