import React, { useEffect, useState, useRef } from 'react';
import { STATS_DATA, GROWTH_CHART_DATA } from '../../data/statsData';
import styles from './Stats.module.css';

export const Stats = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" className={styles.statsSection} ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className={styles.sectionHeader}>
          <span className="caption-label">04 // AGENCY PERFORMANCE METRICS</span>
          <h2 className="heading-section">
            Quantifiable Proof Of <br />
            <span className="serif-italic text-gradient">Uncompromising Quality.</span>
          </h2>
        </div>

        {/* Counter Metric Cards */}
        <div className={styles.statsGrid}>
          {STATS_DATA.map((stat) => (
            <div key={stat.id} className={styles.statCard}>
              {/* Circular SVG Ring */}
              <div className={styles.ringContainer}>
                <svg className={styles.ringSvg} viewBox="0 0 100 100">
                  <circle className={styles.ringBg} cx="50" cy="50" r="42" />
                  <circle
                    className={styles.ringProgress}
                    cx="50"
                    cy="50"
                    r="42"
                    style={{
                      strokeDasharray: 264,
                      strokeDashoffset: inView ? 264 - (264 * stat.percentage) / 100 : 264
                    }}
                  />
                </svg>
                <div className={styles.ringCenterText}>
                  <span className={styles.counterValue}>
                    {inView ? stat.value : 0}
                    <span className={styles.counterSuffix}>{stat.suffix}</span>
                  </span>
                </div>
              </div>

              <h4 className={styles.statLabel}>{stat.label}</h4>
              <p className={styles.statDesc}>{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Interactive Growth & Speed Curve Chart */}
        <div className={styles.chartPanel}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Delivery Velocity & Page Load Optimization</h3>
              <p className={styles.chartSubtitle}>Consistently scaling project count while lowering average load times below 350ms.</p>
            </div>
            <div className={styles.chartLegend}>
              <span className={styles.legendDotVal}>— Projects Completed</span>
              <span className={styles.legendDotSpeed}>-- Page Load (seconds)</span>
            </div>
          </div>

          <div className={styles.svgChartWrapper}>
            <svg className={styles.svgChart} viewBox="0 0 800 240" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="800" y2="40" className={styles.gridLine} />
              <line x1="0" y1="100" x2="800" y2="100" className={styles.gridLine} />
              <line x1="0" y1="160" x2="800" y2="160" className={styles.gridLine} />
              <line x1="0" y1="220" x2="800" y2="220" className={styles.gridLine} />

              {/* Smooth Spline Curve for Growth */}
              <path
                d="M 50 200 Q 200 150 350 100 T 650 40 T 750 20"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
                className={`${styles.chartLine} ${inView ? styles.chartLineAnimated : ''}`}
              />

              {/* Chart Points */}
              {GROWTH_CHART_DATA.map((item, idx) => {
                const x = 50 + idx * 140;
                const y = 220 - (item.value / 160) * 180;
                return (
                  <g key={item.month} className={styles.chartPointGroup}>
                    <circle cx={x} cy={y} r="5" className={styles.chartPoint} />
                    <text x={x} y="235" className={styles.chartXText}>{item.month}</text>
                    <text x={x} y={y - 12} className={styles.chartValText}>{item.value}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
