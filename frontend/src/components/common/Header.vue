<script setup>
import logo from '../../assets/images/logo.png'
</script>

<template>
  <header class="logo_section">
    <div class="w-25 mx-auto mb-2">
      <img :src="logo" alt="Logo de la empresa Acueducto la Aguadita">
    </div>
    <h1>Asociación Acueducto La Aguadita</h1>
  </header>
</template>

<style scoped>
.logo_section {
  position: relative;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  &>h1 {
    font-size: 1.2em;
    font-weight: 700;
    text-align: center;
  }
}
</style>