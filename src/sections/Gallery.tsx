import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { galleryConfig, twcGalleryConfig, twcTheme } from '../config';
import { useBrand } from '../context/BrandContext';
import { X, ZoomIn } from 'lucide-react';

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { isTWC } = useBrand();

  const config = isTWC ? twcGalleryConfig : galleryConfig;
  const accentColor = isTWC ? twcTheme.accent : '#e8954e';
  const textColor = isTWC ? twcTheme.foreground : '#2f2218';

  const gridItems = [
    { index: 0, span: 'col-span-2 row-span-2' },
    { index: 1, span: 'col-span-1 row-span-1' },
    { index: 2, span: 'col-span-1 row-span-1' },
    { index: 3, span: 'col-span-1 row-span-2' },
    { index: 4, span: 'col-span-1 row-span-1' },
    { index: 5, span: 'col-span-1 row-span-1' },
    { index: 6, span: 'col-span-1 row-span-1' },
    { index: 7, span: 'col-span-2 row-span-1' },
  ];

  return (
    <section id="gallery" ref={sectionRef} style={{ padding: '120px 24px', position: 'relative', backgroundColor: isTWC ? twcTheme.background : '#fdf6e3', transition: 'background-color 0.8s ease' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', marginBottom: '64px' }}>
          <AnimatePresence mode="wait">
            <motion.span key={config.sectionLabel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', fontWeight: 600, letterSpacing: isTWC ? '4px' : '3px', textTransform: 'uppercase', color: accentColor, display: 'block', marginBottom: '16px', transition: 'color 0.6s ease' }}>{config.sectionLabel}</motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.h2 key={config.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }} className={isTWC ? 'font-elegant' : 'font-serif'} style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: isTWC ? 400 : 300, color: textColor, margin: 0, transition: 'color 0.6s ease' }}>{config.title}</motion.h2>
          </AnimatePresence>
        </motion.div>

        {/* Photo Grid - Desktop */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '200px', gap: isTWC ? '4px' : '16px', transition: 'gap 0.6s ease' }}>
          {gridItems.map((item, i) => {
            const image = config.images[item.index];
            if (!image) return null;
            return (
              <motion.div key={`${isTWC ? 'twc' : 'hd'}-${item.index}`} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }} className={`${item.span} ${isTWC ? 'elegant-card' : 'organic-card'}`} style={{ overflow: 'hidden', position: 'relative', cursor: 'pointer', transition: 'border-radius 0.6s ease' }} onClick={() => setLightboxImage(image)}>
                <motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} src={image} alt={`${isTWC ? 'TWC' : 'Hangri Dessert'} creation ${item.index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, background: isTWC ? 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' : 'linear-gradient(to top, rgba(47,34,24,0.5) 0%, transparent 60%)', opacity: 0, transition: 'opacity 0.4s ease', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '20px' }}>
                  <ZoomIn size={24} color="#fff" style={{ opacity: 0.9 }} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Photo Grid - Mobile */}
        <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {config.images.map((image, i) => (
            <motion.div key={`mobile-${isTWC ? 'twc' : 'hd'}-${i}`} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }} className={isTWC ? 'elegant-card' : 'organic-card'} style={{ overflow: 'hidden', position: 'relative', cursor: 'pointer', height: '240px' }} onClick={() => setLightboxImage(image)}>
              <img src={image} alt={`${isTWC ? 'TWC' : 'Hangri Dessert'} creation ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ position: 'fixed', inset: 0, zIndex: 200, background: isTWC ? twcTheme.overlay : 'rgba(47, 34, 24, 0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setLightboxImage(null)}>
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setLightboxImage(null)} style={{ position: 'absolute', top: '24px', right: '24px', width: '44px', height: '44px', borderRadius: isTWC ? '0' : '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}><X size={22} color="#fff" /></motion.button>
            <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }} src={lightboxImage} alt="Gallery preview" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: isTWC ? '0' : '12px', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }} onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
