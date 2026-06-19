<script setup>
import imgMapa from '../assets/images/mapa_fresno.webp'
import Cards from '../components/Cards.vue'
</script>

<template>
  <main class="flex flex-col gap-3">
    <header class="flex flex-col gap-4 items-center text-center shadow">
      <h1
        class="text-2xl font-semibold lg:font-bold lg:text-5xl text-transparent bg-clip-text bg-linear-to-r from-(--verde-oscuro-60) to-(--verde-oscuro)">
        Bienvenido A La Plataforma De Gestión
      </h1>
      <p class="text-lg text-(--marron-suave) lg:text-xl">
        Asociación Acueducto Veredal La Aguadita - Fresno, Tolima
      </p>
    </header>

    <section class="p-6 flex flex-col gap-4">
      <article class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <Cards static="146" title="Usuarios Activos" subtitle="Conectados Al Acueducto" icon="👨‍👩‍👧‍👦" />
        <Cards static="730" title="Población Estimada" subtitle="Conectados Al Acueducto" icon="🗺️" />
        <Cards static="Quebrada Chorro De Isidro" title="Fuente De Agua" subtitle="Ubicado En Fresno, Tolima"
          icon="💧" />
      </article>

      <figure>
        <img class="w-full" :src="imgMapa" alt="Imagen Del Rio">
        <figcaption class="text-2xl text-center mt-4">
          Ubicación de la fuente principal del agua que se distribuye a todos los usuarios.
        </figcaption>
      </figure>
    </section>
  </main>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  padding-block: 5rem;
  border-bottom: 2px solid var(--beige-oscuro-40);
  background: var(--beige-principal-20);
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--crema);
}

figcaption {
  font-family: (--fuente-titulo);
}
</style>
