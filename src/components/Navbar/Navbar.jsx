import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../../data/navigationData';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className={`${styles.navbarWrapper} ${scrolled ? styles.navbarScrolled : ''}`}>
      <nav className={styles.navbarContainer}>
        {/* Brand Logo */}
        <a href="#home" className={styles.logo}>
          <span className={styles.logoSymbol}>L</span>
          <span className={styles.logoText}>LAME<span className={styles.logoAccent}>.DEV</span></span>
        </a>

        {/* Desktop Menu Links */}
        <div className={styles.navMenu}>
          {NAV_LINKS.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={styles.navLink}
            >
              <span className={styles.linkText} data-text={link.name}>
                {link.name}
              </span>
              <span className={styles.linkUnderline} />
            </a>
          ))}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerActive : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.mobileDrawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <span className={styles.logoText}>LAME<span className={styles.logoAccent}>.DEV</span></span>
          <button className={styles.closeButton} onClick={toggleMobileMenu}>&times;</button>
        </div>
        <div className={styles.mobileNavMenu}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};
