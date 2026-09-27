<template>
  <section class="how">
    <div class="how-inner">
      <h2>Como funciona</h2>
      <div class="cards">
        <div class="step-card">
          <div class="step-number">1</div>
          <div class="step-title">Cadastre sua iniciativa</div>
          <div class="step-desc">Conte quem você é, onde atua e com o que trabalha.</div>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <div class="step-title">Apareça no mapa</div>
          <div class="step-desc">Seu perfil passa a fazer parte da rede visível do Amapá.</div>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <div class="step-title">Conecte-se com outros agentes</div>
          <div class="step-desc">Encontre parceiros, materiais e iniciativas próximas.</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.how {
  background: #FFFFFF;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 36px 64px;
}
.how-inner {
  max-width: 1312px;
  margin: 0 auto;
}
.how h2 {
  margin: 0 0 22px 0;
  text-align: center;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 24px;
  color: var(--color-text);
}
.cards {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.step-card {
  flex: 1;
  min-width: 220px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.step-number {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(47, 93, 58, 0.12);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}
.step-title {
  font-weight: 600;
  font-size: 15.5px;
  color: var(--color-text);
}
.step-desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-3);
}

@media (max-width: 640px) {
  .how { padding: 28px 20px; }
}
</style>
