<script setup>
import imgMapa from '../assets/images/mapa_fresno.webp'
import Cards from '../components/common/Cards.vue'
</script>

<template>
  <section class="flex flex-col gap-3 px-5 md:px-10 lg:px-15">
    <header class="flex flex-col gap-4 items-center text-center justify-center h-50">
      <h1
        class="text-2xl font-semibold lg:font-bold lg:text-5xl text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-sky-400 text-shadow-sm text-shadow-white/10">
        Bienvenido A La Plataforma De Gestión
      </h1>
      <p class="text-lg text-cyan-800 dark:text-cyan-200 lg:text-xl">
        Asociación Acueducto Veredal La Aguadita - Fresno, Tolima
      </p>
    </header>

    <article class="p-6 flex flex-col gap-10">
      <article class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <Cards static="146" title="Usuarios Activos" subtitle="Conectados Al Acueducto" icon="👨‍👩‍👧‍👦" />
        <Cards static="730" title="Población Estimada" subtitle="Conectados Al Acueducto" icon="🗺️" />
        <Cards static="Quebrada Chorro De Isidro" title="Fuente De Agua" subtitle="Ubicado En Fresno, Tolima"
          icon="💧" />
      </article>

      <figure class="w-fit mx-auto">
        <div class="mx-auto w-4/5 rounded-xl overflow-hidden">
          <img class="w-full" :src="imgMapa" alt="Imagen Del Rio">
        </div>
        <figcaption class="text-2xl text-center mt-4">
          Ubicación de la fuente principal del agua que se distribuye a todos los usuarios.
        </figcaption>
      </figure>
    </article>
  </section>
</template>
