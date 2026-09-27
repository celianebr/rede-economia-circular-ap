<template>
  <div class="page">
    <WelcomeHeader @logout="handleLogout" />

    <main class="content">
      <div class="main-col">
        <div class="progress-block">
          <div class="progress-label">
            <span>Etapa {{ step }} de 3</span>
            <span>{{ stepLabel }}</span>
          </div>
          <div class="progress-bar">
            <div class="segment" :class="{ filled: step >= 1 }"></div>
            <div class="segment" :class="{ filled: step >= 2 }"></div>
            <div class="segment" :class="{ filled: step >= 3 }"></div>
          </div>
        </div>

        <div class="step-card">
          <!-- Etapa 1: Informações básicas -->
          <template v-if="step === 1">
            <div class="card-heading">
              <h1>Complete seu perfil</h1>
              <p>Só o essencial para começar — o resto você preenche quando quiser.</p>
            </div>

            <div class="field">
              <span class="field-label">Tipo de cadastro</span>
              <div class="type-toggle">
                <button
                  type="button"
                  class="type-btn"
                  :class="{ active: form.tipoCadastro === 'PF' }"
                  @click="form.tipoCadastro = 'PF'"
                >Pessoa Física</button>
                <button
                  type="button"
                  class="type-btn"
                  :class="{ active: form.tipoCadastro === 'PJ' }"
                  @click="form.tipoCadastro = 'PJ'"
                >Pessoa Jurídica</button>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label for="nome">{{ isPJ ? 'Nome da instituição' : 'Nome completo' }}</label>
                <input id="nome" v-model="form.nome" type="text" :placeholder="isPJ ? 'Nome da instituição' : 'Seu nome'" />
              </div>
              <div class="field">
                <label for="tel">Telefone / WhatsApp</label>
                <input id="tel" v-model="form.telefone" type="text" placeholder="(96) 90000-0000" />
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label for="municipio">Município de atuação</label>
                <select id="municipio" v-model="form.municipio">
                  <option value="" disabled>Selecione...</option>
                  <option v-for="m in profileOptions.municipios" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
              <div class="field">
                <label for="ocupacao">{{ isPJ ? 'Tipo de organização' : 'Ocupação atual' }}</label>
                <select id="ocupacao" v-model="form.ocupacao">
                  <option value="" disabled>Selecione...</option>
                  <option v-for="opt in ocupacaoOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
            </div>

            <div class="actions">
              <button type="button" class="btn" @click="saveStep1" :disabled="saving">
                {{ saving ? 'Salvando...' : 'Continuar' }}
              </button>
            </div>
          </template>

          <!-- Etapa 2: Áreas de atuação (opcional) -->
          <template v-else-if="step === 2">
            <div class="card-heading">
              <h1>Áreas de atuação</h1>
              <p>Opcional — ajuda outros agentes a te encontrarem por especialidade.</p>
            </div>

            <div class="checkbox-groups">
              <div v-for="(options, group) in profileOptions.areasAtuacao" :key="group" class="checkbox-group">
                <h4>{{ group }}</h4>
                <div class="checkbox-grid">
                  <label v-for="opt in options" :key="opt" class="checkbox-item">
                    <input type="checkbox" :value="opt" v-model="form.areasAtuacao" />
                    {{ opt }}
                  </label>
                </div>
              </div>
            </div>

            <div class="actions">
              <button type="button" class="link-skip" @click="goToStep(3)">Pular esta etapa</button>
              <button type="button" class="btn" @click="saveStep2" :disabled="saving">
                {{ saving ? 'Salvando...' : 'Continuar' }}
              </button>
            </div>
          </template>

          <!-- Etapa 3: Materiais trabalhados (opcional) -->
          <template v-else>
            <div class="card-heading">
              <h1>Materiais trabalhados</h1>
              <p>Opcional — ajuda quem procura por materiais específicos.</p>
            </div>

            <div class="checkbox-groups">
              <div v-for="(options, group) in profileOptions.materiaisTrabalhados" :key="group" class="checkbox-group">
                <h4>{{ group }}</h4>
                <div class="checkbox-grid">
                  <label v-for="opt in options" :key="opt" class="checkbox-item">
                    <input type="checkbox" :value="opt" v-model="form.materiaisTrabalhados" />
                    {{ opt }}
                  </label>
                </div>
              </div>
            </div>

            <div class="actions">
              <button type="button" class="link-skip" @click="finish(false)">Pular esta etapa</button>
              <button type="button" class="btn" @click="finish(true)" :disabled="saving">
                {{ saving ? 'Salvando...' : 'Concluir' }}
              </button>
            </div>
          </template>
        </div>
      </div>

      <aside class="side-col">
        <div class="progress-card">
          <div class="progress-card-heading">
            <span>Progresso do perfil</span>
            <span class="progress-pct">{{ progressPct }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
          </div>
          <p class="progress-desc">
            <template v-if="step === 1">
              Preencha os dados básicos para o seu perfil já aparecer no mapa da rede.
            </template>
            <template v-else>
              Seu perfil já aparece no mapa com essas informações básicas. Complete as próximas etapas quando quiser.
            </template>
          </p>

          <div class="checklist">
            <div class="checklist-item">
              <span class="check-icon done">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span class="checklist-label">Dados de acesso</span>
            </div>

            <div class="checklist-item">
              <span class="check-icon" :class="step > 1 ? 'done' : 'current'">
                <svg v-if="step > 1" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
              <span class="checklist-label" :class="{ current: step === 1 }">Informações básicas</span>
            </div>

            <div class="checklist-item spread">
              <div class="checklist-item">
                <span class="check-icon" :class="step > 2 ? 'done' : (step === 2 ? 'current' : '')">
                  <svg v-if="step > 2" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                <span class="checklist-label" :class="{ current: step === 2 }">Áreas de atuação</span>
              </div>
              <span v-if="step <= 2" class="badge-optional">opcional</span>
            </div>

            <div class="checklist-item spread">
              <div class="checklist-item">
                <span class="check-icon" :class="step === 3 ? 'current' : ''"></span>
                <span class="checklist-label" :class="{ current: step === 3 }">Materiais trabalhados</span>
              </div>
              <span class="badge-optional">opcional</span>
            </div>
          </div>
        </div>

        <router-link v-if="step > 1" to="/profile" class="skip-all">
          Pular etapas opcionais e ver meu perfil
        </router-link>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import WelcomeHeader from '../components/WelcomeHeader.vue'
import { salvarPerfil, buscarPerfil } from '../services/firestoreService.js'
import { profileOptions } from '../data/profileOptions.js'

const router = useRouter()
const userId = ref('')
const step = ref(1)
const saving = ref(false)

const form = ref({
  tipoCadastro: 'PF',
  nome: '',
  telefone: '',
  municipio: '',
  ocupacao: '',
  areasAtuacao: [],
  materiaisTrabalhados: [],
})

const isPJ = computed(() => form.value.tipoCadastro === 'PJ')
const ocupacaoOptions = computed(() =>
  isPJ.value ? profileOptions.tiposOrganizacao : profileOptions.situacaoProfissional
)

const stepLabel = computed(() => {
  if (step.value === 1) return 'Informações básicas'
  if (step.value === 2) return 'Áreas de atuação'
  return 'Materiais trabalhados'
})

const progressPct = computed(() => {
  if (step.value === 1) return 33
  if (step.value === 2) return 66
  return 100
})

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, async (u) => {
    if (!u) {
      router.push('/login')
      return
    }
    userId.value = u.uid
    const data = await buscarPerfil(userId.value)
    if (data) {
      form.value = {
        ...form.value,
        ...data,
        areasAtuacao: Array.isArray(data.areasAtuacao) ? data.areasAtuacao : [],
        materiaisTrabalhados: Array.isArray(data.materiaisTrabalhados) ? data.materiaisTrabalhados : [],
      }
    }
  })
})

