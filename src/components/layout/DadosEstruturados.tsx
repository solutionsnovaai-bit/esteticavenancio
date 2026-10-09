import { HORARIO, SEO, SITE, INSTAGRAM_URL } from '../../config/site'
import { temWhatsApp } from '../../lib/whatsapp'

const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** Dados para o Google entender o negócio (clínica de estética, com endereço e horário). */
export default function DadosEstruturados() {
  const e = SITE.endereco
  const dados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: SITE.nome,
    description: SEO.descricao,
    url: `${__SITE_ORIGIN__}/`,
    image: `${__SITE_ORIGIN__}/og.jpg`,
    logo: `${__SITE_ORIGIN__}/icon-512.png`,
    address: {
      '@type': 'PostalAddress', streetAddress: e.rua, addressLocality: e.cidade, addressRegion: e.uf, addressCountry: 'BR', postalCode: e.cep,
    },
    openingHoursSpecification: HORARIO.filter(h => h.abre && h.fecha).map(h => ({
      '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS[h.dia], opens: h.abre, closes: h.fecha,
    })),
  }
  if (temWhatsApp) dados.telephone = `+${SITE.whatsapp.replace(/\D/g, '')}`
  if (INSTAGRAM_URL) dados.sameAs = [INSTAGRAM_URL]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }} />
}
