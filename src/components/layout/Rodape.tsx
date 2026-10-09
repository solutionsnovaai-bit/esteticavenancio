import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { NAV, RODAPE } from '../../content/textos'
import { ENDERECO_COMPLETO, INSTAGRAM_URL, MENSAGENS, SITE } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import BrandIcon from '../ui/BrandIcon'
import Selo from '../ui/Selo'

/** Rodapé: o lema da clínica correndo com a rolagem, o selo e os contatos. */
export default function Rodape() {
  const { reduced, paused, toggle } = useMotionPreferences()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['14%', '-10%'])

  return <footer ref={ref} className="rodape tema-escuro">
    <div className="rodape-faixa" aria-hidden="true">
      <m.p className="rodape-assinatura" style={reduced ? undefined : { x }}>{RODAPE.faixa}</m.p>
    </div>
    <div className="conteiner rodape-grade">
      <div className="rodape-marca">
        <Selo className="rodape-selo" />
        <p>{SITE.nome}<span>{SITE.assinatura}</span></p>
      </div>
      <div className="rodape-col">
        <h2 className="rodape-titulo">Endereço</h2>
        <address>{ENDERECO_COMPLETO}</address>
      </div>
      <div className="rodape-col">
        <h2 className="rodape-titulo">Contato</h2>
        <a href={waLink(MENSAGENS.padrao)} target="_blank" rel="noopener noreferrer"><BrandIcon brand="whatsapp" />{SITE.whatsappExibicao}</a>
        {INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><BrandIcon brand="instagram" />@{SITE.instagram}</a>}
      </div>
      <nav className="rodape-col" aria-label="Seções do site">
        <h2 className="rodape-titulo">No site</h2>
        {NAV.map(n => <a key={n.href} href={n.href}>{n.rotulo}</a>)}
      </nav>
    </div>
    <div className="conteiner rodape-base">
      <p>© {new Date().getFullYear()} {SITE.nome}</p>
      <button type="button" className="rodape-pausa" onClick={toggle} aria-pressed={paused}>
        {paused ? <Play aria-hidden="true" strokeWidth={2} /> : <Pause aria-hidden="true" strokeWidth={2} />}
        {paused ? 'Ligar movimento' : 'Pausar movimento'}
      </button>
    </div>
  </footer>
}
