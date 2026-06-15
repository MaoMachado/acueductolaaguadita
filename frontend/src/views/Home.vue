<script setup>
import imgMapa from '../assets/images/mapa_fresno.webp'
import Cards from '../components/Cards.vue'
</script>

<template>
  <section class="flex flex-col gap-10 p-6">
    <header class="text-center space-y-2">
      <h1 class="text-2xl text-balance font-semibold lg:font-bold lg:text-5xl">Bienvenido A La Plataforma De Gestión
      </h1>
      <p class="text-lg lg:text-xl">
        Asociación Acueducto Veredal La Aguadita - Fresno, Tolima
      </p>
    </header>

    <article class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      <Cards static="146" title="Usuarios Activos" subtitle="Conectados Al Acueducto" icon="👨‍👩‍👧‍👦" />
      <Cards static="730" title="Población Estimada" subtitle="Conectados Al Acueducto" icon="🗺️" />
      <Cards static="Quebrada Chorro De Isidro" title="Fuente De Agua" subtitle="Ubicado En Fresno, Tolima" icon="💧" />
    </article>

    <figure class="w-9/12 m-auto">
      <img class="w-full" :src="imgMapa" alt="Imagen Del Rio">
      <figcaption class="text-2xl text-center mt-4">
        Ubicación de la fuente principal del agua que se distribuye a todos los usuarios.
      </figcaption>
    </figure>
  </section>
</template>

<style scoped>
header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  position: relative;
  padding-block-end: 0.8rem;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    opacity: 0.5;
    border-radius: 50rem;
    background: linear-gradient(90deg, var(--verde-principal), var(--verde-claro));
  }

  &>h1 {
    color: var(--verde-oscuro);
  }

  &>p {
    color: var(--marron-suave);
    opacity: 0.8;
  }
}


.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--crema);
}

figcaption{
  font-family: (--fuente-titulo);
}
</style>
