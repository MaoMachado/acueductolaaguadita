<template>
  <aside class="h-full w-64">
    <nav class="flex flex-col">
      <RouterLink to="/" class="nav_item active">Inicio</RouterLink>
      <RouterLink to="/galeria" class="nav_item">Galería</RouterLink>
      <RouterLink to="/archivos" class="nav_item">Archivos</RouterLink>
      <RouterLink to="/nosotros" class="nav_item">Nosotros</RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const navItems = document.querySelectorAll('.nav_item');
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navItems.forEach(nav => {
      nav.classList.remove('active');
    });

    item.classList.add('active')
  })
});
</script>

<style scoped>
nav {
  padding: 20px 0;
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