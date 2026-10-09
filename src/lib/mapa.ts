import { SITE } from '../config/site'

const e = SITE.endereco
const busca = [e.rua, e.bairro, `${e.cidade} - ${e.uf}`, e.cep].filter(Boolean).join(', ')
const consulta = encodeURIComponent(`${SITE.nome}, ${busca}`)

/** Abre o endereço no Google Maps (no celular, abre o app). */
export const linkMapa = `https://www.google.com/maps/search/?api=1&query=${consulta}`

/** Abre a ficha da clínica no Google Maps, onde ficam as avaliações. */
export const linkAvaliacoes = SITE.googlePlaceId ? `${linkMapa}&query_place_id=${SITE.googlePlaceId}` : linkMapa

/** Mapa embutido (não precisa de chave). */
export const mapaEmbutido = `https://www.google.com/maps?q=${encodeURIComponent(busca)}&z=16&hl=pt-BR&output=embed`
