<script setup>
import imgMapa from '../assets/images/mapa_fresno.webp'
</script>

<template>
  <section class="max-w-6xl mx-auto p-6 space-y-8">
    <header class="text-center space-y-2">
      <h1 class="text-4xl font-bold ">Bienvenido A La Plataforma De Gestión</h1>
      <p class="text-lg mb-8">
        Asociación Acueducto Veredal La Aguadita - Fresno, Tolima
      </p>
    </header>

    <article class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      <div class="p-4 rounded-xl shadow-xl card">
        <h3 class="text-lg font-bold">Usuario Activos <span class="text-xl icono">👨‍👩‍👧‍👦</span></h3>
        <p class="text-3xl font-bold ">146 </p>
        <p class="text-sm subtitulo">Conectados Al Acueducto</p>
      </div>

      <div class="p-4 rounded-xl shadow-xl card">
        <h3 class="text-lg font-bold">Población Estimada <span class="text-xl icono">🗺️</span></h3>
        <p class="text-3xl font-bold ">730</p>
        <p class="text-sm subtitulo">Habitantes Beneficiados</p>
      </div>

      <div class="p-4 rounded-xl shadow-xl card">
        <h3 class="text-lg font-bold">Fuente De Agua <span class="text-xl icono">💧</span></h3>
        <p class="text-md font-bold ">Quebrada Chorro De Isidro</p>
        <p class="text-sm subtitulo">Ubicado En Fresno, Tolima</p>
      </div>
    </article>

    <figure class="w-9/12 m-auto">
      <img class="w-full" :src="imgMapa" alt="Imagen Del Rio">
      <figcaption class="text-center text-xl font-light mt-2 p-1 shadow rounded-sm">
        Ubicación de la fuente principal del agua que se distribuye a todos los usuarios.
      </figcaption>
    </figure>
  </section>
</template>

<style scoped>
header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--verde-principal), var(--verde-claro));
  }

  &>h1 {
    color: var(--verde-oscuro);
  }

  &>p {
    color: var(--marron-suave);
    font-weight: 400;
  }
}


.card {
  background: var(--crema);

  &>h3 {
    color: var(--verde-oscuro);

    &>span {
      background: var(--verde-oscuro);
      border-radius: 50%;
      padding: 0.2rem;
      margin-inline-start: 1rem;
    }
  }

  &>.subtitulo {
    color: var(--marron-suave);
  }
}

figcaption {
  font-family: var(--fuente-titulo);
  background: var(--crema);
}
</style>