<template>
  <header class="site-header">
    <div class="header-inner">
      <router-link to="/" class="brand">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.5 6.5a7.5 7.5 0 0 0-11.9 1.9"></path>
          <path d="M4 4v4h4"></path>
          <path d="M6.5 17.5a7.5 7.5 0 0 0 11.9-1.9"></path>
          <path d="M20 20v-4h-4"></path>
        </svg>
        <span class="brand-text">
          <span class="brand-title">Mapa dos Agentes da Economia Circular do Amapá</span>
          <span class="brand-subtitle">Instituto Movimento Lixo Zero Amapá</span>
        </span>
      </router-link>

      <nav class="nav">
        <router-link
          v-if="showNav"
          to="/quem-somos"
          class="nav-link"
          :class="{ active: route.path === '/quem-somos' }"
        >Quem somos</router-link>
        <router-link to="/login" class="btn-outline">Entrar</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineProps({
  showNav: { type: Boolean, default: true },
})

const route = useRoute()
</script>

<style scoped>
.site-header {
  background: #FFFFFF;
  border-bottom: 1px solid var(--color-border);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 64px;
  max-width: 1440px;
  margin: 0 auto;
  gap: 16px;
  flex-wrap: wrap;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.brand-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  color: var(--color-text);
}
.brand-subtitle {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--color-text-3);
}
.nav {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-link {
  font-weight: 500;
  font-size: 14.5px;
  color: var(--color-text-2);
  text-decoration: none;
}
.nav-link:hover { color: var(--color-accent); }
.nav-link.active { font-weight: 700; color: var(--color-accent); }

@media (max-width: 640px) {
  .header-inner { padding: 16px 20px; }
  .brand-subtitle { display: none; }
}
</style>
