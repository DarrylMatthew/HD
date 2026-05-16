import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLenis } from '../hooks/useLenis';
import { navigationConfig, twcNavigationConfig, twcTheme } from '../config';
import { useBrand } from '../context/BrandContext';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { isTWC, toggleBrand } = useBrand();

  const config = isTWC ? twcNavigationConfig : navigationConfig;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const baseTextColor = scrolled ? (isTWC ? twcTheme.foreground : '#2f2218') : '#fdf6e3';
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
      className="main-nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        padding: scrolled ? '8px 8px' : '12px 8px',
        transition: 'padding 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        boxSizing: 'border-box',
      }}
    >
      <div
        className={scrolled ? (isTWC ? 'elegant-glass' : 'warm-glass') : ''}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '24px',
          borderRadius: isTWC ? '0' : (scrolled ? '0.5rem 0.5rem 0.5rem 0.5rem' : '0'),
          border: 'none',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          overflow: 'hidden',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
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
            color: scrolled ? (isTWC ? twcTheme.foreground : '#4e3b31') : '#fdf6e3',
            border: 'none',
            textDecoration: 'none',
            transition: 'color 0.6s ease, font-size 0.6s ease',
            letterSpacing: isTWC ? '3px' : '0px',
            textTransform: isTWC ? 'uppercase' : 'none',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 0',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={config.brandName}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {isTWC ? (
                <span>{config.brandName}</span>
              ) : (
                <img 
                  src="/images/Hangri Dessert Logo and Text.png" 
                  alt="Hangri Dessert" 
                  className="nav-logo"
                  style={{ 
                    width: 'auto', 
                    objectFit: 'contain',
                    transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </a>

        <div className="nav-links-container" style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Nav Links */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isTWC ? 'twc-links' : 'hangri-links'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="nav-links-row"
              style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}
            >
              {config.links.map((item) => (
                <a
                  key={`${item.label}-${item.target}`}
                  href={item.target}
                  onClick={(e) => handleNavClick(e, item.target)}
                  className="nav-link"
                  style={{
                    fontFamily: 'Effra Trial Bold',
                    fontSize: isTWC ? '13px' : '15px',
                    fontWeight: 600,
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

          {/* Divider - Wait, the user asked to change the color of the navbar FROM the separation. So the divider might not even be needed if the colors meet, but let's keep it just in case, centered. Actually, they said "make the wedding cake in the middle of the separation", meaning in the middle of that new colored area. I will remove the thin divider line and let the color block be the separation. */}
          {/* Brand Toggle Button */}
          <motion.button
            onClick={handleBrandToggle}
            whileTap={{ scale: 0.96 }}
            style={{
              fontFamily: 'Effra Trial Bold',
              fontSize: '12px',
              fontWeight: 600,
              color: isTWC ? '#2f2218' : '#fdf6e3', 
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              background: isTWC ? twcTheme.accent : '#4e3b31', 
              border: 'none',
              cursor: 'pointer',
              padding: '0 32px',
              marginLeft: '24px', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.4s ease, color 0.4s ease',
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
