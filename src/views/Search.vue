<template>
  <div class="page">
    <WelcomeHeader v-if="isAuthenticated" @logout="handleLogout" />
    <Header v-else />

    <main class="content">
      <!-- Sidebar de filtros -->
      <aside class="sidebar">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6558" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" v-model="filters.keyword" placeholder="Buscar" />
        </div>

        <!-- Município -->
        <div class="filter-block">
          <button type="button" class="filter-header" @click="toggle('municipio')">
            <span>Município</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B6558" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ collapsed: !expanded.municipio }"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div v-if="expanded.municipio" class="chip-row">
            <span
              v-for="m in visibleMunicipios"
              :key="m"
              class="chip"
              :class="{ active: filters.municipio.includes(m) }"
              @click="toggleFilter('municipio', m)"
            >
              {{ m }} ({{ municipioCounts[m] || 0 }})
              <svg v-if="filters.municipio.includes(m)" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </span>
            <span class="chip-toggle" @click="showAllMunicipios = !showAllMunicipios">
              {{ showAllMunicipios ? '– ver menos' : '+ ver mais' }}
            </span>
          </div>
        </div>

        <!-- Tipo de perfil -->
        <div class="filter-block">
          <button type="button" class="filter-header" @click="toggle('tipo')">
            <span>Tipo de perfil</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B6558" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ collapsed: !expanded.tipo }"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div v-if="expanded.tipo" class="chip-row">
            <span
              v-for="t in tiposPerfil"
              :key="t"
              class="chip"
              :class="{ active: filters.tipo.includes(t) }"
              @click="toggleFilter('tipo', t)"
            >
              {{ t }} ({{ tipoCounts[t] || 0 }})
            </span>
          </div>
        </div>

        <!-- Materiais -->
        <div class="filter-block">
          <button type="button" class="filter-header" @click="toggle('materiais')">
            <span>Materiais</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B6558" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ collapsed: !expanded.materiais }"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div v-if="expanded.materiais" class="checklist-scroll">
            <div v-for="(opts, group) in profileOptions.materiaisTrabalhados" :key="group" class="checklist-group">
              <p class="group-label">{{ group }}</p>
              <label v-for="opt in opts" :key="opt" class="checklist-row">
                <input type="checkbox" :value="opt" v-model="filters.material" />
                {{ opt }}
              </label>
            </div>
          </div>
        </div>

        <!-- Áreas de atuação -->
        <div class="filter-block">
          <button type="button" class="filter-header" @click="toggle('areas')">
            <span>Áreas de atuação</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B6558" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ collapsed: !expanded.areas }"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div v-if="expanded.areas" class="checklist-scroll">
            <div v-for="(opts, group) in profileOptions.areasAtuacao" :key="group" class="checklist-group">
              <p class="group-label">{{ group }}</p>
              <label v-for="opt in opts" :key="opt" class="checklist-row">
                <input type="checkbox" :value="opt" v-model="filters.area" />
                {{ opt }}
              </label>
            </div>
          </div>
        </div>
      </aside>

      <!-- Resultados -->
      <div class="results-col">
        <div class="results-header">
          <span class="results-count">{{ filteredResults.length }} perfis encontrados</span>
          <button type="button" class="sort-toggle" @click="toggleSort">
            Ordenar: <strong>{{ sortMode === 'recentes' ? 'Recentes' : 'Nome (A-Z)' }}</strong>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4A453B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        </div>

        <div v-if="activeTags.length" class="active-tags">
          <span class="active-tags-label">Filtrado por:</span>
          <span v-for="tag in activeTags" :key="tag.key" class="tag">
            {{ tag.label }}
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#6B6558" stroke-width="3" stroke-linecap="round" @click="removeTag(tag)"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </span>
          <button type="button" class="clear-link" @click="clearFilters">Limpar</button>
        </div>

        <div v-if="loading" class="empty-state">Carregando...</div>
        <div v-else-if="filteredResults.length === 0" class="empty-state">
          Nenhum resultado encontrado com os filtros selecionados.
        </div>

        <div v-else class="result-list">
          <div v-for="r in filteredResults" :key="r.id" class="result-card" @click="router.push('/u/' + r.id)">
            <div class="result-icon" :style="{ background: tipoColor(classifyTipo(r)) + '1f' }"></div>
            <div class="result-body">
              <div class="result-top">
                <span class="result-name">{{ r.nome || r.nomeFantasia || 'Usuário sem nome' }}</span>
                <span class="result-badge" :style="badgeStyle(classifyTipo(r))">{{ classifyTipo(r) }}</span>
              </div>
              <div class="result-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6558" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>
                {{ r.municipio || (r.municipios && r.municipios[0]) || 'Município não informado' }}
              </div>
              <div v-if="resultTags(r).length" class="result-tags">
                <span v-for="(tag, i) in resultTags(r).slice(0, 2)" :key="i" class="mini-tag">{{ tag }}</span>
                <span v-if="resultTags(r).length > 2" class="mini-tag">+{{ resultTags(r).length - 2 }}</span>
              </div>
            </div>
            <router-link :to="'/u/' + r.id" class="ver-link" @click.stop>Ver →</router-link>
          </div>
        </div>
      </div>

      <!-- Mapa -->
      <div class="map-panel">
        <div class="map-title">Onde estão os agentes</div>

        <svg width="270" height="310" viewBox="0 0 400 460" xmlns="http://www.w3.org/2000/svg">
          <path d="M150 10 L200 25 L225 80 L290 70 L330 150 L295 195 L340 240 L320 310 L270 325 L255 385 L200 410 L175 355 L135 365 L105 310 L120 250 L85 200 L105 140 L75 95 L115 55 Z" fill="#2F5D3A"></path>
          <path d="M200 25 L290 70 L330 150 L295 195 L250 140 L210 80 Z" fill="#FFFFFF" opacity="0.12"></path>
          <path d="M105 310 L120 250 L175 355 L135 365 Z" fill="#000000" opacity="0.10"></path>

          <g v-for="pin in mapPins" :key="pin.key" :transform="`translate(${pin.x},${pin.y})`">
            <path d="M0,0 C-6.6,0 -12,-5.2 -12,-11.6 C-12,-20.3 0,-32 0,-32 C0,-32 12,-20.3 12,-11.6 C12,-5.2 6.6,0 0,0 Z" :fill="pin.color"></path>
            <circle cx="0" cy="-11.6" r="5" fill="#FFFFFF"></circle>
          </g>
        </svg>

        <div class="legend">
          <span class="legend-item"><span class="dot" style="background:#2F5D3A;"></span>Catador(a)</span>
          <span class="legend-item"><span class="dot" style="background:#B9622E;"></span>Cooperativa</span>
          <span class="legend-item"><span class="dot" style="background:#3B5A73;"></span>Empresa</span>
          <span class="legend-item"><span class="dot" style="background:#6B4E8E;"></span>Pesquisador(a)</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WelcomeHeader from '../components/WelcomeHeader.vue'
