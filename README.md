# agentes-amapa

Projeto front-end em Vue 3 + Vite + Tailwind CSS com integração opcional com Firebase (Auth + Firestore) e configuração para Firebase Hosting.

## Como usar (local, com mock)
1. Instale dependências:
   ```bash
   npm install
   ```
2. Rodar em desenvolvimento:
   ```bash
   npm run dev
   ```
3. O projeto usa `src/services/api.js` que por padrão usa o `mockService` (localStorage).
   Para usar Firebase, edite `src/services/api.js` e altere `USE_FIREBASE` para `true`, e adicione suas credenciais em `src/services/firebase.js`.

## Deploy para Firebase Hosting
1. Instale Firebase CLI:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. Inicialize hosting (ou use o painel do Firebase):
   ```bash
   firebase init hosting
   ```
   - Escolha o projeto no console
   - Configure `dist` como diretório público após build
   - Configure como SPA (rewrites to /index.html)
3. Build e deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Observações
- Substitua as credenciais no arquivo `src/services/firebase.js` pelos dados do seu projeto Firebase.
- O projeto pertence ao **Movimento Lixo Zero Amapá**. Use com responsabilidade.
