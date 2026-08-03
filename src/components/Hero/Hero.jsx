import React, { useEffect, useRef, useState } from 'react';
import { MOCKUP_PROJECTS } from '../../data/mockupsData';
import { aboutPageCards } from '../../data/aboutPageCards';
import styles from './Hero.module.css';

export const Hero = () => {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const viewportRef = useRef(null);
  const cardRefs = useRef([]);
  const textOverlayRef = useRef(null);
  const aboutStageOverlayRef = useRef(null);

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

      // Clamp scrollFlight so the gallery is never pushed past the camera lens (Z clipping plane)
      const scrollFlight = Math.min(140, currentScroll * 0.35);

      // ── Phase 1 Factors ──────────────────────────────────
      // Hero exit factor: 0→1 as scroll goes from 0→350px
      const heroExitFactor = Math.min(1, currentScroll / 350);

      // CinematicAbout active factor: 0→1 as scroll travels past Hero into pinned transition
      const cinematicAboutFactor = Math.max(0, Math.min(1, (currentScroll - vh * 0.25) / (vh * 1.3)));

      // Disable card mouse interaction when transition begins
      const transitionActive = currentScroll > 50;

      // ── viewport3D: switch to fixed so cards survive in viewport as page scrolls
      if (viewportRef.current) {
        if (currentScroll > 5 && currentScroll < vh * 3.5) {
          viewportRef.current.style.position = 'fixed';
          viewportRef.current.style.inset = '0';
          viewportRef.current.style.pointerEvents = transitionActive ? 'none' : 'auto';
          viewportRef.current.style.visibility = 'visible';
        } else if (currentScroll <= 5) {
          viewportRef.current.style.position = 'absolute';
          viewportRef.current.style.inset = '0';
          viewportRef.current.style.pointerEvents = 'auto';
          viewportRef.current.style.visibility = 'visible';
        } else {
          viewportRef.current.style.visibility = 'hidden';
        }
      }

      // Camera rotation & movement — camera rotates, making objects travel naturally
      const sceneRotY = (transitionActive ? 0 : currMouseX * 12) + (cinematicAboutFactor * -14);
      const sceneRotX = (transitionActive ? 0 : -currMouseY * 8) + (cinematicAboutFactor * 3);

      // Initial camera depth zoom during slow motion load
      const initialCameraZ = (1 - easedLoad) * -450;

      if (galleryRef.current) {
        galleryRef.current.style.transform = `
          translate3d(0, 0, ${initialCameraZ + scrollFlight}px)
          rotateX(${sceneRotX}deg)
          rotateY(${sceneRotY}deg)
        `;
      }

      // Hero text completely dissolves before camera settles
      if (textOverlayRef.current) {
        const textFade = Math.max(0, 1 - heroExitFactor);
        const slideUp = currentScroll * 0.5;
        const textTiltX = transitionActive ? 0 : -currMouseY * 2.5;
        const textTiltY = transitionActive ? 0 : currMouseX * 3.5;

        textOverlayRef.current.style.opacity = textFade.toFixed(3);
        textOverlayRef.current.style.transform = `
          translate3d(0, -${slideUp}px, 50px)
          rotateX(${textTiltX}deg)
          rotateY(${textTiltY}deg)
        `;
        textOverlayRef.current.style.pointerEvents = textFade < 0.1 ? 'none' : 'auto';
      }

      // About Stage Editorial Text Overlay fades in ONLY AFTER cards settle in place (cinematicAboutFactor > 0.65)
      if (aboutStageOverlayRef.current) {
        const aboutFade = Math.max(0, Math.min(1, (cinematicAboutFactor - 0.65) / 0.3));
        aboutStageOverlayRef.current.style.opacity = aboutFade.toFixed(3);
        aboutStageOverlayRef.current.style.pointerEvents = aboutFade > 0.5 ? 'auto' : 'none';
      }

      // ── VIEWPORT DESTINATIONS FOR THE 2 FEATURED CARDS (RESPONSIVE) ──
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      const CARD_TARGETS = isMobile
        ? [
            // Mobile: Framed layout (Card 0 top center, Card 1 bottom center framing centered text)
            { x: 0, y: -34, z: 100, rx: 0, ry: 0, rz: 0, scale: 0.68 },
            { x: 0, y: 32, z: 130, rx: 0, ry: 0, rz: 0, scale: 0.72 }
          ]
        : isTablet
        ? [
            // Tablet: Slightly tighter offsets
            { x: -20, y: -20, z: 130, rx: 0, ry: 0, rz: 0, scale: 0.88 },
            { x: 16, y: 14, z: 160, rx: 2, ry: -2, rz: -2, scale: 0.92 }
          ]
        : [
            // Desktop: Full editorial composition
            { x: -28, y: -22, z: 140, rx: 0, ry: 0, rz: 0, scale: 1.0 },
            { x: 20, y: 13, z: 180, rx: 2, ry: -3, rz: -2, scale: 1.02 }
          ];

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

        // Multi-harmonic floating sine wave
        const floatY = Math.sin(time * speed.y * 50 + idx) * amp.y;
        const driftX = Math.cos(time * speed.x * 50 + idx * 0.7) * amp.x;
        const tiltX = Math.sin(time * speed.rot * 50 + idx * 0.5) * amp.rot;
        const tiltY = Math.cos(time * speed.rot * 40 + idx) * amp.rot;
        const breathScale = 1 + Math.sin(time * 1.2 + idx) * 0.015;

        const depthFactor = (initialPos.z + 500) / 1000;
        const mouseShiftX = transitionActive ? 0 : currMouseX * (14 * depthFactor);
        const mouseShiftY = transitionActive ? 0 : currMouseY * (10 * depthFactor);

        const currentX = initialPos.x + driftX + mouseShiftX;
        const currentY = initialPos.y + floatY + mouseShiftY;

        let finalX, finalY, finalZ, finalScale, finalRotX, finalRotY, finalRotZ, finalOpacity, finalBlur;

        if (idx < 2) {
          // ── Featured 2 Cards: Physical 3D flight into exact viewport destinations ──
          const stagger = idx * 0.15; // Staggered flight initiation
          const cardFlightT = Math.max(0, Math.min(1, (cinematicAboutFactor - stagger) / (1 - stagger)));

          // Smooth GSAP-style quartic ease-out for physical 3D flight
          const easeT = 1 - Math.pow(1 - cardFlightT, 4);

          const target = CARD_TARGETS[idx];

          // Micro-ambient motion at destination: max +-3px (~0.2vh), max +-0.4deg
          const microFloatY = Math.sin(time * 1.2 + idx * 2) * 0.2;
          const microFloatX = Math.cos(time * 0.9 + idx * 1.5) * 0.15;
          const microRotZ = target.rz === 0 ? 0 : Math.sin(time * 0.8 + idx) * 0.4;

          finalX = currentX + (target.x - currentX) * easeT + microFloatX * easeT;
          finalY = currentY + (target.y - currentY) * easeT + microFloatY * easeT;
          finalZ = (initialPos.z + loadZOffset) + (target.z - (initialPos.z + loadZOffset)) * easeT;

          finalScale = loadScale * (1 + (target.scale - 1) * easeT);
          finalRotX = (initialPos.rx + tiltX) * (1 - easeT) + target.rx * easeT;
          finalRotY = (initialPos.ry + tiltY) * (1 - easeT) + target.ry * easeT;
          finalRotZ = (initialPos.rz || 0) * (1 - easeT) + (target.rz + microRotZ) * easeT;

          finalOpacity = cardLoadOpacity * (0.85 + 0.15 * easeT);
          finalBlur = (1 - easeT) * 1.5;

          // Smooth cross-fade card content to rich About media from aboutPageCards.js and remove browser header bar
          const aboutImageOverlayEl = cardEl.querySelector(`.${styles.cardAboutImageOverlay}`);
          if (aboutImageOverlayEl) {
            aboutImageOverlayEl.style.opacity = easeT.toFixed(3);
          }
          const browserHeaderEl = cardEl.querySelector(`.${styles.browserHeader}`);
          if (browserHeaderEl) {
            browserHeaderEl.style.opacity = (1 - easeT).toFixed(3);
          }
        } else {
          // ── Remaining cards (including MediPulse Health - Index 2): Drift outward into background depth ──
          const posMag = Math.sqrt(initialPos.x * initialPos.x + initialPos.y * initialPos.y) || 1;
          const dirX = initialPos.x / posMag;
          const dirY = initialPos.y / posMag;

          const heroDriftX = dirX * heroExitFactor * 25;
          const heroDriftY = dirY * heroExitFactor * 15;

          finalX = currentX + heroDriftX;
          finalY = currentY + heroDriftY;
          finalZ = initialPos.z + loadZOffset;
          finalScale = loadScale * breathScale * (1 - cinematicAboutFactor * 0.15);
          finalRotX = initialPos.rx + tiltX;
          finalRotY = initialPos.ry + tiltY;
          finalRotZ = initialPos.rz || 0;
          finalOpacity = Math.max(0.08, cardLoadOpacity * (1 - cinematicAboutFactor * 0.92));
          finalBlur = cinematicAboutFactor * 4;
        }

        const isHovered = !transitionActive && activeProjectRef.current === proj.id;

        cardEl.style.transform = `
          translate3d(${finalX}vw, ${finalY}vh, ${finalZ}px)
          rotateX(${finalRotX}deg)
          rotateY(${finalRotY}deg)
          rotateZ(${finalRotZ}deg)
          scale(${finalScale})
        `;
        cardEl.style.opacity = isHovered ? 1 : finalOpacity.toFixed(2);
        cardEl.style.filter = isHovered ? 'none' : `blur(${finalBlur.toFixed(1)}px)`;
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

              {/* Full-Card Clean Image Overlay for About Stage (Loaded from aboutPageCards.js) */}
              {idx < 2 && aboutPageCards[idx] && (
                <div className={styles.cardAboutImageOverlay}>
                  <img
                    src={aboutPageCards[idx].image}
                    alt={aboutPageCards[idx].title}
                    className={styles.aboutCardImage}
                  />
                  <div className={styles.aboutCardVignette} />
                </div>
              )}

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
                <div className={styles.badgeCategory}>
                  {idx === 0 ? '01 // ABOUT US' : idx === 1 ? '02 // CREATIVE SHOWCASE' : proj.category}
                </div>
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

      {/* Unified 3D About Stage Overlay — text, watermark, and SVG arcs fade in as cards settle */}
      <div className={styles.aboutStageOverlay} ref={aboutStageOverlayRef}>
        {/* Decorative Background SVG Arc Lines (Matching Reference Image Inspiration) */}
        <svg className={styles.aboutArcSvg} viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M -100 250 C 300 50, 600 450, 900 200"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 400 800 C 700 950, 1100 600, 1500 750"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1.2"
          />
          <circle cx="280" cy="180" r="160" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
          <circle cx="1150" cy="620" r="280" stroke="rgba(0, 229, 255, 0.035)" strokeWidth="1" />
        </svg>

        {/* Large Watermark Background Typography */}
        <div className={styles.aboutWatermark}>
          <span className={styles.aboutWatermarkText}>CRAFT</span>
          <span className={styles.aboutWatermarkText}>VISION</span>
          <span className={styles.aboutWatermarkText}>IMPACT</span>
          <span className={styles.aboutWatermarkText}>DISCIPLINE</span>
        </div>

        {/* Upper Right Editorial Text Block */}
        <div className={styles.aboutTypographyGroup}>
          <span className={styles.aboutLabel}>01 // STUDIO OVERVIEW</span>
          <h2 className={styles.aboutHeading}>
            Designing Digital <span className="serif-italic text-cyan">Experiences</span> With Purpose & Precision.
          </h2>
          <p className={styles.aboutParagraph}>
            At Lame Dev, we believe in the power of digital craft, restraint, and architectural clarity. Our mission is simple: to support ambitious brands and create lasting change through high-impact interactive systems—one detail at a time.
          </p>
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
