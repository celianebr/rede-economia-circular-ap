<template>
  <div class="page">
    <WelcomeHeader v-if="isAuthenticated" @logout="handleLogout" />
    <Header v-else />

    <main class="content">
      <div class="toolbar rep-switcher">
        <div class="switch-group">
          <span class="switch-label">Ver como:</span>
          <button type="button" class="pill" :class="{ active: view === 'painel' }" @click="view = 'painel'">
            Painel executivo
          </button>
          <button type="button" class="pill" :class="{ active: view === 'narrativo' }" @click="view = 'narrativo'">
            Relatório narrativo
          </button>
        </div>
        <div class="action-group">
          <button type="button" class="btn-outline-sm" @click="exportarCSV" :disabled="loading || !total">Exportar CSV</button>
          <button type="button" class="btn-solid-sm" @click="imprimir" :disabled="loading || !total">Baixar PDF</button>
        </div>
      </div>

      <div v-if="loading" class="state-box">Carregando dados...</div>
      <div v-else-if="erro" class="state-box">{{ erro }}</div>
      <div v-else-if="!total" class="state-box">Ainda não há cadastros públicos suficientes para gerar o relatório.</div>

      <!-- ============ PAINEL EXECUTIVO ============ -->
      <article v-else-if="view === 'painel'" class="sheet">
        <header class="sheet-head">
          <h1 class="doc-title">Relatório da Rede de Agentes da Economia Circular do Amapá</h1>
          <p class="doc-meta">Gerado automaticamente em {{ dataGeracao }} · dados agregados e anonimizados</p>
        </header>

        <div class="sheet-body">
          <div class="kpis">
            <div class="kpi">
              <div class="kpi-value">{{ total }}</div>
              <div class="kpi-label">Agentes cadastrados</div>
            </div>
            <div class="kpi">
              <div class="kpi-value">{{ municipiosComAgentes }}</div>
              <div class="kpi-label">dos 16 municípios com agentes</div>
            </div>
            <div class="kpi">
              <div class="kpi-value">{{ tipoCounts['Cooperativa'] || 0 }}</div>
              <div class="kpi-label">Cooperativas ativas</div>
            </div>
            <div class="kpi">
              <div class="kpi-value">{{ areasDistintas }}</div>
              <div class="kpi-label">Áreas de atuação mapeadas</div>
            </div>
          </div>

          <div class="two-col">
            <section>
              <h2 class="sec-title">Agentes por tipo</h2>
              <div class="bar-list">
                <div v-for="t in tiposOrdenados" :key="t.nome" class="bar-row">
                  <span class="bar-name">{{ t.nome }}</span>
                  <div class="bar-track">
                    <div class="bar-fill" :style="{ width: t.pctBarra + '%', background: tipoColor(t.nome) }"></div>
                  </div>
                  <span class="bar-count">{{ t.qtd }}</span>
                </div>
              </div>
            </section>

            <section>
              <h2 class="sec-title">Municípios com mais agentes</h2>
              <ol class="rank-list">
                <li v-for="(m, i) in municipiosTop" :key="m.nome" class="rank-row">
                  <span class="rank-pos">{{ i + 1 }}</span>
                  <span class="rank-name">{{ m.nome }}</span>
                  <span class="rank-count">{{ m.qtd }}</span>
                </li>
              </ol>
            </section>
          </div>

          <div class="two-col">
            <section>
              <h2 class="sec-title">Áreas de atuação mais frequentes</h2>
              <div class="chips">
                <span v-for="a in areasTop" :key="a.nome" class="chip">{{ a.nome }} <strong>{{ a.qtd }}</strong></span>
              </div>
            </section>
            <section>
              <h2 class="sec-title">Materiais mais trabalhados</h2>
              <div class="chips">
                <span v-for="m in materiaisTop" :key="m.nome" class="chip">{{ m.nome }} <strong>{{ m.qtd }}</strong></span>
              </div>
            </section>
          </div>
        </div>

        <footer class="sheet-foot">{{ notaPrivacidade }}</footer>
      </article>

      <!-- ============ RELATÓRIO NARRATIVO ============ -->
      <article v-else class="sheet narrative">
        <header class="sheet-head narrative-head">
          <p class="eyebrow">Instituto Movimento Lixo Zero Amapá · IMOLIZEAP</p>
          <h1 class="doc-title">Relatório da Rede de Agentes da Economia Circular do Amapá</h1>
          <p class="doc-lead">
            Panorama consolidado dos agentes cadastrados na plataforma até {{ dataGeracao }}, com base nos
            dados que cada agente autorizou tornar públicos.
          </p>
        </header>

        <div class="sheet-body narrative-body">
          <section class="n-sec">
            <h2 class="n-title">1. Panorama geral</h2>
            <p>
              Até a data de geração deste relatório, a Rede de Agentes da Economia Circular do Amapá conta com
              <strong>{{ total }} cadastros ativos</strong>, distribuídos em
              <strong>{{ municipiosComAgentes }} dos 16 municípios</strong> do estado. Desse total, {{ resumoTipos }}.
            </p>
            <p v-if="municipiosTop.length">
              O município com mais agentes cadastrados é <strong>{{ municipiosTop[0].nome }}</strong>, com
              {{ municipiosTop[0].qtd }} cadastro{{ municipiosTop[0].qtd === 1 ? '' : 's' }}
              ({{ formatPct(municipiosTop[0].qtd / total) }} do total).
            </p>
          </section>

          <section class="n-sec">
            <h2 class="n-title">2. Distribuição por tipo de agente</h2>
            <table class="r-table">
              <thead>
                <tr><th>Tipo</th><th>Agentes</th><th class="num">% do total</th></tr>
              </thead>
              <tbody>
                <tr v-for="t in tiposOrdenados" :key="t.nome">
                  <td><strong>{{ t.nome }}</strong></td>
                  <td>{{ t.qtd }}</td>
                  <td class="num">{{ formatPct(t.qtd / total) }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="n-sec">
            <h2 class="n-title">3. Distribuição geográfica</h2>
            <table class="r-table">
              <thead>
                <tr><th>Município</th><th>Agentes</th><th class="num">% do total</th></tr>
              </thead>
              <tbody>
                <tr v-for="m in municipiosTop" :key="m.nome">
                  <td><strong>{{ m.nome }}</strong></td>
                  <td>{{ m.qtd }}</td>
                  <td class="num">{{ formatPct(m.qtd / total) }}</td>
                </tr>
                <tr v-if="demaisMunicipios.qtdMunicipios > 0">
                  <td><strong>Demais {{ demaisMunicipios.qtdMunicipios }} município{{ demaisMunicipios.qtdMunicipios === 1 ? '' : 's' }}</strong></td>
                  <td>{{ demaisMunicipios.qtd }}</td>
                  <td class="num">{{ formatPct(demaisMunicipios.qtd / total) }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="n-sec">
            <h2 class="n-title">4. Áreas de atuação e materiais mais frequentes</h2>
            <div class="two-col lists">
              <div>
                <h3 class="n-sub">Áreas de atuação</h3>
                <ul class="plain-list">
                  <li v-for="a in areasTop.slice(0, 5)" :key="a.nome">{{ a.nome }} — {{ a.qtd }} agente{{ a.qtd === 1 ? '' : 's' }}</li>
                </ul>
              </div>
              <div>
                <h3 class="n-sub">Materiais trabalhados</h3>
                <ul class="plain-list">
                  <li v-for="m in materiaisTop.slice(0, 5)" :key="m.nome">{{ m.nome }} — {{ m.qtd }} agente{{ m.qtd === 1 ? '' : 's' }}</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="n-sec">
            <h2 class="n-title">5. Metodologia e privacidade dos dados</h2>
            <p>
              Os números apresentados são calculados automaticamente a partir dos perfis cadastrados na plataforma
              que autorizaram a exibição pública das informações. Cada agente é contado uma única vez, no primeiro
              município informado em seu cadastro. Este relatório mostra apenas dados agregados e estatísticos:
              nenhum nome, telefone, e-mail ou dado de contato individual é exibido aqui, mesmo quando o agente
              autorizou sua exibição no perfil público.
            </p>
            <div class="note-box">
              Documento gerado automaticamente pela plataforma em {{ dataGeracao }}. Para consultar agentes
              individualmente, utilize a página de Pesquisa.
            </div>
          </section>
        </div>
      </article>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import { auth, db } from '../services/firebase.js'
import WelcomeHeader from '../components/WelcomeHeader.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { TIPOS, tipoColor, classifyTipo } from '../utils/tipoPerfil.js'

const router = useRouter()

const view = ref('painel')
const loading = ref(true)
const erro = ref('')
const agentes = ref([])
const isAuthenticated = ref(false)

// Plural em português usado na frase do panorama geral
const TIPO_PLURAL = {
  'Catador(a)': ['catador(a)', 'catadores(as)'],
  'Cooperativa': ['cooperativa', 'cooperativas'],
  'Empresa': ['empresa', 'empresas'],
  'Pesquisador(a)': ['pesquisador(a)', 'pesquisadores(as)'],
  'Outros': ['agente de outro perfil', 'agentes de outros perfis'],
}


function primeiroMunicipio(p) {
  if (p.municipios && p.municipios.length) return p.municipios[0]
  return p.municipio || ''
}

function formatPct(fracao) {
  return (fracao * 100).toFixed(1).replace('.', ',') + '%'
}

const total = computed(() => agentes.value.length)

const dataGeracao = computed(() =>
  new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
)

const tipoCounts = computed(() => {
  const c = {}
  agentes.value.forEach((a) => { const t = classifyTipo(a); c[t] = (c[t] || 0) + 1 })
  return c
})

const tiposOrdenados = computed(() => {
  const lista = TIPOS.map((nome) => ({ nome, qtd: tipoCounts.value[nome] || 0 }))
    .filter((t) => t.nome !== 'Outros' || t.qtd > 0)
    .sort((a, b) => b.qtd - a.qtd)
  const max = Math.max(1, ...lista.map((t) => t.qtd))
  return lista.map((t) => ({ ...t, pctBarra: (t.qtd / max) * 100 }))
})

const municipioCounts = computed(() => {
  const c = {}
  agentes.value.forEach((a) => {
    const m = primeiroMunicipio(a)
    if (m) c[m] = (c[m] || 0) + 1
  })
  return c
})

const municipiosOrdenados = computed(() =>
  Object.entries(municipioCounts.value)
    .map(([nome, qtd]) => ({ nome, qtd }))
    .sort((a, b) => b.qtd - a.qtd || a.nome.localeCompare(b.nome))
)
const municipiosTop = computed(() => municipiosOrdenados.value.slice(0, 5))
const municipiosComAgentes = computed(() => municipiosOrdenados.value.length)
const demaisMunicipios = computed(() => {
  const resto = municipiosOrdenados.value.slice(5)
  return { qtdMunicipios: resto.length, qtd: resto.reduce((s, m) => s + m.qtd, 0) }
})

function countListField(field) {
  const c = {}
  agentes.value.forEach((a) => {
    const lista = Array.isArray(a[field]) ? a[field] : []
    new Set(lista).forEach((item) => {
      if (item && item !== 'Outro') c[item] = (c[item] || 0) + 1
    })
  })
  return Object.entries(c)
    .map(([nome, qtd]) => ({ nome, qtd }))
    .sort((a, b) => b.qtd - a.qtd || a.nome.localeCompare(b.nome))
}

const areasTodas = computed(() => countListField('areasAtuacao'))
const materiaisTodos = computed(() => countListField('materiaisTrabalhados'))
const areasTop = computed(() => areasTodas.value.slice(0, 6))
const materiaisTop = computed(() => materiaisTodos.value.slice(0, 6))
const areasDistintas = computed(() => areasTodas.value.length)

// "19 catadores(as), 16 empresas, 13 pesquisadores(as) e 8 cooperativas"
const resumoTipos = computed(() => {
  const partes = tiposOrdenados.value
    .filter((t) => t.qtd > 0)
    .map((t) => `${t.qtd} ${TIPO_PLURAL[t.nome][t.qtd === 1 ? 0 : 1]}`)
  if (partes.length <= 1) return partes[0] || 'nenhum agente classificado'
  return partes.slice(0, -1).join(', ') + ' e ' + partes[partes.length - 1]
})

const notaPrivacidade =
  'Relatório gerado a partir dos cadastros que autorizaram exibição pública. Os dados são apresentados de forma agregada — nomes, telefones e e-mails individuais não constam neste documento, mesmo quando o agente autorizou exibi-los em seu perfil público.'

async function carregar() {
  loading.value = true
  erro.value = ''
  try {
    const snapshot = await getDocs(collection(db, 'users'))
    agentes.value = snapshot.docs.map((d) => d.data()).filter((u) => u.termoAceite)
  } catch (err) {
    console.error('Erro ao carregar dados do relatório:', err)
    erro.value = 'Não foi possível carregar os dados agora. Tente novamente em instantes.'
  } finally {
    loading.value = false
  }
}

// CSV com ponto e vírgula: no Excel em português o separador de campos é ";"
// (a vírgula é o separador decimal, ex.: "53,6%").
function exportarCSV() {
  const esc = (v) => {
    const s = String(v ?? '')
    return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const linhas = []
  const add = (...cols) => linhas.push(cols.map(esc).join(';'))

  add('Relatório da Rede de Agentes da Economia Circular do Amapá')
  add('Gerado em', dataGeracao.value)
  add('Total de agentes', total.value)
  add('')
  add('Distribuição por tipo')
  add('Tipo', 'Agentes', '% do total')
  tiposOrdenados.value.forEach((t) => add(t.nome, t.qtd, formatPct(t.qtd / total.value)))
  add('')
  add('Distribuição por município (primeiro município informado)')
  add('Município', 'Agentes', '% do total')
  municipiosOrdenados.value.forEach((m) => add(m.nome, m.qtd, formatPct(m.qtd / total.value)))
  add('')
  add('Áreas de atuação')
  add('Área', 'Agentes')
  areasTodas.value.forEach((a) => add(a.nome, a.qtd))
  add('')
  add('Materiais trabalhados')
  add('Material', 'Agentes')
  materiaisTodos.value.forEach((m) => add(m.nome, m.qtd))

  const blob = new Blob(['﻿' + linhas.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `relatorio-rede-agentes-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function imprimir() {
  window.print()
}

async function handleLogout() {
  await signOut(auth)
  router.push('/login')
}

onMounted(() => {
  carregar()
})

onAuthStateChanged(auth, (u) => {
  isAuthenticated.value = !!u
})
</script>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; }
.content { flex: 1; width: 100%; max-width: 1040px; margin: 0 auto; padding: 28px 20px 48px; box-sizing: border-box; }

.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.switch-group, .action-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.switch-label { font-size: 13px; color: var(--color-text-3); }
.pill {
  background: #FFFFFF; border: 1px solid var(--color-border-2); color: var(--color-text);
  font-weight: 600; font-size: 13px; padding: 9px 18px; border-radius: 999px; cursor: pointer; font-family: var(--font-sans);
}
.pill.active { background: var(--color-accent); border-color: var(--color-accent); color: #FFFFFF; }
.btn-outline-sm, .btn-solid-sm {
  font-weight: 600; font-size: 13px; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: var(--font-sans);
}
.btn-outline-sm { background: #FFFFFF; border: 1px solid var(--color-border-2); color: var(--color-text); }
.btn-solid-sm { background: var(--color-accent); border: 1px solid var(--color-accent); color: #FFFFFF; }
.btn-outline-sm:disabled, .btn-solid-sm:disabled { opacity: 0.5; cursor: not-allowed; }

.state-box { text-align: center; padding: 48px 16px; color: var(--color-text-3); background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 12px; }

.sheet { background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 16px; overflow: hidden; }
.sheet-head { padding: 36px 40px 24px; border-bottom: 1px solid var(--color-border); }
.doc-title { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: 26px; line-height: 1.25; color: var(--color-text); }
.doc-meta { margin: 10px 0 0; font-size: 12.5px; color: var(--color-text-3); }
.sheet-body { padding: 28px 40px 36px; display: flex; flex-direction: column; gap: 32px; }
.sheet-foot { padding: 20px 40px 28px; border-top: 1px solid var(--color-border); font-size: 11.5px; line-height: 1.6; color: var(--color-text-3); }

.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.kpi { background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; }
.kpi-value { font-family: var(--font-display); font-weight: 600; font-size: 30px; color: var(--color-accent); }
.kpi-label { margin-top: 4px; font-size: 12.5px; color: var(--color-text-2); }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.sec-title { margin: 0 0 14px; font-family: var(--font-display); font-weight: 600; font-size: 17px; color: var(--color-text); }

.bar-list { display: flex; flex-direction: column; gap: 14px; }
.bar-row { display: grid; grid-template-columns: 110px 1fr 32px; align-items: center; gap: 12px; font-size: 13px; }
.bar-name { color: var(--color-text-2); }
.bar-track { background: var(--color-bg); height: 10px; border-radius: 999px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 999px; }
.bar-count { text-align: right; font-weight: 700; color: var(--color-text); }

.rank-list { list-style: none; margin: 0; padding: 0; }
.rank-row { display: grid; grid-template-columns: 26px 1fr auto; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--color-border); font-size: 13.5px; }
.rank-row:last-child { border-bottom: none; }
.rank-pos { width: 20px; height: 20px; border-radius: 999px; background: var(--color-chip-bg); color: var(--color-text-3); font-size: 11px; display: flex; align-items: center; justify-content: center; }
.rank-name { color: var(--color-text); }
.rank-count { font-weight: 700; color: var(--color-text); }

.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 999px; padding: 6px 13px; font-size: 12.5px; color: var(--color-text-2); }
.chip strong { color: var(--color-accent); margin-left: 3px; }

/* Narrativo */
.narrative-head { border-bottom: 2px solid var(--color-text); }
.eyebrow { margin: 0 0 8px; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-3); }
.doc-lead { margin: 12px 0 0; max-width: 620px; font-size: 14.5px; line-height: 1.6; color: var(--color-text-2); }
.narrative-body { gap: 0; }
.n-sec { padding: 24px 0; border-bottom: 1px solid var(--color-border); font-size: 14px; line-height: 1.7; color: var(--color-text-2); }
.n-sec:last-child { border-bottom: none; }
.n-sec p { margin: 0 0 10px; }
.n-title { margin: 0 0 14px; font-family: var(--font-display); font-weight: 600; font-size: 17px; color: var(--color-text); }
.n-sub { margin: 0 0 8px; font-size: 14px; font-weight: 700; color: var(--color-text); }
.plain-list { margin: 0; padding-left: 18px; font-size: 13.5px; line-height: 1.9; }
.lists { gap: 32px; }

.r-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.r-table th { text-align: left; font-size: 11.5px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--color-text-3); padding: 10px; border-bottom: 2px solid var(--color-text); }
.r-table td { padding: 10px; border-bottom: 1px solid var(--color-border); color: var(--color-text); }
.r-table .num { text-align: right; }

.note-box { margin-top: 12px; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 10px; padding: 14px 16px; font-size: 12px; line-height: 1.6; color: var(--color-text-3); }

@media (max-width: 760px) {
  .sheet-head, .sheet-body, .sheet-foot { padding-left: 20px; padding-right: 20px; }
  .kpis { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; gap: 28px; }
  .doc-title { font-size: 21px; }
  .bar-row { grid-template-columns: 90px 1fr 28px; }
}

@media print {
  :global(.site-header), :global(.site-footer), .rep-switcher { display: none !important; }
  .content { max-width: none; padding: 0; }
  .sheet { border: none; border-radius: 0; }
  .sheet-head, .sheet-body, .sheet-foot { padding-left: 0; padding-right: 0; }
  .kpi, .chip, .note-box, .bar-track { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .bar-fill, .pill { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .n-sec, .kpis, .two-col { break-inside: avoid; }
}
</style>
