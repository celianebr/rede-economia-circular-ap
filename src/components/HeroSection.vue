<template>
  <section class="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-12">
    
    <!-- Lado Esquerdo: Texto -->
    <div class="md:w-1/2 text-left">
      <h1 class="text-4xl md:text-5xl font-bold text-primary-dark mb-6 leading-tight">
        Conectando o Amapá pela Economia Circular
      </h1>

      <p class="text-lg text-primary mb-8 leading-relaxed">
        Descubra quem transforma resíduos em valor. 
        Encontre agentes, iniciativas e materiais que fazem a diferença no estado.
      </p>

      <div class="flex gap-4">
        <router-link 
          to="/login" 
          class="px-8 py-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-opacity-90 transition-all"
        >
          Entrar
        </router-link>

        <router-link 
          to="/signup" 
          class="px-8 py-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-opacity-90 transition-all"
        >
          Cadastrar
        </router-link>

        <router-link
          to="/search"
          class="px-8 py-3 bg-primary text-white border-2 border-primary font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all"
        >
          Pesquisar na Rede
        </router-link>
      </div>
    </div>

    <!-- Lado Direito: Imagem do Mapa -->
    <div class="md:w-1/2 flex justify-center">
      <img src="/img/mapa_ap.png" alt="Mapa do Amapá" class="w-full max-w-md drop-shadow-lg transform hover:scale-105 transition-transform duration-500" />
    </div>

  </section>
</template>

<style scoped>
.text-primary { color: #16524a; }
.text-primary-dark { color: #16524a; }
.bg-primary { background-color: #16524a; }
.border-primary { border-color: #16524a; }
</style>
