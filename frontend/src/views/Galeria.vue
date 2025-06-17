<template>
  <section class="max-w-6xl mx-auto p-6 space-y-8">
    <header class="text-center space-y-2">
      <h1 class="text-4xl font-bold ">Galeria De Evidencias Comunitarias</h1>
      <p class="text-lg mb-8">
        Fotografías y registros visuales de las actividades de la Asociación Acueducto La Aguadita.
      </p>
    </header>
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
</style>