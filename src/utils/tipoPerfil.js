// src/utils/tipoPerfil.js
//
// Agrupa os perfis cadastrados em "tipos" (usados nas cores do mapa, nos
// filtros da pesquisa e no relatório). A regra fica num só lugar para a
// pesquisa e o relatório sempre concordarem.

export const TIPOS = ['Catador(a)', 'Cooperativa', 'Empresa', 'Pesquisador(a)', 'Outros']

export const TIPO_COLORS = {
  'Catador(a)': '#2F5D3A',
  'Cooperativa': '#B9622E',
  'Empresa': '#3B5A73',
  'Pesquisador(a)': '#6B4E8E',
  'Outros': '#7A7466',
}

export function tipoColor(tipo) {
  return TIPO_COLORS[tipo] || TIPO_COLORS['Outros']
}

// Texto que identifica a pessoa/organização como ela mesma informou no cadastro.
export function rotuloPerfil(p) {
  return p.ocupacao || p.tipoOrganizacao || (p.tipoCadastro === 'PJ' ? 'Organização' : '')
}

export function classifyTipo(p) {
  const occ = (p.ocupacao || '').toLowerCase()
  const org = (p.tipoOrganizacao || '').toLowerCase()
  const texto = `${occ} ${org}`

  if (texto.includes('catador') || texto.includes('triador') || texto.includes('reciclador')) return 'Catador(a)'
  if (texto.includes('cooperativa')) return 'Cooperativa'
  if (
    texto.includes('pesquisad') ||
    texto.includes('extensionista') ||
    texto.includes('professor') ||
    texto.includes('estudante')
  ) {
    return 'Pesquisador(a)'
  }
  if (
    texto.includes('empresa') ||
    texto.includes('empreendedor') ||
    texto.includes('empreendimento')
  ) {
    return 'Empresa'
  }
  // Gestor(a), educador(a), consultor(a), servidor(a), ONG, órgão público,
  // "Outro" ou perfil ainda sem ocupação preenchida.
  return 'Outros'
}
