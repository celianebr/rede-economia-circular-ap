<template>
  <div>
    <WelcomeHeader @logout="handleLogout" />
    <main class="container mt-6">
      <div class="card mb-4">
        <h2 class="text-lg font-semibold">Pesquisar membros</h2>
        <p class="text-sm text-gray-600">
          Busque por município e materiais/áreas de interesse.
        </p>

        <div class="mt-3 grid grid-cols-2 gap-2">
          <input
            v-model="filters.municipio"
            placeholder="Município"
            class="px-3 py-2 rounded"
          />
          <select v-model="material" class="px-3 py-2 rounded" @change="updateMaterials">
            <option value="">-- Selecionar material/interesse --</option>
            <option value="reciclagem">Reciclagem</option>
            <option value="compostagem">Compostagem</option>
            <option value="educacao">Educação Ambiental</option>
            <option value="gestao">Gestão de Resíduos</option>
            <option value="empreendedorismo">Empreendedorismo Verde</option>
          </select>
        </div>

        <div class="mt-3">
          <button class="btn" @click="search">Pesquisar</button>
        </div>
      </div>

      <div v-if="results.length === 0" class="card">Nenhum resultado.</div>

      <div v-for="r in results" :key="r.email" class="card mb-3">
        <div class="flex justify-between">
          <div>
            <div class="font-semibold">{{ r.nome || r.email }}</div>
            <div class="text-sm text-gray-600">
              {{ r.municipio || "—" }} • {{ (r.atuacao || []).join(", ") }}
            </div>
            <div class="text-sm">
              Interesses: {{ (r.interesses || []).join(", ") }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import WelcomeHeader from "../components/WelcomeHeader.vue"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../services/firebase.js"
import { firebaseService as api } from '../services/firebase.js'


const router = useRouter()
const filters = ref({ municipio: "" })
const material = ref("")
const results = ref([])

// Atualiza filtro de materiais
function updateMaterials() {
  if (material.value) filters.value.materiais = [material.value]
  else filters.value.materiais = []
}

// Faz a pesquisa no Firestore
async function search() {
  const q = []
  const colRef = collection(db, "perfis")

  if (filters.value.municipio) {
    q.push(where("municipio", "==", filters.value.municipio))
  }
  if (filters.value.materiais && filters.value.materiais.length > 0) {
    q.push(where("interesses", "array-contains-any", filters.value.materiais))
  }

  const queryRef = q.length > 0 ? query(colRef, ...q) : colRef
  const snapshot = await getDocs(queryRef)

  results.value = snapshot.docs.map((d) => d.data())
}

// Controle de login/logout
const auth = getAuth()
onAuthStateChanged(auth, (u) => {
  if (!u) router.push("/login")
})

async function handleLogout() {
  await signOut(auth)
  router.push("/login")
}
</script>
