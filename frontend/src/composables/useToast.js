import { ref } from 'vue';

const mensaje = ref("");
const tipo = ref("success") // success | error
const visible = ref(false);
let timeout = null;

export function useToast() {
  function mostrar(msg, t = 'success') {
    clearTimeout(timeout);
    mensaje.value = msg;
    tipo.value = t;
    visible.value = true;

    timeout = setTimeout(() => visible.value = false, 3000);
  }

  return { mensaje, tipo, visible, mostrar };
}
