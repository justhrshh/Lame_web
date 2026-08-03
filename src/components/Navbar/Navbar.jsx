import React, { useState } from 'react';
import { NAV_LINKS } from '../../data/navigationData';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className={styles.navbarWrapper}>
      <nav className={styles.navbarContainer}>
        {/* Left Side: Brand Logo & Name */}
        <a href="#home" className={styles.logo}>
          <span className={styles.logoSymbol}>L</span>
          <span className={styles.logoText}>LAME<span className={styles.logoAccent}>.DEV</span></span>
        </a>

        {/* Right Side: 3-Bar Hamburger Toggle */}
        <button 
          className={`${styles.hamburgerBtn} ${menuOpen ? styles.hamburgerActive : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </nav>

      {/* Navigation Links Drawer Overlay */}
      <div className={`${styles.menuDrawer} ${menuOpen ? styles.menuDrawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <a href="#home" className={styles.logo} onClick={() => setMenuOpen(false)}>
            <span className={styles.logoSymbol}>L</span>
            <span className={styles.logoText}>LAME<span className={styles.logoAccent}>.DEV</span></span>
          </a>
        </div>

        <div className={styles.drawerNavMenu}>
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              className={styles.drawerNavLink}
              onClick={() => setMenuOpen(false)}
            >
              <span className={styles.linkNumber}>0{idx + 1}</span>
              <span className={styles.drawerLinkText}>{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
