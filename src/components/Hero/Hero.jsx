import React, { useEffect, useRef, useState } from 'react';
import { MOCKUP_PROJECTS } from '../../data/mockupsData';
import styles from './Hero.module.css';

export const Hero = () => {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const viewportRef = useRef(null);
  const cardRefs = useRef([]);
  const textOverlayRef = useRef(null);

  const mousePosRef = useRef({ targetX: 0, targetY: 0 });
  const activeProjectRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);
  const [visibleCardCount, setVisibleCardCount] = useState(18);

  // Responsive card count
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setVisibleCardCount(6);
      } else if (w < 1024) {
        setVisibleCardCount(10);
      } else {
        setVisibleCardCount(18);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Passive mouse move listener updating Ref directly without triggering React re-renders
  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to +1
      const normY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to +1
      mousePosRef.current.targetX = normX;
      mousePosRef.current.targetY = normY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Individual card tilt & specular glare calculation on hover
  const handleCardMouseMove = (e, idx) => {
    const card = cardRefs.current[idx];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    const tiltX = py * -24;
    const tiltY = px * 24;
    const glareX = (px + 0.5) * 100;
    const glareY = (py + 0.5) * 100;

    card.style.setProperty('--card-tilt-x', `${tiltX}deg`);
    card.style.setProperty('--card-tilt-y', `${tiltY}deg`);
    card.style.setProperty('--glare-x', `${glareX}%`);
    card.style.setProperty('--glare-y', `${glareY}%`);
  };

  const handleCardMouseLeave = (idx) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    card.style.setProperty('--card-tilt-x', `0deg`);
    card.style.setProperty('--card-tilt-y', `0deg`);
    card.style.setProperty('--glare-x', `50%`);
    card.style.setProperty('--glare-y', `50%`);
    activeProjectRef.current = null;
    setActiveProject(null);
  };

  // Continuous 60FPS rAF Loop for Smooth Loading & Floating Motion (Zero Re-render overhead)
  useEffect(() => {
    let animId;
    let time = 0;
    let loadProgress = 0;
    let currMouseX = 0;
    let currMouseY = 0;

    const render = () => {
      time += 0.016; // Smooth time step

      // Smooth cinematic slow-motion load sequence (~2.0 seconds duration)
      if (loadProgress < 1) {
        loadProgress = Math.min(1, loadProgress + 0.005);
      }
      const easedLoad = 1 - Math.pow(1 - loadProgress, 3);

      // Smooth Lerp for Mouse
      currMouseX += (mousePosRef.current.targetX - currMouseX) * 0.04;
      currMouseY += (mousePosRef.current.targetY - currMouseY) * 0.04;

      const currentScroll = window.scrollY;
      const vh = window.innerHeight;
      const scrollFlight = currentScroll * 1.8;

      // ── Extended dissolve factor ───────────────────────────
      // Phase 0 (rawFactor 0→1): cards drift outward in hero (0→0.4vh scroll)
      // Phase 1 (rawFactor 1→2): cards enter About section, ghost-fade (0.4→0.8vh)
      // Phase 2 (rawFactor >2):  cards fully gone, viewport3D hidden
      const rawDissolveFactor = Math.min(2.5, currentScroll / (vh * 0.4));
      const scrollDissolveFactor = Math.min(1, rawDissolveFactor);
      const aboutEntryFactor = Math.max(0, Math.min(1, rawDissolveFactor - 1.0));
      const cardsFullyGone = rawDissolveFactor >= 2.2;

      // ── viewport3D: switch to fixed so cards survive in viewport as page scrolls
      if (viewportRef.current) {
        if (currentScroll > 5 && !cardsFullyGone) {
          viewportRef.current.style.position = 'fixed';
          viewportRef.current.style.inset = '0';
          // Disable pointer events once cards enter About section territory
          viewportRef.current.style.pointerEvents = currentScroll > vh * 0.5 ? 'none' : 'auto';
        } else if (currentScroll <= 5) {
          viewportRef.current.style.position = 'absolute';
          viewportRef.current.style.inset = '0';
          viewportRef.current.style.pointerEvents = 'auto';
        }
        viewportRef.current.style.visibility = cardsFullyGone ? 'hidden' : 'visible';
      }

      // Global gallery rotation from mouse perspective
      const sceneRotY = currMouseX * 12;
      const sceneRotX = -currMouseY * 8;

      // Initial camera depth zoom during slow motion load
      const initialCameraZ = (1 - easedLoad) * -450;

      if (galleryRef.current) {
        galleryRef.current.style.transform = `
          translate3d(0, 0, ${initialCameraZ + scrollFlight}px)
          rotateX(${sceneRotX}deg)
          rotateY(${sceneRotY}deg)
        `;
      }

      // Hero text 3D parallax, tilt & fade on scroll & mouse move
      if (textOverlayRef.current) {
        const fade = Math.max(0, 1 - currentScroll / 450);
        const slideUp = currentScroll * 0.6;
        const textTiltX = -currMouseY * 2.5;
        const textTiltY = currMouseX * 3.5;

        textOverlayRef.current.style.opacity = fade.toFixed(3);
        textOverlayRef.current.style.transform = `
          translate3d(0, -${slideUp}px, 50px)
          rotateX(${textTiltX}deg)
          rotateY(${textTiltY}deg)
        `;
        textOverlayRef.current.style.pointerEvents = fade < 0.1 ? 'none' : 'auto';
      }

      // Animate individual 3D Cards
      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;

        const proj = MOCKUP_PROJECTS[idx];
        if (!proj) return;

        const { initialPos, speed, amp } = proj;

        // Staggered card load progress
        const staggerDelay = idx * 0.03;
        const cardProgress = Math.max(0, Math.min(1, (loadProgress - staggerDelay) / 0.5));
        const easedCardLoad = 1 - Math.pow(1 - cardProgress, 3);

        const loadZOffset = (1 - easedCardLoad) * -300;
        const loadScale = 0.88 + easedCardLoad * 0.12;
        const cardLoadOpacity = Math.min(1, cardProgress * 1.4);

        // Multi-harmonic floating & breathing sine wave animations
        const floatY = Math.sin(time * speed.y * 50 + idx) * amp.y;
        const driftX = Math.cos(time * speed.x * 50 + idx * 0.7) * amp.x;
        const tiltX = Math.sin(time * speed.rot * 50 + idx * 0.5) * amp.rot;
        const tiltY = Math.cos(time * speed.rot * 40 + idx) * amp.rot;
        const breathScale = 1 + Math.sin(time * 1.2 + idx) * 0.015;

        const depthFactor = (initialPos.z + 500) / 1000;
        const mouseShiftX = currMouseX * (14 * depthFactor);
        const mouseShiftY = currMouseY * (10 * depthFactor);

        const currentX = initialPos.x + driftX + mouseShiftX;
        const currentY = initialPos.y + floatY + mouseShiftY;

        // ── Scroll-dissolve: cards drift outward then sink into About section ──
        const posMag = Math.sqrt(initialPos.x * initialPos.x + initialPos.y * initialPos.y) || 1;
        const dirX = initialPos.x / posMag;
        const dirY = initialPos.y / posMag;

        // Phase 1 (hero): outward drift along each card's own radial direction
        const dissolveCurve = scrollDissolveFactor * scrollDissolveFactor; // ease-in
        const heroDriftX = dirX * dissolveCurve * 28;
        const heroDriftY = dirY * dissolveCurve * 18;
        const dissolveRotZ = initialPos.rz + dirX * dissolveCurve * 10;
        const dissolveScale = 1 - dissolveCurve * 0.06;

        // Phase 2 (About entry): cards sink DOWNWARD in viewport — independent of direction
        // aboutEntryFactor: 0→1 as scroll goes from 0.4→0.8vh
        // Stagger each card slightly so they don't all move identically
        const cardStagger = (idx % 5) * 0.06; // 0→0.24 stagger
        const aboutCurve = Math.max(0, aboutEntryFactor - cardStagger);
        const aboutSink = aboutCurve * 65; // sink 65vh downward into About section

        const finalX = currentX + heroDriftX;
        const finalY = currentY + heroDriftY + aboutSink;

        // Only apply text safe-zone mask during hero phase (not About entry)
        let centerOpacity = 1;
        let centerBlur = 0;
        let centerSaturate = 1;
        if (dissolveCurve < 0.8 && aboutEntryFactor === 0) {
          const clampedX = Math.max(-22, Math.min(22, finalX));
          const dx = finalX - clampedX;
          const clampedY = Math.max(-26, Math.min(22, finalY));
          const dy = finalY - clampedY;
          const normX = dx / 8;
          const normY = dy / 8;
          const centerDist = Math.sqrt(normX * normX + normY * normY);
          const centerFactor = Math.min(1, Math.max(0, centerDist));
          centerOpacity = 0.35 + centerFactor * 0.65;
          centerBlur = (1 - centerFactor) * 2.5;
          centerSaturate = 0.6 + centerFactor * 0.4;
        }

        const effZ = initialPos.z + loadZOffset + scrollFlight;
        const scrollOpacity = effZ > 450 ? Math.max(0, 1 - (effZ - 450) / 200) : 1;

        // Opacity:
        // Hero phase: gentle fade (stays mostly visible)
        // About entry: ghost fade — cards become translucent as they sink into studio
        const heroFade = 1 - dissolveCurve * 0.4;
        const aboutGhostFade = aboutEntryFactor > 0 ? Math.max(0, 1 - aboutEntryFactor * 1.2) : 1;
        const dissolveOpacity = heroFade * aboutGhostFade;

        // In About section, cards are desaturated ghosts (no hovered state override)
        const isHovered = aboutEntryFactor === 0 ? activeProjectRef.current === proj.id : false;

        const finalOpacity = isHovered ? 1 : cardLoadOpacity * scrollOpacity * centerOpacity * dissolveOpacity;
        const finalBlur = isHovered ? 0 : (centerBlur + aboutEntryFactor * 2);
        const finalSaturate = isHovered ? 1 : (centerSaturate * (1 - aboutEntryFactor * 0.7));

        cardEl.style.transform = `
          translate3d(${finalX}vw, ${finalY}vh, ${initialPos.z + loadZOffset}px)
          rotateX(calc(${initialPos.rx + tiltX}deg + var(--card-tilt-x, 0deg)))
          rotateY(calc(${initialPos.ry + tiltY}deg + var(--card-tilt-y, 0deg)))
          rotateZ(${dissolveRotZ}deg)
          scale(${loadScale * breathScale * dissolveScale})
        `;
        cardEl.style.opacity = finalOpacity.toFixed(2);
        cardEl.style.filter = isHovered ? 'none' : `blur(${finalBlur.toFixed(1)}px) saturate(${finalSaturate.toFixed(2)})`;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section id="home" className={styles.heroSection} ref={containerRef}>
      {/* Ambient Radial Background Glow & Edge Vignette */}
      <div className={styles.ambientGlow} />
      <div className={styles.vignetteOverlay} />

      {/* 3D Scene Viewport — becomes fixed on scroll so cards persist into About section */}
      <div className={styles.viewport3D} ref={viewportRef}>
        <div className={styles.gallery3D} ref={galleryRef}>
          {MOCKUP_PROJECTS.slice(0, visibleCardCount).map((proj, idx) => (
            <div
              key={proj.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              className={`${styles.mockupCard} ${activeProject === proj.id ? styles.mockupCardHovered : ''}`}
              onMouseEnter={() => {
                activeProjectRef.current = proj.id;
                setActiveProject(proj.id);
              }}
              onMouseMove={(e) => handleCardMouseMove(e, idx)}
              onMouseLeave={() => handleCardMouseLeave(idx)}
            >
              {/* Dynamic Specular Light Glare Spot & Sheen (Riotters Effect) */}
              <div className={styles.dynamicSpecularLight} />
              <div className={styles.hoverSheenBeam} />

              {/* Card Browser Window Header (Depth Layer Z: 20px) */}
              <div className={styles.browserHeader}>
                <div className={styles.trafficLights}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
                <div className={styles.addressBar}>
                  <span className={styles.lockIcon}>🔒</span>
                  <span className={styles.urlText}>{proj.url.replace('https://', '')}</span>
                </div>
                <div className={styles.badgeCategory}>{proj.category}</div>
              </div>

              {/* Card Body & Mockup Preview Graphic */}
              <div
                className={styles.cardBody}
                style={{ background: proj.gradient }}
              >
                {/* Glass Reflection Highlight */}
                <div className={styles.glassReflection} />

                {/* Wireframe Mockup UI Content (Depth Layers Z: 30px - 55px) */}
                <div className={styles.mockupContent}>
                  <div className={styles.mockNav}>
                    <div className={styles.mockLogo} style={{ backgroundColor: proj.accentColor }} />
                    <div className={styles.mockLines}>
                      <span /><span /><span />
                    </div>
                  </div>

                  <div className={styles.mockHero}>
                    <span className={styles.mockTag}>{proj.category}</span>
                    <h4 className={styles.mockTitle}>{proj.title}</h4>
                    <p className={styles.mockDesc}>{proj.previewText}</p>
                    
                    <div className={styles.mockFooter}>
                      <span className={styles.mockStat}>{proj.stat}</span>
                      <span className={styles.mockBudget}>{proj.budget}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Reveal Overlay (Depth Layer Z: 75px) */}
                <div className={styles.hoverOverlay}>
                  <span className={styles.hoverTitle}>{proj.title}</span>
                  <span className={styles.hoverCategory}>{proj.category}</span>
                  <div className={styles.tagsRow}>
                    {proj.tags.map((t) => (
                      <span key={t} className={styles.tagPill}>{t}</span>
                    ))}
                  </div>
                  <span className={styles.viewBadge}>EXPLORE PROJECT →</span>
                </div>
              </div>

              {/* Soft Ambient Card Glow */}
              <div className={styles.cardGlow} />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Hero Text Overlay */}
      <div className={styles.heroTextOverlay} ref={textOverlayRef}>
        <div className="container">
          <div className={styles.textContainer}>
            {/* Ethereal Halo Backlight Glow behind heading */}
            <div className={styles.headingBacklightGlow} />

            <h1 className={styles.heroHeading}>
              Designing Digital <br />
              <span className="serif-italic text-cyan">Experiences</span> That Move <br />
              People.
            </h1>

            {/* Slow Motion Animated Theme Line */}
            <div className={styles.themeLineWrapper}>
              <div className={styles.themeLineTrack}>
                <div className={styles.themeLineGlow} />
                <div className={styles.themeLightBeam} />
              </div>
            </div>

            <p className={styles.heroSubheading}>
              Lame Dev creates modern websites, UI/UX experiences, SaaS platforms and custom web applications for ambitious businesses worldwide.
            </p>

            <div className={styles.heroButtons}>
              <a href="#portfolio" className={styles.primaryBtn}>
                <span>VIEW PORTFOLIO</span>
                <div className={styles.btnArrow}>→</div>
              </a>
              <a href="#contact" className={styles.secondaryBtn}>
                <span>START YOUR PROJECT</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className={styles.scrollDownIndicator}>
        <span className={styles.scrollText}>SCROLL TO EXPLORE</span>
        <div className={styles.scrollLine}>
          <div className={styles.scrollDot} />
        </div>
      </div>
    </section>
  );
};
