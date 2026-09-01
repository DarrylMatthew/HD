import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroConfig, twcHeroConfig, twcStoryConfig } from '../config';
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

  // ======== TWC: editorial split hero (mirrors the brand-deck cover) ========
  if (isTWC) {
    const ease = [0.16, 1, 0.3, 1] as const;
    return (
      <section
        id="hero"
        ref={sectionRef}
        className="twc-hero-section"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
          background: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {/* Left: typographic panel */}
        <div
          className="twc-hero-copy"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 'clamp(88px, 10vw, 140px) clamp(28px, 7vw, 110px) 64px',
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="twc-eyebrow"
            style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', marginBottom: 'clamp(28px, 4vw, 44px)', maxWidth: '320px', lineHeight: 1.7 }}
          >
            {twcHeroConfig.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="font-elegant twc-display"
            style={{ fontSize: 'clamp(82px, 17vw, 188px)', letterSpacing: '0.06em' }}
          >
            TWC
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.35, ease }}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: 'clamp(14px, 2vw, 22px)', width: '100%', maxWidth: '440px' }}
          >
            <span className="twc-rule" style={{ flex: 1 }} />
            <span
              className="font-elegant"
              style={{ fontSize: 'clamp(15px, 1.9vw, 22px)', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#1a1a1a', whiteSpace: 'nowrap' }}
            >
              Tiramisu Wedding Cake
            </span>
            <span className="twc-rule" style={{ flex: 1 }} />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.55, ease }}
            onClick={handleCtaClick}
            className="btn-twc-solid"
            style={{ marginTop: 'clamp(40px, 5vw, 60px)' }}
          >
            {twcHeroConfig.ctaText}
          </motion.button>

          <motion.span
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease }}
            style={{
              marginTop: 'clamp(40px, 6vw, 72px)',
              fontFamily: "'EB Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '13px',
              letterSpacing: '1.5px',
              color: 'rgba(0,0,0,0.45)',
            }}
          >
            {twcStoryConfig.signatureLine}
          </motion.span>
        </div>

        {/* Right: full-bleed image. Rendered as a real <img> with a srcset so the
            browser can start it early and pick a phone-sized file on phones; the
            blurred LQIP sits underneath until the photo decodes. */}
        <motion.div
          className="twc-hero-image"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.4, ease }}
          style={{
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: twcHeroConfig.imageLqip ? `url("${twcHeroConfig.imageLqip}")` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <img
            src={twcHeroConfig.imagePath}
            srcSet={twcHeroConfig.imageSrcSet}
            sizes={twcHeroConfig.imageSizes}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(255,255,255,0.10) 0%, transparent 22%)' }} />
        </motion.div>

        <span className="twc-watermark">@TiramisuWeddingCake&nbsp;&nbsp;|&nbsp;&nbsp;@HangriDessert</span>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 0.6 } : {}}
          transition={{ duration: 1, delay: 1.4 }}
          style={{ position: 'absolute', bottom: '28px', left: 'clamp(28px, 7vw, 110px)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 6 }}
        >
          <span className="twc-eyebrow" style={{ fontSize: '10px', letterSpacing: '3px' }}>Scroll</span>
          <motion.span
            animate={{ scaleX: [0, 1, 0], transformOrigin: ['left', 'left', 'right'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'block', width: '48px', height: '1px', background: '#1a1a1a' }}
          />
        </motion.div>
      </section>
    );
  }

  // ======== Hangri Dessert hero (unchanged) ========
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
      {/* Background Image — Hangri. A real <img> (not a CSS background) so the
          browser can fetch it from the preload in index.html instead of waiting
          for the JS bundle, and so phones download the 640w file. The blurred
          LQIP behind it means the hero is never blank. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background: `#241811 ${heroConfig.imageLqip ? `url("${heroConfig.imageLqip}")` : ''} center / cover no-repeat`,
          transform: 'scale(1.05)',
        }}
      >
        <img
          src={heroConfig.imagePath}
          srcSet={heroConfig.imageSrcSet}
          sizes={heroConfig.imageSizes}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(30,20,12,0.65) 0%, rgba(50,35,25,0.5) 50%, rgba(30,20,12,0.7) 100%)',
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
            className="font-serif"
            style={{
              fontSize: 'clamp(40px, 7vw, 72px)',
              fontWeight: 300,
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

        {/* Subtitle — hidden entirely when the config leaves it empty */}
        <AnimatePresence mode="wait">
          {config.subtitleLine1 && (
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
          )}
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
            className="hero-cta-btn hero-cta-btn--hangri"
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
