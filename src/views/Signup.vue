<template>
  <div class="container">
    <div class="flex items-center justify-between py-4">
      <div class="text-xl font-bold text-lz-primary">Movimento Lixo Zero Amapá</div>
      <router-link to="/login" class="text-sm">Entrar</router-link>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold mb-3">Cadastrar</h2>
      <div class="mb-3">
        <label class="block mb-1">Nome completo</label>
        <input v-model="name" class="w-full px-3 py-2 rounded" />
      </div>
      <div class="mb-3">
        <label class="block mb-1">E-mail</label>
        <input v-model="email" class="w-full px-3 py-2 rounded" />
      </div>
      <div class="mb-3">
        <label class="block mb-1">Senha</label>
        <input type="password" v-model="password" class="w-full px-3 py-2 rounded" />
      </div>
      <div class="mt-4">
        <button class="btn" @click="submit" :disabled="loading">{{ loading ? 'Aguarde...' : 'Cadastrar' }}</button>
      </div>
      <p class="text-sm mt-3">Já tem conta? <router-link to="/login">Entrar</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { firebaseService as api } from '../services/firebase.js'


const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

async function submit() {
  if (!name.value || !email.value || !password.value) {
    alert('Preencha todos os campos obrigatórios.')
    return
  }

  loading.value = true
  const auth = getAuth()
  const db = getFirestore()

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    await setDoc(doc(db, 'users', user.uid), {
      name: name.value,
      email: email.value,
      createdAt: new Date()
    })

    router.push('/profile')
  } catch (err) {
    alert('Erro ao cadastrar: ' + (err.message || err))
  } finally {
    loading.value = false
  }
}
</script>
