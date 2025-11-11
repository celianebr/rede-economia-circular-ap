<template>
  <header class="container flex items-center justify-between py-4">
    <div class="flex items-center gap-3">
      <img src="/logo.png" alt="Lixo Zero Amapá" class="h-12 w-12 rounded-full"/>
      <div>
        <div class="text-lg font-bold text-lz-primary">Movimento Lixo Zero Amapá</div>
        <div class="text-sm text-gray-600">Rede de Agentes</div>
      </div>
    </div>
    <nav class="flex items-center gap-4">
      <router-link to="/profile" class="text-sm">Meu Perfil</router-link>
      <router-link to="/search" class="text-sm">Pesquisar membros</router-link>
      <button class="btn" @click="$emit('logout')">Sair</button>
    </nav>
  </header>
</template>
<script setup>
defineEmits(['logout'])
</script>
<style scoped>
.text-lz-primary{ color: #08748C; font-weight:700; }
</style>
