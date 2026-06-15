<script setup>
import { fundadores } from '../../data/fundadores.js';
import { juntaDirectiva } from '../../data/juntaDirectiva.js'
</script>

<template>
  <article class="container rounded-xl">
    <div class="flex flex-col gap-8 p-4">
      <h2 class="lg:text-4xl font-light mb-2 text-center text-balance">
        SOCIOS FUNDADORES DE LA ASOCIACIÓN USUARIOS ACUEDUCTO LA
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

      <h2 class="lg:text-4xl font-light mb-2 text-center">
        MIEMBROS DE LA JUNTA DIRECTIVA AÑO 2025
      </h2>

      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th>Cédula</th>
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
    </div>
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
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 3px solid var(--beige-oscuro);
}

td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid var(--beige-oscuro);
  font-weight: 300;
}

tr:hover {
  background-color: var(--crema);
  transform: scale(1.005);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}
</style>
