<template>
  <aside>
    <nav class="flex flex-col">
      <RouterLink to="/" class="nav_item" :class="{ active: route.path === '/' }">Inicio</RouterLink>
      <RouterLink to="/documentos" class="nav_item" :class="{ active: route.path === '/documentos' }">Documentos
        Publicos</RouterLink>
      <RouterLink to="/galeria" class="nav_item" :class="{ active: route.path === '/galeria' }">Galería</RouterLink>
      <RouterLink to="/archivos" class="nav_item" :class="{ active: route.path === '/archivos' }">Archivos</RouterLink>
      <RouterLink to="/informeObra" class="nav_item" :class="{ active: route.path === '/informeObra' }">Informe De Obra
      </RouterLink>
      <RouterLink to="/nosotros" class="nav_item" :class="{ active: route.path === '/nosotros' }">Nosotros</RouterLink>
      <RouterLink to="/contactanos" class="nav_item" :class="{ active: route.path === '/contactanos' }">Contactanos
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped>
nav {
  position: relative;
  z-index: 2;
}

.nav_item {
  position: relative;
  padding: 15px 25px;
  border-left: 4px solid transparent;
  font-family: var(--fuente-titulo);
  font-weight: 600;
  transition: all 0.2s linear;

  &:hover {
    padding-left: 30px;
    background: rgba(255, 255, 255, 0.2);
    border-left-color: var(--crema);
  }
}

.nav_item::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background-color: var(--blanco);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav_item:hover::before,
.nav_item.active::before {
  opacity: 1;
}

.nav_item.active {
  background: rgba(255, 255, 255, 0.15);
  border-left-color: var(--crema);
  color: var(--blanco);
  font-weight: 600;
}
</style>