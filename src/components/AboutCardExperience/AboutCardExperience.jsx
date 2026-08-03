import React from 'react';
import { aboutPageCards } from '../../data/aboutPageCards';
import { EditorialCard } from '../EditorialCard/EditorialCard';
import styles from './AboutCardExperience.module.css';

/**
 * Phase 2 — AboutCardExperience Component
 *
 * Premium editorial magazine layout holding:
 * - 3 configurable cards loaded dynamically from aboutPageCards.js
 * - Unique IDs ("about-page-card-01", "02", "03")
 * - Non-overlapping typography (Section label, Large Heading, Supporting Paragraph)
 * - Large background watermark typography ("CRAFT / VISION / IMPACT")
 * - Decorative SVG thin arc graphics connecting cards visually
 */
export const AboutCardExperience = () => {
  const card1Data = aboutPageCards.find((c) => c.id === 'about-page-card-01') || aboutPageCards[0];
  const card2Data = aboutPageCards.find((c) => c.id === 'about-page-card-02') || aboutPageCards[1];
  const card3Data = aboutPageCards.find((c) => c.id === 'about-page-card-03') || aboutPageCards[2];

  return (
    <section className={styles.aboutExperienceSection}>
      {/* Decorative Background SVG Arc Lines (Inspired by Reference Composition) */}
      <svg className={styles.decorativeArcs} viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M -100 250 C 300 50, 600 450, 900 200"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M 400 800 C 700 950, 1100 600, 1500 750"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1.2"
        />
        <circle cx="280" cy="180" r="160" stroke="rgba(255, 255, 255, 0.035)" strokeWidth="1" />
        <circle cx="1150" cy="620" r="280" stroke="rgba(0, 229, 255, 0.03)" strokeWidth="1" />
      </svg>

      {/* Large Subtle Watermark Typography in Background */}
      <div className={styles.watermarkContainer}>
        <span className={styles.watermarkLine}>CRAFT</span>
        <span className={styles.watermarkLine}>VISION</span>
        <span className={styles.watermarkLine}>IMPACT</span>
        <span className={styles.watermarkLine}>DISCIPLINE</span>
      </div>

      <div className="container">
        {/* Asymmetrical Editorial Composition Layout */}
        <div className={styles.editorialGrid}>

          {/* Top Left Zone: Card 01 */}
          <div className={styles.cardZone01}>
            <EditorialCard id="about-page-card-01" data={card1Data} />
          </div>

          {/* Top Right Zone: Complementary Editorial Typography */}
          <div className={styles.typographyZone}>
            <span className={styles.sectionLabel}>01 // STUDIO OVERVIEW</span>
            <h2 className={styles.editorialHeading}>
              Designing Digital <br />
              <span className="serif-italic text-cyan">Experiences</span> With <br />
              Purpose & Precision.
            </h2>
            <p className={styles.editorialParagraph}>
              At Lame Dev, we believe in the power of digital craft, restraint, and architectural clarity. Our mission is simple: to support ambitious brands and create lasting change through high-impact interactive systems—one detail at a time.
            </p>
          </div>

          {/* Lower Left Zone: Card 02 */}
          <div className={styles.cardZone02}>
            <EditorialCard id="about-page-card-02" data={card2Data} />
          </div>

          {/* Center / Lower Right Zone: Card 03 */}
          <div className={styles.cardZone03}>
            <EditorialCard id="about-page-card-03" data={card3Data} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutCardExperience;
