import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styles from './CinematicAbout.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * PHASE 1 — CinematicAbout Section
 *
 * Placed directly between Hero and the existing About section.
 * Pinned via GSAP ScrollTrigger.
 * Drives camera rotation and 3-card editorial entrance.
 */
export const CinematicAbout = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Master ScrollTrigger timeline for Phase 1 transition
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: true,
        scrub: 1.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.cinematicAboutSection}>
      <div className={styles.pinnedStage}>
        {/* Subtle ambient lighting indicator */}
        <div className={styles.ambientGlow} />
      </div>
    </section>
  );
};

export default CinematicAbout;
