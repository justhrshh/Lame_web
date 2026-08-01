import React, { useState, useEffect } from 'react';
import { TESTIMONIALS_DATA } from '../../data/testimonialsData';
import styles from './Testimonials.module.css';

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section id="testimonials" className={styles.testimonialsSection}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className="caption-label">05 // CLIENT ENDORSEMENTS</span>
          <h2 className="heading-section">
            What Founders & Visionaries <br />
            <span className="serif-italic text-gradient">Say About Partnering With Us.</span>
          </h2>
        </div>

        {/* Testimonials Carousel Container */}
        <div
          className={styles.carouselWrapper}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={styles.cardStage}>
            {TESTIMONIALS_DATA.map((item, idx) => {
              const isActive = idx === activeIndex;
              const isPrev = idx === (activeIndex - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length;
              const isNext = idx === (activeIndex + 1) % TESTIMONIALS_DATA.length;

              let cardStyleClass = styles.cardHidden;
              if (isActive) cardStyleClass = styles.cardActive;
              else if (isPrev) cardStyleClass = styles.cardPrev;
              else if (isNext) cardStyleClass = styles.cardNext;

              return (
                <div
                  key={item.id}
                  className={`${styles.testimonialCard} ${cardStyleClass}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  {/* Rating Stars */}
                  <div className={styles.ratingRow}>
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <span key={i} className={styles.star}>★</span>
                    ))}
                  </div>

                  {/* Review Quote */}
                  <p className={styles.reviewText}>“{item.review}”</p>

                  {/* Project Tag */}
                  <span className={styles.projectTag}>PROJECT: {item.project}</span>

                  {/* Author Meta */}
                  <div className={styles.authorMeta}>
                    <img src={item.avatar} alt={item.name} className={styles.avatarImg} />
                    <div className={styles.authorDetails}>
                      <h4 className={styles.authorName}>{item.name}</h4>
                      <p className={styles.authorRole}>{item.role}, <span className={styles.companyName}>{item.company}</span></p>
                    </div>
                  </div>

                  {/* Glass Reflection */}
                  <div className={styles.cardReflection} />
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className={styles.controlsRow}>
            <button
              className={styles.navArrow}
              onClick={() => setActiveIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length)}
              aria-label="Previous review"
            >
              ←
            </button>

            <div className={styles.dotsGroup}>
              {TESTIMONIALS_DATA.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dotBtn} ${i === activeIndex ? styles.dotBtnActive : ''}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>

            <button
              className={styles.navArrow}
              onClick={() => setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length)}
              aria-label="Next review"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