function goToStep(n) {
  step.value = n
}

async function saveStep1() {
  if (!form.value.nome || !form.value.telefone || !form.value.municipio || !form.value.ocupacao) {
    alert('Preencha nome, telefone, município e ocupação para continuar.')
    return
  }
  saving.value = true
  try {
    await salvarPerfil(userId.value, {
      tipoCadastro: form.value.tipoCadastro,
      nome: form.value.nome,
      telefone: form.value.telefone,
      municipio: form.value.municipio,
      municipios: [form.value.municipio],
      ocupacao: form.value.ocupacao,
      termoAceite: true,
    })
    goToStep(2)
  } catch (err) {
    alert('Erro ao salvar: ' + (err.message || err))
  } finally {
    saving.value = false
  }
}

async function saveStep2() {
  saving.value = true
  try {
    await salvarPerfil(userId.value, { areasAtuacao: form.value.areasAtuacao })
    goToStep(3)
  } catch (err) {
    alert('Erro ao salvar: ' + (err.message || err))
  } finally {
    saving.value = false
  }
}

async function finish(save) {
  saving.value = true
  try {
    if (save) {
      await salvarPerfil(userId.value, { materiaisTrabalhados: form.value.materiaisTrabalhados })
    }
    router.push('/profile')
  } catch (err) {
    alert('Erro ao salvar: ' + (err.message || err))
  } finally {
    saving.value = false
  }
}

