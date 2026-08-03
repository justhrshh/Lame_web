import React from 'react';
import styles from './EditorialCard.module.css';

/**
 * Generic, Reusable Editorial Card Component
 *
 * Section-agnostic card that supports:
 * - Unique ID for dynamic targeted updates (e.g. id="about-page-card-01")
 * - Media types: 'image' | 'video' | 'gif'
 * - Independent configurable dimensions (width, height, aspectRatio, borderRadius, scale)
 * - Reusable across About, Services, Portfolio, Motion Graphics, etc.
 */
export const EditorialCard = ({
  id,
  data = {},
  className = '',
  style = {},
  children,
}) => {
  const {
    title = '',
    subtitle = '',
    description = '',
    type = 'image',
    image = '',
    video = '',
    gif = '',
    badgeLabel = '',
    dimensions = {},
  } = data;

  const {
    width = '100%',
    height = 'auto',
    aspectRatio = '16 / 9',
    borderRadius = '24px',
    scale = 1.0,
  } = dimensions;

  const cardStyle = {
    width,
    height,
    aspectRatio,
    borderRadius,
    transform: `scale(${scale})`,
    ...style,
  };

  return (
    <div
      id={id}
      className={`${styles.editorialCard} ${className}`}
      style={cardStyle}
      data-card-type={type}
    >
      {/* Dynamic Specular Sheen & Highlight Beam */}
      <div className={styles.specularLight} />
      <div className={styles.sheenBeam} />

      {/* Browser Window Header */}
      <div className={styles.cardHeader}>
        <div className={styles.trafficLights}>
          <span className={styles.dotRed} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
        </div>
        {badgeLabel && <span className={styles.badgeLabel}>{badgeLabel}</span>}
      </div>

      {/* Media Canvas Container */}
      <div className={styles.mediaContainer}>
        {type === 'video' && video ? (
          <video
            src={video}
            className={styles.mediaElement}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : type === 'gif' && gif ? (
          <img src={gif} alt={title} className={styles.mediaElement} />
        ) : (
          <img
            src={image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'}
            alt={title}
            className={styles.mediaElement}
            loading="lazy"
          />
        )}

        {/* Soft Dark Vignette Gradient */}
        <div className={styles.mediaVignette} />

        {/* Card Overlay Content */}
        <div className={styles.cardContent}>
          {subtitle && <span className={styles.subtitleTag}>{subtitle}</span>}
          {title && <h3 className={styles.cardTitle}>{title}</h3>}
          {description && <p className={styles.cardDescription}>{description}</p>}
        </div>
      </div>

      {children}
    </div>
  );
};

export default EditorialCard;
