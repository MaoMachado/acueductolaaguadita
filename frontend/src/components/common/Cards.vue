<script setup>
defineProps({
  static: String,
  title: String,
  subtitle: String,
  icon: String
})
</script>

<template>
  <article
    class="flex flex-col justify-between gap-6 p-4 rounded-2xl shadow-xl border-2 border-sky-700 dark:border-sky-300/60 hover:border-teal-500 transition-all duration-300">
    <p class="text-xl font-semibold text-center lg:text-2xl">{{ static }}</p>
    <div class="flex justify-between items-center">
      <div>
        <h3 class="font-semibold text-lg lg:font-bold dark:text-sky-400 tracking-wider">{{ title }}</h3>
        <p class="text-[15px] text-(--marron-suave)/70 tracking-wider">{{ subtitle }}</p>
      </div>
      <span class="text-2xl">{{ icon }}</span>
    </div>
  </article>
</template>

<style scoped>
article {
  position: relative;
  overflow: hidden;
  background: transparent;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: var(--azul-claro-20);
    transition: height .3s ease;
  }

  &:hover::before {
    height: 100%;
  }
}
</style>
