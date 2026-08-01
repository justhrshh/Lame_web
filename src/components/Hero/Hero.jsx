import React, { useEffect, useRef, useState } from 'react';
import { MOCKUP_PROJECTS } from '../../data/mockupsData';
import styles from './Hero.module.css';

export const Hero = () => {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const cardRefs = useRef([]);
  const textOverlayRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [scrollY, setScrollY] = useState(0);
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

  // Mouse move listener for global 3D perspective
  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to +1
      const normY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to +1
      setMousePos((prev) => ({ ...prev, targetX: normX, targetY: normY }));
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Individual card tilt & specular glare calculation on hover (Riotters-inspired physics)
  const handleCardMouseMove = (e, idx) => {
    const card = cardRefs.current[idx];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to +0.5

    const tiltX = py * -24; // tilt up/down
    const tiltY = px * 24;  // tilt left/right
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
    setActiveProject(null);
  };

  // Continuous rAF Loop for Slow Motion Loading + 60FPS Floating Motion + Lerped Mouse Perspective + Scroll Flight
  useEffect(() => {
    let animId;
    let time = 0;
    let loadProgress = 0;
    let currMouseX = 0;
    let currMouseY = 0;

    const render = () => {
      time += 1;

      // Slow-motion cinematic loading progression
      if (loadProgress < 1) {
        loadProgress = Math.min(1, loadProgress + 0.007);
      }
      const easedLoad = 1 - Math.pow(1 - loadProgress, 3.5);

      // Smooth Lerp for Mouse
      currMouseX += (mousePos.targetX - currMouseX) * 0.05;
      currMouseY += (mousePos.targetY - currMouseY) * 0.05;

      const currentScroll = window.scrollY;
      const scrollFlight = currentScroll * 1.8;

      // Global gallery rotation from mouse perspective
      const sceneRotY = currMouseX * 14;
      const sceneRotX = -currMouseY * 10;

      // Initial camera depth zoom during slow motion load
      const initialCameraZ = (1 - easedLoad) * -550;

      if (galleryRef.current) {
        galleryRef.current.style.transform = `
          translate3d(0, 0, ${initialCameraZ + scrollFlight}px)
          rotateX(${sceneRotX}deg)
          rotateY(${sceneRotY}deg)
        `;
      }

      // Hero text parallax fade & slide upward on scroll
      if (textOverlayRef.current) {
        const fade = Math.max(0, 1 - currentScroll / 450);
        const slideUp = currentScroll * 0.6;
        textOverlayRef.current.style.opacity = fade.toFixed(3);
        textOverlayRef.current.style.transform = `translate3d(0, -${slideUp}px, 0)`;
        textOverlayRef.current.style.pointerEvents = fade < 0.1 ? 'none' : 'auto';
      }

      // Animate individual 3D Cards
      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;

        const proj = MOCKUP_PROJECTS[idx];
        if (!proj) return;

        const { initialPos, speed, amp } = proj;

        // Staggered card load progress
        const staggerDelay = idx * 0.035;
        const cardProgress = Math.max(0, Math.min(1, (loadProgress - staggerDelay) / 0.55));
        const easedCardLoad = 1 - Math.pow(1 - cardProgress, 3);

        const loadZOffset = (1 - easedCardLoad) * -350;
        const loadScale = 0.85 + easedCardLoad * 0.15;
        const cardLoadOpacity = Math.min(1, cardProgress * 1.5);

        // Multi-harmonic sine waves for float & tilt
        const floatY = Math.sin(time * speed.y + idx) * amp.y;
        const driftX = Math.cos(time * speed.x + idx * 0.7) * amp.x;
        const tiltX = Math.sin(time * speed.rot + idx * 0.5) * amp.rot;
        const tiltY = Math.cos(time * speed.rot * 0.8 + idx) * amp.rot;
        const breathScale = 1 + Math.sin(time * 0.0015 + idx) * 0.02;

        const depthFactor = (initialPos.z + 500) / 1000;
        const mouseShiftX = currMouseX * (25 * depthFactor);
        const mouseShiftY = currMouseY * (20 * depthFactor);

        const effZ = initialPos.z + loadZOffset + scrollFlight;
        const scrollOpacity = effZ > 450 ? Math.max(0, 1 - (effZ - 450) / 200) : 1;
        const finalOpacity = cardLoadOpacity * scrollOpacity;

        cardEl.style.transform = `
          translate3d(${initialPos.x + driftX + mouseShiftX}vw, ${initialPos.y + floatY + mouseShiftY}vh, ${initialPos.z + loadZOffset}px)
          rotateX(calc(${initialPos.rx + tiltX}deg + var(--card-tilt-x, 0deg)))
          rotateY(calc(${initialPos.ry + tiltY}deg + var(--card-tilt-y, 0deg)))
          rotateZ(${initialPos.rz}deg)
          scale(${loadScale * breathScale})
        `;
        cardEl.style.opacity = finalOpacity.toFixed(2);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [mousePos]);

  return (
    <section id="home" className={styles.heroSection} ref={containerRef}>
      {/* Ambient Radial Background Glow */}
      <div className={styles.ambientGlow} />

      {/* 3D Scene Viewport */}
      <div className={styles.viewport3D}>
        <div className={styles.gallery3D} ref={galleryRef}>
          {MOCKUP_PROJECTS.slice(0, visibleCardCount).map((proj, idx) => (
            <div
              key={proj.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              className={`${styles.mockupCard} ${activeProject === proj.id ? styles.mockupCardHovered : ''}`}
              onMouseEnter={() => setActiveProject(proj.id)}
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
            <h1 className={styles.heroHeading}>
              Designing Digital <br />
              <span className="serif-italic text-gradient">Experiences</span> That Move People.
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
