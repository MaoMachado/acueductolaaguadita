<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex h-full">
    <!-- Submenu Lateral -->
    <aside class="w-64 h-fit p-4 user-invalid sticky top-4">
      <nav class="flex flex-col space-y-3 font-semibold">
        <RouterLink to="/nosotros" class="link">Quiénes Somos</RouterLink>
        <RouterLink to="/nosotros/valores" class="link">Nuestros Compromisos Y Valores
        </RouterLink>
        <RouterLink to="/nosotros/comunidad" class="link">Representación Para La Comunidad
        </RouterLink>
        <RouterLink to="/nosotros/poe" class="link">Asociación - POE</RouterLink>
        <RouterLink to="/nosotros/poblacion" class="link">Población Beneficiaria</RouterLink>
        <RouterLink to="/nosotros/estrategias" class="link">Estrategia De Educación</RouterLink>
        <RouterLink to="/nosotros/sociosmiembros" class="link">Socios Y Miembros</RouterLink>
      </nav>
    </aside>

    <!-- Contenido  -->
    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.link {
  padding: 0.5rem;
  border-radius: 1rem;
  font-family: var(--fuente-titulo);
  transition: all 0.2s ease-in-out;
}

.link:hover {
  padding: 0.5rem;
  background: var(--crema);
  border-radius: 1rem;
  outline: 1px solid var(--beige-oscuro);
}
</style>