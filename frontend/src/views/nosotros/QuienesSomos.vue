<template>
  <main class="border h-full">
    <section class="h-full flex flex-col gap-2">
      <header>
        <h2 class="text-4xl text-center">Asociación Acueducto La Aguadita</h2>
      </header>

      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6 p-6">
        <article>
          <h2 class="text-2xl font-semibold mb-2">Quienes Somos</h2>
          <p class="ml-3 italic">
            La Asociación Acueducto La Aguadita es una entidad sin ánimo de lucro que se dedica a proporcionar agua para
            consumo humano a la comunidad de La Aguadita. Con una trayectoria de servicio y compromiso con la comunidad,
            nuestra asociación se enfoca en garantizar el acceso al agua para consumo humano de manera eficiente y
            sostenible.
          </p>
        </article>

        <article>
          <h2 class="text-2xl font-semibold mb-2">Nuestra Historia</h2>
          <p class="ml-3 italic">
            Nuestra asociación nació de la necesidad de la comunidad de contar con un servicio de agua confiable y de
            calidad. A lo largo de los años, hemos trabajado arduamente para mejorar la gestión del agua y garantizar su
            disponibilidad para todos los miembros de la comunidad.
          </p>
        </article>

        <article>
          <h2 class="text-2xl font-semibold mb-2">Misión</h2>
          <p class="ml-3 italic">
            La Asociación Acueducto La Aguadita Veredal tiene como misión proporcionar agua para consumo humano a la
            comunidad, garantizando su disponibilidad y accesibilidad de manera eficiente y sostenible. Nos
            comprometemos
            a
            gestionar de manera responsable nuestros recursos, promoviendo la participación ciudadana y la transparencia
            en
            nuestras acciones.
          </p>
        </article>

        <article>
          <h2 class="text-2xl font-semibold mb-2">Visión</h2>
          <p class="ml-3 italic">
            Nuestra visión es ser una entidad líder en la gestión de agua para consumo humano en nuestra comunidad,
            reconocida por nuestra eficiencia y compromiso con la calidad del servicio. Buscamos garantizar el acceso
            universal al agua para consumo humano, protegiendo los recursos hídricos y contribuyendo al bienestar y
            desarrollo de nuestra comunidad.
          </p>
        </article>
      </div>

      <footer class="flex justify-center bg-(--gris-suave) rounded-lg">
        <div class="w-fit py-3">
          <h2 class="text-2xl font-semibold mb-2 text-(--verde-oscuro)">Contacto</h2>
          <p class="text-(--marron-suave)">
            <strong>Representante: </strong> Hidelfonso Calderón Ospina <br>
            <strong>Teléfono: </strong> 319 527 5438 <br>
            <strong>Email: </strong> juntaacueductoaguadita2024@gmail.com <br>
            <strong>Dirección: </strong> Vereda La Aguadita, Municipio De Fresno, Tolima.
          </p>
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  padding-block: 5rem;
  border-bottom: 2px solid var(--beige-oscuro-40);
  background: var(--beige-principal-20);
}
</style>
