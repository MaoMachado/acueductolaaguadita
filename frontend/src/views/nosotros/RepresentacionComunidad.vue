<script setup>
const data = {
  title: "La Asociación Acueducto La Aguadita Veredal representa para la comunidad:",
  items: [
    {
      title: "Acceso Al Agua:",
      text: "Garantizar el acceso al agua para consumo humano, mejorando la calidad de vida de los habitantes."
    },
    {
      title: "Gestión Sostenible:",
      text: "Promover prácticas sostenibles en la gestión del agua, protegiendo los recursos hídricos para futuras generaciones."
    },
    {
      title: "Participación Comunitaria:",
      text: "Fomentar la participación activa de la comunidad en la toma de decisiones y la gestión del acueducto."
    },
    {
      title: "Transparencia Y Rendición De Cuentas:",
      text: "Asegurar la transparencia en nuestras acciones y decisiones, rindiendo cuentas a la comunidad sobre nuestra gestión."
    }
  ]
}
</script>

<template>
  <article class="container h-full px-5 md:px-10 lg:px-15">
    <section class="flex flex-col gap-6">
      <header class="text-center h-50 place-content-center">
        <h2
          class="text-2xl font-semibold lg:font-bold text-balance lg:text-5xl text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-sky-400">
          {{ data.title }}
        </h2>
      </header>
      <article>
        <ul class="text-base list-disc mx-auto w-fit">
          <li v-for="item in data.items" :key="item.title" class="lg:text-xl mb-2">
            <strong class="text-lg text-cyan-800 dark:text-cyan-200 lg:text-xl">{{ item.title }}</strong>
            {{ item.text }}
          </li>
        </ul>
      </article>
    </section>
  </article>
</template>
