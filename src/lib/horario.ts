import { HORARIO } from '../config/site'

const minutos = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m }

/** Dia da semana e minutos do dia agora, no fuso de São Paulo (não importa onde a pessoa esteja). */
function agoraEmSaoPaulo() {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date())
  const p = (t: string) => partes.find(x => x.type === t)?.value ?? ''
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p('weekday'))
  return { dia, min: Number(p('hour')) * 60 + Number(p('minute')) }
}

export const formataHora = (hhmm: string) => { const [h, m] = hhmm.split(':'); return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}` }

/** Situação agora: aberto ou fechado, e a frase que acompanha. */
export function situacao() {
  const { dia, min } = agoraEmSaoPaulo()
  const hoje = HORARIO.find(h => h.dia === dia)
  if (hoje?.abre && hoje.fecha) {
    if (min >= minutos(hoje.abre) && min < minutos(hoje.fecha)) return { dia, aberto: true, frase: `Aberto agora, até as ${formataHora(hoje.fecha)}` }
    if (min < minutos(hoje.abre)) return { dia, aberto: false, frase: `Abre hoje às ${formataHora(hoje.abre)}` }
  }
  for (let i = 1; i <= 7; i++) {
    const d = HORARIO.find(h => h.dia === (dia + i) % 7)
    if (d?.abre) return { dia, aberto: false, frase: `Abre ${i === 1 ? 'amanhã' : d.rotulo.toLowerCase()} às ${formataHora(d.abre)}` }
  }
  return { dia, aberto: false, frase: 'Fechado' }
}
