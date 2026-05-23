import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroConfig, twcHeroConfig } from '../config';
import { useBrand } from '../context/BrandContext';
import { getLenis } from '../hooks/useLenis';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { isTWC } = useBrand();

  const config = isTWC ? twcHeroConfig : heroConfig;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(config.ctaTargetId);
    } else {
      const el = document.querySelector(config.ctaTargetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Image — Hangri */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroConfig.imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.05)',
          transition: 'opacity 1s ease',
          opacity: isTWC ? 0 : 1,
        }}
      />
      {/* Background Image — TWC */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${twcHeroConfig.imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.05)',
          transition: 'opacity 1s ease',
          opacity: isTWC ? 1 : 0,
        }}
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isTWC
            ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(26,26,26,0.5) 50%, rgba(0,0,0,0.65) 100%)'
            : 'linear-gradient(135deg, rgba(30,20,12,0.65) 0%, rgba(50,35,25,0.5) 50%, rgba(30,20,12,0.7) 100%)',
          transition: 'background 1s ease',
        }}
      />

      {/* Content — directly on background, no card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          padding: '0 24px',
        }}
      >
        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={config.titleLine + config.titleEmphasis}
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={isTWC ? 'font-elegant' : 'font-serif'}
            style={{
              fontSize: 'clamp(40px, 7vw, 72px)',
              fontWeight: isTWC ? 400 : 300,
              lineHeight: 1.1,
              color: '#fdf6e3',
              margin: 0,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            {config.titleLine}
            <br />
            <span
              style={{
                color: '#e8954e',
                fontStyle: 'normal',
              }}
            >
              {config.titleEmphasis}
            </span>
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={config.subtitleLine1}
            initial={{ opacity: 0, y: 15 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              fontFamily: 'Effra Trial Bold',
              fontSize: 'clamp(13px, 2vw, 16px)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'rgba(253,246,227,0.75)',
              maxWidth: '420px',
              margin: '0',
            }}
          >
            {config.subtitleLine1}
          </motion.p>
        </AnimatePresence>

        {/* CTA Button — outline style with hover fill */}
        <AnimatePresence mode="wait">
          <motion.button
            key={config.ctaText}
            initial={{ opacity: 0, y: 15 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            onClick={handleCtaClick}
            className={`hero-cta-btn ${isTWC ? '' : 'hero-cta-btn--hangri'}`}
            style={{
              marginTop: '20px',
              fontFamily: 'Effra Trial Bold',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              padding: '16px 48px',
              cursor: 'pointer',
              color: '#fdf6e3',
              background: 'transparent',
              border: '1.5px solid rgba(253,246,227,0.5)',
              borderRadius: '0',
              transition: 'all 0.4s ease',
            }}
          >
            {config.ctaText}
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 0.6 } : {}}
        transition={{ duration: 1, delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontFamily: 'Effra Trial Bold',
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(253,246,227,0.6)',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '24px',
            background: 'linear-gradient(to bottom, rgba(253,246,227,0.5), transparent)',
          }}
        />
      </motion.div>
    </section>
  );
}
