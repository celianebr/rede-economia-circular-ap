<template>
  <div class="card">
    <h2 class="text-lg font-semibold mb-3">Meu Perfil</h2>

    <div class="mb-4">
      <label class="block font-semibold mb-2">Tipo de Cadastro</label>
      <div class="flex gap-4">
        <label class="flex items-center gap-2">
          <input type="radio" value="PF" v-model="form.tipoCadastro" />
          Pessoa Física (PF)
        </label>
        <label class="flex items-center gap-2">
          <input type="radio" value="PJ" v-model="form.tipoCadastro" />
          Pessoa Jurídica (PJ)
        </label>
      </div>
    </div>

    <!-- PESSOA FÍSICA -->
    <div v-if="isPF" class="space-y-4">
      <h3 class="font-semibold text-lz-primary border-b pb-1">1. Informações pessoais e de contato</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">Nome completo</label>
          <input v-model="form.nome" class="w-full px-3 py-2 rounded border" />
        </div>
        <div>
          <label class="block mb-1">E-mail</label>
          <input v-model="form.email" class="w-full px-3 py-2 rounded border" />
        </div>
        <div>
          <label class="block mb-1">Telefone / WhatsApp</label>
          <input v-model="form.telefone" class="w-full px-3 py-2 rounded border" placeholder="(00) 00000-0000" />
        </div>
        <div class="md:col-span-2">
          <label class="block mb-1">Municípios de atuação</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 border p-2 rounded max-h-40 overflow-y-auto">
             <label v-for="m in profileOptions.municipios" :key="m" class="flex items-center gap-2 text-sm">
               <input type="checkbox" :value="m" v-model="form.municipios">
               {{ m }}
             </label>
          </div>
        </div>
        <div>
          <label class="block mb-1">Bairro / Comunidade</label>
          <input v-model="form.bairro" class="w-full px-3 py-2 rounded border" />
        </div>
        <div>
          <label class="block mb-1">Data de nascimento</label>
          <input type="date" v-model="form.dataNascimento" class="w-full px-3 py-2 rounded border" />
        </div>
         <div>
          <label class="block mb-1">Gênero (opcional)</label>
           <select v-model="form.genero" class="w-full px-3 py-2 rounded border">
             <option value="">Selecione...</option>
             <option value="Feminino">Feminino</option>
             <option value="Masculino">Masculino</option>
             <option value="Não-binário">Não-binário</option>
             <option value="Outro">Outro</option>
             <option value="Prefiro não dizer">Prefiro não dizer</option>
          </select>
        </div>
      </div>

      <h3 class="font-semibold text-lz-primary border-b pb-1 mt-6">2. Situação profissional</h3>
      <div>
        <label class="block mb-1">Ocupação Atual</label>
        <select v-model="form.ocupacao" class="w-full px-3 py-2 rounded border mb-2">
           <option value="">Selecione...</option>
           <option v-for="opt in profileOptions.situacaoProfissional" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <input v-if="form.ocupacao === 'Outro'" v-model="form.ocupacaoOutro" placeholder="Qual?" class="w-full px-3 py-2 rounded border" />
      </div>
      <div>
          <label class="block mb-1">Nome da instituição / organização (se aplicável)</label>
          <input v-model="form.instituicao" class="w-full px-3 py-2 rounded border" />
      </div>

      <h3 class="font-semibold text-lz-primary border-b pb-1 mt-6">3. Áreas de atuação</h3>
      <div v-for="(options, group) in profileOptions.areasAtuacao" :key="group" class="mb-4">
        <h4 class="font-bold text-sm text-gray-700 mb-2">{{ group }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
           <label v-for="opt in options" :key="opt" class="flex items-center gap-2 text-sm">
             <input type="checkbox" :value="opt" v-model="form.areasAtuacao">
             {{ opt }}
           </label>
        </div>
      </div>
       <div v-if="form.areasAtuacao.includes('Outro')" class="mt-2">
         <label class="block mb-1 text-sm">Especifique outra área:</label>
         <input v-model="form.areasAtuacaoOutro" class="w-full px-3 py-2 rounded border" />
       </div>

      <h3 class="font-semibold text-lz-primary border-b pb-1 mt-6">4. Materiais trabalhados</h3>
       <div v-for="(options, group) in profileOptions.materiaisTrabalhados" :key="group" class="mb-4">
        <h4 class="font-bold text-sm text-gray-700 mb-2">{{ group }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
           <label v-for="opt in options" :key="opt" class="flex items-center gap-2 text-sm">
             <input type="checkbox" :value="opt" v-model="form.materiaisTrabalhados">
             {{ opt }}
           </label>
        </div>
      </div>
       <div v-if="form.materiaisTrabalhados.includes('Outro')" class="mt-2">
         <label class="block mb-1 text-sm">Especifique outro material:</label>
         <input v-model="form.materiaisTrabalhadosOutro" class="w-full px-3 py-2 rounded border" />
       </div>

      <h3 class="font-semibold text-lz-primary border-b pb-1 mt-6">5. Formação e capacitação</h3>
      <div>
         <label class="block mb-1">Nível de escolaridade</label>
         <select v-model="form.escolaridade" class="w-full px-3 py-2 rounded border">
           <option value="">Selecione...</option>
           <option value="Fundamental incompleto">Fundamental incompleto</option>
           <option value="Fundamental completo">Fundamental completo</option>
           <option value="Médio incompleto">Médio incompleto</option>
           <option value="Médio completo">Médio completo</option>
           <option value="Superior incompleto">Superior incompleto</option>
           <option value="Superior completo">Superior completo</option>
           <option value="Pós-graduação">Pós-graduação</option>
         </select>
      </div>
      <div>
         <label class="block mb-1">Curso ou área de formação (se aplicável)</label>
         <input v-model="form.cursoFormacao" class="w-full px-3 py-2 rounded border" />
      </div>
       <div class="mt-2">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.interesseCapacitacao" />
          Interesse em participar de capacitações
        </label>
      </div>

       <h3 class="font-semibold text-lz-primary border-b pb-1 mt-6">6. Imagem e redes (opcional)</h3>
        <div>
          <label class="block mb-1">Foto de Perfil</label>
           <div class="flex items-center gap-4">
             <img v-if="form.fotoPerfil" :src="form.fotoPerfil" class="w-16 h-16 rounded-full object-cover border" />
             <input type="file" @change="handleFileChange" class="text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-lz-primary file:text-white
              hover:file:bg-green-600
            "/>
          </div>
        </div>
       <div>
         <label class="block mb-1">Redes sociais (Instagram, LinkedIn etc.)</label>
         <input v-model="form.redesSociais" class="w-full px-3 py-2 rounded border" />
      </div>

    </div>

    <!-- PESSOA JURÍDICA -->
    <div v-if="isPJ" class="space-y-4">
        <h3 class="font-semibold text-lz-primary border-b pb-1">1. Informações da organização</h3>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1">Nome da instituição / empresa</label>
              <input v-model="form.nomeFantasia" class="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label class="block mb-1">CNPJ</label>
              <input v-model="form.cnpj" class="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label class="block mb-1">Tipo de organização</label>
               <select v-model="form.tipoOrganizacao" class="w-full px-3 py-2 rounded border mb-2">
                <option value="">Selecione...</option>
                <option v-for="opt in profileOptions.tiposOrganizacao" :key="opt" :value="opt">{{ opt }}</option>
              </select>
               <input v-if="form.tipoOrganizacao === 'Outro'" v-model="form.tipoOrganizacaoOutro" placeholder="Qual?" class="w-full px-3 py-2 rounded border" />
            </div>
             <div class="md:col-span-2">
              <label class="block mb-1">Municípios onde atua</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 border p-2 rounded max-h-40 overflow-y-auto">
                 <label v-for="m in profileOptions.municipios" :key="m" class="flex items-center gap-2 text-sm">
                   <input type="checkbox" :value="m" v-model="form.municipios">
                   {{ m }}
                 </label>
              </div>
            </div>
             <div class="md:col-span-2">
              <label class="block mb-1">Endereço / Bairro / Comunidade</label>
              <input v-model="form.endereco" class="w-full px-3 py-2 rounded border" />
            </div>
            <div>
              <label class="block mb-1">Telefone / WhatsApp institucional</label>
               <input v-model="form.telefone" class="w-full px-3 py-2 rounded border" />
            </div>
             <div>
              <label class="block mb-1">E-mail institucional</label>
               <input v-model="form.emailInstitucional" class="w-full px-3 py-2 rounded border" />
            </div>
         </div>

        <h3 class="font-semibold text-lz-primary border-b pb-1 mt-6">2. Perfil e atuação da organização</h3>
        <div>
          <label class="block font-semibold mb-2">Setor de atuação</label>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
             <label v-for="opt in profileOptions.setoresAtuacaoPJ" :key="opt" class="flex items-center gap-2 text-sm">
               <input type="checkbox" :value="opt" v-model="form.setorAtuacaoPJ">
               {{ opt }}
             </label>
          </div>
            <div v-if="form.setorAtuacaoPJ.includes('Outro')" class="mt-2">
             <label class="block mb-1 text-sm">Especifique outro setor:</label>
             <input v-model="form.setorAtuacaoPJOutro" class="w-full px-3 py-2 rounded border" />
           </div>
        </div>
        
        <div class="mt-4">
           <label class="block font-semibold mb-2">Materiais trabalhados</label>
            <div v-for="(options, group) in profileOptions.materiaisTrabalhados" :key="group" class="mb-4">
            <h4 class="font-bold text-sm text-gray-700 mb-2">{{ group }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
               <label v-for="opt in options" :key="opt" class="flex items-center gap-2 text-sm">
                 <input type="checkbox" :value="opt" v-model="form.materiaisTrabalhados">
                 {{ opt }}
               </label>
            </div>
          </div>
          <div v-if="form.materiaisTrabalhados.includes('Outro')" class="mt-2">
             <label class="block mb-1 text-sm">Especifique outro material:</label>
             <input v-model="form.materiaisTrabalhadosOutro" class="w-full px-3 py-2 rounded border" />
           </div>
        </div>

        <h3 class="font-semibold text-lz-primary border-b pb-1 mt-6">3. Estrutura e capacidades</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
              <label class="block mb-1">Quantidade aproximada de membros / colaboradores</label>
              <input v-model="form.quantidadeMembros" type="number" class="w-full px-3 py-2 rounded border" />
           </div>
           <div>
              <label class="block mb-1">Parceiros ativos (opcional)</label>
              <input v-model="form.parceiros" class="w-full px-3 py-2 rounded border" />
           </div>
        </div>
        <div class="mt-4">
           <label class="block font-semibold mb-2">Interesse em participar de:</label>
           <div class="flex flex-col gap-2">
             <label class="flex items-center gap-2"><input type="checkbox" value="Projetos conjuntos" v-model="form.interessesPJ"> Projetos conjuntos</label>
             <label class="flex items-center gap-2"><input type="checkbox" value="Capacitações" v-model="form.interessesPJ"> Capacitações</label>
             <label class="flex items-center gap-2"><input type="checkbox" value="Ações de campo" v-model="form.interessesPJ"> Ações de campo</label>
             <label class="flex items-center gap-2"><input type="checkbox" value="Eventos" v-model="form.interessesPJ"> Eventos</label>
           </div>
        </div>

        <h3 class="font-semibold text-lz-primary border-b pb-1 mt-6">4. Representante legal / responsável pelo cadastro</h3>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1">Nome completo</label>
              <input v-model="form.responsavelNome" class="w-full px-3 py-2 rounded border" />
            </div>
             <div>
              <label class="block mb-1">Cargo / função</label>
              <input v-model="form.responsavelCargo" class="w-full px-3 py-2 rounded border" />
            </div>
             <div>
              <label class="block mb-1">Telefone / WhatsApp</label>
              <input v-model="form.responsavelTelefone" class="w-full px-3 py-2 rounded border" />
            </div>
             <div>
              <label class="block mb-1">E-mail</label>
              <input v-model="form.responsavelEmail" class="w-full px-3 py-2 rounded border" />
            </div>
         </div>
         
         <h3 class="font-semibold text-lz-primary border-b pb-1 mt-6">5. Imagem e redes (opcional)</h3>
         <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block mb-1">Logo ou imagem da organização</label>
              <div class="flex items-center gap-4">
                <img v-if="form.fotoPerfil" :src="form.fotoPerfil" class="w-16 h-16 rounded-full object-cover border" />
                <input type="file" @change="handleFileChange" class="text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-lz-primary file:text-white
                  hover:file:bg-green-600
                "/>
              </div>
            </div>
            <div>
              <label class="block mb-1">Redes sociais</label>
              <input v-model="form.redesSociais" class="w-full px-3 py-2 rounded border" />
            </div>
             <div>
              <label class="block mb-1">Site (se tiver)</label>
              <input v-model="form.site" class="w-full px-3 py-2 rounded border" />
            </div>
         </div>

    </div>

    <div class="my-6 bg-gray-50 p-4 rounded border">
      <label class="flex items-start gap-2">
        <input type="checkbox" v-model="form.termoAceite" class="mt-1" />
        <span class="text-sm text-gray-700">
          Autorizo a exibição pública das informações deste cadastro no Mapa da Rede de Economia Circular do Amapá, conforme a finalidade do projeto. *
        </span>
      </label>
    </div>

    <!-- BOTAO SALVAR -->
    <div class="mt-6 border-t pt-4 flex flex-col md:flex-row gap-4 items-center">
      <button class="btn w-full md:w-auto" @click="salvar" :disabled="loading">
        {{ loading ? "Salvando..." : "Salvar perfil" }}
      </button>
      
      <button class="text-lz-primary underline text-sm" @click="$router.push('/u/' + userId)">
        Visualizar Perfil Público
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { salvarPerfil } from "../services/firestoreService.js";
import { profileOptions } from "../data/profileOptions.js";

const props = defineProps({
  initialProfile: Object,
  userId: String,
});

const form = ref({
  tipoCadastro: "", // 'PF' ou 'PJ'
  
  // PF
  nome: "",
  email: "", // Added email
  telefone: "",
  municipios: [], // Agora array
  bairro: "",
  dataNascimento: "",
  genero: "",
  ocupacao: "",
  ocupacaoOutro: "",
  instituicao: "",
  
  // PJ
  nomeFantasia: "",
  cnpj: "",
  tipoOrganizacao: "",
  tipoOrganizacaoOutro: "",
  endereco: "", // Bairro/Comunidade já tem campo acima, mas talvez seja melhor separar
  emailInstitucional: "",
  responsavelNome: "",
  responsavelCargo: "",
  responsavelTelefone: "",
  responsavelEmail: "",
  quantidadeMembros: "",
  parceiros: "",
  
  // Mídia
  fotoPerfil: null, // Pode ser URL ou base64 futuramente
  
  // Comuns / Listas
  areasAtuacao: [],
  materiaisTrabalhados: [],
  interesseCapacitacao: false, // PF
  interessesPJ: [], // PJ (projetos, capacitacoes, acoes, eventos)
  
  // Outros inputs de texto para "Outro"
  areasAtuacaoOutro: "",
  materiaisTrabalhadosOutro: "",
  setorAtuacaoPJ: [], // PJ
  setorAtuacaoPJOutro: "",
  
  site: "",
  redesSociais: "",
  
  // Termos
  termoAceite: false
});

const loading = ref(false);

const isPF = computed(() => form.value.tipoCadastro === 'PF');
const isPJ = computed(() => form.value.tipoCadastro === 'PJ');

// Sempre que o perfil inicial mudar, atualiza o formulário
watch(
  () => props.initialProfile,
  (val) => {
    if (val) {
      // Mesclar valores existentes
      form.value = { ...form.value, ...val };
      
      // Migração/Compatibilidade: Se tiver 'municipio' string e não tiver array
      if (val.municipio && (!val.municipios || val.municipios.length === 0)) {
         form.value.municipios = [val.municipio];
      }
      
      // Garantir arrays
      if (!Array.isArray(form.value.municipios)) form.value.municipios = [];
      if (!Array.isArray(form.value.areasAtuacao)) form.value.areasAtuacao = [];
      if (!Array.isArray(form.value.materiaisTrabalhados)) form.value.materiaisTrabalhados = [];
      if (!Array.isArray(form.value.interessesPJ)) form.value.interessesPJ = [];
      if (!Array.isArray(form.value.setorAtuacaoPJ)) form.value.setorAtuacaoPJ = [];
    }
  },
  { immediate: true }
);

// Máscara de Telefone
watch(
  () => form.value.telefone,
  (val) => {
    if (!val) return;
    // Remove tudo que não é dígito
    let r = val.replace(/\D/g, "");
    if (r.length > 11) r = r.substring(0, 11);

    if (r.length > 10) {
      // (11) 12345-6789
      form.value.telefone = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
       // (11) 1234-5678...
      form.value.telefone = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
      // (11) 123...
      form.value.telefone = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
      // 11...
      form.value.telefone = r.replace(/^(\d*)/, "($1");
    }
  }
);

async function salvar() {
  if (!props.userId) {
    alert("Usuário não identificado.");
    return;
  }
  
  if (!form.value.tipoCadastro) {
    alert("Selecione o tipo de cadastro.");
    return;
  }
  
  if (!form.value.termoAceite) {
    alert("É necessário autorizar a exibição pública das informações para prosseguir.");
    return;
  }

  loading.value = true;
  try {
    // Copia superficial
    const data = { ...form.value };
    
    // Limpezas específicas se necessário
    data.atualizadoEm = new Date().toISOString();

    await salvarPerfil(props.userId, data);
    alert("Perfil salvo com sucesso!");
  } catch (err) {
    alert("Erro ao salvar perfil: " + (err.message || err));
  } finally {
    loading.value = false;
  }
}

function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      // Convert to Base64
      const reader = new FileReader();
      reader.onload = (e) => {
        form.value.fotoPerfil = e.target.result;
      };
      reader.readAsDataURL(file);
    }
}
</script>
