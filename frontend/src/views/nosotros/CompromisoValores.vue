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
  <main class="grid place-content-center container h-full p-4">
    <div class="flex flex-col gap-8">
      <article>
        <h2 class="text-2xl text-center font-semibold mb-2">{{ data.compromiso.title }}</h2>
        <h3 class="mb-2 text-lg ml-4">{{ data.compromiso.subtitle }}</h3>
        <ol class="list-none border-2 border-(--beige-oscuro-20) rounded-xl p-2 w-fit">
          <li v-for="item in data.compromiso.items" :key="item">
            <p>{{ item }}</p>
          </li>
        </ol>
      </article>

      <article>
        <h2 class="text-2xl text-center font-semibold mb-2">{{ data.valores.title }}</h2>
        <ol class="list-none border-2 border-(--beige-oscuro-20) rounded-xl p-2 w-fit">
          <li v-for="item in data.valores.items" :key="item">
            <p>
              <strong>{{ data.valores.subtitle }}: </strong>
              {{ item }}
            </p>
          </li>
        </ol>
      </article>
    </div>
  </main>
</template>
