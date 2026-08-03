import React from 'react';
import styles from './About.module.css';

export const About = () => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className="caption-label">01 // THE STUDIO</span>
          <h2 className="heading-section">
            <span className={styles.firstLine}>We don't just build websites—</span> <br />
            <span className="serif-italic text-gradient">
              we build <span className="text-cyan">brands</span> people remember.
            </span>
          </h2>
        </div>

        {/* Editorial Grid Layout */}
        <div className={styles.editorialGrid}>
          {/* Main Story Content */}
          <div className={styles.storyColumn}>
            <p className={styles.paragraphLead}>
              Lame.Dev is a multidisciplinary creative agency where design, technology, motion, and storytelling converge.
            </p>
            <p className={styles.paragraphBody}>
              From premium websites and intuitive digital products to brand identities, cinematic motion graphics, VFX, social media creatives, and visual campaigns, we craft experiences that elevate how businesses are seen, remembered, and trusted.
            </p>
            <p className={styles.paragraphBody}>
              Every project begins with strategy—not templates. We study your brand, understand your audience, and design every visual, interaction, animation, and experience with intention. Whether it's a startup launching its first identity or an established company redefining its digital presence, our goal remains the same:
            </p>

            {/* Capability Cards */}
            <div className={styles.capabilitiesGrid}>
              <div className={styles.capabilityCard}>
                <span className={styles.capNumber}>01</span>
                <h4>Digital Experiences</h4>
                <p>Premium websites, web applications, interactive interfaces, and conversion-focused user experiences.</p>
              </div>
              <div className={styles.capabilityCard}>
                <span className={styles.capNumber}>02</span>
                <h4>Brand & Graphic Design</h4>
                <p>Visual identities, logo systems, marketing assets, print collateral, packaging, presentations, and social media creatives.</p>
              </div>
              <div className={styles.capabilityCard}>
                <span className={styles.capNumber}>03</span>
                <h4>Motion & VFX</h4>
                <p>Motion graphics, product reveals, explainer animations, cinematic edits, VFX, title sequences, and promotional videos.</p>
              </div>
              <div className={styles.capabilityCard}>
                <span className={styles.capNumber}>04</span>
                <h4>Creative Strategy</h4>
                <p>Brand positioning, visual direction, design systems, content planning, and long-term creative partnerships.</p>
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
                  Create work that people don't just use—they remember.
                </p>
                <span className={styles.quoteAuthor}>— LAME.DEV MANIFESTO</span>
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

