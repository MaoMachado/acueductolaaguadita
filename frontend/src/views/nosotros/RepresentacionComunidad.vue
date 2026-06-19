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
  <main class="grid place-content-center container h-full px-6">
    <section class="bg-(--gris-suave-40) rounded-lg flex flex-col gap-6">
      <header>
        <h2 class="text-2xl text-center">{{ data.title }}</h2>
      </header>
      <article class="px-6">
        <ul v-for="item in data.items" :key="item.title" class="ml-4 text-base list-disc">
          <li><strong>{{ item.title }}</strong> {{ item.text }}</li>
        </ul>
      </article>
    </section>
  </main>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  padding-block: 2.5rem;
  border-bottom: 2px solid var(--beige-oscuro-40);
  background: var(--beige-principal-20);
}
</style>
