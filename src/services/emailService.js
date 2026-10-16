// src/services/emailService.js
//
// Envio de e-mails de notificação via EmailJS (sem necessidade de servidor
// próprio). Para funcionar, é preciso:
//   1. Criar uma conta gratuita em https://www.emailjs.com/
//   2. Conectar um serviço de e-mail (ex: Gmail) em "Email Services"
//   3. Criar um template em "Email Templates" com estas variáveis:
//        {{to_email}}   - e-mail de quem vai receber o aviso
//        {{to_name}}    - nome de quem vai receber o aviso
//        {{from_name}}  - nome de quem demonstrou interesse
//        {{message}}    - mensagem opcional deixada pelo interessado
//        {{profile_url}} - link para o perfil público de quem demonstrou interesse
//        {{reply_to}}   - e-mail de quem demonstrou interesse (opcional)
//      Dica: no campo "To Email" do template, use {{to_email}}. Em
//      "Settings" do template, no campo "Reply To", use {{reply_to}} —
//      assim, se a pessoa responder o e-mail, a resposta vai direto
//      para quem demonstrou interesse, e não para a conta que enviou
//      o aviso.
//   4. Preencher as três constantes abaixo com os valores do seu painel
//      EmailJS (Account > General): Service ID, Template ID e Public Key.
//   5. Em EmailJS > Account > Security, restringir os domínios permitidos
//      ao endereço do site publicado (e a localhost, se quiser testar).
//
// Enquanto os valores abaixo estiverem com "COLOQUE_AQUI", o envio de
// e-mail fica desativado automaticamente (mas o aviso dentro da
// plataforma continua funcionando normalmente).

import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = 'COLOQUE_AQUI_SEU_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'COLOQUE_AQUI_SEU_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'COLOQUE_AQUI_SUA_PUBLIC_KEY'

const configurado =
  !EMAILJS_SERVICE_ID.startsWith('COLOQUE_AQUI') &&
  !EMAILJS_TEMPLATE_ID.startsWith('COLOQUE_AQUI') &&
  !EMAILJS_PUBLIC_KEY.startsWith('COLOQUE_AQUI')

export async function enviarEmailInteresse({ toEmail, toName, fromName, message, profileUrl, replyTo }) {
  if (!configurado) {
    console.warn(
      'EmailJS ainda não foi configurado (src/services/emailService.js) — aviso por e-mail desativado, mas o interesse já foi registrado na plataforma.'
    )
    return { enviado: false, motivo: 'nao-configurado' }
  }

  if (!toEmail) {
    console.warn('Não há e-mail cadastrado para este agente — aviso por e-mail não enviado.')
    return { enviado: false, motivo: 'sem-email' }
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: toEmail,
        to_name: toName || 'Agente',
        from_name: fromName || 'Um agente da rede',
        message: message || '(sem mensagem adicional)',
        profile_url: profileUrl || '',
        reply_to: replyTo || '',
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    )
    return { enviado: true }
  } catch (err) {
    console.error('Erro ao enviar e-mail via EmailJS:', err)
    return { enviado: false, motivo: 'erro-envio', erro: err }
  }
}
