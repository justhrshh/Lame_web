import React, { useState } from 'react';
import { NAV_LINKS, SOCIAL_LINKS } from '../../data/navigationData';
import styles from './Footer.module.css';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer className={styles.footerSection}>
      {/* Animated SVG Wave / Line Divider */}
      <div className={styles.dividerContainer}>
        <svg className={styles.dividerSvg} viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path
            d="M 0 20 Q 300 0 600 20 T 1200 20"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="container">
        {/* Top Footer Banner */}
        <div className={styles.footerTop}>
          <div className={styles.brandGroup}>
            <div className={styles.footerLogo}>
              <span className={styles.logoSymbol}>L</span>
              <span className={styles.logoText}>LAME<span className={styles.logoAccent}>.DEV</span></span>
            </div>
            <p className={styles.brandDesc}>
              Designing digital experiences that move people. Handcrafted 3D web applications, luxury UI/UX, and 60 FPS motion engineering.
            </p>
          </div>

          {/* Newsletter Input Box */}
          <div className={styles.newsletterBox}>
            <span className={styles.newsletterTitle}>JOIN THE STUDIO JOURNAL</span>
            <p className={styles.newsletterDesc}>Quarterly insights on creative coding, 3D web design, and digital art direction.</p>
            
            {subscribed ? (
              <div className={styles.subSuccess}>✓ Subscribed to Journal!</div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.subForm}>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  required
                  className={styles.subInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className={styles.subBtn}>SUBSCRIBE</button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Footer Navigation Links */}
        <div className={styles.footerMid}>
          <div className={styles.navCol}>
            <span className={styles.colTitle}>NAVIGATION</span>
            <div className={styles.linkList}>
              {NAV_LINKS.map((link) => (
                <a key={link.name} href={link.href} className={styles.footerLink}>
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.socialCol}>
            <span className={styles.colTitle}>CONNECT & NETWORK</span>
            <div className={styles.socialGrid}>
              {SOCIAL_LINKS.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialCard}
                >
                  <span className={styles.socialName}>{soc.name}</span>
                  <span className={styles.socialHandle}>{soc.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Live Clock */}
        <div className={styles.footerBottom}>
          <p className={styles.copyrightText}>
            © {new Date().getFullYear()} LAME DEV STUDIO. ALL RIGHTS RESERVED. HANDCRAFTED WITH REACT & CSS 3D.
          </p>

          <div className={styles.systemStatus}>
            <span className={styles.statusDot} />
            <span>ALL SYSTEMS OPERATIONAL // 60 FPS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
