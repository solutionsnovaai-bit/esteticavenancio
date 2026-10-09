import { useState } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { TRATAMENTOS } from '../../content/textos'
import { GRUPOS } from '../../content/tratamentos'
import { MENSAGENS } from '../../config/site'
import { waLink } from '../../lib/whatsapp'
import Revelar, { Titulo } from '../ui/Revelar'

/**
 * Os cuidados, em lista. Tocar num nome abre a explicação e o atalho para perguntar no WhatsApp
 * (a mensagem já vai com o nome do tratamento). Só um fica aberto por vez.
 */
export default function Tratamentos() {
  const [aberto, setAberto] = useState<string | null>(GRUPOS[0].itens[0].nome)
  return <section id="tratamentos" className="tratamentos secao fundo-areia papel" aria-labelledby="tratamentos-titulo">
    <div className="conteiner tratamentos-grade">
      <div className="tratamentos-cabeca">
        <Titulo id="tratamentos-titulo" className="titulo" linhas={TRATAMENTOS.titulo} />
        <Revelar delay={.1}><p className="lead">{TRATAMENTOS.texto}</p></Revelar>
      </div>
      <div className="tratamentos-lista">
        {GRUPOS.map(g => <div key={g.id} className="tratamentos-grupo">
          <Revelar><h3 className="tratamentos-grupo-nome">{g.titulo}</h3></Revelar>
          <ul>
            {g.itens.map((t, i) => {
              const ativo = aberto === t.nome
              const id = `tratamento-${g.id}-${i}`
              return <Revelar as="li" key={t.nome} delay={i * .06} y={18} className={`tratamento ${ativo ? 'is-aberto' : ''}`}>
                <h4>
                  <button type="button" className="tratamento-botao" aria-expanded={ativo} aria-controls={id} onClick={() => setAberto(ativo ? null : t.nome)}>
                    <span className="tratamento-nome">{t.nome}</span>
                    <span className="tratamento-sinal" aria-hidden="true"><Plus strokeWidth={1.5} /></span>
                  </button>
                </h4>
                <div id={id} className="tratamento-painel" role="region" aria-label={t.nome} inert={!ativo}>
                  <div>
                    <p>{t.texto}</p>
                    <a className="link-linha tratamento-link" href={waLink(MENSAGENS.tratamento(t.frase))} target="_blank" rel="noopener noreferrer">
                      {TRATAMENTOS.perguntar} {t.frase}<ArrowUpRight aria-hidden="true" strokeWidth={2} />
                      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
                    </a>
                  </div>
                </div>
              </Revelar>
            })}
          </ul>
        </div>)}
      </div>
    </div>
  </section>
}
