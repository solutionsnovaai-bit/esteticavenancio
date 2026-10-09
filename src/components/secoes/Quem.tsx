import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { QUEM } from '../../content/textos'
import { RETRATO } from '../../config/imagens'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import Selo from '../ui/Selo'
import Revelar, { EASE, Titulo } from '../ui/Revelar'

/**
 * Quem cuida de você: o retrato recortado sai de dentro de um disco rosé (a cabeça passa da borda de cima),
 * com o selo da clínica girando devagar no canto. O disco cresce com um quique, o retrato sobe logo depois
 * e, com a rolagem, o retrato se move um pouco dentro do disco.
 */
export default function Quem() {
  const { reduced } = useMotionPreferences()
  const figura = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: figura, offset: ['start end', 'end start'] })
  const yPalco = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])
  const yFoto = useTransform(scrollYProgress, [0, 1], ['3.5%', '0%'])
  const giro = useTransform(scrollYProgress, [0, 1], [-18, 18])

  return <section id="quem-cuida" className="quem secao" aria-labelledby="quem-titulo">
    <div className="conteiner quem-grade">
      <m.div ref={figura} className="quem-figura" initial={reduced ? false : 'fora'} whileInView="dentro" viewport={{ once: true, amount: .3 }}>
        <m.div className="quem-palco" style={reduced ? undefined : { y: yPalco }}>
          <div className="quem-disco" aria-hidden="true">
            <m.span variants={{ fora: { scale: .2, opacity: 0 }, dentro: { scale: 1, opacity: 1 } }} transition={{ type: 'spring', stiffness: 70, damping: 14 }} />
          </div>
          <div className="quem-recorte">
            <m.div className="quem-sobe" variants={{ fora: { y: '16%', opacity: 0 }, dentro: { y: '0%', opacity: 1 } }} transition={{ duration: 1.3, delay: .3, ease: EASE }}>
              <picture>
                <source type="image/avif" srcSet={RETRATO.avif} sizes="(min-width: 1024px) 30vw, 60vw" />
                <m.img src={RETRATO.src} srcSet={RETRATO.webp} sizes="(min-width: 1024px) 30vw, 60vw" width={RETRATO.largura} height={RETRATO.altura}
                  loading="lazy" decoding="async" alt={QUEM.fotoAlt} style={reduced ? undefined : { y: yFoto, scale: 1.04, transformOrigin: '50% 100%' }} />
              </picture>
            </m.div>
          </div>
        </m.div>
        <m.div className="quem-selo" aria-hidden="true"
          variants={{ fora: { scale: 0, rotate: -60 }, dentro: { scale: 1, rotate: 0 } }} transition={{ type: 'spring', stiffness: 120, damping: 13, delay: .7 }}>
          <m.div style={reduced ? undefined : { rotate: giro }}><Selo gira /></m.div>
        </m.div>
      </m.div>

      <div className="quem-texto">
        <Titulo id="quem-titulo" className="titulo" linhas={QUEM.titulo} />
        <Revelar><p className="quem-nome">{QUEM.nome}</p></Revelar>
        <div className="quem-paragrafos">
          {QUEM.paragrafos.map((p, i) => <Revelar key={i} delay={i * .08}><p className="lead">{p}</p></Revelar>)}
        </div>
        <ul className="quem-pontos">
          {QUEM.pontos.map((p, i) => <Revelar as="li" key={p} delay={i * .08} y={14}>{p}</Revelar>)}
        </ul>
      </div>
    </div>
  </section>
}
