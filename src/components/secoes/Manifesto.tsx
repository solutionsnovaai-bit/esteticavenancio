import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { MANIFESTO } from '../../content/textos'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { Rosto } from '../ui/Selo'

type Palavra = { texto: string; enfase: boolean }

/* Separa o texto em palavras; o que está entre *asteriscos* vira ênfase. */
function palavras(texto: string): Palavra[] {
  const out: Palavra[] = []
  texto.split('*').forEach((trecho, i) => trecho.split(/\s+/).filter(Boolean).forEach(p => out.push({ texto: p, enfase: i % 2 === 1 })))
  return out
}
const PALAVRAS = palavras(MANIFESTO.texto)

function Acende({ p, i, total, progresso }: { p: Palavra; i: number; total: number; progresso: MotionValue<number> }) {
  const a = i / total, b = Math.min(1, (i + 3.5) / total)
  const opacity = useTransform(progresso, [a, b], [.14, 1])
  return <m.span className={p.enfase ? 'manifesto-enfase' : undefined} style={{ opacity }}>{p.texto} </m.span>
}

/** O jeito de atender, numa frase só: as palavras acendem uma a uma conforme a pessoa rola, e o perfil do selo é desenhado ao lado. */
export default function Manifesto() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 82%', 'end 48%'] })
  return <section className="manifesto secao papel">
    <div className="conteiner manifesto-grade">
      <div className="manifesto-rosto" aria-hidden="true"><Rosto espessura={3} progresso={reduced ? undefined : scrollYProgress} /></div>
      <p ref={ref} className="manifesto-texto" aria-label={MANIFESTO.texto.replace(/\*/g, '')}>
        <span aria-hidden="true">
          {PALAVRAS.map((p, i) => reduced
            ? <span key={i} className={p.enfase ? 'manifesto-enfase' : undefined}>{p.texto} </span>
            : <Acende key={i} p={p} i={i} total={PALAVRAS.length} progresso={scrollYProgress} />)}
        </span>
      </p>
    </div>
  </section>
}
