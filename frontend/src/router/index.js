import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Galeria from '../views/Galeria.vue';
import DocumentosPublico from '../views/DocumentosPublico.vue';
import Archivos from '../views/Archivos.vue';
import InformeObra from '../views/InformeObra.vue';
import Contactanos from '../views/Contactanos.vue';


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/documentos', name: 'DocumentosPublicos', component: DocumentosPublico },
  { path: '/galeria', name: 'Galeria', component: Galeria },
  { path: '/informeObra', name: 'InformeObra', component: InformeObra },
  { path: '/archivos', name: 'Archivos', component: Archivos },
  {
    path: '/nosotros',
    component: () => import('../views/nosotros/NosotrosLayout.vue'),
    children: [
      {
        path: '',
        name: 'QuienesSomos',
        component: () => import('../views/nosotros/QuienesSomos.vue')
      },
      {
        path: 'valores',
        name: 'CompromisoValores',
        component: () => import('../views/nosotros/CompromisoValores.vue')
      },
      {
        path: 'comunidad',
        name: 'RepresentacionComunidad',
        component: () => import('../views/nosotros/RepresentacionComunidad.vue')
      },
      {
        path: 'poe',
        name: 'POE',
        component: () => import('../views/nosotros/POE.vue')
      },
      {
        path: 'poblacion',
        name: 'PoblacionBeneficiaria',
        component: () => import('../views/nosotros/PoblacionBeneficiaria.vue')
      },
      {
        path: 'estrategias',
        name: 'Estrategias',
        component: () => import('../views/nosotros/Estrategias.vue')
      },
      {
        path: 'sociosmiembros',
        name: 'SociosMiembros',
        component: () => import('../views/nosotros/SociosMiembros.vue')
      }
    ]
  },
  { path: '/contactanos', name: 'Contactanos', component: Contactanos }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})