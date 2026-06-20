<script setup>
import { useToast } from '../composables/useToast.js';
const { mensaje, tipo, visible } = useToast();
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed top-4 right-4 z-9999 px-6 py-3 rounded-lg shadow-lg text-white text-sm transition-all
duration-300" :class="tipo === 'success' ? 'bg-green-600' : 'bg-red-600'">
      {{ mensaje }}
    </div>
  </Teleport>
</template>
