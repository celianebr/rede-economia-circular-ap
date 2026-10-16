<template>
  <div class="card mb-4" v-if="!loading">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold">Interesses recebidos</h2>
      <span v-if="naoLidos > 0" class="text-xs font-bold bg-primary text-white rounded-full px-2 py-0.5">
        {{ naoLidos }} novo{{ naoLidos === 1 ? '' : 's' }}
      </span>
    </div>

    <p v-if="interesses.length === 0" class="text-sm text-gray-500">
      Ninguém demonstrou interesse em contato ainda. Quando alguém clicar em "Tenho interesse em contato"
      no seu perfil público, o aviso aparece aqui.
    </p>

    <ul v-else class="space-y-3">
      <li
        v-for="item in interesses"
        :key="item.id"
        class="border rounded p-3"
        :class="item.lido ? 'bg-white' : 'bg-green-50 border-green-200'"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold text-sm">
              {{ item.deNome }}
              <span v-if="!item.lido" class="text-xs font-bold text-primary ml-1">&bull; novo</span>
            </p>
            <p v-if="item.mensagem" class="text-sm text-gray-600 mt-1">{{ item.mensagem }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ formatarData(item.criadoEm) }}</p>
          </div>
          <div class="flex flex-col items-end gap-1 flex-shrink-0">
            <router-link :to="'/u/' + item.deId" class="text-xs text-primary font-semibold hover:underline whitespace-nowrap">
              Ver perfil →
            </router-link>
            <button
              v-if="!item.lido"
              type="button"
              class="text-xs text-gray-400 underline"
              @click="marcarLido(item)"
            >
              Marcar como lido
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { buscarInteressesRecebidos, marcarInteresseLido } from '../services/firestoreService.js'

const props = defineProps({
  userId: { type: String, required: true },
})

const interesses = ref([])
const loading = ref(true)

const naoLidos = computed(() => interesses.value.filter((i) => !i.lido).length)

function formatarData(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

async function carregar() {
  if (!props.userId) return
  loading.value = true
  try {
    interesses.value = await buscarInteressesRecebidos(props.userId)
  } catch (err) {
    console.error('Erro ao carregar interesses recebidos:', err)
  } finally {
    loading.value = false
  }
}

async function marcarLido(item) {
  try {
    await marcarInteresseLido(item.id)
    item.lido = true
  } catch (err) {
    console.error('Erro ao marcar interesse como lido:', err)
  }
}

onMounted(carregar)
</script>
