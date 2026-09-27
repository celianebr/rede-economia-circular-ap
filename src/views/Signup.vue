<template>
  <div class="page">
    <Header :show-nav="false" />

    <main class="content">
      <div class="signup-card">
        <div class="card-heading">
          <h1>Junte-se à rede</h1>
          <p>Crie sua conta para começar a fazer parte do mapeamento.</p>
        </div>

        <div class="progress-block">
          <div class="progress-label">
            <span>Etapa 1 de 2</span>
            <span>Dados de acesso</span>
          </div>
          <div class="progress-bar">
            <div class="segment filled"></div>
            <div class="segment"></div>
          </div>
        </div>

        <form class="fields" @submit.prevent="submit">
          <div class="field">
            <label for="nome">Nome completo</label>
            <input id="nome" v-model="name" type="text" placeholder="Seu nome" required />
          </div>

          <div class="field">
            <label for="email">E-mail</label>
            <input id="email" v-model="email" type="email" placeholder="voce@exemplo.com" required />
          </div>

          <div class="field">
            <label for="senha">Senha</label>
            <input id="senha" v-model="password" type="password" placeholder="Mínimo de 8 caracteres" minlength="8" required />
          </div>

          <div class="field">
            <label for="confirmar">Confirmar senha</label>
            <input id="confirmar" v-model="confirmPassword" type="password" placeholder="Repita a senha" required />
          </div>

          <label class="terms">
            <input type="checkbox" v-model="acceptedTerms" required />
            <span>Li e aceito os <a href="#">Termos de Uso</a> e a <a href="#">Política de Privacidade</a>.</span>
          </label>

          <button type="submit" class="btn submit-btn" :disabled="loading">
            {{ loading ? 'Aguarde...' : 'Continuar' }}
          </button>

          <div class="login-link">
            Já tem conta? <router-link to="/login">Entrar</router-link>
          </div>
        </form>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase.js'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptedTerms = ref(false)
const loading = ref(false)

async function submit() {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    alert('Preencha todos os campos obrigatórios.')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('As senhas não coincidem.')
    return
  }
  if (!acceptedTerms.value) {
    alert('É necessário aceitar os Termos de Uso e a Política de Privacidade.')
    return
  }

  loading.value = true
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    await setDoc(doc(db, 'users', user.uid), {
      nome: name.value,
      email: email.value,
      createdAt: new Date().toISOString(),
    }, { merge: true })

    router.push('/cadastro/perfil')
  } catch (err) {
    alert('Erro ao cadastrar: ' + (err.message || err))
  } finally {
    loading.value = false
  }
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
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
}
.signup-card {
  width: 100%;
  max-width: 460px;
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  box-sizing: border-box;
}
.card-heading {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.card-heading h1 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 26px;
  color: var(--color-text);
}
.card-heading p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-3);
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
.progress-bar {
  display: flex;
  gap: 6px;
}
.segment {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: var(--color-border);
}
.segment.filled { background: var(--color-accent); }

.fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text);
}
.field input {
  padding: 12px 14px;
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  background: var(--color-bg);
  font-size: 15px;
}

.terms {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-2);
}
.terms input { margin-top: 3px; width: 16px; height: 16px; flex-shrink: 0; }

.submit-btn { width: 100%; padding: 14px; font-size: 15px; }

.login-link {
  text-align: center;
  font-size: 13.5px;
  color: var(--color-text-3);
}
.login-link :deep(a) { font-weight: 600; }
</style>
