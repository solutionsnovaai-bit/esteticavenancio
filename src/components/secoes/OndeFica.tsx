import { useEffect, useState } from 'react'
import { m } from 'motion/react'
import { MapPin } from 'lucide-react'
import { ONDE } from '../../content/textos'
import { HORARIO, INSTAGRAM_URL, MENSAGENS, SITE } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import { linkMapa, mapaEmbutido } from '../../lib/mapa'
import { formataHora, situacao } from '../../lib/horario'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import BrandIcon from '../ui/BrandIcon'
import { Botao } from '../ui/Botao'
import Revelar, { CORTINA, CORTINA_SOBE, Titulo } from '../ui/Revelar'

/** Endereço, horário (com "aberto agora" calculado no fuso de São Paulo) e o mapa, que se abre como cortina. */
export default function OndeFica() {
  const { reduced } = useMotionPreferences()
  const e = SITE.endereco
  /* A situação depende do relógio de quem visita: só calcula no navegador e atualiza a cada minuto. */
  const [agora, setAgora] = useState<ReturnType<typeof situacao> | null>(null)
  useEffect(() => {
    const atualiza = () => setAgora(situacao())
    atualiza()
    const t = window.setInterval(atualiza, 60_000)
    return () => clearInterval(t)
  }, [])

  return <section id="onde-fica" className="onde secao papel" aria-labelledby="onde-titulo">
    <div className="conteiner onde-grade">
      <div className="onde-texto">
        <Titulo id="onde-titulo" className="titulo" linhas={ONDE.titulo} />
        <Revelar delay={.06}>
          <address className="onde-endereco">
            <span>{e.rua}</span>
            <span>{e.bairro}, {e.cidade} - {e.uf}</span>
            <span>CEP {e.cep}</span>
          </address>
        </Revelar>
        <Revelar delay={.1}><p className="lead">{ONDE.texto}</p></Revelar>

        <Revelar delay={.14} className="onde-horario">
          <div className="onde-horario-cabeca">
            <h3>{ONDE.horarioTitulo}</h3>
            {agora && <p className={`onde-agora ${agora.aberto ? 'is-aberto' : ''}`}><i aria-hidden="true" />{agora.frase}</p>}
          </div>
          <dl>
            {HORARIO.map(h => <div key={h.dia} className={agora?.dia === h.dia ? 'is-hoje' : undefined}>
              <dt>{h.rotulo}</dt>
              <dd className="num">{h.abre && h.fecha ? `${formataHora(h.abre)} às ${formataHora(h.fecha)}` : ONDE.fechado}</dd>
            </div>)}
          </dl>
        </Revelar>

        <Revelar delay={.18} className="onde-acoes">
          <Botao href={waLink(MENSAGENS.caminho)} rotuloAcessivel={`${ONDE.whatsapp} pelo WhatsApp (abre em nova aba)`}>{ONDE.whatsapp}</Botao>
          <Botao href={linkMapa} variante="claro" icone={<MapPin strokeWidth={2} />} rotuloAcessivel={`${ONDE.mapa} (abre em nova aba)`}>{ONDE.mapa}</Botao>
        </Revelar>
        <Revelar delay={.22} className="onde-contatos">
          <a href={waLink(MENSAGENS.padrao)} target="_blank" rel="noopener noreferrer" className="link-linha"><BrandIcon brand="whatsapp" />{SITE.whatsappExibicao}</a>
          {INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="link-linha"><BrandIcon brand="instagram" />@{SITE.instagram}</a>}
        </Revelar>
      </div>

      <m.div className="onde-mapa" initial={reduced ? false : 'fechada'} whileInView="aberta" viewport={{ once: true, amount: .2 }}>
        <m.div className="onde-cortina" variants={CORTINA_SOBE} transition={{ duration: 1.6, ease: CORTINA }}>
          <p className="onde-reserva" aria-hidden="true"><MapPin strokeWidth={1.5} />{e.rua}<br />{e.bairro}, {e.cidade}</p>
          <iframe src={mapaEmbutido} title={ONDE.mapaTitulo} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen data-lenis-prevent />
        </m.div>
      </m.div>
    </div>
  </section>
}
