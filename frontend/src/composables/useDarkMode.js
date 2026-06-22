import { ref, watchEffect } from "vue";

const isDark = ref(localStorage.getItem('theme') === 'dark');

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})


export function useDarkMode() {
  function toggleDark() {
    isDark.value = !isDark.value;
  }

  return { isDark, toggleDark }
}
