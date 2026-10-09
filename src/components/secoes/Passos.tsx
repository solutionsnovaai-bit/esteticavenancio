import { useRef } from 'react'
import { m, useScroll, useSpring, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { PASSOS } from '../../content/textos'
import { MENSAGENS } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { Botao } from '../ui/Botao'
import Revelar, { Titulo } from '../ui/Revelar'

function Passo({ i, total, progresso, titulo, texto, parado }: { i: number; total: number; progresso: MotionValue<number>; titulo: string; texto: string; parado: boolean }) {
  /* cada passo acende quando o fio chega nele */
  const de = i / total, ate = de + .5 / total
  const opacity = useTransform(progresso, [de, ate], [.3, 1])
  const escala = useTransform(progresso, [de, ate], [.4, 1])
  return <m.li className="passo" style={parado ? undefined : { opacity }}>
    <span className="passo-marca" aria-hidden="true"><m.i style={parado ? undefined : { scale: escala }} /></span>
    <span className="passo-numero num" aria-hidden="true">{i + 1}</span>
    <h3 className="titulo-m">{titulo}</h3>
    <p>{texto}</p>
  </m.li>
}

/** Como funciona, em três passos. Um fio corre pelos passos conforme a rolagem. */
export default function Passos() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 52%'] })
  const progresso = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: .001 })
  return <section id="como-funciona" className="passos secao papel" aria-labelledby="passos-titulo">
    <div className="conteiner">
      <Titulo id="passos-titulo" className="titulo" linhas={PASSOS.titulo} />
      <div className="passos-trilho">
        <m.div className="passos-fio" aria-hidden="true" style={{ '--p': reduced ? 1 : progresso } as never}><span /></m.div>
        <ol ref={ref} className="passos-lista">
          {PASSOS.itens.map((p, i) => <Passo key={p.titulo} i={i} total={PASSOS.itens.length} progresso={progresso} titulo={p.titulo} texto={p.texto} parado={reduced} />)}
        </ol>
      </div>
      <Revelar className="passos-cta"><Botao href={waLink(MENSAGENS.padrao)} rotuloAcessivel={`${PASSOS.cta} (abre em nova aba)`}>{PASSOS.cta}</Botao></Revelar>
    </div>
  </section>
}
