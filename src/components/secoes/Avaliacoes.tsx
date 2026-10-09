import { useEffect, useRef } from 'react'
import { animate, m, useInView } from 'motion/react'
import { Star } from 'lucide-react'
import { AVALIACOES } from '../../content/textos'
import { SITE } from '../../config/site'
import { linkAvaliacoes } from '../../lib/mapa'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { Botao } from '../ui/Botao'
import Revelar, { EASE, Titulo } from '../ui/Revelar'

const formata = (n: number) => n.toFixed(1).replace('.', ',')

/** A nota no Google: o número conta até a nota, as estrelas acendem uma a uma. */
export default function Avaliacoes() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLDivElement>(null)
  const numero = useRef<HTMLSpanElement>(null)
  const visivel = useInView(ref, { once: true, amount: .5 })
  const { nota, avaliacoes } = SITE.google
  const cheias = Math.round(nota)

  useEffect(() => {
    if (!visivel || reduced || !numero.current) return
    const el = numero.current
    const c = animate(0, nota, { duration: 1.8, ease: EASE, onUpdate: v => { el.textContent = formata(v) } })
    return () => c.stop()
  }, [visivel, reduced, nota])

  return <section id="avaliacoes" className="avaliacoes secao tema-escuro" aria-labelledby="avaliacoes-titulo">
    <div className="conteiner avaliacoes-grade">
      <div ref={ref} className="avaliacoes-nota">
        <p className="avaliacoes-numero num" aria-label={`Nota ${formata(nota)} de 5 no Google`}>
          <span ref={numero} aria-hidden="true">{reduced ? formata(nota) : '0,0'}</span>
        </p>
        <div className="avaliacoes-estrelas" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => <m.span key={i}
            initial={reduced ? false : { scale: 0, rotate: -50, opacity: 0 }}
            animate={visivel || reduced ? { scale: 1, rotate: 0, opacity: i < cheias ? 1 : .3 } : undefined}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: .5 + i * .12 }}>
            <Star strokeWidth={0} fill="currentColor" />
          </m.span>)}
        </div>
        <Revelar delay={.2}><p className="avaliacoes-legenda">{AVALIACOES.legenda(avaliacoes)}</p></Revelar>
      </div>

      <div className="avaliacoes-texto">
        <Titulo id="avaliacoes-titulo" className="titulo" linhas={AVALIACOES.titulo} />
        <Revelar><h3 className="avaliacoes-subtitulo">{AVALIACOES.elogiosTitulo}</h3></Revelar>
        <ul className="avaliacoes-elogios">
          {AVALIACOES.elogios.map((e, i) => <Revelar as="li" key={e} delay={i * .07} y={16}>{e}</Revelar>)}
        </ul>
        <Revelar className="avaliacoes-cta">
          <Botao href={linkAvaliacoes} variante="rose" icone={<Star strokeWidth={0} fill="currentColor" />} rotuloAcessivel={`${AVALIACOES.cta} (abre em nova aba)`}>{AVALIACOES.cta}</Botao>
        </Revelar>
      </div>
    </div>
  </section>
}
