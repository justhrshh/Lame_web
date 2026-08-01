import React, { useState } from 'react';
import { PORTFOLIO_CATEGORIES, PORTFOLIO_PROJECTS } from '../../data/portfolioData';
import styles from './Portfolio.module.css';

export const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = activeCategory === 'All'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className={styles.portfolioSection}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div>
            <span className="caption-label">03 // SELECTED CLIENT WORKS</span>
            <h2 className="heading-section">
              Floating Artworks Of <br />
              <span className="serif-italic text-gradient">Digital Engineering.</span>
            </h2>
          </div>

          {/* Filter Categories */}
          <div className={styles.filterTabs}>
            {PORTFOLIO_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Showcase Grid */}
        <div className={styles.portfolioGrid}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={styles.projectCard}
              onClick={() => setSelectedProject(project)}
            >
              {/* Image Frame */}
              <div className={styles.imageContainer}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.projectImg}
                  loading="lazy"
                />
                <div className={styles.imageOverlay} />
                <span className={styles.statBadge}>{project.stat}</span>
                <span className={styles.budgetBadge}>{project.budget}</span>
              </div>

              {/* Card Meta Content */}
              <div className={styles.cardMeta}>
                <div className={styles.metaTop}>
                  <span className={styles.categoryTag}>{project.category}</span>
                  <span className={styles.yearTag}>{project.year}</span>
                </div>

                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDesc}>{project.description}</p>

                {/* Tech Tags */}
                <div className={styles.techTags}>
                  {project.technologies.map((tech) => (
                    <span key={tech} className={styles.techTag}>{tech}</span>
                  ))}
                </div>

                {/* Action Trigger Link */}
                <div className={styles.viewLinkRow}>
                  <span className={styles.viewLinkText}>VIEW PROJECT SPECIFICATIONS</span>
                  <span className={styles.viewArrow}>→</span>
                </div>
              </div>

              {/* Hover Glow */}
              <div className={styles.cardGlow} />
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Project Detail Modal */}
      {selectedProject && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedProject(null)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalCloseBtn}
              onClick={() => setSelectedProject(null)}
            >
              &times;
            </button>

            <div className={styles.modalGrid}>
              <div className={styles.modalImageCol}>
                <img src={selectedProject.image} alt={selectedProject.title} className={styles.modalImg} />
              </div>

              <div className={styles.modalInfoCol}>
                <span className={styles.modalCategory}>{selectedProject.category} // {selectedProject.year}</span>
                <h3 className={styles.modalTitle}>{selectedProject.title}</h3>
                <p className={styles.modalDesc}>{selectedProject.description}</p>

                <div className={styles.modalDetailsRow}>
                  <div>
                    <span className={styles.detailLabel}>CLIENT</span>
                    <span className={styles.detailVal}>{selectedProject.client}</span>
                  </div>
                  <div>
                    <span className={styles.detailLabel}>BUDGET</span>
                    <span className={styles.detailVal}>{selectedProject.budget}</span>
                  </div>
                  <div>
                    <span className={styles.detailLabel}>PERFORMANCE</span>
                    <span className={styles.detailVal}>{selectedProject.stat}</span>
                  </div>
                </div>

                <div className={styles.modalTechGroup}>
                  <span className={styles.detailLabel}>TECHNOLOGY STACK</span>
                  <div className={styles.techTags}>
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech} className={styles.techTag}>{tech}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <a href="#contact" className={styles.modalCtaPrimary} onClick={() => setSelectedProject(null)}>
                    REQUEST SIMILAR PROJECT
                  </a>
                  <button className={styles.modalCtaSecondary} onClick={() => setSelectedProject(null)}>
                    CLOSE PREVIEW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
