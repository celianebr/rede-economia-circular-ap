<template>
  <header class="site-header">
    <div class="header-inner">
      <router-link to="/" class="brand">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.5 6.5a7.5 7.5 0 0 0-11.9 1.9"></path>
          <path d="M4 4v4h4"></path>
          <path d="M6.5 17.5a7.5 7.5 0 0 0 11.9-1.9"></path>
          <path d="M20 20v-4h-4"></path>
        </svg>
        <span class="brand-title">Rede de Agentes</span>
      </router-link>

      <nav class="nav">
        <router-link to="/profile" class="nav-link" :class="{ active: isActive('/profile') }">Meu Perfil</router-link>
        <router-link to="/search" class="nav-link" :class="{ active: isActive('/search') }">Pesquisar membros</router-link>
        <button type="button" class="nav-link nav-button" @click="$emit('logout')">Sair</button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineEmits(['logout'])

const route = useRoute()
function isActive(path) {
  return route.path === path
}
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
.brand-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 16px;
  color: var(--color-text);
}
.nav {
  display: flex;
  align-items: center;
  gap: 32px;
}
.nav-link {
  font-weight: 500;
  font-size: 14.5px;
  color: var(--color-text-2);
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-sans);
}
.nav-link:hover { color: var(--color-accent); }
.nav-link.active { font-weight: 700; color: var(--color-accent); }

@media (max-width: 640px) {
  .header-inner { padding: 16px 20px; }
  .nav { gap: 18px; }
}
</style>
