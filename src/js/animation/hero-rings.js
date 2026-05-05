const NS = 'http://www.w3.org/2000/svg';

const RINGS = [
  { color: '#4F5358', opacity: 0.55, delay: 0   },
  { color: '#8A9096', opacity: 0.45, delay: 120 },
  { color: '#C49A1E', opacity: 0.70, delay: 240 },
];

const START_R  = 50;
const START_SW = 65;
const END_SW   = 6;
const DUR      = 3400;

function fireRing(svg, ring, cx, cy, maxR) {
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('cx', cx);
  c.setAttribute('cy', cy);
  c.setAttribute('r', START_R);
  c.setAttribute('fill', 'none');
  c.setAttribute('stroke', ring.color);
  c.setAttribute('stroke-width', START_SW);
  c.setAttribute('stroke-opacity', ring.opacity);
  svg.appendChild(c);

  const start = performance.now();

  function tick(now) {
    const t    = Math.min((now - start) / DUR, 1);
    const ease = 1 - Math.pow(1 - t, 2.5);

    c.setAttribute('r',              START_R  + (maxR   - START_R)  * ease);
    c.setAttribute('stroke-width',   START_SW + (END_SW - START_SW) * ease);
    c.setAttribute('stroke-opacity', ring.opacity * (1 - t));

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      c.remove();
    }
  }

  requestAnimationFrame(tick);
}

export function initHeroRings() {
  if (!document.body.hasAttribute('data-hero-rings')) return;

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:30;';
  document.body.appendChild(svg);

  const cx   = window.innerWidth  / 2;
  const cy   = window.innerHeight / 2;
  const maxR = Math.hypot(cx, cy) + 80;

  RINGS.forEach(ring => setTimeout(() => fireRing(svg, ring, cx, cy, maxR), ring.delay));

  const totalDuration = RINGS[RINGS.length - 1].delay + DUR + 200;
  setTimeout(() => svg.remove(), totalDuration);
}
