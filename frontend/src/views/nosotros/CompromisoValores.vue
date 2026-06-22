<script setup>
const data = {
  compromiso: {
    title: "Nuestro Compromiso",
    subtitle: "Nos comprometemos a:",
    items: [
      "Proporcionar agua para consumo humano de manera eficiente y sostenible.",
      "Garantizar la calidad del agua para consumo humano.",
      "Promover la participación ciudadana y la transparencia en nuestras acciones.",
      "Proteger los recursos hídricos y contribuir al bienestar y desarrollo de nuestra comunidad."
    ]
  },
  valores: {
    title: "Nuestros Valores Corporativos",
    subtitle: "Responsabilidad",
    items: [
      "Asumir la responsabilidad de proporcionar agua para consumo humano de manera eficiente y sostenible.",
      "Estar comprometidos con la comunidad y con la protección de los recursos hídricos.",
      "Actuar con transparencia en nuestras acciones y decisiones, rindiendo cuentas a la comunidad sobre nuestra gestión.",
      "Fomentar la participación activa de la comunidad en la toma de decisiones y la gestión del acueducto."
    ]
  }
}
</script>

<template>
  <article class="container h-full px-5 md:px-10 lg:px-15">
    <section class="flex flex-col gap-8">
      <article>
        <header class="flex flex-col gap-4 items-center text-center justify-center h-30 mb-10">
          <h2
            class="text-2xl font-semibold lg:font-bold lg:text-5xl text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-sky-400">
            {{ data.compromiso.title }}</h2>
          <h3 class="text-lg text-cyan-800 dark:text-cyan-200 lg:text-xl">{{ data.compromiso.subtitle }}</h3>
        </header>
        <ol class="list-none text-center">
          <li v-for="item in data.compromiso.items" :key="item" class="lg:text-2xl mb-2">
            <p>{{ item }}</p>
          </li>
        </ol>
      </article>

      <article class="flex flex-col gap-3">
        <header class="flex flex-col gap-4 items-center text-center justify-center h-30">
          <h2
            class="text-2xl font-semibold lg:font-bold lg:text-5xl text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-sky-400">
            {{ data.valores.title }}
          </h2>
        </header>
        <ol class="list-none w-fit mx-auto">
          <li v-for="item in data.valores.items" :key="item" class="lg:text-xl mb-2">
            <p>
              <strong class="text-lg text-cyan-800 dark:text-cyan-200 lg:text-xl">{{ data.valores.subtitle }}: </strong>
              {{ item }}
            </p>
          </li>
        </ol>
      </article>
    </section>
  </article>
</template>
