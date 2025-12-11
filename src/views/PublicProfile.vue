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
              <span v-if="profile.municipio" class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
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
               <li v-if="profile.email || profile.emailInstitucional">
                 <span class="font-semibold block text-sm text-gray-500">E-mail:</span>
                 <a :href="'mailto:'+(profile.email || profile.emailInstitucional)" class="text-primary hover:underline">
                   {{ profile.email || profile.emailInstitucional }}
                 </a>
               </li>
               
               <li v-if="profile.telefone">
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

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { buscarPerfil } from "../services/firestoreService";

const route = useRoute();
const profile = ref(null);
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id;
  if(id) {
    try {
      const data = await buscarPerfil(id);
      if(data) {
        profile.value = data;
      }
    } catch(e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
});
</script>

<style scoped>
.text-primary { color: #16524a; }
.bg-primary { background-color: #16524a; }
.bg-primary\/10 { background-color: rgba(22, 82, 74, 0.1); }
.border-primary { border-color: #16524a; }
.border-primary\/20 { border-color: rgba(22, 82, 74, 0.2); }
</style>
