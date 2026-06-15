<script setup>
import ListItem from '../components/ListItem.vue';

const mantenimientoList = [
  {
    subtitle: "Mantenimiento de las Cuencas y la Represa",
    text: "Estamos realizando mantenimiento periódico de las cuencas y la represa para garantizar su funcionalidad y prolongar su vida útil."
  },
  {
    subtitle: "Protección del recurso hídrico",
    text: "Nuestro objetivo es proteger el recurso hídrico y garantizar la calidad del agua."
  }
]

const siembreList = [
  {
    subtitle: "Reforestación",
    text: "Estamos llevando a cabo programas de reforestación en las áreas circundantes a la represa y la cuenca hídrica para proteger el suelo y mejorar la calidad del agua."
  },
  {
    subtitle: "Conservación del medio ambiente",
    text: "Nuestra meta es conservar el medio ambiente y promover la biodiversidad en nuestra zona de influencia."
  }
]

const convitesList = [
  {
    subtitle: "Mantenimiento de los alrededores:",
    text: "Estamos organizando convites comunitarios para realizar mantenimiento a los alrededores de la represa y la cuenca hídrica, incluyendo la eliminación de malezas y la limpieza de áreas comunes."
  },
  {
    subtitle: "Participación comunitaria",
    text: "Fomentamos la participación activa de la comunidad en la gestión del recurso hídrico y la protección del medio ambiente."
  }
]

const mantenimientoTubList = [
  {
    subtitle: "Mantenimiento preventivo:",
    text: "Estamos realizando mantenimiento preventivo y correctivo de la tubería para garantizar la eficiencia y la calidad del servicio de agua."
  },
  {
    subtitle: "Reducción de pérdidas",
    text: "Nuestro objetivo es reducir las pérdidas de agua y mejorar la eficiencia del sistema de suministro."
  }
]

const monitoreo = [
  {
    subtitle: "Monitoreo constante",
    text: "Estamos llevando a cabo un monitoreo constante del caudal y la cuenca hídrica para garantizar la calidad y disponibilidad del agua."
  },
  {
    subtitle: "Gestión sostenible",
    text: "Nuestra meta es gestionar de manera sostenible el recurso hídrico y proteger el medio ambiente para futuras generaciones."
  }
]
</script>

<template>
  <main class="p-2 lg:px-16 lg:py-8">
    <header class="flex flex-col gap-4 mb-6">
      <h2 class="text-center text-balance text-(--verde-oscuro) lg:font-bold lg:text-3xl">Informe de Obras en Ejecución
        en la Asociación Acueducto La Aguadita</h2>

      <div class="border border-(--beige-oscuro-40) rounded-full" />

      <p class="text-justify text-(--marron-suave) lg:text-xl">
        La Asociación Acueducto La Aguadita está comprometida con la gestión sostenible y eficiente del recurso hídrico
        en nuestra comunidad. A continuación, se presentan las obras en ejecución que estamos llevando a cabo para
        garantizar la calidad y disponibilidad del agua para nuestros usuarios:
      </p>
    </header>

    <article>
      <div>
        <ol class="flex flex-col gap-4 list-decimal ml-4">
          <ListItem title="Mantenimiento de las Cuencas y la Represa" :items="mantenimientoList" />
          <ListItem title="Siembra de Árboles" :items="siembreList" />
          <ListItem title="Convites Comunitarios" :items="convitesList" />
          <ListItem title="Mantenimiento de la Tubería" :items="mantenimientoTubList" />
          <ListItem title="Monitoreo del Caudal y la Cuenca Hídrica" :items="mantenimientoTubList" />
        </ol>
      </div>
    </article>

    <footer class="mt-6 bg-(--crema-60) p-3 rounded-lg">
      <div>
        <p class="text-justify font-light lg:text-lg text-(--marron-suave)">
          Estas obras en ejecución demuestran nuestro compromiso con la gestión sostenible y eficiente del recurso
          hídrico en nuestra comunidad. Estamos trabajando arduamente para garantizar la calidad y disponibilidad
          del
          agua para nuestros usuarios y proteger el medio ambiente.
        </p>
      </div>
    </footer>
  </main>
</template>
