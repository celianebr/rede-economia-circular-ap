<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <!-- Header condicional -->
    <WelcomeHeader v-if="isAuthenticated" @logout="handleLogout" />
    <Header v-else />

    <main class="flex-1 flex flex-col container overflow-hidden">
      <!-- Filtros no Topo -->
      <!-- Filtros no Topo -->
      <div class="card my-4 p-4 shadow-sm bg-white z-10">
        <h2 class="text-lg font-semibold mb-3">Pesquisar na Rede</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Filtro Município -->
          <div>
             <label class="block text-sm font-medium text-gray-700 mb-2">Municípios (Selecione um ou mais)</label>
             <div class="h-40 overflow-y-auto border rounded p-2 bg-gray-50">
               <label v-for="m in profileOptions.municipios" :key="m" class="flex items-center gap-2 mb-1 text-sm">
                 <input type="checkbox" :value="m" v-model="filters.municipio" @change="search">
                 {{ m }}
               </label>
             </div>
          </div>

          <!-- Filtro Área de Atuação (Itens específicos) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Área de Atuação</label>
            <div class="h-40 overflow-y-auto border rounded p-2 bg-gray-50">
              <label v-for="item in allAreaItems" :key="item" class="flex items-center gap-2 mb-1 text-sm">
                <input type="checkbox" :value="item" v-model="filters.area" @change="search">
                {{ item }}
              </label>
            </div>
          </div>

          <!-- Filtro Materiais -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Materiais Trabalhados</label>
            <div class="h-40 overflow-y-auto border rounded p-2 bg-gray-50">
               <!-- Flattened or grouped? Let's use grouped for clarity but checkboxes -->
                <div v-for="(opts, group) in profileOptions.materiaisTrabalhados" :key="group" class="mb-2">
                   <p class="font-bold text-xs text-gray-500 uppercase mt-1">{{group}}</p>
                   <label v-for="opt in opts" :key="opt" class="flex items-center gap-2 mb-1 text-sm">
                     <input type="checkbox" :value="opt" v-model="filters.material" @change="search">
                     {{ opt }}
                   </label>
                </div>
            </div>
          </div>
        </div>
        
        <div class="mt-3 flex justify-end">
            <button class="text-sm text-gray-500 underline" @click="clearFilters">Limpar Filtros</button>
        </div>
      </div>

      <!-- Conteúdo Principal: Resultados + Mapa -->
      <div class="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden h-full pb-4">
        
        <!-- Coluna de Resultados (2/3) -->
        <div class="w-full md:w-2/3 overflow-y-auto pr-2">
          
          <div v-if="loading" class="text-center py-10">Carregando...</div>
          
          <div v-else-if="results.length === 0" class="text-center py-10 text-gray-500 border rounded bg-white">
            Nenhum resultado encontrado com os filtros selecionados.
          </div>

          <div v-else class="space-y-4">
            <div v-for="(r, index) in results" :key="index" class="card hover:shadow-md transition-shadow cursor-pointer" @click="router.push('/u/'+r.id)">
              <div class="flex items-start gap-4">
                 <!-- Avatar Placeholder ou Foto -->
                 <div v-if="r.fotoPerfil" class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border bg-gray-100">
                    <img :src="r.fotoPerfil" class="w-full h-full object-cover" />
                 </div>
                 <div v-else class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                    {{ (r.nome || r.nomeFantasia || 'U')[0] }}
                 </div>
                 
                 <div>
                   <h3 class="font-bold text-lg text-primary">
                     {{ r.nome || r.nomeFantasia || 'Usuário Sem Nome' }}
                   </h3>
                   <span class="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
                     {{ r.tipoCadastro || 'Não informado' }}
                   </span>
                   
                   <p class="text-sm text-gray-600 mt-1">
                     <strong>Município:</strong> {{ r.municipio || "—" }}
                   </p>
                   
                   <div v-if="r.areasAtuacao && r.areasAtuacao.length" class="mt-2">
                      <p class="text-xs font-semibold text-gray-500">Áreas:</p>
                      <p class="text-sm">{{ r.areasAtuacao.join(", ") }}</p>
                   </div>
                   
                   <div v-if="r.materiaisTrabalhados && r.materiaisTrabalhados.length" class="mt-2">
                      <p class="text-xs font-semibold text-gray-500">Materiais:</p>
                      <p class="text-sm">{{ r.materiaisTrabalhados.join(", ") }}</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna do Mapa (1/3) -->
        <div class="w-full md:w-1/3 min-h-[300px] md:h-full bg-gray-200 rounded-lg overflow-hidden border relative z-0">
           <!-- MAPA -->
           <l-map ref="map" v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
             <l-tile-layer
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               layer-type="base"
               name="OpenStreetMap"
             ></l-tile-layer>
             
             <!-- Marcadores -->
             <l-marker 
                v-for="(r, index) in resultsWithCoords" 
                :key="index"
                :lat-lng="r.coords"
             >
                <l-popup>
                  <div class="font-bold">{{ r.nome || r.nomeFantasia }}</div>
                  <div class="text-sm">{{ r.municipio }}</div>
                </l-popup>
             </l-marker>
             
           </l-map>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import WelcomeHeader from "../components/WelcomeHeader.vue";
