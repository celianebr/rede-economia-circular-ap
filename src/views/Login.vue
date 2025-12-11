<template>
  <div class="container">
    <div class="flex items-center justify-between py-4">
      <div class="text-xl font-bold text-primary">Movimento Lixo Zero Amapá</div>
      <router-link to="/signup" class="text-sm">Cadastrar</router-link>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold mb-3">Entrar</h2>
      <div class="mb-3">
        <label class="block mb-1">E-mail</label>
        <input v-model="email" class="w-full px-3 py-2 rounded" />
      </div>
      <div class="mb-3">
        <label class="block mb-1">Senha</label>
        <input type="password" v-model="password" class="w-full px-3 py-2 rounded" />
      </div>
      <div class="mt-4">
        <button class="w-full px-4 py-2 bg-primary text-white rounded font-semibold hover:opacity-90 transition-opacity" @click="submit" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </div>
      <p class="text-sm mt-3">
        Ainda não tem conta? <router-link to="/signup">Cadastre-se</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { firebaseService as api } from '../services/firebase.js'


const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

async function submit() {
  if (!email.value || !password.value) {
    alert('Preencha todos os campos.')
    return
  }

  loading.value = true
  try {
    await api.login(email.value, password.value)
    router.push('/profile')
  } catch (err) {
    alert('Erro ao entrar: ' + (err.message || err))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.text-primary { color: #16524a; }
.bg-primary { background-color: #16524a; }
</style>
