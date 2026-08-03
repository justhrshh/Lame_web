import React, { useEffect, useRef } from 'react';
import styles from './SceneEnvironment.module.css';

/**
 * SceneEnvironment v2 — One Continuous Cinematic Environment
 *
 * Design Philosophy:
 *   One world. One light. One uninterrupted journey.
 *   Nothing resets. Everything transforms.
 *
 * Six Rooms inside one building:
 *   Arrival → Creative Studio → Workshop → Gallery → Lounge → Launch Room
 *
 * Persistent elements:
 *   - Directional spotlight (one light source, evolves in position + color temperature)
 *   - Architectural grid (emerges → intensifies → softens → disappears)
 *   - Zone atmospheric overlays (crossfade — never switch abruptly)
 *   - Film grain (ultra-subtle, static — collective richness)
 */

// ── Zone Spotlight Config ─────────────────────────────────────
// Each zone: [top%vh, left%vw, colorRGB, opacity, filterBlur]
const ZONE_SPOTLIGHTS = [
  { top: -8,   left: 50, color: '210, 230, 255', opacity: 0.065, blur: 100 }, // Hero
  { top: 15,   left: 32, color: '205, 210, 240', opacity: 0.055, blur: 110 }, // Studio
  { top: 30,   left: 62, color: '175, 205, 255', opacity: 0.060, blur: 115 }, // Services
  { top: 45,   left: 50, color: '232, 232, 245', opacity: 0.055, blur: 105 }, // Portfolio
  { top: 55,   left: 38, color: '255, 238, 210', opacity: 0.048, blur: 120 }, // Testimonials
  { top: 68,   left: 50, color: '255, 255, 255', opacity: 0.060, blur: 95  }, // Contact
];

// ── Zone Grid Config ──────────────────────────────────────────
// Grid opacity per zone (raw SVG line opacity × this factor)
const ZONE_GRID = [
  0.0,   // Hero: invisible
  0.28,  // Studio: begins appearing
  0.50,  // Services: slightly stronger
  0.42,  // Portfolio: gallery neutral
  0.18,  // Testimonials: softens
  0.05,  // Contact: nearly gone
];

// ── Zone Perspective Config ───────────────────────────────────
// Portfolio zone gets a subtle perspective tilt on the grid
const ZONE_GRID_PERSPECTIVE = [
  'none', 'none', 'none',
  'perspective(800px) rotateX(12deg)',  // Portfolio: perspective lines
  'none', 'none',
];

// Zone CSS class names
const ZONE_CLASSES = [
  'zoneHero', 'zoneStudio', 'zoneServices',
  'zonePortfolio', 'zoneTestimonials', 'zoneContact',
];

// ── Grid Layout ───────────────────────────────────────────────
// Fine hairlines: 80px major grid, 20px minor subdivision
const GRID_MAJOR = 80;
const GRID_MINOR = 20;
const GRID_LINE_COLOR = 'rgba(255, 255, 255, 0.09)';
const GRID_MINOR_COLOR = 'rgba(255, 255, 255, 0.04)';

function buildGridSvg() {
  const W = 1920, H = 1080;
  const lines = [];

  // Minor grid
  for (let x = 0; x < W; x += GRID_MINOR) {
    const isMajor = x % GRID_MAJOR === 0;
    if (!isMajor) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${GRID_MINOR_COLOR}" stroke-width="0.5"/>`);
  }
  for (let y = 0; y < H; y += GRID_MINOR) {
    const isMajor = y % GRID_MAJOR === 0;
    if (!isMajor) lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${GRID_MINOR_COLOR}" stroke-width="0.5"/>`);
  }

  // Major grid
  for (let x = 0; x < W; x += GRID_MAJOR) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${GRID_LINE_COLOR}" stroke-width="0.5"/>`);
  }
  for (let y = 0; y < H; y += GRID_MAJOR) {
    lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${GRID_LINE_COLOR}" stroke-width="0.5"/>`);
  }

  // Corner measurement marks at major intersections (architectural detail)
  for (let x = GRID_MAJOR; x < W; x += GRID_MAJOR * 4) {
    for (let y = GRID_MAJOR; y < H; y += GRID_MAJOR * 4) {
      const m = 6;
      lines.push(`<line x1="${x-m}" y1="${y}" x2="${x+m}" y2="${y}" stroke="${GRID_LINE_COLOR}" stroke-width="0.8" opacity="0.6"/>`);
      lines.push(`<line x1="${x}" y1="${y-m}" x2="${x}" y2="${y+m}" stroke="${GRID_LINE_COLOR}" stroke-width="0.8" opacity="0.6"/>`);
    }
  }

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${lines.join('')}</svg>`
  )}`;
}

// ── Math utils ────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function smoothstep(x) {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

