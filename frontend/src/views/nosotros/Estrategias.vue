<script setup>
const headerTitle = [
  "text-2xl",
  "font-semibold",
  "text-balance",
  "text-transparent",
  "bg-clip-text",
  "bg-linear-to-r",
  "from-sky-600",
  "to-sky-400",
  "lg:font-bold",
  "lg:text-3xl"
]
</script>

<template>
  <article class="container px-5 md:px-10 lg:px-15 mt-20">
    <section>
      <ol class="list-none w-fit mx-auto">
        <li class="mb-4">
          <h2 :class="headerTitle">FORMACIÓN EN CULTURA DEL AGUA</h2>
          <ul class="list-disc ml-10 text-sm lg:text-xl font-light">
            <li>
              Realizar talleres participativos sobre el ciclo del agua, importancia de la fuente hídrica y buenas
              prácticas de uso.
            </li>
            <li>
              Promover campañas escolares y comunitarias de sensibilización para reducir el desperdicio y proteger la
              cuenca abastecedora.
            </li>
          </ul>
        </li>

        <li class="mb-4">
          <h2 :class="headerTitle">CAPACITACIÓN EN GESTIÓN DEL RIESGO</h2>
          <ul class="list-disc ml-10 text-sm lg:text-xl font-light">
            <li>
              Entrenar a la comunidad en identificación de amenazas y signos de alerta temprana (turbidez, olores,
              fugas,
              deslizamientos).
            </li>
            <li>
              Desarrollar jornadas de simulacro sobre qué hacer en caso de contaminación, interrupción o colapso del
              sistema.
            </li>
          </ul>
        </li>

        <li class="mb-4">
          <h2 :class="headerTitle">PARTICIPACIÓN EN EL MANTENIMIENTO PREVENTIVO</h2>
          <ul class="list-disc ml-10 text-sm lg:text-xl font-light">
            <li>
              Involucrar a la comunidad en jornadas periódicas de limpieza, reforestación, mantenimiento de la
              infraestructura y protección del cauce.
            </li>
            <li>
              Crear brigadas comunitarias de monitoreo y respuesta, integradas por voluntarios capacitados.
            </li>
          </ul>
        </li>
      </ol>
    </section>
  </article>
</template>
