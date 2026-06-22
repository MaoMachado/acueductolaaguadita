<script setup>
import { fundadores } from '../../data/fundadores.js';
import { juntaDirectiva } from '../../data/juntaDirectiva.js';

const headerTitle = [
  "text-2xl",
  "font-semibold",
  "text-balance",
  "text-transparent",
  "bg-clip-text",
  "bg-linear-to-r",
  "from-sky-600",
  "to-sky-400",
  "lg:font-bold",
  "lg:text-3xl"
];
</script>

<template>
  <article class="container px-5 md:px-10 lg:px-15">
    <section>
      <header class="flex flex-col gap-4 items-center text-center justify-center h-20">
        <h2 :class="headerTitle">
          SOCIOS FUNDADORES DE LA ASOCIACIÓN USUARIOS ACUEDUCTO LA AGUADITA
        </h2>
      </header>

      <table class="w-full border-collapse">
        <thead class="border border-teal-500/50">
          <tr class="bg-cyan-400/70 text-black dark:bg-cyan-600/50 dark:text-white">
            <th class="p-2 text-lg">Cédula</th>
            <th class="p-2 text-lg" colspan="2">Apellido</th>
            <th class="p-2 text-lg" colspan="2">Nombres</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fundador in fundadores" :key="fundador.cedula" class="border border-teal-500/50">
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ fundador.cedula }}</td>
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ fundador.apellidoUno }}</td>
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ fundador.apellidoDos }}</td>
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ fundador.nombreUno }}</td>
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ fundador.nombreDos }}</td>
          </tr>
        </tbody>
      </table>

      <header class="flex flex-col gap-4 items-center text-center justify-center h-20">
        <h2 :class="headerTitle">
          MIEMBROS DE LA JUNTA DIRECTIVA AÑO 2025
        </h2>
      </header>

      <table class="w-full border-collapse">
        <thead class="border border-teal-500/50">
          <tr class="bg-cyan-400/70 text-black dark:bg-cyan-600/50 dark:text-white">
            <th class="p-2 text-lg">Cédula</th>
            <th class="p-2 text-lg" colspan="2">Apellido</th>
            <th class="p-2 text-lg" colspan="2">Nombres</th>
            <th>Cargo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="directivo in juntaDirectiva" :key="directivo.cedula" class="border border-teal-500/50">
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ directivo.cedula }}</td>
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ directivo.apellidoUno }}</td>
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ directivo.apellidoDos }}</td>
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ directivo.nombreUno }}</td>
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ directivo.nombreDos }}</td>
            <td class="py-2 text-lg text-center border-r border-teal-500/50">{{ directivo.cargo }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </article>
</template>
