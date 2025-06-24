<script setup>
import { RouterLink } from 'vue-router';

import { ref } from 'vue';

// Estado para el menú móvil
const menuMovilAbierto = ref(false);

function toggleMenuMovil() {
  menuMovilAbierto.value = !menuMovilAbierto.value;
}

function cerrarMenuMovil() {
  menuMovilAbierto.value = false;
}
</script>

<template>
  <main class="flex h-full relative">
    <div v-if="menuMovilAbierto" @click="cerrarMenuMovil" class="overlay-movil lg:hidden"></div>

    <!-- Submenu Lateral -->
    <aside class="sidebar" :class="{ 'sidebar-abierto': menuMovilAbierto }">
      <div class="sidebar-header">
        <div class="sidebar-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h2 class="sidebar-title">Nosotros</h2>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/nosotros" class="nav-link" @click="cerrarMenuMovil">
          <div class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <span>Quiénes Somos</span>
        </RouterLink>

        <RouterLink to="/nosotros/valores" class="nav-link" @click="cerrarMenuMovil">
          <div class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2Z" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3.09 8.26L12 14.52L20.91 8.26" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M3.09 15.74L12 22L20.91 15.74" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <span>Compromisos Y Valores</span>
        </RouterLink>

        <RouterLink to="/nosotros/comunidad" class="nav-link" @click="cerrarMenuMovil">
          <div class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.6977C21.7033 16.0413 20.9999 15.5741 20.2 15.3654"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M16 3.13C16.8003 3.33866 17.5037 3.80598 18.0098 4.46243C18.5159 5.11888 18.8003 5.92954 18.8003 6.765C18.8003 7.60046 18.5159 8.41112 18.0098 9.06757C17.5037 9.72402 16.8003 10.1913 16 10.4"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <span>Representación Comunidad</span>
        </RouterLink>

        <RouterLink to="/nosotros/poe" class="nav-link" @click="cerrarMenuMovil">
          <div class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <span>Asociación - POE</span>
        </RouterLink>

        <RouterLink to="/nosotros/poblacion" class="nav-link" @click="cerrarMenuMovil">
          <div class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <span>Población Beneficiaria</span>
        </RouterLink>

        <RouterLink to="/nosotros/estrategias" class="nav-link" @click="cerrarMenuMovil">
          <div class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 10V6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V10C3.10457 10 4 10.8954 4 12C4 13.1046 3.10457 14 2 14V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V14C20.8954 14 20 13.1046 20 12C20 10.8954 20.8954 10 22 10Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <span>Estrategia Educación</span>
        </RouterLink>

        <RouterLink to="/nosotros/sociosmiembros" class="nav-link" @click="cerrarMenuMovil">
          <div class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <polyline points="17,11 19,13 23,9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <span>Socios Y Miembros</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="progress-indicator">
          <div class="progress-bar"></div>
        </div>
        <p class="sidebar-footer-text">Conoce más sobre nosotros</p>
      </div>
    </aside>

    <!-- Contenido  -->
    <main class="flex-1 p-6">
      <transition name="slide-view" mode="out-in">
        <router-view />
      </transition>
    </main>
  </main>
</template>

<style scoped>
.slide-view-enter-active,
.slide-view-leave-active {
  transition: all 0.3s ease;
}

.slide-view-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-view-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Layout principal */
.flex {
  display: flex;
}

.h-full {
  height: 100%;
}

.relative {
  position: relative;
}

/* Botón menú móvil */
.btn-menu-movil {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background: var(--verde-principal);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 60;
}

.btn-menu-movil:hover {
  background: var(--verde-oscuro);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: white;
  margin: 2px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px;
}

.menu-abierto .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-abierto .hamburger-line:nth-child(2) {
  opacity: 0;
}

.menu-abierto .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Overlay móvil */
.overlay-movil {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
  backdrop-filter: blur(4px);
}

/* Sidebar */
.sidebar {
  width: 300px;
  background: linear-gradient(135deg, var(--crema) 30%, var(--verde-principal) 100%);
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: scroll;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Sidebar responsive */
@media (max-width: 1023px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    transform: translateX(-100%);
    height: 100vh;
    width: 320px;
  }

  .sidebar-abierto {
    transform: translateX(0);
  }
}

/* Header del sidebar */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.sidebar-icon {
  width: 40px;
  height: 40px;
  background: var(--verde-principal);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--verde-oscuro);
  font-family: var(--fuente-titulo, 'Inter', sans-serif);
  margin: 0;
}

/* Navegación */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 1rem;
  color: var(--gris-claro);
  text-decoration: none;
  font-weight: 500;
  font-family: var(--fuente-titulo);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--verde-principal), var(--verde-claro));
  transition: width 0.3s ease;
  z-index: -1;
}

.nav-link:hover {
  color: var(--verde-oscuro);
  background: rgba(34, 197, 94, 0.1);
  transform: translateX(4px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.nav-link:hover::before {
  width: 4px;
}

.nav-link.router-link-active {
  background: var(--verde-claro);
  color: var(--blanco);
  font-weight: 400;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.nav-link.router-link-active::before {
  width: 100%;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover .nav-icon,
.nav-link.router-link-active .nav-icon {
  opacity: 1;
  transform: scale(1.1);
}

/* Footer del sidebar */
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.5);
}

.progress-indicator {
  width: 100%;
  height: 4px;
  background: rgba(148, 163, 184, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-bar {
  height: 100%;
  width: 20%;
  background: linear-gradient(90deg, var(--verde-principal), var(--verde-claro));
  border-radius: 2px;
  animation: progress-animation 3s ease-in-out infinite;
}

@keyframes progress-animation {

  0%,
  100% {
    width: 20%;
  }

  50% {
    width: 80%;
  }
}

.sidebar-footer-text {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  text-align: center;
  font-style: italic;
}

/* Contenido principal */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
}

.content-wrapper {
  flex: 1;
  padding: 2rem;
  max-width: 100%;
}

@media (max-width: 1023px) {
  .content-wrapper {
    padding: 1rem;
    margin-left: 0;
  }

  .main-content {
    margin-left: 0;
  }
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Scrollbar personalizado */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--sidebar-border);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>