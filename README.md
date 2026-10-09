# Estética Venâncio

Site de uma página da Estética Venâncio (Praça Adilson Aparecido da Silva, 218, Vila Pedroso, São Paulo).

React 19, TypeScript 5.9, Vite 6.4, Tailwind 4.3, Motion 12 e Lenis 1.3 (versões fixas no package.json).
Fontes Cormorant (títulos) e Jost (texto), servidas pelo próprio site.
Imagens em AVIF com reserva em WebP. O único serviço externo é o mapa do Google, na seção "Onde fica".

## Rodar

Requisito: Node.js 20 ou superior.

```bash
npm ci
npm run dev      # http://localhost:4173
npm run build    # gera a pasta dist/
npm run check    # confere os tipos (opcional)
```

## Publicar na Vercel

Importe o repositório na Vercel. Framework: Vite. Build: `npm run build`. Saída: `dist`.
Não precisa de variável de ambiente. Com domínio próprio, defina `VITE_SITE_URL`
(ex.: `https://esteticavenancio.com.br`) nas variáveis do projeto e publique de novo.

**Aparecer no Google:** o site sai com `indexar: false` em `src/config/site.ts`, ou seja, pede aos buscadores
para não listar a página (bom enquanto é uma prévia). Na hora de publicar de vez, troque para `indexar: true`.

## Onde mudar cada coisa

| O quê | Arquivo |
| --- | --- |
| WhatsApp, Instagram, endereço, horário, nota do Google | `src/config/site.ts` |
| Mensagens prontas do WhatsApp | `src/config/site.ts` (`MENSAGENS`) |
| Textos de todas as seções | `src/content/textos.ts` |
| Lista de tratamentos (nomes e explicações) | `src/content/tratamentos.ts` |
| Cores e fontes | `src/styles/tema.css` |
| Imagens (topo, retrato, selo em papel) | `public/` e `src/config/imagens.ts` |

Todos os botões abrem o WhatsApp com uma mensagem pronta. Na lista de tratamentos, a mensagem já vai com o
nome do tratamento.

## Conferir com a clínica antes de publicar de vez

- **WhatsApp:** o número em `src/config/site.ts` é o telefone da ficha da clínica no Google.
- **Tratamentos:** as explicações em `src/content/tratamentos.ts` são curtas e gerais, sem prometer resultado.
  Vale a clínica revisar cada uma, principalmente Transforme ICE, Ezbody, Hipro e Endolaser.
- **Quem cuida de você:** o texto diz que a Pamela está à frente da clínica; a formação dela não aparece
  porque não foi informada.

## O que tem no site

Abertura (peça de motion) → topo com o selo na parede → fita dos cuidados → o jeito de atender →
tratamentos → como funciona → quem cuida de você → avaliações → onde fica → convite final → rodapé.
Balão do WhatsApp sempre visível.

**Abertura**: num papel creme, o selo se monta. O anel é a barra de carregamento de verdade, o perfil é
desenhado num traço só, as letras entram uma a uma pelos dois arcos e os pontos fecham com um quique.
Depois o selo voa até o lugar exato do letreiro e o papel sobe como cortina (com um véu rosé atrás): a parede
aparece com o metal já embaixo do desenho. Na 1ª visita dura cerca de 5 s; ao voltar na mesma sessão, uma
versão curta; com "reduzir movimento" ligado no aparelho, não há abertura.

**Topo**: a arte já traz o selo, e ele nunca é cortado. No computador a arte ocupa a largura toda, com o
selo à direita e o texto no lado livre; se a janela for larga demais para a altura, a arte encolhe em vez
de cortar. No celular, o selo fica inteiro no alto e o texto, centralizado, embaixo. Uma luz quente acompanha o mouse.

**Fita**: os cuidados correm sozinhos, aceleram com a rolagem e invertem o sentido quando a pessoa rola para cima.

**O jeito de atender**: as palavras acendem uma a uma conforme a rolagem, e o perfil do selo é desenhado ao lado.

**Tratamentos**: lista que abre um item por vez, com a explicação e o atalho para perguntar no WhatsApp.

**Como funciona**: três passos; um fio corre por eles com a rolagem e cada passo acende quando o fio chega.

**Quem cuida de você**: o retrato recortado sai de dentro de um disco rosé, com o selo girando como um carimbo
no canto. O carimbo fica de propósito sobre o antebraço esquerdo, onde o recorte da foto termina numa borda reta.

**Avaliações**: a nota conta até 5,0 e as estrelas acendem uma a uma. O botão abre a ficha da clínica no Google.

**Onde fica**: endereço, horário com "aberto agora" calculado no fuso de São Paulo e o mapa.

**Convite final**: o selo impresso em papel, como um cartão que inclina com o mouse e ganha reflexo,
com a sombra de palmeira balançando ao fundo.

O rodapé tem o botão "Pausar movimento".

## Trocar as artes do topo

As artes ficam em `public/hero/`: `desktop-1672` e `desktop-1100` (16:9) e `mobile-941` e `mobile-640` (9:16),
cada uma em `.avif` e `.webp`. Para trocar por versões maiores, salve com os mesmos nomes ou ajuste os nomes e
tamanhos em `src/config/imagens.ts`.

A abertura pousa o desenho em cima do letreiro usando a posição do selo dentro de cada arte. Essas posições
estão em `ALVOS`, no fim de `src/components/abertura/selo.ts`: `caixa` (x, y, largura e altura do selo, em pixels
da arte) e `ajuste` (a pequena correção de perspectiva de cada parte). Se a nova arte tiver o selo em outro
lugar ou tamanho, atualize `caixa` e troque cada `ajuste` por `[1, 0, 0, 1, 0, 0]`.
O CSS do topo (`src/styles/secoes.css`) também usa a posição do selo na arte para nunca cortá-lo; as frações
estão anotadas nos comentários.

## Arquivos

Menos de 100 arquivos no total (sem contar `node_modules` e `dist`).
