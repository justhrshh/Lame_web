/**
 * Configuration data for About Page Cards (Phase 2)
 *
 * Each card is independently configurable:
 * - id: Unique element identifier for future dynamic replacement
 * - type: Media type ('image' | 'video' | 'gif')
 * - dimensions: width, height, aspectRatio, borderRadius, scale
 * - layoutPosition: desktop coordinates & placement metadata
 */
export const aboutPageCards = [
  {
    id: "about-page-card-01",
    title: "Aura Fine Dining",
    subtitle: "01 // ARCHITECTURAL INTERIORS",
    description: "Michelin star gastronomy & reserve table portal with real-time room rendering.",
    type: "image",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
    video: "",
    gif: "",
    badgeLabel: "01 // ABOUT US",
    dimensions: {
      width: "280px",
      height: "220px",
      aspectRatio: "4 / 3",
      borderRadius: "24px",
      scale: 1.0,
    },
    layoutPosition: {
      gridArea: "top-left",
      rotation: "-6deg",
      zIndex: 3,
    }
  },
  {
    id: "about-page-card-02",
    title: "Vanguard Architects",
    subtitle: "02 // SPATIAL STRUCTURES",
    description: "Monolithic spatial structures & editorial portfolio showcasing urban design.",
    type: "image",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    video: "",
    gif: "",
    badgeLabel: "02 // CREATIVE SHOWCASE",
    dimensions: {
      width: "340px",
      height: "280px",
      aspectRatio: "1.2 / 1",
      borderRadius: "28px",
      scale: 1.08,
    },
    layoutPosition: {
      gridArea: "center-right",
      rotation: "4deg",
      zIndex: 4,
    }
  },
  {
    id: "about-page-card-03",
    title: "MediPulse Health",
    subtitle: "03 // HUMAN CONNECTIVITY",
    description: "Real-time biometric diagnostics & EHR analytics for digital healthcare.",
    type: "image",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
    video: "",
    gif: "",
    badgeLabel: "03 // FEATURED WORK",
    dimensions: {
      width: "360px",
      height: "440px",
      aspectRatio: "4 / 5",
      borderRadius: "32px",
      scale: 0.95,
    },
    layoutPosition: {
      gridArea: "bottom-left",
      rotation: "-2deg",
      zIndex: 2,
    }
  }
];

export default aboutPageCards;
