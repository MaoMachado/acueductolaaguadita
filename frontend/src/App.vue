<script setup>
import Header from './components/common/Header.vue';
import Sidebar from './components/common/Sidebar.vue';
import Footer from './components/common/Footer.vue';
import ToastRenderer from './components/ToastRenderer.vue';
</script>

<template>
  <main
    class="flex min-h-screen bg-(--gris-suave-20) text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-all duration-300">
    <ToastRenderer />

    <section class="container_header flex flex-col justify-between h-screen p-2 w-75">
      <Header />
      <Sidebar />
      <Footer />
    </section>

    <main class="container relative overflow-hidden mx-auto">
      <router-view v-slot="{ Component }">
        <transition name="slide-view" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </main>
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
  position: sticky;
  top: 0;

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
}
</style>
