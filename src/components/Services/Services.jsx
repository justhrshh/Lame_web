import React, { useState } from 'react';
import { SERVICES_DATA } from '../../data/servicesData';
import styles from './Services.module.css';

export const Services = () => {
  const [activeHover, setActiveHover] = useState(null);

  return (
    <section id="services" className={styles.servicesSection}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerTitleGroup}>
            <span className="caption-label">02 // CAPABILITIES & SERVICES</span>
            <h2 className="heading-section">
              Digital Services Engineered For <br />
              <span className="serif-italic text-gradient">Maximum Visual Impact.</span>
            </h2>
          </div>
          <p className="subheading">
            Whether launching a flagship brand, scaling an enterprise SaaS dashboard, or polishing animation frame rates to 60 FPS, we deliver end-to-end excellence.
          </p>
        </div>

        {/* Services Glass Cards Grid */}
        <div className={styles.servicesGrid}>
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className={`${styles.serviceCard} ${activeHover === service.id ? styles.serviceCardActive : ''}`}
              onMouseEnter={() => setActiveHover(service.id)}
              onMouseLeave={() => setActiveHover(null)}
            >
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <span className={styles.serviceNumber}>{service.number}</span>
                <span className={styles.priceBadge}>{service.estPrice}</span>
              </div>

              {/* Title & Subtitle */}
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceSubtitle}>{service.subtitle}</p>

              {/* Description */}
              <p className={styles.serviceDescription}>{service.description}</p>

              {/* Features Checklist */}
              <ul className={styles.featureList}>
                {service.features.map((feat, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Tags & Action CTA */}
              <div className={styles.cardFooter}>
                <div className={styles.tagGroup}>
                  {service.tags.map((t) => (
                    <span key={t} className={styles.serviceTag}>{t}</span>
                  ))}
                </div>

                <a href="#contact" className={styles.requestBtn}>
                  <span>REQUEST SERVICE</span>
                  <span className={styles.arrowIcon}>→</span>
                </a>
              </div>

              {/* Card Ambient Hover Glow */}
              <div className={styles.cardGlow} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
