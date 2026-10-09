import { useLayoutEffect, useRef } from 'react'
import { animate } from 'motion/react'
import { CONSULTA_MOBILE } from '../../config/imagens'
import { ALVOS, ANEL, ARCO_BAIXO, ARCO_CIMA, LADO, PONTOS, ROSTO, ROSTO_ESP } from './selo'
import type { Matriz, Parte } from './selo'

export type ModoAbertura = 'completa' | 'rapida' | 'nenhuma'

export function modoAbertura(): ModoAbertura {
  const m = document.documentElement.dataset.abertura
  return m === 'rapida' || m === 'nenhuma' ? m : 'completa'
}

type Props = {
  /** O papel começou a subir: o topo do site entra. */
  onSaida: () => void
  /** O papel saiu e o desenho se dissolveu no letreiro: a abertura sai de cena. */
  onFim: () => void
}

type Ret = { x: number; y: number; w: number; h: number }
const PARTES: readonly Parte[] = ['cima', 'baixo', 'rosto', 'pontos']
const matriz = (m: Matriz) => `matrix(${m.join(', ')})`
const NEUTRA: Matriz = [1, 0, 0, 1, 0, 0]

const espera = (s: number) => new Promise<void>(r => window.setTimeout(r, s * 1000))
const E = [0.22, 1, 0.36, 1] as const
const CANETA = [0.45, 0, 0.15, 1] as const
const CORTINA = [0.76, 0, 0.24, 1] as const

/* O rosto é desenhado como uma caneta só: cada traço começa quando o anterior termina. */
const COMPRIMENTO = ROSTO.reduce((s, t) => s + t.comp, 0)
const INICIO_ROSTO = .2, TEMPO_ROSTO = 1.75
const RITMO = ROSTO.reduce<{ quando: number; dura: number }[]>((lista, t) => {
  const ultimo = lista[lista.length - 1]
  const quando = ultimo ? ultimo.quando + ultimo.dura : INICIO_ROSTO
  return [...lista, { quando, dura: Math.max(.09, (t.comp / COMPRIMENTO) * TEMPO_ROSTO) }]
}, [])

