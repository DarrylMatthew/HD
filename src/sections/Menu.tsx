import { useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { menuConfig, twcMenuConfig, twcTheme } from '../config';
import { useBrand } from '../context/BrandContext';
import { getLenis } from '../hooks/useLenis';
import { UtensilsCrossed, Diamond, MessageCircle } from 'lucide-react';
import type { TWCProductConfig, ProductConfig } from '../config';

export default function Menu() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { isTWC } = useBrand();

  const accentColor = isTWC ? twcTheme.accent : '#e8954e';
  const textColor = isTWC ? twcTheme.foreground : '#2f2218';
  const mutedColor = isTWC ? twcTheme.muted : '#5a4a3a';

  return (
    <section
      id="menu"
      ref={sectionRef}
      style={{
        padding: '120px 24px',
        position: 'relative',
        backgroundColor: isTWC ? twcTheme.background : '#fdf6e3',
        transition: 'background-color 0.8s ease',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isTWC ? 'twc-label' : 'hangri-label'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: 'Effra Trial Bold',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: isTWC ? '4px' : '3px',
                textTransform: 'uppercase',
                color: accentColor,
                display: 'block',
                marginBottom: '16px',
                transition: 'color 0.6s ease',
              }}
            >
              {isTWC ? twcMenuConfig.sectionLabel : menuConfig.sectionLabel}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.h2
              key={isTWC ? 'twc-title' : 'hangri-title'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className={isTWC ? 'font-elegant' : 'font-serif'}
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: isTWC ? 400 : 300,
                color: textColor,
                margin: '0 0 16px',
                lineHeight: 1.2,
                transition: 'color 0.6s ease',
              }}
            >
              {isTWC ? twcMenuConfig.title : menuConfig.title}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={isTWC ? 'twc-sub' : 'hangri-sub'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: 'Effra Trial Bold',
                fontSize: '16px',
                lineHeight: 1.7,
                color: mutedColor,
                maxWidth: '500px',
                margin: '0 auto',
                transition: 'color 0.6s ease',
              }}
            >
              {isTWC ? twcMenuConfig.subtitle : menuConfig.subtitle}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Product Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            marginBottom: '100px',
          }}
        >
          <AnimatePresence mode="wait">
            {isTWC ? (
              <motion.div
                key="twc-products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'contents',
                }}
              >
                {twcMenuConfig.products.map((product, index) => (
                  <TWCProductCard
                    key={product.name}
                    product={product}
                    index={index}
                    isInView={isInView}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="hangri-products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'contents',
                }}
              >
                {menuConfig.products.map((product, index) => (
                  <HangriProductCard
                    key={product.name}
                    product={product}
                    index={index}
                    isInView={isInView}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Card */}
        <AnimatePresence mode="wait">
          {isTWC ? (
            <motion.div
              key="twc-bespoke"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="elegant-card"
              style={{
                background: '#1a1a1a',
                padding: '56px 48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Diamond size={26} color={twcTheme.accent} />
              </div>
              <h3
                className="font-elegant"
                style={{
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  fontWeight: 400,
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '1px',
                }}
              >
                {twcMenuConfig.bespokeTitle}
              </h3>
              <p
                style={{
                  fontFamily: 'Effra Trial Bold',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.6)',
                  maxWidth: '520px',
                  margin: 0,
                }}
              >
                {twcMenuConfig.bespokeDescription}
              </p>
              <motion.a
                href="#order"
                onClick={(e) => {
                  e.preventDefault();
                  const lenis = getLenis();
                  if (lenis) lenis.scrollTo('#order');
                }}
                className="font-elegant"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '12px',
                  padding: '16px 48px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  background: twcTheme.accent,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <MessageCircle size={16} />
                {twcMenuConfig.bespokeCta}
              </motion.a>
            </motion.div>
          ) : (
            <motion.div
              key="hangri-catering"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="organic-card"
              style={{
                background: 'linear-gradient(135deg, #4e3b31 0%, #2f2218 100%)',
                padding: '56px 48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(232, 149, 78, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UtensilsCrossed size={26} color="#e8954e" />
              </div>
              <h3
                className="font-serif"
                style={{
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  fontWeight: 300,
                  color: '#fdf6e3',
                  margin: 0,
                }}
              >
                {menuConfig.cateringTitle}
              </h3>
              <p
                style={{
                  fontFamily: 'Effra Trial Bold',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: '#d8c3a5',
                  maxWidth: '520px',
                  margin: 0,
                }}
              >
                {menuConfig.cateringDescription}
              </p>
              <motion.a
                href="#order"
                onClick={(e) => {
                  e.preventDefault();
                  const lenis = getLenis();
                  if (lenis) lenis.scrollTo('#order');
                }}
                className="font-script"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  padding: '14px 36px',
                  fontSize: '20px',
                  color: '#2f2218',
                  background: '#e8954e',
                  borderRadius: '2rem 0.5rem 2rem 0.5rem',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}
              >
                {menuConfig.cateringCta}
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ======== Hangri Product Card (unchanged design) ======== */
function HangriProductCard({
  product,
  index,
  isInView,
}: {
  product: ProductConfig;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="organic-card"
      style={{
        background: '#fffdf7',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: '100%',
          height: '280px',
          overflow: 'hidden',
          borderRadius: '2rem 0.5rem 0 0',
        }}
      >
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Product Info */}
      <div
        style={{
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flex: 1,
        }}
      >
        <h3
          className="font-serif"
          style={{
            fontSize: '28px',
            fontWeight: 400,
            color: '#2f2218',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontFamily: 'Effra Trial Bold',
            fontSize: '14px',
            lineHeight: 1.7,
            color: '#5a4a3a',
            margin: 0,
            flex: 1,
          }}
        >
          {product.description}
        </p>

        {/* Sizes */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingTop: '8px',
            borderTop: '1px solid #f0e6d3',
          }}
        >
          {product.sizes.map((size) => (
            <div
              key={size.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Effra Trial Bold',
                  fontSize: '13px',
                  color: '#5a4a3a',
                }}
              >
                {size.label}
              </span>
              <span
                className="font-script"
                style={{
                  fontSize: '20px',
                  color: '#e8954e',
                  fontWeight: 500,
                }}
              >
                {size.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ======== TWC Product Card (elegant, no pricing) ======== */
function TWCProductCard({
  product,
  index,
  isInView,
}: {
  product: TWCProductConfig;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="elegant-card"
      style={{
        background: twcTheme.card,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${twcTheme.cardBorder}`,
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: '100%',
          height: '320px',
          overflow: 'hidden',
        }}
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Product Info */}
      <div
        style={{
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flex: 1,
        }}
      >
        <h3
          className="font-elegant"
          style={{
            fontSize: '26px',
            fontWeight: 500,
            color: twcTheme.foreground,
            margin: 0,
            lineHeight: 1.3,
            letterSpacing: '0.5px',
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontFamily: 'Effra Trial Bold',
            fontSize: '14px',
            lineHeight: 1.8,
            color: twcTheme.muted,
            margin: 0,
            flex: 1,
          }}
        >
          {product.description}
        </p>

        {/* Serving Info — no pricing */}
        <div
          style={{
            paddingTop: '12px',
            borderTop: `1px solid ${twcTheme.cardBorder}`,
          }}
        >
          <span
            style={{
              fontFamily: 'Effra Trial Bold',
              fontSize: '13px',
              fontStyle: 'italic',
              color: twcTheme.accent,
              letterSpacing: '0.5px',
            }}
          >
            {product.servingInfo}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