import Header from '../components/Header.vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import { auth, db } from '../services/firebase.js'
import { profileOptions } from '../data/profileOptions.js'

const router = useRouter()

const filters = reactive({
  keyword: '',
  municipio: [],
  tipo: [],
  area: [],
  material: [],
})

const expanded = reactive({ municipio: true, tipo: true, materiais: false, areas: false })
function toggle(key) { expanded[key] = !expanded[key] }

const showAllMunicipios = ref(false)
const visibleMunicipios = computed(() =>
  showAllMunicipios.value ? profileOptions.municipios : profileOptions.municipios.slice(0, 6)
)

const tiposPerfil = ['Catador(a)', 'Cooperativa', 'Empresa', 'Pesquisador(a)']

const allResults = ref([])
const loading = ref(false)
const isAuthenticated = ref(false)
const sortMode = ref('recentes')

function toggleSort() {
  sortMode.value = sortMode.value === 'recentes' ? 'nome' : 'recentes'
}

function toggleFilter(kind, value) {
  const arr = filters[kind]
  const i = arr.indexOf(value)
  if (i === -1) arr.push(value)
  else arr.splice(i, 1)
}

function clearFilters() {
  filters.keyword = ''
  filters.municipio = []
  filters.tipo = []
  filters.area = []
  filters.material = []
}

const TIPO_COLORS = {
  'Catador(a)': '#2F5D3A',
  'Cooperativa': '#B9622E',
  'Empresa': '#3B5A73',
  'Pesquisador(a)': '#6B4E8E',
}
function tipoColor(tipo) { return TIPO_COLORS[tipo] || TIPO_COLORS['Catador(a)'] }
function badgeStyle(tipo) {
  const color = tipoColor(tipo)
  return { background: color + '1f', color }
}