/*
  Abertura (1ª visita ~5 s; ao voltar ~2 s).
  1. Num papel creme, o selo da clínica se monta: o anel é a barra de carregamento de verdade (fontes e a arte do topo),
     o perfil é desenhado num traço só, as letras entram uma a uma pelos dois arcos e os pontos fecham com um quique.
  2. Com tudo carregado, o selo voa, ainda sobre o papel, até o lugar exato do letreiro na parede.
  3. O papel sobe como uma cortina (e um véu rosé logo atrás dele): a parede aparece com o metal já embaixo do desenho.
  Tudo o que se move é transform, opacity ou traço: nada de layout durante a animação.
*/
export default function Abertura({ onSaida, onFim }: Props) {
  const raiz = useRef<HTMLDivElement>(null)
  const papel = useRef<HTMLDivElement>(null)
  const veu = useRef<HTMLDivElement>(null)
  const selo = useRef<HTMLDivElement>(null)
  const anel = useRef<SVGCircleElement>(null)
  const contador = useRef<HTMLDivElement>(null)
  const numero = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const modo = modoAbertura()
    if (modo === 'nenhuma') { onSaida(); onFim(); return }
    const completa = modo === 'completa'
    try { sessionStorage.setItem('ven-abertura', '1') } catch { /* navegação privada */ }

    let cancelado = false
    let voando = false
    const el = selo.current!
    const arte = () => document.querySelector<HTMLElement>('[data-arte]')

    /*
      O selo tem o tamanho final (o do letreiro na parede) e começa reduzido no centro da tela.
      inicio: onde fica no palco. destino: onde está na arte do topo.
    */
    const transformacao = (de: Ret, para: Ret) => `translate3d(${de.x.toFixed(2)}px, ${de.y.toFixed(2)}px, 0) scale(${(de.w / para.w).toFixed(5)}, ${(de.h / para.h).toFixed(5)})`
    const medir = () => {
      const vw = window.innerWidth, vh = window.innerHeight
      const lado = Math.min(vw * .76, vh * .58, 500)
      const inicio: Ret = { x: (vw - lado) / 2, y: (vh - lado) / 2 - vh * .03, w: lado, h: lado }
      const A = ALVOS[window.matchMedia(CONSULTA_MOBILE).matches ? 'mobile' : 'desktop']
      const R = arte()?.getBoundingClientRect()
      const temArte = Boolean(R && R.width > 0)
      const [ax, ay, aw, ah] = A.caixa
      const destino: Ret = R && temArte
        ? { x: R.left + (ax / A.w) * R.width, y: R.top + (ay / A.h) * R.height, w: (aw / A.w) * R.width, h: (ah / A.h) * R.height }
        : inicio
      el.style.width = `${destino.w}px`
      el.style.height = `${destino.h}px`
      if (!voando) el.style.transform = transformacao(inicio, destino)
      return { inicio, destino, temArte, ajuste: A.ajuste }
    }

    let medida = medir()
    const aoRedimensionar = () => { if (!voando) medida = medir() }
    window.addEventListener('resize', aoRedimensionar)

    /* Carregamento real: as fontes e a arte do topo. */
    const img = arte()?.querySelector('img') ?? null
    const tarefas = [
      document.fonts?.ready ?? Promise.resolve(),
      img ? (img.complete && img.naturalWidth ? Promise.resolve() : new Promise<void>(r => { img.addEventListener('load', () => r(), { once: true }); img.addEventListener('error', () => r(), { once: true }) })) : Promise.resolve(),
    ]
    let feitas = 0
    const carregado = Promise.race([Promise.all(tarefas.map(t => Promise.resolve(t).then(() => { feitas++ }))), espera(7)])

    /* O anel anda com o tempo do desenho, mas só fecha a volta quando tudo carregou. */
    const DESENHO = 2.75
    let raf = 0, exibido = 0, pronto = false
    const inicioRelogio = performance.now()
    const voltaCompleta = new Promise<void>(resolve => {
      const quadro = (agora: number) => {
        if (cancelado) return
        const tempo = Math.min(1, (agora - inicioRelogio) / 1000 / DESENHO)
        const carga = pronto ? 1 : .55 + .35 * (feitas / tarefas.length)
        const alvo = Math.min(tempo, carga) * 100
        exibido += (alvo - exibido) * .14
        if (alvo >= 100 && exibido > 99.4) exibido = 100
        if (numero.current) numero.current.textContent = String(Math.round(exibido)).padStart(2, '0')
        if (anel.current) anel.current.style.strokeDashoffset = (1 - exibido / 100).toFixed(4)
        if (exibido >= 100) { resolve(); return }
        raf = requestAnimationFrame(quadro)
      }
      raf = requestAnimationFrame(quadro)
    })
    void carregado.then(() => { pronto = true })

    const roda = async () => {
      const tracos = Array.from(el.querySelectorAll<SVGPathElement>('.ab-rosto path'))
      const letras = Array.from(el.querySelectorAll<SVGPathElement>('.ab-cima path, .ab-baixo path'))
      const pontos = Array.from(el.querySelectorAll<SVGCircleElement>('.ab-pontos circle'))

      if (completa) {
        animate(el, { opacity: [0, 1] }, { duration: .5 })
        animate(contador.current!, { opacity: [0, 1] }, { duration: .6, delay: .1 })
        /* O perfil, num traço só. */
        tracos.forEach((p, i) => {
          const { quando, dura } = RITMO[i]
          animate(p, { strokeDashoffset: [1, 0], opacity: [0, 1] }, {
            strokeDashoffset: { duration: dura, delay: quando, ease: i === 0 ? CANETA : 'linear' },
            opacity: { duration: .05, delay: quando },
          })
        })
        /* As letras entram uma a uma: primeiro o arco de cima, depois o de baixo. */
        letras.forEach((p, i) => {
          animate(p, { opacity: [0, 1], y: [22, 0] }, { duration: .65, delay: .55 + i * .046, ease: E })
        })
        /* Os dois pontos fecham o selo com um quique. */
        pontos.forEach((p, i) => {
          animate(p, { scale: [0, 1], opacity: [0, 1] }, { type: 'spring', stiffness: 320, damping: 13, delay: 2.3 + i * .12 })
        })
        await voltaCompleta
        if (cancelado) return
        await espera(.25)
      } else {
        tracos.forEach(p => { p.style.strokeDashoffset = '0'; p.style.opacity = '1' })
        letras.forEach(p => { p.style.opacity = '1' })
        pontos.forEach(p => { p.style.opacity = '1' })
        animate(el, { opacity: [0, 1] }, { duration: .45, ease: 'easeOut' })
        await Promise.all([espera(.55), carregado])
        if (anel.current) anel.current.style.strokeDashoffset = '0'
      }
      if (cancelado) return

      /*
        O selo voa primeiro, ainda sobre o papel, até o lugar exato do letreiro. Só então o papel sobe (e o véu atrás dele):
        a parede aparece com o metal já embaixo do desenho, que se dissolve nele.
      */
      medida = medir()
      voando = true
      const { inicio, destino, temArte, ajuste } = medida
      animate(contador.current!, { opacity: 0 }, { duration: .3 })
      const voo = completa ? 1.05 : .85
      const subida = completa ? 1.15 : 1
      const largada = voo * .58
      const curva = [0.7, 0, 0.2, 1] as const
      if (temArte) {
        animate(el,
          { transform: [transformacao(inicio, destino), `translate3d(${destino.x.toFixed(2)}px, ${destino.y.toFixed(2)}px, 0) scale(1, 1)`] },
          { duration: voo, ease: curva })
        /*
          Durante o voo, cada parte do miolo se acomoda na perspectiva do letreiro da foto.
          É a animação nativa do navegador, porque a matriz vale no quadro do selo, com origem em 0 0 (ver abertura.css).
        */
        PARTES.forEach(parte => {
          el.querySelector<SVGGElement>(`.ab-${parte}`)?.animate(
            [{ transform: matriz(NEUTRA) }, { transform: matriz(ajuste[parte]) }],
            { duration: voo * 1000, easing: `cubic-bezier(${curva.join(', ')})`, fill: 'forwards' })
        })
      }
      await espera(largada)
      if (cancelado) return
      raiz.current?.classList.remove('is-bloqueando')
      raiz.current?.classList.add('is-saindo')
      onSaida()
      const sobe = (alvo: HTMLElement, atraso: number) => animate(alvo,
        { transform: ['translate3d(0, 0, 0)', 'translate3d(0, -104%, 0)'] }, { duration: subida, delay: atraso, ease: CORTINA })
      const cortinas = [sobe(papel.current!, 0), sobe(veu.current!, .13)]
      const some = animate(el, { opacity: 0 }, { duration: .55, delay: temArte ? subida * .72 : 0, ease: 'easeInOut' })
      await Promise.all([some.finished, ...cortinas.map(c => c.finished)])
      if (!cancelado) onFim()
    }

    roda().catch(() => { if (!cancelado) { onSaida(); onFim() } })
    return () => { cancelado = true; cancelAnimationFrame(raf); window.removeEventListener('resize', aoRedimensionar) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tracado = { pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 }
  return <div ref={raiz} className="abertura is-bloqueando" aria-hidden="true">
    <div ref={veu} className="ab-veu" />
    <div ref={papel} className="ab-papel papel">
      <div ref={contador} className="ab-contador">
        <span ref={numero} className="ab-numero num">00</span>
      </div>
    </div>
    <div ref={selo} className="ab-selo">
      <svg viewBox={`0 0 ${LADO} ${LADO}`} preserveAspectRatio="none">
        <circle className="ab-trilho" cx={ANEL.c} cy={ANEL.c} r={ANEL.r} strokeWidth={ANEL.esp} />
        <circle ref={anel} className="ab-anel" cx={ANEL.c} cy={ANEL.c} r={ANEL.r} strokeWidth={ANEL.esp}
          transform={`rotate(-90 ${ANEL.c} ${ANEL.c})`} {...tracado} />
        <g className="ab-cima">
          {ARCO_CIMA.map((d, i) => <path key={i} d={d} fillRule="evenodd" opacity={0} />)}
        </g>
        <g className="ab-baixo">
          {ARCO_BAIXO.map((d, i) => <path key={i} d={d} fillRule="evenodd" opacity={0} />)}
        </g>
        <g className="ab-pontos">
          {PONTOS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} opacity={0} />)}
        </g>
        <g className="ab-rosto" strokeWidth={ROSTO_ESP}>
          {ROSTO.map((t, i) => <path key={i} d={t.d} opacity={0} {...tracado} />)}
        </g>
      </svg>
    </div>
  </div>
}
