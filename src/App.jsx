import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Global & Component Styles
import './styles/globals.css';

// Components
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { CinematicAbout } from './components/CinematicAbout/CinematicAbout';
import { About } from './components/About/About';
import { Services } from './components/Services/Services';
import { Portfolio } from './components/Portfolio/Portfolio';
import { Stats } from './components/Stats/Stats';
import { Testimonials } from './components/Testimonials/Testimonials';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';

// Ambient Micro-Interactions
import { Cursor } from './components/Cursor/Cursor';
import { ParticleCanvas } from './components/FloatingElements/ParticleCanvas';

// Cinematic Scene Environment
import { SceneEnvironment } from './components/SceneEnvironment/SceneEnvironment';
import { ScrollProgress } from './components/ScrollProgress/ScrollProgress';

export function App() {
  useEffect(() => {
    // Initialize Lenis Smooth Scrolling Engine
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8
    });

    // Connect Lenis → GSAP ScrollTrigger update
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="app-root">
      {/* Persistent Cinematic Scene Environment — fixed, z-index 0 */}
      <SceneEnvironment />

      {/* Top Reading Scroll Indicator */}
      <ScrollProgress />

      {/* Custom Glowing Cursor Follower */}
      <Cursor />

      {/* Background Soft White Particle Canvas */}
      <ParticleCanvas />

      {/* Floating Glassmorphism Navbar */}
      <Navbar />

      {/* Main Studio Page Flow */}
      <main>
        <Hero />
        <CinematicAbout />
        <About />
        <Services />
        <Portfolio />
        <Stats />
        <Testimonials />
        <Contact />
      </main>

      {/* Studio Footer */}
      <Footer />
    </div>
  );
}

export default App;

