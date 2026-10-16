<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <p class="text-xl font-semibold text-gray-500">Carregando perfil...</p>
    </div>

    <div v-else-if="!profile" class="flex-1 flex flex-col items-center justify-center gap-4">
      <p class="text-xl text-red-600">Perfil não encontrado.</p>
      <router-link to="/search" class="text-primary font-semibold hover:underline">&larr; Voltar para a busca</router-link>
    </div>

    <div v-else class="flex-1 container mx-auto py-8 px-4">
      <!-- Back Button -->
      <router-link to="/search" class="inline-flex items-center text-primary font-semibold mb-6 hover:underline">
        &larr; Voltar para a busca
      </router-link>

      <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        
        <!-- Header / Capa -->
        <div class="bg-primary/10 p-8 flex flex-col md:flex-row items-center gap-6 border-b border-primary/20">
          <!-- Avatar -->
          <div v-if="profile.fotoPerfil" class="w-24 h-24 rounded-full overflow-hidden shadow-md border-4 border-white">
            <img :src="profile.fotoPerfil" class="w-full h-full object-cover">
          </div>
          <div v-else class="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl shadow-md border-4 border-white">
            {{ (profile.nome || profile.nomeFantasia || 'U')[0] }}
          </div>
          
          <div class="text-center md:text-left">
            <h1 class="text-3xl font-bold text-primary mb-2">
              {{ profile.nome || profile.nomeFantasia || 'Usuário Sem Nome' }}
            </h1>
            <div class="flex flex-wrap justify-center md:justify-start gap-2">
              <span class="px-3 py-1 bg-white border border-primary text-primary rounded-full text-sm font-semibold">
                {{ profile.tipoCadastro === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física' }}
              </span>
              <span v-if="profile.municipio && !(profile.municipios || []).includes(profile.municipio)" class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {{ profile.municipio }}
              </span>
               <!-- Array Municipios Support -->
              <span v-for="m in profile.municipios" :key="m" class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {{ m }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- INFO GERAL -->
          <div>
             <h2 class="text-xl font-bold text-primary mb-4 border-b pb-2">Informações Gerais</h2>
             <ul class="space-y-3 text-gray-700">
               
               <li v-if="profile.ocupacao">
                 <span class="font-semibold block text-sm text-gray-500">Ocupação:</span>
                 {{ profile.ocupacao }}
               </li>
               
               <li v-if="profile.tipoOrganizacao">
                 <span class="font-semibold block text-sm text-gray-500">Tipo de Organização:</span>
                 {{ profile.tipoOrganizacao }}
               </li>

               <li v-if="profile.instituicao || profile.nomeFantasia">
                 <span class="font-semibold block text-sm text-gray-500">Instituição:</span>
                 {{ profile.instituicao || profile.nomeFantasia }}
               </li>

               <li v-if="profile.bairro || profile.endereco">
                 <span class="font-semibold block text-sm text-gray-500">Localização/Bairro:</span>
                 {{ profile.bairro || profile.endereco }}
               </li>
             </ul>
          </div>

          <!-- CONTATO -->
          <div>
            <h2 class="text-xl font-bold text-primary mb-4 border-b pb-2">Contato</h2>
            <ul class="space-y-3 text-gray-700">
               <li v-if="profile.compartilharEmail && (profile.email || profile.emailInstitucional)">
                 <span class="font-semibold block text-sm text-gray-500">E-mail:</span>
                 <a :href="'mailto:'+(profile.email || profile.emailInstitucional)" class="text-primary hover:underline">
                   {{ profile.email || profile.emailInstitucional }}
                 </a>
               </li>
               
               <li v-if="profile.compartilharTelefone && profile.telefone">
                 <span class="font-semibold block text-sm text-gray-500">Telefone / WhatsApp:</span>
                 <a :href="'https://wa.me/55'+profile.telefone.replace(/\D/g, '')" target="_blank" class="text-primary hover:underline">
                   {{ profile.telefone }}
                 </a>
               </li>

               <li v-if="profile.redesSociais">
                 <span class="font-semibold block text-sm text-gray-500">Redes Sociais:</span>
                 {{ profile.redesSociais }}
               </li>
               
               <li v-if="profile.site">
                 <span class="font-semibold block text-sm text-gray-500">Site:</span>
                 <a :href="profile.site.startsWith('http') ? profile.site : 'https://'+profile.site" target="_blank" class="text-primary hover:underline">
                    {{ profile.site }}
                 </a>
               </li>

               <li v-if="!profile.compartilharEmail && !profile.compartilharTelefone && !profile.redesSociais && !profile.site" class="text-sm text-gray-400 italic">
                 Este agente não disponibilizou contato público.
               </li>
            </ul>
          </div>

          <!-- AREAS -->
          <div class="md:col-span-2" v-if="profile.areasAtuacao && profile.areasAtuacao.length">
             <h2 class="text-xl font-bold text-primary mb-4 border-b pb-2">Áreas de Atuação</h2>
             <div class="flex flex-wrap gap-2">
               <span v-for="area in profile.areasAtuacao" :key="area" class="px-3 py-1 bg-green-50 text-green-800 rounded border border-green-200 text-sm">
                 {{ area }}
               </span>
             </div>
          </div>

          <!-- MATERIAIS -->
          <div class="md:col-span-2" v-if="profile.materiaisTrabalhados && profile.materiaisTrabalhados.length">
             <h2 class="text-xl font-bold text-primary mb-4 border-b pb-2">Materiais Trabalhados</h2>
             <div class="flex flex-wrap gap-2">
               <span v-for="mat in profile.materiaisTrabalhados" :key="mat" class="px-3 py-1 bg-blue-50 text-blue-800 rounded border border-blue-200 text-sm">
                 {{ mat }}
               </span>
             </div>
          </div>


          <!-- MATCHMAKING: demonstrar interesse em contato -->
          <div class="md:col-span-2 border-t pt-6" v-if="!isOwnProfile">
            <h2 class="text-xl font-bold text-primary mb-3">Interessado(a) em se conectar?</h2>

            <div v-if="!currentUserId" class="text-sm text-gray-600">
              <router-link to="/login" class="text-primary font-semibold hover:underline">Entre na sua conta</router-link>
              para demonstrar interesse em contato com este agente.
            </div>

            <div v-else-if="interesseEnviado" class="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-4 py-3">
              {{ mensagemConfirmacaoInteresse }}
            </div>

            <div v-else>
              <button
                v-if="!mostrarFormInteresse"
                type="button"
                class="btn"
                @click="mostrarFormInteresse = true"
              >
                Tenho interesse em contato
              </button>

              <div v-else class="max-w-lg">
                <label class="block text-sm font-medium text-gray-700 mb-1">Mensagem (opcional)</label>
                <textarea
                  v-model="mensagemInteresse"
                  rows="3"
                  maxlength="500"
                  placeholder="Conte um pouco sobre por que quer se conectar..."
                  class="w-full px-3 py-2 rounded border mb-2"
                ></textarea>
                <div class="flex gap-3">
                  <button type="button" class="btn" @click="enviarInteresseHandler" :disabled="enviandoInteresse">
                    {{ enviandoInteresse ? 'Enviando...' : 'Enviar interesse' }}
                  </button>
                  <button type="button" class="text-sm text-gray-500 underline" @click="mostrarFormInteresse = false">
                    Cancelar
                  </button>
                </div>
                <p v-if="erroInteresse" class="text-sm text-red-600 mt-2">{{ erroInteresse }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { buscarPerfil, enviarInteresse } from "../services/firestoreService";
import { enviarEmailInteresse } from "../services/emailService";

const route = useRoute();
const profile = ref(null);
const loading = ref(true);

const currentUserId = ref("");
const currentUserProfile = ref(null);
const isOwnProfile = computed(() => currentUserId.value && currentUserId.value === route.params.id);

const mostrarFormInteresse = ref(false);
const mensagemInteresse = ref("");
const enviandoInteresse = ref(false);
const interesseEnviado = ref(false);
const ultimoEnvioComEmail = ref(false);
const erroInteresse = ref("");

const mensagemConfirmacaoInteresse = computed(() => {
  const nome = profile.value ? (profile.value.nome || profile.value.nomeFantasia) : "Agente";
  return ultimoEnvioComEmail.value
    ? `Interesse enviado! ${nome} vai receber um aviso na plataforma e por e-mail.`
    : `Interesse enviado! ${nome} vai receber um aviso na plataforma.`;
});

async function carregarPerfil() {
  const id = route.params.id;
  if (id) {
    try {
      const data = await buscarPerfil(id);
      if (data) {
        profile.value = data;
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
}

async function enviarInteresseHandler() {
  if (!currentUserId.value || !profile.value) return;
  erroInteresse.value = "";
  enviandoInteresse.value = true;
  try {
    const deNome =
      (currentUserProfile.value && (currentUserProfile.value.nome || currentUserProfile.value.nomeFantasia)) ||
      "Um agente da rede";
    const paraNome = profile.value.nome || profile.value.nomeFantasia || "Agente";
    // O aviso por e-mail é uma notificação interna entre os dois agentes, por isso usa o
    // e-mail cadastrado mesmo que a pessoa não tenha autorizado exibi-lo no perfil público.
    const paraEmail = profile.value.email || profile.value.emailInstitucional || "";
    const deEmail =
      (currentUserProfile.value && (currentUserProfile.value.email || currentUserProfile.value.emailInstitucional)) ||
      "";

    await enviarInteresse({
      deId: currentUserId.value,
      deNome,
      paraId: route.params.id,
      paraNome,
      mensagem: mensagemInteresse.value.trim(),
    });

    const resultadoEmail = await enviarEmailInteresse({
      toEmail: paraEmail,
      toName: paraNome,
      fromName: deNome,
      message: mensagemInteresse.value.trim(),
      profileUrl: `${window.location.origin}/u/${currentUserId.value}`,
      replyTo: deEmail,
    });

    ultimoEnvioComEmail.value = !!resultadoEmail.enviado;
    interesseEnviado.value = true;
  } catch (err) {
    console.error("Erro ao enviar interesse:", err);
    erroInteresse.value = "Não foi possível enviar seu interesse agora. Tente novamente em instantes.";
  } finally {
    enviandoInteresse.value = false;
  }
}

onMounted(() => {
  carregarPerfil();

  const auth = getAuth();
  onAuthStateChanged(auth, async (u) => {
    currentUserId.value = u ? u.uid : "";
    if (u) {
      try {
        currentUserProfile.value = await buscarPerfil(u.uid);
      } catch (e) {
        console.error(e);
      }
    } else {
      currentUserProfile.value = null;
    }
  });
});
</script>

<style scoped>
.text-primary { color: #2F5D3A; }
.bg-primary { background-color: #2F5D3A; }
.bg-primary\/10 { background-color: rgba(47, 93, 58, 0.1); }
.border-primary { border-color: #2F5D3A; }
.border-primary\/20 { border-color: rgba(47, 93, 58, 0.2); }
</style>
