import { useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { galleryConfig, twcGalleryConfig, twcTheme } from '../config';
import { useBrand } from '../context/BrandContext';

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { isTWC } = useBrand();

  const config = isTWC ? twcGalleryConfig : galleryConfig;
  const accentColor = isTWC ? twcTheme.accent : '#e8954e';
  const textColor = isTWC ? twcTheme.foreground : '#2f2218';

  return (
    <section id="gallery" ref={sectionRef} className={isTWC ? 'twc-section' : undefined} style={{ padding: isTWC ? 'clamp(96px, 12vw, 150px) 24px' : '120px 24px', position: 'relative', backgroundColor: isTWC ? '#E9E8E9' : '#fdf6e3', transition: 'background-color 0.8s ease', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        {isTWC ? (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 80px)' }}>
            <span className="twc-eyebrow" style={{ fontSize: '12px', display: 'block', marginBottom: '20px' }}>{config.sectionLabel}</span>
            <h2 className="font-elegant twc-display" style={{ fontSize: 'clamp(34px, 5.4vw, 64px)' }}>{config.title}</h2>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <AnimatePresence mode="wait">
              <motion.span key={config.sectionLabel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: accentColor, display: 'block', marginBottom: '16px', transition: 'color 0.6s ease' }}>{config.sectionLabel}</motion.span>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.h2 key={config.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }} className="font-serif" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: textColor, margin: 0, transition: 'color 0.6s ease' }}>{config.title}</motion.h2>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Compact Collection Grid for TWC - fits all 17 images neatly on page */}
        {isTWC ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '14px',
            }}
          >
            {config.images.map((image, i) => (
              <motion.div
                key={`twc-compact-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (i % 10) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '210px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#1a1a1a',
                  borderRadius: '2px',
                }}
                className="elegant-card group"
              >
                <img
                  src={image}
                  alt={`TWC creation ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '12px 14px',
                  }}
                  className="group-hover:!opacity-100"
                >
                  <span style={{ color: '#ffffff', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'EB Garamond', Georgia, serif" }}>
                    #{String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Original grid for Hangri */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {config.images.map((image, i) => (
              <motion.div key={`hd-${i}`} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }} className="organic-card" style={{ overflow: 'hidden', position: 'relative', height: '240px' }}>
                <img src={image} alt={`Hangri Dessert creation ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {isTWC && <span className="twc-watermark">@TiramisuWeddingCake&nbsp;&nbsp;|&nbsp;&nbsp;@HangriDessert</span>}
    </section>
  );
}
