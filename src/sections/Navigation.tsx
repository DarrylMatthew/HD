import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLenis } from '../hooks/useLenis';
import { navigationConfig, twcNavigationConfig, twcTheme } from '../config';
import { useBrand } from '../context/BrandContext';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isLightSection, setIsLightSection] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const { isTWC, toggleBrand } = useBrand();

  const config = isTWC ? twcNavigationConfig : navigationConfig;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      const navHeight = navRef.current?.offsetHeight ?? 0;
      const probeY = navHeight > 0 ? navHeight * 0.6 : 60;
      const lightSectionIds = ['menu', 'order', 'gallery', 'footer'];
      const isInLightSection = lightSectionIds.some((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom >= probeY;
      });

      setIsLightSection(isInLightSection);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const baseTextColor = isTWC ? twcTheme.foreground : '#2f2218';
  const hoverTextColor = isTWC ? twcTheme.accent : '#e8954e';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(targetId);
    } else {
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBrandToggle = () => {
    toggleBrand();
    // Scroll to top on brand switch
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: false, duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        padding: scrolled ? '12px 0' : '20px 0',
        transition: 'padding 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className={isTWC ? 'elegant-glass' : 'warm-glass'}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '14px 36px',
          borderRadius: isTWC ? '0' : '2rem 0.5rem 2rem 0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'border-radius 0.8s ease, background 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease',
        }}
      >
        {/* Brand Name */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className={isTWC ? 'font-elegant' : 'font-script'}
          style={{
            fontSize: isTWC ? '22px' : '28px',
            fontWeight: isTWC ? 500 : 600,
            color: isTWC ? twcTheme.foreground : '#4e3b31',
            textDecoration: 'none',
            transition: 'color 0.6s ease, font-size 0.6s ease',
            letterSpacing: isTWC ? '3px' : '0px',
            textTransform: isTWC ? 'uppercase' : 'none',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={config.brandName}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {config.brandName}
            </motion.span>
          </AnimatePresence>
        </a>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {/* Nav Links */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isTWC ? 'twc-links' : 'hangri-links'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', gap: '32px', alignItems: 'center' }}
            >
              {config.links.map((item) => (
                <a
                  key={`${item.label}-${item.target}`}
                  href={item.target}
                  onClick={(e) => handleNavClick(e, item.target)}
                  className="nav-link"
                  style={{
                    fontFamily: isTWC ? "'Playfair Display', Georgia, serif" : 'Inter, system-ui, sans-serif',
                    fontSize: isTWC ? '12px' : '13px',
                    fontWeight: 500,
                    color: baseTextColor,
                    letterSpacing: isTWC ? '2px' : '0.5px',
                    textDecoration: 'none',
                    textTransform: isTWC ? 'uppercase' : 'none',
                    transition: 'color 0.4s ease, opacity 0.4s ease, letter-spacing 0.6s ease',
                    opacity: 0.85,
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color = hoverTextColor;
                    (e.target as HTMLAnchorElement).style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color = baseTextColor;
                    (e.target as HTMLAnchorElement).style.opacity = '0.85';
                  }}
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div
            style={{
              width: '1px',
              height: '20px',
              background: isTWC ? 'rgba(0,0,0,0.15)' : 'rgba(78,59,49,0.25)',
              transition: 'background 0.6s ease',
            }}
          />

          {/* Brand Toggle Button */}
          <motion.button
            onClick={handleBrandToggle}
            className="brand-toggle-btn"
            whileTap={{ scale: 0.96 }}
            style={{
              fontFamily: isTWC ? 'Inter, system-ui, sans-serif' : "'Playfair Display', Georgia, serif",
              fontSize: '11px',
              fontWeight: 600,
              color: isTWC ? twcTheme.accent : '#e8954e',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'color 0.4s ease',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isTWC ? 'to-desserts' : 'to-wedding'}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'block' }}
              >
                {isTWC ? 'Desserts' : 'Wedding Cake'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
