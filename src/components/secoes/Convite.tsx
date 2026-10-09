import { useEffect, useRef } from 'react'
import { m, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { CONVITE } from '../../content/textos'
import { MENSAGENS, SITE } from '../../config/site'
import { PAPEL } from '../../config/imagens'
import { waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { Botao } from '../ui/Botao'
import Palmeira from '../ui/Palmeira'
import Revelar, { Titulo } from '../ui/Revelar'

/**
 * O convite final: o selo impresso em papel, como um cartão que inclina com o mouse
 * e ganha um reflexo de luz, na mesma parede ao sol do topo (com a sombra de palmeira viva).
 */
export default function Convite() {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const giro = useTransform(scrollYProgress, [0, 1], [-7, 1])
  const yCartao = useTransform(scrollYProgress, [0, 1], ['10%', '-8%'])

  const mx = useMotionValue(0), my = useMotionValue(0)
  const rotY = useSpring(useTransform(mx, [-1, 1], [-11, 11]), { stiffness: 110, damping: 15 })
  const rotX = useSpring(useTransform(my, [-1, 1], [9, -9]), { stiffness: 110, damping: 15 })
  const bx = useTransform(mx, [-1, 1], ['12%', '88%']), by = useTransform(my, [-1, 1], ['8%', '92%'])
  const brilho = useMotionTemplate`radial-gradient(circle at ${bx} ${by}, rgb(255 246 232 / .55), transparent 46%)`
  useEffect(() => {
    const el = ref.current
    if (reduced || !el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const mover = (e: PointerEvent) => { const r = el.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width) * 2 - 1); my.set(((e.clientY - r.top) / r.height) * 2 - 1) }
    const sair = () => { mx.set(0); my.set(0) }
    el.addEventListener('pointermove', mover, { passive: true })
    el.addEventListener('pointerleave', sair)
    return () => { el.removeEventListener('pointermove', mover); el.removeEventListener('pointerleave', sair) }
  }, [reduced, mx, my])

  return <section ref={ref} className="convite secao" aria-labelledby="convite-titulo">
    <Palmeira className="convite-palmeira" />
    <div className="conteiner convite-grade">
      <div className="convite-palco">
        <m.div className="convite-voo" style={reduced ? undefined : { rotate: giro, y: yCartao }}>
          <m.div className="convite-cartao" style={reduced ? undefined : { rotateX: rotX, rotateY: rotY }}>
            <picture>
              <source type="image/avif" srcSet={PAPEL.avif} sizes="(min-width: 1024px) 34vw, 76vw" />
              <img src={PAPEL.src} srcSet={PAPEL.webp} sizes="(min-width: 1024px) 34vw, 76vw" width={PAPEL.largura} height={PAPEL.altura}
                loading="lazy" decoding="async" alt={`Selo da ${SITE.nome} impresso em papel creme.`} />
            </picture>
            <m.span className="convite-brilho" aria-hidden="true" style={reduced ? undefined : { backgroundImage: brilho }} />
          </m.div>
        </m.div>
      </div>
      <div className="convite-texto">
        <Titulo id="convite-titulo" className="titulo" linhas={CONVITE.titulo} />
        <Revelar delay={.1}><p className="lead">{CONVITE.texto}</p></Revelar>
        <Revelar delay={.16} className="convite-acoes">
          <Botao href={waLink(MENSAGENS.padrao)} rotuloAcessivel={`${CONVITE.cta} (abre em nova aba)`}>{CONVITE.cta}</Botao>
          <span className="convite-numero num">{SITE.whatsappExibicao}</span>
        </Revelar>
      </div>
    </div>
  </section>
}
