import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MapPin } from 'lucide-react';
import { getLenis } from '../hooks/useLenis';
import { navigationConfig, twcNavigationConfig, twcTheme, orderingPageConfig } from '../config';
import { useBrand } from '../context/BrandContext';
import { useCart } from '../context/CartContext';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { isTWC, toggleBrand } = useBrand();
  const { cartCount, setShowCart } = useCart();

  const config = isTWC ? twcNavigationConfig : navigationConfig;
  const locations = orderingPageConfig.pickupLocations;

  // Close the location dropdown on any outside click.
  useEffect(() => {
    if (!locOpen) return;
    const close = () => setLocOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [locOpen]);

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

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const baseTextColor = scrolled ? (isTWC ? twcTheme.foreground : '#2f2218') : '#fdf6e3';
  const hoverTextColor = isTWC ? twcTheme.accent : '#e8954e';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);
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
      className={`main-nav${isTWC ? ' twc-mode' : ''}`}
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
        className="nav-row"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'stretch',
          gap: '8px',
        }}
      >
      <div
        className={`nav-inner ${scrolled ? (isTWC ? 'elegant-glass' : 'warm-glass') : ''}`}
        style={{
          flex: 1,
          minWidth: 0,
          paddingLeft: '24px',
          borderRadius: scrolled ? '0.5rem 0.5rem 0.5rem 0.5rem' : '0',
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
            fontSize: '28px',
            fontWeight: isTWC ? 400 : 600,
            color: scrolled ? (isTWC ? twcTheme.foreground : '#4e3b31') : '#fdf6e3',
            border: 'none',
            textDecoration: 'none',
            transition: 'color 0.6s ease, font-size 0.6s ease',
            letterSpacing: isTWC ? '4px' : '0px',
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
                  src="/images/HD logo background remove.png" 
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
                    fontSize: '15px',
                    fontWeight: 600,
                    color: baseTextColor,
                    letterSpacing: '0.5px',
                    textDecoration: 'none',
                    textTransform: 'none',
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

          {/* Brand Toggle Button */}
          <motion.button
            onClick={handleBrandToggle}
            whileTap={{ scale: 0.96 }}
            className="brand-toggle-btn"
            style={{
              fontFamily: 'Effra Trial Bold',
              fontSize: '12px',
              fontWeight: 600,
              color: isTWC ? '#ffffff' : '#fdf6e3',
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

          {/* Mobile hamburger - hidden on desktop via CSS */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              margin: 0,
              width: '44px',
              height: '44px',
              color: baseTextColor,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ position: 'relative', width: '22px', height: '14px', display: 'inline-block', marginTop: '10px' }}>
              <span style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'currentColor', borderRadius: '2px', top: menuOpen ? '6px' : '0', transform: menuOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease, top 0.3s ease' }} />
              <span style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'currentColor', borderRadius: '2px', top: '6px', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s ease' }} />
              <span style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'currentColor', borderRadius: '2px', top: menuOpen ? '6px' : '12px', transform: menuOpen ? 'rotate(-45deg)' : 'none', transition: 'transform 0.3s ease, top 0.3s ease' }} />
            </span>
          </button>
        </div>
      </div>

      {/* Location button - opens a small dropdown with one Google Maps link per outlet */}
      {!isTWC && (
        <div className="nav-location-wrap" style={{ position: 'relative', display: 'none', flexShrink: 0 }}>
          <motion.button
            onClick={(e) => { e.stopPropagation(); setLocOpen((v) => !v); }}
            whileTap={{ scale: 0.92 }}
            className="nav-location-btn"
            aria-label="Store locations"
            aria-expanded={locOpen}
            style={{
              height: '100%',
              border: 'none',
              cursor: 'pointer',
              padding: '0 20px',
              background: '#4e3b31',
              color: '#fdf6e3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: scrolled ? '0.5rem' : '0',
              boxShadow: '0 4px 16px rgba(78, 59, 49, 0.25)',
              fontFamily: 'Effra Trial Bold',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <MapPin size={18} />
            Location
          </motion.button>
          <AnimatePresence>
            {locOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="warm-glass"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: '180px',
                  borderRadius: '0.5rem',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 110,
                }}
              >
                {locations.map((loc) => (
                  <a
                    key={loc.id}
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setLocOpen(false)}
                    style={{
                      fontFamily: 'Effra Trial Bold',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#2f2218',
                      textDecoration: 'none',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(232,149,78,0.15)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                  >
                    <MapPin size={14} color="#e8954e" />
                    {loc.shortLabel}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Cart icon - Hangri Dessert only; TWC has no online ordering cart */}
      {!isTWC && (
      <motion.button
        onClick={() => setShowCart(true)}
        whileTap={{ scale: 0.92 }}
        className="nav-cart-btn"
        aria-label={`Open cart${cartCount > 0 ? ` (${cartCount} item${cartCount === 1 ? '' : 's'})` : ''}`}
        style={{
          position: 'relative',
          border: 'none',
          cursor: 'pointer',
          padding: '0 20px',
          background: '#e8954e',
          color: '#fdf6e3',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: scrolled ? '0.5rem' : '0',
          boxShadow: '0 4px 16px rgba(232, 149, 78, 0.35)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingCart size={28} />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key="cart-badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 18, stiffness: 360 }}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  background: '#2f2218',
                  color: '#fdf6e3',
                  borderRadius: '999px',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 5px',
                  fontFamily: 'Effra Trial Bold',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
                }}
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
      )}
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 90 }}
            />
            <motion.div
              key={isTWC ? 'twc-menu' : 'hangri-menu'}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="nav-mobile-menu warm-glass"
              style={{
                position: 'fixed',
                top: '64px',
                left: '8px',
                right: '8px',
                zIndex: 95,
                padding: '12px 8px',
                borderRadius: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {config.links
                // Mobile shows only "Choose Your Dessert" (#ordering); the grid
                // (#order-grid) is desktop-only, so drop its nav link here.
                .filter((item) => isTWC || item.target !== '#order-grid')
                .map((item) => (
                <a
                  key={`${item.label}-${item.target}`}
                  href={item.target}
                  onClick={(e) => handleNavClick(e, item.target)}
                  style={{
                    fontFamily: 'Effra Trial Bold',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: isTWC ? twcTheme.foreground : '#2f2218',
                    letterSpacing: '0.5px',
                    textDecoration: 'none',
                    textTransform: 'none',
                    padding: '14px 16px',
                    borderRadius: '6px',
                  }}
                >
                  {item.label}
                </a>
                ))}
              {!isTWC && (
                <>
                  <div style={{ height: '1px', background: 'rgba(216,195,165,0.5)', margin: '8px 16px' }} />
                  {locations.map((loc) => (
                    <a
                      key={loc.id}
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        fontFamily: 'Effra Trial Bold',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#2f2218',
                        letterSpacing: '0.5px',
                        textDecoration: 'none',
                        padding: '14px 16px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <MapPin size={16} color="#e8954e" />
                      Location – {loc.shortLabel}
                    </a>
                  ))}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
