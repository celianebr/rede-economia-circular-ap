<template>
  <div class="card">
    <h2 class="text-lg font-semibold mb-3">Meu Perfil</h2>

    <div class="mb-3">
      <label class="block mb-1">Nome</label>
      <input v-model="form.nome" class="w-full px-3 py-2 rounded border" />
    </div>

    <div class="mb-3">
      <label class="block mb-1">Município</label>
      <input v-model="form.municipio" class="w-full px-3 py-2 rounded border" />
    </div>

    <div class="mb-3">
      <label class="block mb-1">Interesses / Materiais</label>
      <input
        v-model="form.interesses"
        placeholder="Ex: vidro, plástico, compostagem"
        class="w-full px-3 py-2 rounded border"
      />
    </div>

    <div class="mt-4">
      <button class="btn" @click="salvar" :disabled="loading">
        {{ loading ? "Salvando..." : "Salvar perfil" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { salvarPerfil } from "../services/firestoreService.js";

const props = defineProps({
  initialProfile: Object,
  userId: String,
});

const form = ref({
  nome: "",
  municipio: "",
  interesses: "",
});

const loading = ref(false);

// Sempre que o perfil inicial mudar, atualiza o formulário
watch(
  () => props.initialProfile,
  (val) => {
    if (val) form.value = { ...form.value, ...val };
  },
  { immediate: true }
);

async function salvar() {
  if (!props.userId) {
    alert("Usuário não identificado.");
    return;
  }

  loading.value = true;
  try {
    const data = {
      nome: form.value.nome,
      municipio: form.value.municipio,
      interesses: form.value.interesses
        ? form.value.interesses.split(",").map((i) => i.trim())
        : [],
      atualizadoEm: new Date().toISOString(),
    };

    await salvarPerfil(props.userId, data);
    alert("Perfil salvo com sucesso!");
  } catch (err) {
    alert("Erro ao salvar perfil: " + (err.message || err));
  } finally {
    loading.value = false;
  }
}
</script>