async function handleLogout() {
  const auth = getAuth()
  await signOut(auth)
  router.push('/login')
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
  display: flex;
  gap: 32px;
  padding: 36px 64px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;
}
.main-col {
  flex: 1.6;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.progress-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
  color: var(--color-text-3);
  font-weight: 600;
}
.progress-bar { display: flex; gap: 6px; }
.segment { flex: 1; height: 6px; border-radius: 999px; background: var(--color-border); }
.segment.filled { background: var(--color-accent); }

.step-card {
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
}
.card-heading { display: flex; flex-direction: column; gap: 6px; }
.card-heading h1 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  color: var(--color-text);
}
.card-heading p { margin: 0; font-size: 13.5px; color: var(--color-text-3); }

.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 13.5px; font-weight: 600; color: var(--color-text); }
.field-row { display: flex; gap: 16px; flex-wrap: wrap; }
.field-row .field { flex: 1; min-width: 180px; }
.field label { font-size: 13.5px; font-weight: 600; color: var(--color-text); }
.field input,
.field select {
  padding: 12px 14px;
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 15px;
}

.type-toggle { display: flex; gap: 10px; }
.type-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border-2);
  background: #FFFFFF;
  color: var(--color-text-2);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}
.type-btn.active {
  border: 2px solid var(--color-accent);
  background: rgba(47, 93, 58, 0.08);
  color: var(--color-accent);
  font-weight: 600;
}

.checkbox-groups { display: flex; flex-direction: column; gap: 20px; max-height: 480px; overflow-y: auto; }
.checkbox-group h4 { margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: var(--color-text-2); }
.checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
.checkbox-item { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--color-text-2); }

.actions { display: flex; justify-content: flex-end; align-items: center; gap: 16px; margin-top: 4px; }
.link-skip {
  background: none;
  border: none;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text-3);
  cursor: pointer;
}
.link-skip:hover { color: var(--color-accent); }

.side-col { width: 360px; flex-shrink: 0; display: flex; flex-direction: column; gap: 16px; }
.progress-card {
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}
.progress-card-heading { display: flex; justify-content: space-between; align-items: center; }
.progress-card-heading span:first-child { font-weight: 600; font-size: 15px; color: var(--color-text); }
.progress-pct { font-weight: 700; font-size: 15px; color: var(--color-accent); }
.progress-track { height: 8px; border-radius: 999px; background: var(--color-border); overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-accent); transition: width 0.2s ease; }
.progress-desc { margin: 0; font-size: 12.5px; line-height: 1.5; color: var(--color-text-3); }

.checklist { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
.checklist-item { display: flex; align-items: center; gap: 10px; }
.checklist-item.spread { justify-content: space-between; }
.check-icon {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 2px solid var(--color-border-2);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.check-icon.done { background: var(--color-accent); border-color: var(--color-accent); }
.check-icon.current { border-color: var(--color-accent); }
.checklist-label { font-size: 13.5px; color: var(--color-text); }
.checklist-label.current { font-weight: 600; }
.badge-optional {
  font-size: 11px;
  color: var(--color-text-3);
  background: var(--color-chip-bg);
  padding: 2px 8px;
  border-radius: 999px;
}

.skip-all {
  text-align: center;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text-3);
  padding: 8px;
  text-decoration: none;
}
.skip-all:hover { color: var(--color-accent); }

@media (max-width: 900px) {
  .content { padding: 24px 20px; }
  .side-col { width: 100%; }
}
</style>
