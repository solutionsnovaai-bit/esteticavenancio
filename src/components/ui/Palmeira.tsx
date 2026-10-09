/*
  Sombra de folhas de palmeira, como a da arte do topo. É só uma forma desfocada que balança devagar.
  As folhas são desenhadas por conta: uma haste curva com folíolos dos dois lados.
*/

function folha(x0: number, y0: number, angulo: number, comprimento: number, foliolos: number) {
  const rad = (angulo * Math.PI) / 180
  const partes: string[] = []
  for (let i = 0; i < foliolos; i++) {
    const t = (i + 1) / (foliolos + 1)
    /* a haste verga um pouco conforme avança */
    const a = rad + t * .5
    const hx = x0 + Math.cos(rad + t * .25) * comprimento * t
    const hy = y0 + Math.sin(rad + t * .25) * comprimento * t
    const tam = comprimento * (.5 - Math.abs(t - .45) * .55)
    const larg = tam * .085
    for (const lado of [-1, 1]) {
      const dir = a + lado * (1.05 - t * .35)
      const px = hx + Math.cos(dir) * tam, py = hy + Math.sin(dir) * tam
      const nx = Math.cos(dir + Math.PI / 2) * larg, ny = Math.sin(dir + Math.PI / 2) * larg
      const mx = (hx + px) / 2, my = (hy + py) / 2
      partes.push(`M${hx.toFixed(1)} ${hy.toFixed(1)}Q${(mx + nx).toFixed(1)} ${(my + ny).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}Q${(mx - nx).toFixed(1)} ${(my - ny).toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}Z`)
    }
  }
  return partes.join('')
}

const FOLHAS = [folha(0, 620, -52, 760, 15), folha(-40, 700, -30, 820, 16), folha(60, 760, -68, 620, 13)]

export default function Palmeira({ className = '' }: { className?: string }) {
  return <svg className={`palmeira anima-continua ${className}`} viewBox="0 0 900 800" aria-hidden="true" focusable="false">
    {FOLHAS.map((d, i) => <path key={i} className="palmeira-folha" d={d} />)}
  </svg>
}