// Deriva um dos 4 "tipos de perfil" do handoff a partir dos campos reais
// do cadastro (tipoCadastro / ocupação / tipo de organização).
function classifyTipo(p) {
  const occ = (p.ocupacao || '').toLowerCase()
  const org = (p.tipoOrganizacao || '').toLowerCase()
  if (occ.includes('pesquisad') || occ.includes('extensionista')) return 'Pesquisador(a)'
  if (org.includes('cooperativa') || occ.includes('cooperativa')) return 'Cooperativa'
  if (p.tipoCadastro === 'PJ' || org.includes('empresa') || org.includes('órgão') || org.includes('associa')) {
    return org.includes('cooperativa') ? 'Cooperativa' : 'Empresa'
  }
  if (occ.includes('catador') || occ.includes('triador') || occ.includes('reciclador')) return 'Catador(a)'
  return 'Catador(a)'
}

function resultTags(r) {
  return [...(r.materiaisTrabalhados || []), ...(r.areasAtuacao || [])]
}

async function loadResults() {
  loading.value = true
  try {
    const snapshot = await getDocs(collection(db, 'users'))
    allResults.value = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((u) => u.termoAceite)
  } catch (err) {
    console.error('Erro ao buscar perfis:', err)
  } finally {
    loading.value = false
  }
}

const municipioCounts = computed(() => {
  const counts = {}
  allResults.value.forEach((r) => {
    const cities = r.municipios && r.municipios.length ? r.municipios : (r.municipio ? [r.municipio] : [])
    cities.forEach((c) => { counts[c] = (counts[c] || 0) + 1 })
  })
  return counts
})

const tipoCounts = computed(() => {
  const counts = {}
  allResults.value.forEach((r) => {
    const t = classifyTipo(r)
    counts[t] = (counts[t] || 0) + 1
  })
  return counts
})

const filteredResults = computed(() => {
  let list = allResults.value.filter((r) => {
    if (filters.keyword) {
      const name = (r.nome || r.nomeFantasia || '').toLowerCase()
      if (!name.includes(filters.keyword.toLowerCase())) return false
    }
    if (filters.municipio.length) {
      const cities = r.municipios && r.municipios.length ? r.municipios : (r.municipio ? [r.municipio] : [])
      if (!filters.municipio.some((c) => cities.includes(c))) return false
    }
    if (filters.tipo.length && !filters.tipo.includes(classifyTipo(r))) return false
    if (filters.area.length) {
      const areas = r.areasAtuacao || []
      if (!filters.area.some((a) => areas.includes(a))) return false
    }
    if (filters.material.length) {
      const materiais = r.materiaisTrabalhados || []
      if (!filters.material.some((m) => materiais.includes(m))) return false
    }
    return true
  })

  if (sortMode.value === 'nome') {
    list = [...list].sort((a, b) =>
      (a.nome || a.nomeFantasia || '').localeCompare(b.nome || b.nomeFantasia || '')
    )
  } else {
    list = [...list].sort((a, b) => (b.atualizadoEm || b.createdAt || '').localeCompare(a.atualizadoEm || a.createdAt || ''))
  }
  return list
})

const activeTags = computed(() => {
  const tags = []
  filters.municipio.forEach((m) => tags.push({ key: `municipio-${m}`, kind: 'municipio', value: m, label: m }))
  filters.tipo.forEach((t) => tags.push({ key: `tipo-${t}`, kind: 'tipo', value: t, label: t }))
  filters.area.forEach((a) => tags.push({ key: `area-${a}`, kind: 'area', value: a, label: a }))
  filters.material.forEach((m) => tags.push({ key: `material-${m}`, kind: 'material', value: m, label: m }))
  return tags
})

function removeTag(tag) {
  toggleFilter(tag.kind, tag.value)
}

// Coordenadas aproximadas (no viewBox 400x460 do SVG) dos 16 municípios do
// Amapá, projetadas a partir da latitude/longitude real de cada um.
const municipioCoords = {
  'Amapá': [308, 165],
  'Calçoene': [288, 131],
  'Cutias': [307, 246],
  'Ferreira Gomes': [260, 255],
  'Itaubal': [315, 274],
  'Laranjal do Jari': [90, 383],
  'Macapá': [273, 317],
  'Mazagão': [246, 328],
  'Oiapoque': [178, 30],
  'Pedra Branca do Amapari': [163, 261],
  'Porto Grande': [230, 266],
  'Pracuúba': [308, 188],
  'Santana': [259, 324],
  'Serra do Navio': [157, 251],
  'Tartarugalzinho': [293, 206],
  'Vitória do Jari': [104, 390],
}