export const SceneEnvironment = () => {
  const spotlightRef = useRef(null);
  const gridRef = useRef(null);
  const zoneRefs = useRef([]);
  const rafRef = useRef(null);
  const scrollRef = useRef(0);

  // Build the grid SVG data URI once
  const gridSvgUrl = useRef(buildGridSvg());

  useEffect(() => {
    const getSectionOffsets = () => {
      const ids = ['home', 'about', 'services', 'portfolio', 'testimonials', 'contact'];
      return ids.map(id => {
        const el = document.getElementById(id);
        return el ? el.offsetTop : Infinity;
      });
    };

    let offsets = getSectionOffsets();

    // Recalculate offsets on resize (fonts load, images load, layout shifts)
    const recalc = () => { offsets = getSectionOffsets(); };
    window.addEventListener('resize', recalc);

    const numZones = ZONE_SPOTLIGHTS.length;

    const render = () => {
      const scroll = scrollRef.current;

      // Determine current zone and interpolation factor
      let zoneIdx = 0;
      let zoneFactor = 0;

      for (let i = 0; i < offsets.length - 1; i++) {
        if (scroll >= offsets[i] && scroll < offsets[i + 1]) {
          zoneIdx = i;
          const range = offsets[i + 1] - offsets[i];
          zoneFactor = range > 0 ? (scroll - offsets[i]) / range : 0;
          break;
        }
        if (scroll >= offsets[offsets.length - 1]) {
          zoneIdx = offsets.length - 1;
          zoneFactor = 0;
        }
      }

      const nextIdx = Math.min(zoneIdx + 1, numZones - 1);
      const t = smoothstep(zoneFactor);

      // ── Spotlight evolution ────────────────────────────────
      const cur = ZONE_SPOTLIGHTS[zoneIdx];
      const nxt = ZONE_SPOTLIGHTS[nextIdx];

      if (spotlightRef.current) {
        const top     = lerp(cur.top, nxt.top, t);
        const left    = lerp(cur.left, nxt.left, t);
        const opacity = lerp(cur.opacity, nxt.opacity, t);
        const blur    = lerp(cur.blur, nxt.blur, t);

        spotlightRef.current.style.top = `${top}vh`;
        spotlightRef.current.style.left = `${left}vw`;
        spotlightRef.current.style.opacity = opacity.toFixed(3);
        spotlightRef.current.style.filter = `blur(${blur.toFixed(0)}px)`;

        // Interpolate spotlight color
        const nextColor = nxt.color.split(',').map(Number);
        const curColor  = cur.color.split(',').map(Number);
        const r = lerp(curColor[0], nextColor[0], t).toFixed(0);
        const g = lerp(curColor[1], nextColor[1], t).toFixed(0);
        const b = lerp(curColor[2], nextColor[2], t).toFixed(0);
        spotlightRef.current.style.background =
          `radial-gradient(circle, rgba(${r},${g},${b}, 1) 0%, rgba(${r},${g},${b}, 0.25) 50%, transparent 75%)`;
      }

      // ── Grid opacity evolution ────────────────────────────
      if (gridRef.current) {
        const gridOpacity = lerp(ZONE_GRID[zoneIdx], ZONE_GRID[nextIdx], t);
        gridRef.current.style.opacity = gridOpacity.toFixed(3);

        // Portfolio: apply perspective transform on grid
        const curPerspective  = ZONE_GRID_PERSPECTIVE[zoneIdx];
        const nextPerspective = ZONE_GRID_PERSPECTIVE[nextIdx];
        // Simple toggle at midpoint — CSS transitions handle the smoothing
        gridRef.current.style.transform = t > 0.5 ? nextPerspective : curPerspective;
      }

      // ── Zone atmospheric crossfade ─────────────────────────
      zoneRefs.current.forEach((el, i) => {
        if (!el) return;
        let alpha = 0;
        if (i === zoneIdx)      alpha = 1 - t;
        else if (i === nextIdx) alpha = t;
        el.style.opacity = alpha.toFixed(3);
      });

      rafRef.current = requestAnimationFrame(render);
    };

    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalc);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={styles.sceneRoot} aria-hidden="true">

      {/* Atmospheric zone overlays — crossfade via JS */}
      {ZONE_CLASSES.map((cls, i) => (
        <div
          key={cls}
          ref={el => (zoneRefs.current[i] = el)}
          className={styles[cls]}
          style={{ opacity: i === 0 ? 1 : 0 }}
        />
      ))}

      {/* Evolving Architectural Grid */}
      <div ref={gridRef} className={styles.grid} style={{ opacity: 0 }}>
        <img
          src={gridSvgUrl.current}
          className={styles.gridSvg}
          alt=""
          draggable={false}
        />
      </div>

      {/* Single directional spotlight — the one moving light of the site */}
      <div ref={spotlightRef} className={styles.spotlight} />

      {/* Film grain — ultra-subtle collective richness */}
      <div className={styles.grain} />
    </div>
  );
};
