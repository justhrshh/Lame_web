import React, { useEffect } from 'react';
import Lenis from 'lenis';

// Global & Component Styles
import './styles/globals.css';

// Components
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app-root">
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
