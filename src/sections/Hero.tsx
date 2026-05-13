import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroConfig, twcHeroConfig, twcTheme } from '../config';
import { useBrand } from '../context/BrandContext';
import { getLenis } from '../hooks/useLenis';
import { Cake, Crown } from 'lucide-react';

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

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isTWC
            ? 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(26,26,26,0.4) 50%, rgba(0,0,0,0.6) 100%)'
            : 'linear-gradient(135deg, rgba(47,34,24,0.5) 0%, rgba(78,59,49,0.4) 50%, rgba(47,34,24,0.6) 100%)',
          transition: 'background 1s ease',
        }}
      />

      {/* Content Card */}
      <div
        className={isTWC ? 'elegant-glass' : 'warm-glass'}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '600px',
          width: '90%',
          padding: '56px 48px',
          borderRadius: isTWC ? '0' : '2rem 0.5rem 2rem 0.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          transition: 'border-radius 0.8s ease, background 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease',
        }}
      >
        {/* Logo Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={isLoaded ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: isTWC ? '0' : '50%',
            background: isTWC
              ? 'linear-gradient(135deg, #c9a96e 0%, #e8d5a3 100%)'
              : 'linear-gradient(135deg, #e8954e 0%, #d4a373 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px',
            boxShadow: isTWC
              ? '0 4px 16px rgba(201, 169, 110, 0.3)'
              : '0 4px 16px rgba(232, 149, 78, 0.3)',
            transition: 'border-radius 0.8s ease, background 0.8s ease, box-shadow 0.8s ease',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isTWC ? 'crown' : 'cake'}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {isTWC ? <Crown size={32} color="#fff" /> : <Cake size={32} color="#fff" />}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Eyebrow */}
        <AnimatePresence mode="wait">
          <motion.span
            key={config.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: isTWC ? "'Playfair Display', Georgia, serif" : 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: isTWC ? '4px' : '3px',
              textTransform: 'uppercase',
              color: isTWC ? twcTheme.accent : '#e8954e',
              transition: 'color 0.6s ease',
            }}
          >
            {config.eyebrow}
          </motion.span>
        </AnimatePresence>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={config.titleLine + config.titleEmphasis}
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={isTWC ? 'font-elegant' : 'font-serif'}
            style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: isTWC ? 400 : 300,
              lineHeight: 1.1,
              color: isTWC ? twcTheme.foreground : '#2f2218',
              margin: 0,
              transition: 'color 0.6s ease',
            }}
          >
            {config.titleLine}
            <br />
            <em
              className={isTWC ? 'font-elegant' : 'font-script'}
              style={{
                fontSize: isTWC ? '1em' : '1.15em',
                color: isTWC ? twcTheme.accent : '#e8954e',
                fontStyle: isTWC ? 'italic' : 'normal',
                transition: 'color 0.6s ease',
              }}
            >
              {config.titleEmphasis}
            </em>
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={config.subtitleLine1}
            initial={{ opacity: 0, y: 15 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '15px',
              lineHeight: 1.7,
              color: isTWC ? twcTheme.muted : '#5a4a3a',
              maxWidth: '380px',
              margin: '0',
              transition: 'color 0.6s ease',
            }}
          >
            {config.subtitleLine1}
            <br />
            {config.subtitleLine2}
          </motion.p>
        </AnimatePresence>

        {/* CTA Button */}
        <AnimatePresence mode="wait">
          <motion.button
            key={config.ctaText}
            initial={{ opacity: 0, y: 15 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            onClick={handleCtaClick}
            className={isTWC ? 'btn-elegant font-elegant' : 'btn-warm font-script'}
            style={{
              marginTop: '12px',
              fontSize: isTWC ? '13px' : '20px',
              padding: isTWC ? '16px 48px' : '14px 40px',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.6s ease',
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
            fontFamily: isTWC ? "'Playfair Display', Georgia, serif" : 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            letterSpacing: isTWC ? '4px' : '2px',
            textTransform: 'uppercase',
            color: '#fcfaee',
            transition: 'letter-spacing 0.6s ease',
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
            background: 'linear-gradient(to bottom, #fcfaee, transparent)',
          }}
        />
      </motion.div>
    </section>
  );
}
