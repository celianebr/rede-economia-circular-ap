<template>
  <section class="hero">
    <div class="hero-text">
      <h1>Conectando o Amapá pela Economia Circular</h1>
      <p>
        Uma rede em construção para conectar quem transforma resíduo em valor
        no estado. Cadastre sua iniciativa, encontre parceiros e ajude a
        mapear a economia circular no Amapá.
      </p>
      <div class="hero-ctas">
        <router-link to="/signup" class="btn">Cadastrar</router-link>
        <router-link to="/login" class="btn-outline">Entrar</router-link>
        <router-link to="/search" class="link-arrow">
          Explorar iniciativas
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2F5D3A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </router-link>
      </div>
    </div>

    <div class="hero-image">
      <img :src="heroImage" alt="Ilustração do Amapá com rede de ícones de economia circular" />
    </div>
  </section>
</template>

<script setup>
// TODO: trocar pelo arquivo enviado por Celiane (amapa-economia-circular-*.svg)
// assim que ele estiver disponível — por ora usa a imagem já existente no projeto.
const heroImage = '/img/mapa_ap.png'
</script>

<style scoped>
.hero {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 48px 64px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;
}
.hero-text {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
  flex-shrink: 0;
}
.hero-text h1 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 46px;
  line-height: 1.12;
  color: var(--color-text);
}
.hero-text p {
  margin: 0;
  font-size: 18px;
  line-height: 1.5;
  color: var(--color-text-2);
  max-width: 560px;
}
.hero-ctas {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
  flex-wrap: wrap;
}
.link-arrow {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 15px;
  color: var(--color-accent);
  padding: 12px 4px;
  text-decoration: none;
}
.hero-image {
  flex-shrink: 0;
}
.hero-image img {
  width: 360px;
  max-width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 900px) {
  .hero { padding: 32px 24px; justify-content: center; text-align: center; }
  .hero-text { align-items: center; }
  .hero-ctas { justify-content: center; }
}
</style>
