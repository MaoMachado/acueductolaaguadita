<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>
  <aside class="bg-beige-principal h-full w-64 p-4 shadow-md">
    <nav class="flex flex-col gap-4">
      <RouterLink to="/" class="hover:text-green-700 font-semibold">Inicio</RouterLink>
      <RouterLink to="/galeria" class="hover:text-green-700 font-semibold">Galería</RouterLink>
      <RouterLink to="/archivos" class="hover:text-green-700 font-semibold">Archivos</RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
aside {
  background-color: var(--beige-principal);
}
</style>