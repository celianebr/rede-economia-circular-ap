<template>
  <div>
    <WelcomeHeader @logout="handleLogout" />
    <main class="container mt-6">
      <div class="card mb-4">
        <h1 class="text-xl font-semibold">
          Bem-vindo(a), <strong>{{ profile.nome || userId }}</strong>!
        </h1>
        <p class="text-sm text-gray-600">
          Você agora faz parte da Rede de Agentes da Economia Circular do Amapá.
          Complete ou atualize seu perfil abaixo.
        </p>
      </div>

      <ProfileForm :initialProfile="profile" :userId="userId" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import WelcomeHeader from "../components/WelcomeHeader.vue"
import ProfileForm from "../components/ProfileForm.vue"
import { salvarPerfil, buscarPerfil } from "../services/firestoreService.js"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { firebaseService as api } from '../services/firebase.js'


const router = useRouter()
const profile = ref({})
const userId = ref("")

onMounted(() => {
  const auth = getAuth()

  onAuthStateChanged(auth, async (u) => {
    if (!u) {
      router.push("/login")
      return
    }

    userId.value = u.uid
    const data = await buscarPerfil(userId.value)
    profile.value =
      data || { nome: u.displayName || u.email || "Usuário", email: u.email }
  })
})

async function handleLogout() {
  const auth = getAuth()
  await signOut(auth)
  router.push("/login")
}
</script>
