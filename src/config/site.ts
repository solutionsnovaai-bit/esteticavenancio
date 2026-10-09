/*
  Dados da clínica. Tudo o que muda (telefone, endereço, horário, Instagram) fica aqui.
*/

export const SITE = {
  nome: 'Estética Venâncio',
  assinatura: 'Saúde e Beleza',
  /** O lema da clínica. */
  lema: 'Autoestima também é saúde.',
  /** Quem está à frente da clínica. */
  profissional: 'Pamela Venancio',
  primeiroNome: 'Pamela',
  /** WhatsApp com 55 + DDD + número (só números). */
  whatsapp: '5511975486483',
  whatsappExibicao: '(11) 97548-6483',
  /** Perfil do Instagram (sem @). Deixe vazio para esconder o link. */
  instagram: 'esteticavenancio',
  endereco: {
    rua: 'Praça Adilson Aparecido da Silva, 218',
    bairro: 'Vila Pedroso',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '08011-220',
  },
  /** Identificador do lugar no Google Maps (abre a ficha com as avaliações). */
  googlePlaceId: 'ChIJS-2tkh9hzpQRx7s-WxrB7zk',
  /** Nota e número de avaliações no Google. Atualize de vez em quando. */
  google: { nota: 5.0, avaliacoes: 83 },
  /**
   * false: o site pede para o Google NÃO listar (bom enquanto é só uma prévia).
   * true: o site aparece nas buscas. Troque para true na hora de publicar de vez.
   */
  indexar: false,
} as const

/** Horário de atendimento. dia: 0 = domingo … 6 = sábado. Horas em "HH:MM"; null = fechado. */
export const HORARIO = [
  { dia: 1, rotulo: 'Segunda', abre: '08:00', fecha: '20:00' },
  { dia: 2, rotulo: 'Terça', abre: null, fecha: null },
  { dia: 3, rotulo: 'Quarta', abre: '08:00', fecha: '20:00' },
  { dia: 4, rotulo: 'Quinta', abre: '08:00', fecha: '20:00' },
  { dia: 5, rotulo: 'Sexta', abre: '08:00', fecha: '20:00' },
  { dia: 6, rotulo: 'Sábado', abre: '08:00', fecha: '14:00' },
  { dia: 0, rotulo: 'Domingo', abre: null, fecha: null },
] as const

export const ENDERECO_LINHA = `${SITE.endereco.rua}, ${SITE.endereco.bairro}`
export const ENDERECO_CURTO = `${SITE.endereco.bairro}, ${SITE.endereco.cidade}`
export const ENDERECO_COMPLETO = `${SITE.endereco.rua}, ${SITE.endereco.bairro}, ${SITE.endereco.cidade} - ${SITE.endereco.uf}, ${SITE.endereco.cep}`
export const INSTAGRAM_URL = SITE.instagram ? `https://www.instagram.com/${SITE.instagram}/` : ''

export const SEO = {
  titulo: 'Estética Venâncio | Estética corporal e facial na Vila Pedroso, São Paulo',
  descricao:
    'Clínica de estética na Vila Pedroso, Zona Leste de São Paulo: depilação a laser, Lavieen, Hipro, Ezbody, drenagem e pós-operatório. Agende a sua avaliação pelo WhatsApp.',
  compartilharTitulo: 'Estética Venâncio · Saúde e Beleza',
  compartilharTexto: 'Autoestima também é saúde. Estética corporal e facial na Vila Pedroso, com avaliação antes de qualquer tratamento.',
  imagemAlt: 'Selo da Estética Venâncio: um perfil feminino em traço contínuo dentro de um círculo, com os dizeres Estética Venâncio, Saúde e Beleza.',
  corTema: '#F6EEE6',
  corFundo: '#F6EEE6',
} as const

/** Mensagens prontas do WhatsApp, uma para cada botão do site. */
export const MENSAGENS = {
  padrao: 'Olá! Vim pelo site da Estética Venâncio e queria agendar uma avaliação.',
  tratamento: (nome: string) => `Olá! Vim pelo site da Estética Venâncio e queria saber mais sobre ${nome}.`,
  caminho: 'Olá! Vim pelo site da Estética Venâncio e queria confirmar um horário para ir até aí.',
} as const
