/*
  Lista de tratamentos. Para incluir, tirar ou reescrever um cuidado, mexa só aqui.
  "nome" aparece na lista; "frase" entra na mensagem do WhatsApp ("queria saber mais sobre …").
*/

export type Tratamento = { nome: string; frase: string; texto: string }

export const GRUPOS: readonly { id: string; titulo: string; itens: readonly Tratamento[] }[] = [
  {
    id: 'corpo',
    titulo: 'Corpo',
    itens: [
      {
        nome: 'Transforme ICE',
        frase: 'o método Transforme ICE',
        texto: 'O método da casa para gordura localizada. Como funciona e para quem é indicado, a equipe explica na avaliação.',
      },
      {
        nome: 'Ezbody',
        frase: 'o Ezbody',
        texto: 'Tecnologia usada nos protocolos de contorno corporal. A área tratada e o número de sessões são definidos na avaliação.',
      },
      {
        nome: 'Endolaser',
        frase: 'o Endolaser',
        texto: 'Laser indicado para flacidez e gordura localizada em áreas pequenas. A avaliação mostra se é o caso para você.',
      },
      {
        nome: 'Drenagem linfática',
        frase: 'a drenagem linfática',
        texto: 'Massagem de movimentos suaves para aliviar o inchaço e a sensação de peso no corpo.',
      },
      {
        nome: 'Pós-operatório',
        frase: 'o pós-operatório',
        texto: 'Acompanhamento na recuperação de cirurgias plásticas, com as sessões combinadas de acordo com a orientação do seu médico.',
      },
    ],
  },
  {
    id: 'rosto',
    titulo: 'Rosto',
    itens: [
      {
        nome: 'Lavieen',
        frase: 'o Lavieen',
        texto: 'Laser voltado para a textura e o tom da pele: manchas, poros e viço. As sessões são planejadas na avaliação.',
      },
      {
        nome: 'Hipro',
        frase: 'o Hipro',
        texto: 'Ultrassom focado para a firmeza da pele e o contorno do rosto, também usado em áreas do corpo.',
      },
      {
        nome: 'Limpeza de pele',
        frase: 'a limpeza de pele',
        texto: 'Higienização profunda, extração cuidadosa e finalização para a pele sair limpa e descansada.',
      },
      {
        nome: 'Peeling de algas',
        frase: 'o peeling de algas marinhas',
        texto: 'Renovação da pele com algas marinhas. A indicação depende do seu tipo de pele.',
      },
      {
        nome: 'Preenchimento',
        frase: 'o preenchimento',
        texto: 'Procedimento para volume e contorno do rosto. A quantidade e o que dá para esperar são conversados na avaliação.',
      },
    ],
  },
  {
    id: 'depilacao',
    titulo: 'Depilação',
    itens: [
      {
        nome: 'Depilação a laser',
        frase: 'a depilação a laser',
        texto: 'Redução dos pelos em sessões espaçadas. O intervalo e o número de sessões variam de pessoa para pessoa.',
      },
    ],
  },
]
