<template>
  <footer class="site-footer">
    <span>
      © {{ year }} Instituto Movimento Lixo Zero do Amapá — IMOLIZEAP
      <template v-if="showLink">
        · <router-link to="/quem-somos">Quem somos e contato</router-link>
      </template>
    </span>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  showLink: { type: Boolean, default: true },
})

const year = computed(() => new Date().getFullYear())
</script>

<style scoped>
.site-footer {
  padding: 18px 64px;
  text-align: center;
  border-top: 1px solid var(--color-border);
  font-size: 12.5px;
  color: var(--color-text-3);
}
.site-footer :deep(a) {
  color: var(--color-text-3);
  text-decoration: underline;
}
.site-footer :deep(a:hover) { color: var(--color-accent); }
</style>
