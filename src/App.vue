<script setup>
import Header from './components/common/Header.vue';
import Sidebar from './components/common/Sidebar.vue';

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <div class="flex flex-1">
      <Sidebar />
      <main class="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <router-view />
      </main>
    </div>

  </div>
</template>

<style scoped></style>
