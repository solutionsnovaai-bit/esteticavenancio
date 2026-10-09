import { m, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { ANEL, ARCO_BAIXO, ARCO_CIMA, LADO, PONTOS, ROSTO, ROSTO_CAIXA, ROSTO_ESP } from '../abertura/selo'

const TOTAL = ROSTO.reduce((s, t) => s + t.comp, 0)
/* Em que trecho do progresso (0 a 1) cada traço do rosto é desenhado: um depois do outro, como uma caneta só. */
const TRECHOS = ROSTO.reduce<{ de: number; ate: number }[]>((lista, t) => {
  const de = lista.length ? lista[lista.length - 1].ate : 0
  return [...lista, { de, ate: de + t.comp / TOTAL }]
}, [])

function Traco({ d, de, ate, progresso }: { d: string; de: number; ate: number; progresso: MotionValue<number> }) {
  const pathLength = useTransform(progresso, [de, ate], [0, 1])
  const opacity = useTransform(progresso, [de, de + .004], [0, 1])
  return <m.path d={d} style={{ pathLength, opacity }} />
}

type RostoProps = {
  className?: string
  /** Espessura do traço, na escala do desenho (padrão: a do selo). */
  espessura?: number
  /** 0 a 1: quanto do desenho já foi traçado. Sem isso, aparece inteiro. */
  progresso?: MotionValue<number>
}

/** O perfil do selo, sozinho, em traço de caneta. */
export function Rosto({ className = '', espessura = ROSTO_ESP, progresso }: RostoProps) {
  const [x, y, w, h] = ROSTO_CAIXA
  const f = espessura
  return <svg className={className} viewBox={`${x - f} ${y - f} ${w + 2 * f} ${h + 2 * f}`} fill="none" stroke="currentColor"
    strokeWidth={espessura} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {ROSTO.map((t, i) => progresso
      ? <Traco key={i} d={t.d} de={TRECHOS[i].de} ate={TRECHOS[i].ate} progresso={progresso} />
      : <path key={i} d={t.d} />)}
  </svg>
}

/**
 * O selo inteiro: anel, os dois arcos de letras, os pontos e o perfil.
 * Com `gira`, as letras dão a volta devagar e o perfil fica parado.
 */
export default function Selo({ className = '', gira = false }: { className?: string; gira?: boolean }) {
  return <svg className={className} viewBox={`0 0 ${LADO} ${LADO}`} fill="currentColor" aria-hidden="true" focusable="false">
    <circle cx={ANEL.c} cy={ANEL.c} r={ANEL.r} fill="none" stroke="currentColor" strokeWidth={ANEL.esp} />
    <g className={gira ? 'selo-gira anima-continua' : undefined}>
      {ARCO_CIMA.map((d, i) => <path key={`c${i}`} d={d} fillRule="evenodd" />)}
      {ARCO_BAIXO.map((d, i) => <path key={`b${i}`} d={d} fillRule="evenodd" />)}
      {PONTOS.map(([x, y, r], i) => <circle key={`p${i}`} cx={x} cy={y} r={r} />)}
    </g>
    <g fill="none" stroke="currentColor" strokeWidth={ROSTO_ESP} strokeLinecap="round" strokeLinejoin="round">
      {ROSTO.map((t, i) => <path key={i} d={t.d} />)}
    </g>
  </svg>
}