import Header from "../components/Header.vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../services/firebase.js";
import { profileOptions } from "../data/profileOptions.js";

// Leaflet
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

const router = useRouter();

// Filtros state
// Filtros state (Arrays para checkbox)
const filters = ref({
  municipio: [],
  area: [],
  material: []
});

// Computed para achatar as áreas de atuação
const allAreaItems = computed(() => {
  const areas = [];
  Object.values(profileOptions.areasAtuacao).forEach(list => {
    areas.push(...list);
  });
  // Remove duplicates and Sort
  return [...new Set(areas)].sort();
});

const results = ref([]);
const loading = ref(false);
const isAuthenticated = ref(false);

// Mapa configuration
const zoom = ref(7); // Zoom para ver o Amapá
const center = ref([0.902, -51.056]); // Centro aproximado do Amapá

// Coordenadas aproximadas dos 16 municípios
const cityCoords = {
  "Amapá": [2.052, -50.796],
  "Calçoene": [2.496, -50.951],
  "Cutias": [0.970, -50.803],
  "Ferreira Gomes": [0.857, -51.180],
  "Itaubal": [0.598, -50.697],
  "Laranjal do Jari": [-0.841, -52.533],
  "Macapá": [0.035, -51.070],
  "Mazagão": [-0.115, -51.289],
  "Oiapoque": [3.840, -51.831],
  "Pedra Branca do Amapari": [0.771, -51.954],
  "Porto Grande": [0.712, -51.414],
  "Pracuúba": [1.745, -50.791],
  "Santana": [-0.058, -51.181],
  "Serra do Navio": [0.901, -52.001],
  "Tartarugalzinho": [1.508, -50.910],
  "Vitória do Jari": [-0.941, -52.418]
};

// Computed para adicionar coords aos resultados
const resultsWithCoords = computed(() => {
  return results.value.map(r => {
    // Tenta encontrar coord pelo município (pode ser array ou string)
    let cityName = "Macapá"; // Default
    if (r.municipios && r.municipios.length > 0) {
      cityName = r.municipios[0]; // Pega o primeiro se for array
    } else if (r.municipio) {
      cityName = r.municipio;
    }

    let coords = cityCoords[cityName] || cityCoords["Macapá"];
    
    // Adiciona um pequeno jitter aleatório
    const jitter = 0.015; 
    const lat = coords[0] + (Math.random() - 0.5) * jitter;
    const lng = coords[1] + (Math.random() - 0.5) * jitter;
    return { ...r, coords: [lat, lng] };
  });
});


async function search() {
  loading.value = true;
  try {
    const colRef = collection(db, "users");
    
    // Pegar todos e filtrar no cliente para flexibilidade total com arrays e campos legados
    let q = query(colRef);
    
    const snapshot = await getDocs(q);
    const rawResults = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // Filter in memory
    results.value = rawResults.filter(user => {
       // Filtro Município (Checkbox - OR logic within filter, usually)
       if (filters.value.municipio.length > 0) {
           const selectedCities = filters.value.municipio;
           const userCities = user.municipios || [];
           const userCity = user.municipio; // legado
           
           // Se usuário atende a ALGUM dos municípios selecionados
           const match = selectedCities.some(city => 
             userCities.includes(city) || userCity === city
           );
           if (!match) return false;
       }

       // Filter Area (Checkbox)
       if (filters.value.area.length > 0) {
          const selectedAreas = filters.value.area;
          const userAreas = user.areasAtuacao || [];
          // Se usuário tem ALGUMA das áreas selecionadas
          const match = selectedAreas.some(a => userAreas.includes(a));
          if (!match) return false;
       }

       // Filter Material (Checkbox)
       if (filters.value.material.length > 0) {
         const selectedMaterials = filters.value.material;
         const userMaterials = user.materiaisTrabalhados || [];
         const match = selectedMaterials.some(m => userMaterials.includes(m));
         if (!match) return false;
       }
       
       // Only show public profiles
       if (!user.termoAceite) return false;

       return true;
    });

  } catch (err) {
    console.error("Error searching:", err);
  } finally {
    loading.value = false;
  }
}

function clearFilters() {
  filters.value = {
    municipio: [],
    area: [],
    material: []
  };
  search();
}

// Auth
onMounted(() => {
  search(); // Initial search
});

onAuthStateChanged(auth, (u) => {
  isAuthenticated.value = !!u;
});

async function handleLogout() {
  await signOut(auth);
  router.push("/login");
}
</script>

<style>
/* Leaflet fix for layout */
.leaflet-container {
  height: 100%;
  width: 100%;
  z-index: 1;
}

.text-primary { color: #16524a; }
.bg-primary { background-color: #16524a; }
.bg-primary\/20 { background-color: rgba(22, 82, 74, 0.2); }
</style>
