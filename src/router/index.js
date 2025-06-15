import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Galeria from '../views/Galeria.vue';
import Archivos from '../views/Archivos.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/galeria', name: 'Galeria', component: Galeria },
  { path: '/archivos', name: 'Archivos', component: Archivos }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})