<template>
  <div class="page">
    <Header />

    <section class="intro">
      <div class="intro-inner">
        <h1>Quem somos</h1>
        <p>
          [Texto sobre a história e a missão do Instituto Movimento Lixo Zero Amapá —
          quando a iniciativa nasceu, o que a motivou e o que ela busca transformar na
          gestão de resíduos e na economia circular do estado.]
        </p>
      </div>

      <div class="pillars">
        <div class="pillar-card">
          <div class="pillar-title">Missão</div>
          <div class="pillar-desc">[Descrição da missão do Instituto]</div>
        </div>
        <div class="pillar-card">
          <div class="pillar-title">Visão</div>
          <div class="pillar-desc">[Descrição da visão do Instituto]</div>
        </div>
        <div class="pillar-card">
          <div class="pillar-title">Valores</div>
          <div class="pillar-desc">[Valores que orientam a atuação]</div>
        </div>
      </div>

      <div class="partners">
        <div class="partners-title">Parceiros</div>
        <div class="partners-grid">
          <div v-for="n in 5" :key="n" class="partner-slot">[Logo do parceiro]</div>
        </div>
      </div>
    </section>

    <section class="contact">
      <div class="contact-info">
        <h2>Contato</h2>
        <p>
          Tem dúvidas, quer propor uma parceria ou saber mais sobre o Movimento Lixo
          Zero Amapá? Fale com a gente.
        </p>

        <div class="contact-rows">
          <div class="contact-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"></path><path d="M4 6l8 7 8-7"></path></svg>
            <span>[contato@imolizeap.org.br]</span>
          </div>
          <div class="contact-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.2 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2.1z"></path></svg>
            <span>[(96) 0000-0000]</span>
          </div>
          <div class="contact-row align-start">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-top:1px;"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>
            <span>[Endereço da sede — Macapá, AP]</span>
          </div>
        </div>

        <div class="social-row">
          <a href="#" class="social-icon" aria-label="Instagram">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.8" fill="#2F5D3A"></circle></svg>
          </a>
          <a href="#" class="social-icon" aria-label="Facebook">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
        </div>
      </div>

      <form class="contact-form" @submit.prevent="submitContact">
        <div class="field">
          <label for="cnome">Nome</label>
          <input id="cnome" v-model="contact.nome" type="text" placeholder="Seu nome" required />
        </div>
        <div class="field">
          <label for="cemail">E-mail</label>
          <input id="cemail" v-model="contact.email" type="email" placeholder="voce@exemplo.com" required />
        </div>
        <div class="field">
          <label for="cmsg">Mensagem</label>
          <textarea id="cmsg" v-model="contact.mensagem" rows="4" placeholder="Como podemos ajudar?" required></textarea>
        </div>
        <button type="submit" class="btn send-btn">Enviar mensagem</button>
        <p v-if="sent" class="sent-msg">Mensagem enviada! Em breve entraremos em contato.</p>
      </form>
    </section>

    <Footer :show-link="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const contact = ref({ nome: '', email: '', mensagem: '' })
const sent = ref(false)

function submitContact() {
  // TODO: ligar a um serviço real de envio (e-mail/Firestore) quando definido.
  sent.value = true
  contact.value = { nome: '', email: '', mensagem: '' }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.intro {
  padding: 56px 64px 48px 64px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  border-bottom: 1px solid var(--color-border);
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}
.intro-inner { display: flex; flex-direction: column; gap: 16px; max-width: 820px; }
.intro-inner h1 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 38px;
  color: var(--color-text);
}
.intro-inner p { margin: 0; font-size: 16.5px; line-height: 1.6; color: var(--color-text-2); }

.pillars { display: flex; gap: 20px; flex-wrap: wrap; }
.pillar-card {
  flex: 1;
  min-width: 220px;
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pillar-title { font-weight: 600; font-size: 15px; color: var(--color-accent); }
.pillar-desc { font-size: 13.5px; line-height: 1.55; color: var(--color-text-3); }

.partners { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
.partners-title { font-weight: 600; font-size: 18px; color: var(--color-text); font-family: var(--font-display); }
.partners-grid { display: flex; gap: 16px; flex-wrap: wrap; }
.partner-slot {
  flex: 1;
  min-width: 120px;
  height: 76px;
  background: #FFFFFF;
  border: 1px dashed var(--color-border-2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #9A927F;
  text-align: center;
  padding: 0 8px;
}

.contact {
  flex: 1;
  padding: 48px 64px;
  display: flex;
  gap: 56px;
  flex-wrap: wrap;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}
.contact-info { flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 20px; max-width: 420px; }
.contact-info h2 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 28px;
  color: var(--color-text);
}
.contact-info > p { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--color-text-3); }
.contact-rows { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
.contact-row { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--color-text); }
.contact-row.align-start { align-items: flex-start; line-height: 1.4; }
.social-row { display: flex; gap: 10px; margin-top: 8px; }
.social-icon {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: rgba(47, 93, 58, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-form {
  flex: 1;
  min-width: 280px;
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 520px;
  box-sizing: border-box;
}
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13.5px; font-weight: 600; color: var(--color-text); }
.field input,
.field textarea {
  padding: 12px 14px;
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  background: var(--color-bg);
  font-size: 14px;
  resize: none;
}
.send-btn { align-self: flex-start; padding: 13px 30px; font-size: 15px; }
.sent-msg { margin: 0; font-size: 13px; color: var(--color-accent); font-weight: 600; }

@media (max-width: 640px) {
  .intro, .contact { padding: 32px 20px; }
}
</style>
