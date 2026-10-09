/*
  Textos do site. Para mudar uma frase, mexa só aqui.
  Listas em "titulo" viram quebras de linha.
*/
import { SITE } from '../config/site'

export const NAV = [
  { href: '#tratamentos', rotulo: 'Tratamentos' },
  { href: '#como-funciona', rotulo: 'Como funciona' },
  { href: '#quem-cuida', rotulo: 'Quem cuida' },
  { href: '#avaliacoes', rotulo: 'Avaliações' },
  { href: '#onde-fica', rotulo: 'Onde fica' },
] as const

export const HERO = {
  titulo: ['Autoestima', 'também é saúde.'],
  texto: `Estética corporal e facial na ${SITE.endereco.bairro}, Zona Leste de São Paulo. Aqui, todo cuidado começa por uma avaliação.`,
  cta: 'Agendar avaliação',
  link: 'Ver os tratamentos',
} as const

export const FAIXA = ['Transforme ICE', 'Ezbody', 'Hipro', 'Lavieen', 'Endolaser', 'Depilação a laser', 'Pós-operatório', 'Limpeza de pele'] as const

export const MANIFESTO = {
  /** As palavras acendem uma a uma conforme a rolagem. Trechos entre *asteriscos* ficam em itálico azul. */
  texto:
    'Na Estética Venâncio, nada começa pelo aparelho. Começa por uma avaliação e por uma conversa franca sobre o que te incomoda e o que dá para esperar de cada sessão. *Só depois vem o plano:* para o corpo, para o rosto ou para os dois.',
} as const

export const TRATAMENTOS = {
  titulo: ['Para o corpo', 'e para o rosto.'],
  texto: 'Toque em um cuidado para saber mais. A indicação certa para você sai da avaliação.',
  perguntar: 'Perguntar sobre',
} as const

export const PASSOS = {
  titulo: ['Do primeiro oi', 'ao seu plano.'],
  itens: [
    { titulo: 'Você chama no WhatsApp', texto: 'Conta o que procura e combina o melhor dia e horário.' },
    { titulo: 'A avaliação vem primeiro', texto: 'Uma conversa e um olhar de perto, antes de qualquer procedimento.' },
    { titulo: 'O plano é montado para você', texto: 'Com os cuidados indicados para o seu caso e o número de sessões.' },
  ],
  cta: 'Começar pelo WhatsApp',
} as const

export const QUEM = {
  titulo: ['Quem cuida', 'de você.'],
  nome: SITE.profissional,
  paragrafos: [
    `${SITE.profissional} está à frente da ${SITE.nome}, na ${SITE.endereco.bairro}, Zona Leste de São Paulo. A clínica cuida do corpo e do rosto, e toda indicação parte de uma avaliação.`,
    'Quem já passou por lá fala de uma equipe atenciosa e acolhedora, e de se sentir segura desde a primeira conversa.',
  ],
  pontos: ['Avaliação antes de tudo', 'Corpo e rosto', 'Equipe acolhedora'],
  fotoAlt: `${SITE.profissional} sorrindo, de braços cruzados, com um colete verde-claro.`,
} as const

export const AVALIACOES = {
  titulo: ['Nota máxima', 'no Google.'],
  legenda: (n: number) => `Nota no Google, em ${n} avaliações.`,
  elogiosTitulo: 'O que mais aparece nas avaliações',
  elogios: ['Equipe atenciosa', 'Atendimento acolhedor', 'Segurança desde a avaliação', 'Drenagem, laser e limpeza de pele'],
  cta: 'Ler as avaliações no Google',
} as const

export const ONDE = {
  titulo: ['Fica na', `${SITE.endereco.bairro}.`],
  texto: 'Atendimento com hora marcada. Chame no WhatsApp para combinar o seu horário.',
  horarioTitulo: 'Horário',
  fechado: 'Fechado',
  mapa: 'Abrir no mapa',
  whatsapp: 'Combinar um horário',
  mapaTitulo: `Mapa: ${SITE.nome}, ${SITE.endereco.rua}`,
} as const

export const CONVITE = {
  titulo: ['Vamos marcar', 'a sua avaliação?'],
  texto: 'É o primeiro passo. Mande uma mensagem e a equipe responde com os horários.',
  cta: 'Agendar pelo WhatsApp',
} as const

export const RODAPE = {
  faixa: SITE.lema,
} as const