const mapPins = computed(() => {
  const pins = []
  const perCity = {}
  filteredResults.value.forEach((r) => {
    const cities = r.municipios && r.municipios.length ? r.municipios : (r.municipio ? [r.municipio] : [])
    const city = cities[0]
    const base = municipioCoords[city] || municipioCoords['Macapá']
    const n = perCity[city] || 0
    perCity[city] = n + 1
    // pequeno deslocamento em espiral para não empilhar pins exatamente no mesmo ponto
    const angle = n * 2.4
    const radius = n === 0 ? 0 : 6 + n * 3
    pins.push({
      key: r.id,
      x: base[0] + Math.cos(angle) * radius,
      y: base[1] + Math.sin(angle) * radius,
      color: tipoColor(classifyTipo(r)),
    })
  })
  return pins
})

onMounted(() => {
  loadResults()
})

onAuthStateChanged(auth, (u) => {
  isAuthenticated.value = !!u
})

async function handleLogout() {
  await signOut(auth)
  router.push('/login')
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; }
.content {
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 28px 56px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;
}

.sidebar { width: 236px; flex-shrink: 0; display: flex; flex-direction: column; gap: 18px; }
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFFFFF;
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  padding: 9px 12px;
}
.search-box input { border: none; outline: none; background: transparent; font-size: 13.5px; flex: 1; color: var(--color-text); width: 100%; }

.filter-block { display: flex; flex-direction: column; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border); }
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 13.5px;
  color: var(--color-text);
  font-family: var(--font-sans);
}
.filter-header svg { transition: transform 0.15s ease; }
.filter-header svg.collapsed { transform: rotate(-90deg); }

.chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #FFFFFF;
  border: 1px solid var(--color-border-2);
  color: var(--color-text-2);
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
}
.chip.active { background: var(--color-accent); color: #FFFFFF; border-color: var(--color-accent); }
.chip-toggle { color: var(--color-accent); font-size: 12px; font-weight: 600; padding: 5px 2px; cursor: pointer; }

.checklist-scroll { max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
.group-label { margin: 4px 0 2px 0; font-size: 11px; font-weight: 700; color: var(--color-text-3); text-transform: uppercase; }
.checklist-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--color-text-2); margin-bottom: 4px; }

.results-col { flex: 1; min-width: 320px; display: flex; flex-direction: column; gap: 14px; }
.results-header { display: flex; align-items: center; justify-content: space-between; }
.results-count { font-size: 13.5px; color: var(--color-text-3); }
.sort-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-2);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
}
.sort-toggle strong { color: var(--color-text); }

.active-tags { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.active-tags-label { font-size: 12.5px; color: var(--color-text-3); }
.tag {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--color-chip-bg);
  color: var(--color-text);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: 999px;
}
.tag svg { cursor: pointer; }
.clear-link { background: none; border: none; font-size: 12px; color: var(--color-accent); font-weight: 600; cursor: pointer; }

.empty-state { text-align: center; padding: 40px 0; color: var(--color-text-3); background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px; }

.result-list { display: flex; flex-direction: column; gap: 12px; }
.result-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.15s ease;
}
.result-card:hover { box-shadow: 0 2px 10px rgba(28,27,23,0.06); }
.result-icon { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; }
.result-body { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.result-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.result-name { font-weight: 700; font-size: 14px; color: var(--color-text); }
.result-badge { font-size: 10.5px; font-weight: 700; padding: 3px 8px; border-radius: 999px; flex-shrink: 0; }
.result-location { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--color-text-3); }
.result-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px; }
.mini-tag { background: var(--color-chip-bg); color: var(--color-text-2); font-size: 11px; padding: 3px 8px; border-radius: 999px; }
.ver-link { font-weight: 600; font-size: 12.5px; color: var(--color-accent); flex-shrink: 0; align-self: center; text-decoration: none; }

.map-panel {
  width: 420px;
  flex-shrink: 0;
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  height: fit-content;
}
.map-title { align-self: flex-start; font-weight: 600; font-size: 14px; color: var(--color-text); }
.legend { display: flex; flex-wrap: wrap; gap: 10px 14px; justify-content: center; align-self: stretch; padding-top: 12px; border-top: 1px solid var(--color-border); }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--color-text-2); }
.dot { width: 9px; height: 9px; border-radius: 999px; display: inline-block; }

@media (max-width: 1200px) {
  .content { padding: 20px; }
  .sidebar { width: 100%; }
  .map-panel { width: 100%; }
}
</style>
