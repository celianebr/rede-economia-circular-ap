<template>
  <div class="page">
    <Header :show-nav="false" />

    <main class="content">
      <div class="login-card">
        <div class="card-heading">
          <h1>Entrar</h1>
          <p>Acesse sua conta para continuar na rede.</p>
        </div>

        <form class="fields" @submit.prevent="submit">
          <div class="field">
            <label for="email">E-mail</label>
            <input id="email" v-model="email" type="email" placeholder="voce@exemplo.com" required />
          </div>

          <div class="field">
            <label for="senha">Senha</label>
            <input id="senha" v-model="password" type="password" placeholder="Sua senha" required />
          </div>

          <button type="submit" class="btn submit-btn" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>

          <div class="signup-link">
            Ainda não tem conta? <router-link to="/signup">Cadastre-se</router-link>
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
import { firebaseService as api } from '../services/firebase.js'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

async function submit() {
  if (!email.value || !password.value) {
    alert('Preencha todos os campos.')
    return
  }

  loading.value = true
  try {
    await api.login(email.value, password.value)
    router.push('/profile')
  } catch (err) {
    alert('Erro ao entrar: ' + (err.message || err))
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
.login-card {
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
.submit-btn { width: 100%; padding: 14px; font-size: 15px; }
.signup-link {
  text-align: center;
  font-size: 13.5px;
  color: var(--color-text-3);
}
.signup-link :deep(a) { font-weight: 600; }
</style>
