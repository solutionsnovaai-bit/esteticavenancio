import { useEffect, useRef } from 'react'
import { m, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown, MapPin, Star } from 'lucide-react'
import { HERO } from '../../content/textos'
import { ENDERECO_CURTO, MENSAGENS, SEO, SITE } from '../../config/site'
import { CONSULTA_MOBILE, HERO_DESKTOP, HERO_MOBILE } from '../../config/imagens'
import { waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { Botao } from '../ui/Botao'
import { EASE, Titulo } from '../ui/Revelar'

export type Fase = 'abertura' | 'saida' | 'pronto'

/**
 * Topo: a parede ao sol com o selo da clínica (a arte já traz o selo) e o texto no lado livre.
 * A abertura pousa o desenho do selo exatamente em cima do letreiro ([data-arte] é a referência de posição).
 * No computador, uma luz quente acompanha o mouse pela parede.
 */
export default function Hero({ fase }: { fase: Fase }) {
  const { reduced } = useMotionPreferences()
  const ref = useRef<HTMLElement>(null)
  const entrou = fase !== 'abertura'
  const pronto = fase === 'pronto'

  /* Rolagem: a parede desce mais devagar que a página e o texto sobe um pouco. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yArte = useTransform(scrollYProgress, [0, 1], ['0%', '9%'])
  const yTexto = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const some = useTransform(scrollYProgress, [0, .7], [1, 0])

  /* Mouse: um foco de luz quente passeia pela parede, com mola. */
  const mx = useMotionValue(.3), my = useMotionValue(.35)
  const lx = useSpring(mx, { stiffness: 60, damping: 18 }), ly = useSpring(my, { stiffness: 60, damping: 18 })
  const px = useTransform(lx, v => `${(v * 100).toFixed(2)}%`), py = useTransform(ly, v => `${(v * 100).toFixed(2)}%`)
  const luz = useMotionTemplate`radial-gradient(42vmax circle at ${px} ${py}, rgb(255 240 214 / .5), transparent 62%)`
  useEffect(() => {
    const el = ref.current
    if (reduced || !pronto || !el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const mover = (e: PointerEvent) => { const r = el.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height) }
    el.addEventListener('pointermove', mover, { passive: true })
    return () => el.removeEventListener('pointermove', mover)
  }, [reduced, pronto, mx, my])

  const surge = (atraso: number) => ({
    initial: reduced ? false : { opacity: 0, y: 26 },
    animate: entrou || reduced ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.1, delay: atraso, ease: EASE },
  })

  const { nota, avaliacoes } = SITE.google
  return <section ref={ref} id="topo" className="hero" aria-labelledby="hero-titulo">
    <div className="hero-arte" data-arte>
      <picture>
        <source media={CONSULTA_MOBILE} type="image/avif" srcSet={HERO_MOBILE.avif} sizes="100vw" />
        <source media={CONSULTA_MOBILE} type="image/webp" srcSet={HERO_MOBILE.webp} sizes="100vw" />
        <source type="image/avif" srcSet={HERO_DESKTOP.avif} sizes="100vw" />
        <m.img src={HERO_DESKTOP.src} srcSet={HERO_DESKTOP.webp} sizes="100vw" width={HERO_DESKTOP.largura} height={HERO_DESKTOP.altura}
          alt={SEO.imagemAlt.replace('Selo da', 'Parede clara ao sol, com sombras de palmeira, e o selo da')} fetchPriority="high" decoding="async" style={reduced ? undefined : { y: yArte }} />
      </picture>
    </div>
    <m.div className="hero-luz" aria-hidden="true" style={reduced ? undefined : { backgroundImage: luz }} />

    <div className="conteiner hero-grade">
      <m.div className="hero-texto" style={reduced ? undefined : { y: yTexto, opacity: some }}>
        <Titulo as="h1" id="hero-titulo" className="titulo hero-titulo" linhas={HERO.titulo} ativo={entrou} atraso={.35}
          rotulo={`${SITE.nome}: ${HERO.titulo.join(' ')}`} />
        <m.p className="lead hero-lead" {...surge(.7)}>{HERO.texto}</m.p>
        <m.div className="hero-acoes" {...surge(.82)}>
          <Botao href={waLink(MENSAGENS.padrao)} rotuloAcessivel={`${HERO.cta} pelo WhatsApp (abre em nova aba)`}>{HERO.cta}</Botao>
          <a className="link-linha hero-link" href="#tratamentos">{HERO.link}<ArrowDown aria-hidden="true" strokeWidth={2} /></a>
        </m.div>
      </m.div>
    </div>

    <m.ul className="hero-base" {...surge(.95)}>
      <li><Star aria-hidden="true" strokeWidth={0} fill="currentColor" /><span className="num">{nota.toFixed(1).replace('.', ',')}</span> no Google, em {avaliacoes} avaliações</li>
      <li><MapPin aria-hidden="true" strokeWidth={2} />{ENDERECO_CURTO}</li>
    </m.ul>
  </section>
}
