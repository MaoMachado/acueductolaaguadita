<script setup>
import Header from './components/common/Header.vue';
import Sidebar from './components/common/Sidebar.vue';
import Footer from './components/common/Footer.vue';
</script>

<template>
  <section class="flex min-h-screen">
    <article class="container_header flex flex-col justify-between h-screen">
      <Header />
      <Sidebar />
      <Footer />
    </article>
    <main class="w-screen relative overflow-hidden">
      <transition name="slide-view" mode="out-in">
        <router-view />
      </transition>
    </main>
  </section>
</template>

<style scoped>
.slide-view-enter-active,
.slide-view-leave-active {
  transition: all 0.4s ease;
  position: absolute;
  width: 100%;
  z-index: 1;
}

.slide-view-enter-from {
  opacity: 0;
  transform: translateY(100px);
}

.slide-view-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-view-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-view-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}

.container_header {
  background: linear-gradient(180deg, var(--verde-principal) 0%, var(--verde-claro) 100%);
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  color: var(--blanco);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
    pointer-events: none;
  }

  & main {
    background: linear-gradient(45deg,
        var(--beige-principal),
        var(--blanco));
    background-size: 300% 300%;
    animation: gradienteMovimiento 4s ease infinite;
  }
}

@keyframes gradienteMovimiento {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
