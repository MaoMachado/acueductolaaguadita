<script setup>
defineProps({
  title: String,
  items: Array
})
</script>

<template>
  <li class="lg:text-xl">
    <h3 class="text-(--verde-oscuro)">{{ title }}</h3>
    <ul class="list-disc ml-4">
      <li v-for="item in items" :key="item.subtitle">
        <p class="lg:text-lg">
          <span class="text-(--verde-claro) font-semibold">{{ item.subtitle }}: </span>
          {{ item.text }}
        </p>
      </li>
    </ul>
  </li>
</template>
