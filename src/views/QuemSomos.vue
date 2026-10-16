<template>
  <div class="page">
    <Header />

    <section class="intro">
      <div class="intro-inner">
        <h1>Quem somos</h1>
        <p>
          O Instituto Movimento Lixo Zero Amapá (IMOLIZEAP) é uma associação de direito
          privado, sem fins lucrativos e de caráter socioambiental. Nasceu em 2020 da
          vontade de mudar a forma como o Amapá lida com os resíduos, tratando-os como
          recursos que podem voltar à cadeia produtiva, e não como algo a ser descartado.
        </p>
        <p>
          Nossa atuação se baseia no conceito Lixo Zero, uma meta ética, econômica e
          eficiente que convida pessoas, empresas e governos a repensar seus modos de
          vida e de produção. Numa gestão Lixo Zero, recicláveis, orgânicos e rejeitos
          não se misturam, e o desperdício de materiais em aterros diminui.
        </p>
        <p>
          Trabalhamos com educação ambiental, mobilização social e soluções sustentáveis.
          Aproximamos sociedade, poder público e setor produtivo em torno da economia
          circular, com o objetivo de tornar o Amapá referência nacional em
          sustentabilidade, com um futuro limpo e responsável para as gerações de hoje e
          de amanhã.
        </p>
      </div>

      <div class="pillars">
        <div class="pillar-card">
          <div class="pillar-title">Missão</div>
          <div class="pillar-desc">
            Promover a gestão eficiente dos resíduos e o consumo consciente, com foco nas
            dimensões ambiental, social e econômica, disseminando o conceito Lixo Zero em
            todo o estado do Amapá.
          </div>
        </div>
        <div class="pillar-card">
          <div class="pillar-title">Visão</div>
          <div class="pillar-desc">
            Ser referência estadual em sustentabilidade e economia circular, unindo
            sociedade, empresas e governo em torno de um Amapá sem desperdício.
          </div>
        </div>
      </div>

      <div class="pillar-card values-card">
        <div class="pillar-title">Valores</div>
        <ul class="values-list">
          <li><strong>Sustentabilidade:</strong> cada ação considera o equilíbrio entre meio ambiente, sociedade e economia.</li>
          <li><strong>Consciência ambiental:</strong> educar e sensibilizar para mudar hábitos e cultura.</li>
          <li><strong>Ética:</strong> transparência e responsabilidade em tudo o que fazemos.</li>
          <li><strong>Cooperação:</strong> redes e parcerias fortalecem a transformação coletiva.</li>
          <li><strong>Educação e inclusão social:</strong> valorização e capacitação de catadores e comunidades.</li>
        </ul>
      </div>

      <div class="partners">
        <div class="partners-title">Parceiros</div>
        <div class="partners-grid">
          <div class="partner-slot">
            <img
              v-if="!logoFalhou"
              :src="logoSrc"
              alt="UNIFAP Digital"
              class="partner-logo"
              @error="logoFalhou = true"
            />
            <span v-else class="partner-fallback">UNIFAP Digital</span>
          </div>
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
          <a class="contact-row" href="mailto:lixozeroamapa@gmail.com">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"></path><path d="M4 6l8 7 8-7"></path></svg>
            <span>lixozeroamapa@gmail.com</span>
          </a>
          <a class="contact-row" href="https://www.instagram.com/lixozero.ap" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.8" fill="#2F5D3A"></circle></svg>
            <span>@lixozero.ap</span>
          </a>
        </div>
      </div>
    </section>

    <Footer :show-link="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

// Se o arquivo da logo ainda não estiver em public/parceiros/, mostra o nome em texto.
const logoSrc = '/parceiros/unifap-digital.png'
const logoFalhou = ref(false)
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
  width: 220px;
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
.contact-row { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--color-text); text-decoration: none; }
a.contact-row:hover span { text-decoration: underline; }
.contact-row.align-start { align-items: flex-start; line-height: 1.4; }

.values-card { flex: none; }
.values-list { margin: 4px 0 0 0; padding-left: 18px; display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; line-height: 1.55; color: var(--color-text-3); }
.values-list strong { color: var(--color-text); }

.partner-slot {
  border-style: solid;
}
.partner-logo { max-width: 100%; max-height: 52px; object-fit: contain; }
.partner-fallback { font-family: var(--font-display); font-weight: 700; font-size: 15px; color: var(--color-text-2); }

@media (max-width: 640px) {
  .intro, .contact { padding: 32px 20px; }
}
</style>
