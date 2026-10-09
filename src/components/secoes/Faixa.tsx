import { useRef } from 'react'
import { m, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { FAIXA } from '../../content/textos'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { useSceneActivity } from '../../hooks/useSceneActivity'

const envolve = (min: number, max: number, v: number) => { const r = max - min; return ((((v - min) % r) + r) % r) + min }

/**
 * Fita com os cuidados da clínica. Anda sozinha, acelera com a velocidade da rolagem
 * e inverte o sentido quando a pessoa rola para cima.
 */
export default function Faixa() {
  const ref = useRef<HTMLElement>(null)
  const ativa = useSceneActivity(ref)
  const { reduced } = useMotionPreferences()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const suave = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 380 })
  const fator = useTransform(suave, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(base, v => `${envolve(-50, 0, v)}%`)
  const sentido = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (!ativa || reduced) return
    let passo = sentido.current * 1.1 * (Math.min(delta, 50) / 1000)
    const f = fator.get()
    if (f < -0.02) sentido.current = 1
    else if (f > 0.02) sentido.current = -1
    passo += sentido.current * Math.abs(passo) * Math.min(Math.abs(f), 6)
    base.set(base.get() + passo)
  })

  const metade = <span className="faixa-metade">
    {FAIXA.map(p => <span key={p} className="faixa-item"><span>{p}</span><i className="faixa-ponto" /></span>)}
  </span>
  return <section ref={ref} className="faixa tema-escuro" aria-label="Cuidados da clínica">
    <p className="sr-only">{FAIXA.join(', ')}.</p>
    <m.div className="faixa-trilho" aria-hidden="true" style={{ x }}>{metade}{metade}</m.div>
  </section>
}
