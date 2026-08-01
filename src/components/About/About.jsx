import React from 'react';
import styles from './About.module.css';

export const About = () => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className="caption-label">01 // THE STUDIO STORY</span>
          <h2 className="heading-section">
            We architect websites that don't just exist— <br />
            <span className="serif-italic text-gradient">they command attention.</span>
          </h2>
        </div>

        {/* Editorial Grid Layout */}
        <div className={styles.editorialGrid}>
          {/* Main Story Content */}
          <div className={styles.storyColumn}>
            <p className={styles.paragraphLead}>
              Lame Dev was founded on a simple conviction: the internet has grown derivative. Most websites feel like rigid templates engineered by algorithms rather than digital art handcrafted by master artisans.
            </p>
            <p className={styles.paragraphBody}>
              We operate as a high-tier boutique web studio and independent development agency. Combining deep technical mastery of 60 FPS CSS 3D parallax, WebGL, React, and motion physics with luxury editorial typography, we craft digital experiences that leave lasting emotional impressions.
            </p>

            {/* Core Values / Capability Badges */}
            <div className={styles.capabilitiesGrid}>
              <div className={styles.capabilityCard}>
                <span className={styles.capNumber}>01</span>
                <h4>Creative Engineering</h4>
                <p>3D floating galleries, rAF motion loops, and bespoke interaction physics.</p>
              </div>
              <div className={styles.capabilityCard}>
                <span className={styles.capNumber}>02</span>
                <h4>Editorial UI/UX</h4>
                <p>Luxury typography, generous whitespace, and human-centered design systems.</p>
              </div>
              <div className={styles.capabilityCard}>
                <span className={styles.capNumber}>03</span>
                <h4>Uncompromising Speed</h4>
                <p>Sub-second page loads, 98+ Lighthouse scores, and zero animation jank.</p>
              </div>
              <div className={styles.capabilityCard}>
                <span className={styles.capNumber}>04</span>
                <h4>Global Client Focus</h4>
                <p>Direct pair-collaboration with visionary founders and boutique brands worldwide.</p>
              </div>
            </div>
          </div>

          {/* Visual Editorial Image Column */}
          <div className={styles.imageColumn}>
            <div className={styles.imageFrame}>
              <img 
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop" 
                alt="Lame Dev Design Studio Workstation" 
                className={styles.editorialImg}
              />
              <div className={styles.imageOverlay} />
              
              {/* Floating Quote Badge */}
              <div className={styles.floatingQuoteBadge}>
                <span className={styles.quoteIcon}>“</span>
                <p className={styles.quoteText}>
                  Digital craftsmanship is the bridge between pure functionality and artistic awe.
                </p>
                <span className={styles.quoteAuthor}>— LAME DEV MANIFESTO</span>
              </div>
            </div>

            {/* Stats Summary Bar */}
            <div className={styles.statsQuickBar}>
              <div className={styles.quickStatItem}>
                <span className={styles.quickStatValue}>100%</span>
                <span className={styles.quickStatLabel}>HANDCRAFTED CODE</span>
              </div>
              <div className={styles.quickStatDivider} />
              <div className={styles.quickStatItem}>
                <span className={styles.quickStatValue}>60 FPS</span>
                <span className={styles.quickStatLabel}>SMOOTH PARALLAX</span>
              </div>
              <div className={styles.quickStatDivider} />
              <div className={styles.quickStatItem}>
                <span className={styles.quickStatValue}>14+</span>
                <span className={styles.quickStatLabel}>COUNTRIES SERVED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
