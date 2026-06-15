<script setup>
defineProps({
  static: String,
  title: String,
  subtitle: String,
  icon: String
})
</script>

<template>
  <article class="p-4 rounded-xl shadow-xl border border-(--verde-claro-40) hover:border-(--verde-claro-80) card">
    <p class="text-xl font-semibold text-center text-(--verde-principal) lg:text-2xl">{{ static }}</p>
    <div class="flex justify-between items-center">
      <div>
        <h3 class="font-semibold lg:text-lg lg:font-bold">{{ title }}</h3>
        <p class="text-sm text-(--marron-suave)/70">{{ subtitle }}</p>
      </div>
      <span class="text-2xl">{{ icon }}</span>
    </div>
  </article>
</template>
