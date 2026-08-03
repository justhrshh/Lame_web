import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';
import { MOCKUP_PROJECTS } from '../../data/mockupsData';
import { aboutPageCards } from '../../data/aboutPageCards';

export const Hero = () => {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const galleryRef = useRef(null);
  const cardRefs = useRef([]);
  const textOverlayRef = useRef(null);
  const aboutStageOverlayRef = useRef(null);
  const aboutLabelRef = useRef(null);
  const aboutHeadingRef = useRef(null);
  const aboutParagraphRef = useRef(null);
  const aboutWatermarkRef = useRef(null);
  const aboutArcRef = useRef(null);

  const mousePosRef = useRef({ targetX: 0, targetY: 0 });
  const activeProjectRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);
  const [visibleCardCount, setVisibleCardCount] = useState(18);

  // Responsive card count
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setVisibleCardCount(12);
      } else if (w < 1024) {
        setVisibleCardCount(16);
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

      // ── Phase 1 & 2 Factors ──────────────────────────────
      // Hero exit factor: 0→1 as scroll goes from 0→350px
      const heroExitFactor = Math.min(1, currentScroll / 350);

      // CinematicAbout active factor: 0→1 as scroll travels past Hero into pinned transition
      const cinematicAboutFactor = Math.max(0, Math.min(1, (currentScroll - vh * 0.25) / (vh * 1.3)));

      // Phase 2 Universe Formation Factor: 0→1 as scroll travels past About reading position (vh * 1.4 -> vh * 3.3)
      const universeFormationFactor = Math.max(0, Math.min(1, (currentScroll - vh * 1.4) / (vh * 1.9)));

      // Disable card mouse interaction when transition begins
      const transitionActive = currentScroll > 50;

      // ── viewport3D: switch to fixed so cards survive in viewport as page scrolls
      if (viewportRef.current) {
        if (currentScroll > 5 && currentScroll < vh * 3.8) {
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

      // Camera rotation & subtle pullback in 3D space
      const cameraPullbackZ = universeFormationFactor * -80;
      const sceneRotY = (transitionActive ? 0 : currMouseX * 12) + (cinematicAboutFactor * -14) + (universeFormationFactor * 14);
      const sceneRotX = (transitionActive ? 0 : -currMouseY * 8) + (cinematicAboutFactor * 3) - (universeFormationFactor * 3);

      // Initial camera depth zoom during slow motion load
      const initialCameraZ = (1 - easedLoad) * -450;

      if (galleryRef.current) {
        galleryRef.current.style.transform = `
          translate3d(0, 0, ${initialCameraZ + scrollFlight + cameraPullbackZ}px)
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

      // ── STEP 1: Fast & Clean About Content Exit (Completes early by universeFormationFactor = 0.18) ──
      const aboutEntranceFade = Math.max(0, Math.min(1, (cinematicAboutFactor - 0.65) / 0.3));
      const aboutExitFade = Math.max(0, Math.min(1, universeFormationFactor / 0.18));

      if (aboutStageOverlayRef.current) {
        const netAboutOpacity = aboutEntranceFade * (1 - aboutExitFade);
        aboutStageOverlayRef.current.style.opacity = netAboutOpacity.toFixed(3);
        aboutStageOverlayRef.current.style.pointerEvents = netAboutOpacity > 0.5 ? 'auto' : 'none';
      }

      // Staggered About Text Exit
      if (aboutLabelRef.current) {
        const labelExit = Math.max(0, Math.min(1, universeFormationFactor / 0.12));
        aboutLabelRef.current.style.opacity = (1 - labelExit).toFixed(3);
        aboutLabelRef.current.style.transform = `translateY(-${labelExit * 35}px)`;
      }

      if (aboutHeadingRef.current) {
        const headingExit = Math.max(0, Math.min(1, (universeFormationFactor - 0.04) / 0.14));
        aboutHeadingRef.current.style.opacity = (1 - headingExit).toFixed(3);
        aboutHeadingRef.current.style.filter = `blur(${headingExit * 6}px)`;
        aboutHeadingRef.current.style.transform = `translateY(-${headingExit * 55}px)`;
      }

      if (aboutParagraphRef.current) {
        const paragraphExit = Math.max(0, Math.min(1, (universeFormationFactor - 0.08) / 0.12));
        aboutParagraphRef.current.style.opacity = (1 - paragraphExit).toFixed(3);
        aboutParagraphRef.current.style.transform = `translateY(-${paragraphExit * 40}px)`;
      }

      if (aboutWatermarkRef.current) {
        const watermarkExit = Math.max(0, Math.min(1, universeFormationFactor / 0.16));
        aboutWatermarkRef.current.style.opacity = (1 - watermarkExit).toFixed(3);
      }

      if (aboutArcRef.current) {
        const arcExit = Math.max(0, Math.min(1, universeFormationFactor / 0.16));
        aboutArcRef.current.style.opacity = (1 - arcExit).toFixed(3);
      }

      // ── VIEWPORT DESTINATIONS FOR THE 2 FEATURED CARDS (RESPONSIVE) ──
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      const CARD_TARGETS = isMobile
        ? [
            { x: 0, y: -34, z: 100, rx: 0, ry: 0, rz: 0, scale: 0.68 },
            { x: 0, y: 32, z: 130, rx: 0, ry: 0, rz: 0, scale: 0.72 }
          ]
        : isTablet
        ? [
            { x: -20, y: -20, z: 130, rx: 0, ry: 0, rz: 0, scale: 0.88 },
            { x: 16, y: 14, z: 160, rx: 2, ry: -2, rz: -2, scale: 0.92 }
          ]
        : [
            { x: -28, y: -22, z: 140, rx: 0, ry: 0, rz: 0, scale: 1.0 },
            { x: 20, y: 13, z: 180, rx: 2, ry: -3, rz: -2, scale: 1.02 }
          ];

      // ── Animate individual 3D Cards ──────────────────────────────────────
      const totalUniverseCards = Math.min(MOCKUP_PROJECTS.length, visibleCardCount);

      // Predefined 18 slot angles mapping spatially so Card 0 (top-left) releases to top-left, Card 1 (lower-right) releases to lower-right
      const CIRCLE_SLOT_ANGLES = [
        Math.PI * 0.85, // Card 0: Top-Left slot (~153°) -> Shortest path from top-left!
        Math.PI * 0.15, // Card 1: Lower-Right slot (~27°) -> Shortest path from lower-right!
        Math.PI * 0.00, // Card 2: Far Right
        Math.PI * 0.30, // Card 3: Lower Right 2
        Math.PI * 0.45, // Card 4: Bottom Right
        Math.PI * 0.60, // Card 5: Bottom Center
        Math.PI * 0.72, // Card 6: Bottom Left
        Math.PI * 1.00, // Card 7: Far Left
        Math.PI * 1.15, // Card 8: Upper Left 1
        Math.PI * 1.30, // Card 9: Upper Left 2
        Math.PI * 1.45, // Card 10: Top Left
        Math.PI * 1.60, // Card 11: Top Center
        Math.PI * 1.75, // Card 12: Top Right 1
        Math.PI * 1.90, // Card 13: Top Right 2
        Math.PI * 0.10, // Card 14: Mid Right 1
        Math.PI * 0.40, // Card 15: Mid Bottom Right
        Math.PI * 0.90, // Card 16: Mid Bottom Left
        Math.PI * 1.25, // Card 17: Mid Top Left
      ];

      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;

        const proj = MOCKUP_PROJECTS[idx];
        if (!proj) return;

        const { initialPos, speed, amp } = proj;

        // Staggered card load progress
        const staggerDelay = idx * 0.02;
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
          // Featured 2 Cards: Physical 3D flight into exact viewport destinations
          const stagger = idx * 0.15;
          const cardFlightT = Math.max(0, Math.min(1, (cinematicAboutFactor - stagger) / (1 - stagger)));
          const easeT = 1 - Math.pow(1 - cardFlightT, 4);

          const target = CARD_TARGETS[idx];

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

          const aboutImageOverlayEl = cardEl.querySelector(`.${styles.cardAboutImageOverlay}`);
          if (aboutImageOverlayEl) {
            aboutImageOverlayEl.style.opacity = Math.max(easeT * (1 - universeFormationFactor), universeFormationFactor * 0.98).toFixed(3);
          }
          const browserHeaderEl = cardEl.querySelector(`.${styles.browserHeader}`);
          if (browserHeaderEl) {
            browserHeaderEl.style.opacity = Math.max(0, (1 - easeT) * (1 - universeFormationFactor)).toFixed(3);
          }
        } else {
          // Remaining outer cards: fade out during About reading so they NEVER pile up behind featured cards
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

          // Fade outer cards to 0 during About reading, then fade in smoothly at their circle positions during universe formation
          finalOpacity = (1 - cinematicAboutFactor) * cardLoadOpacity + universeFormationFactor * 0.92;
          finalBlur = (1 - universeFormationFactor) * (cinematicAboutFactor * 4);

          const aboutImageOverlayEl = cardEl.querySelector(`.${styles.cardAboutImageOverlay}`);
          if (aboutImageOverlayEl) {
            aboutImageOverlayEl.style.opacity = (universeFormationFactor * 0.98).toFixed(3);
          }
          const browserHeaderEl = cardEl.querySelector(`.${styles.browserHeader}`);
          if (browserHeaderEl) {
            browserHeaderEl.style.opacity = (1 - universeFormationFactor).toFixed(3);
          }
        }

        // ── STEPS 4, 5, 6: MULTI-LAYER SCATTERED UNIVERSE WITH CENTER-FACING RADIAL TILT (MATCHING REFERENCE GIF SCREENSHOT 2) ──
        if (universeFormationFactor > 0.05) {
          const orbitBlendT = Math.max(0, Math.min(1, (universeFormationFactor - 0.08) / 0.82));
          const easeOrbitT = 1 - Math.pow(1 - orbitBlendT, 3);

          // Calculate current spatial angle directly from card's CURRENT (x,y) location (Zero criss-crossing!)
          const spatialAngle = Math.atan2(finalY, finalX);
          const orbitAngle = spatialAngle + time * 0.008; // Serene slow continuous rotation

          // 3 Scattered Radial Layers (Inner, Mid, Outer) so cards are SCATTERED across screen, NOT in a single orbit line!
          const layer = idx % 3;
          const layerRadX = layer === 0 ? (isMobile ? 18 : isTablet ? 22 : 25)
                          : layer === 1 ? (isMobile ? 28 : isTablet ? 32 : 36)
                          :               (isMobile ? 38 : isTablet ? 42 : 46);

          const layerRadY = layer === 0 ? (isMobile ? 12 : isTablet ? 14 : 17)
                          : layer === 1 ? (isMobile ? 20 : isTablet ? 22 : 25)
                          :               (isMobile ? 28 : isTablet ? 30 : 34);

          // Individual scatter noise offset to prevent any alignment into a single ring
          const scatterNoiseX = Math.sin(idx * 7.5) * 3.5;
          const scatterNoiseY = Math.cos(idx * 4.3) * 3.5;

          const orbitX = Math.cos(orbitAngle) * layerRadX + scatterNoiseX;
          const orbitY = Math.sin(orbitAngle) * layerRadY + scatterNoiseY;
          const orbitZ = (layer === 0 ? -100 : layer === 1 ? 0 : 90) + Math.sin(spatialAngle * 2 + time * 0.2) * 25;

          // Prominent photo tile scale (~160px wide) for clear, high-impact view
          const targetTileScale = layer === 0 ? (isMobile ? 0.34 : isTablet ? 0.38 : 0.42)
                                : layer === 1 ? (isMobile ? 0.38 : isTablet ? 0.44 : 0.48)
                                :               (isMobile ? 0.42 : isTablet ? 0.48 : 0.52);

          // EXACT RADIAL TANGENT ROTATION FACING CENTER (Matching Reference Screenshot 2!)
          // (spatialAngle * 180 / Math.PI) + 90deg aligns the tile tangentially around the center circle!
          const orbitRotZ = (spatialAngle * 180 / Math.PI) + 90;
          const orbitRotX = -Math.sin(spatialAngle) * 6;
          const orbitRotY = Math.cos(spatialAngle) * 6;

          const orbitOpacity = 0.96;

          finalX = finalX + (orbitX - finalX) * easeOrbitT;
          finalY = finalY + (orbitY - finalY) * easeOrbitT;
          finalZ = finalZ + (orbitZ - finalZ) * easeOrbitT;

          finalScale = finalScale + (targetTileScale - finalScale) * easeOrbitT;
          finalRotX = finalRotX + (orbitRotX - finalRotX) * easeOrbitT;
          finalRotY = finalRotY + (orbitRotY - finalRotY) * easeOrbitT;
          finalRotZ = finalRotZ + (orbitRotZ - finalRotZ) * easeOrbitT;
          finalOpacity = finalOpacity + (orbitOpacity - finalOpacity) * easeOrbitT;
          finalBlur = finalBlur + (0 - finalBlur) * easeOrbitT;
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
              className={styles.mockupCard}
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

              {/* Full-Card Clean Image Overlay for About Stage & Universe Formation */}
              {aboutPageCards[idx % aboutPageCards.length] && (
                <div className={styles.cardAboutImageOverlay}>
                  <img
                    src={aboutPageCards[idx % aboutPageCards.length].image}
                    alt={proj.title}
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
                    <div className={styles.mockPill} />
                    <div className={styles.mockHeading} />
                    <div className={styles.mockHeadingShort} />
                    <div className={styles.mockSub} />
                  </div>

                  <div className={styles.mockGrid}>
                    <div className={styles.mockCard} />
                    <div className={styles.mockCard} />
                    <div className={styles.mockCard} />
                  </div>
                </div>

                {/* Bottom Overlay bar with Title & Stat (Depth Layer Z: 40px) */}
                <div className={styles.cardFooter}>
                  <div className={styles.footerTextGroup}>
                    <span className={styles.cardTitle}>{proj.title}</span>
                    <span className={styles.cardPreviewText}>{proj.previewText}</span>
                  </div>
                  <div className={styles.statBadge}>{proj.stat}</div>
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
        <svg ref={aboutArcRef} className={styles.aboutArcSvg} viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <div ref={aboutWatermarkRef} className={styles.aboutWatermark}>
          <span className={styles.aboutWatermarkText}>CRAFT</span>
          <span className={styles.aboutWatermarkText}>VISION</span>
          <span className={styles.aboutWatermarkText}>IMPACT</span>
          <span className={styles.aboutWatermarkText}>DISCIPLINE</span>
        </div>

        {/* Upper Right Editorial Text Block */}
        <div className={styles.aboutTypographyGroup}>
          <span ref={aboutLabelRef} className={styles.aboutLabel}>01 // STUDIO OVERVIEW</span>
          <h2 ref={aboutHeadingRef} className={styles.aboutHeading}>
            Designing Digital <span className="serif-italic text-cyan">Experiences</span> With Purpose & Precision.
          </h2>
          <p ref={aboutParagraphRef} className={styles.aboutParagraph}>
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
              Ambitious Brands Forward.
            </h1>

            <p className={styles.heroSubheading}>
              We partner with visionary founders and global teams to engineer high-performance web applications, bespoke digital design systems, and immersive web experiences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
