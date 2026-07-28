import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { menuConfig, twcMenuConfig, twcConsultationConfig } from '../config';
import { useBrand } from '../context/BrandContext';
import { getLenis } from '../hooks/useLenis';
import { UtensilsCrossed } from 'lucide-react';
import type { TWCProductConfig, ProductConfig } from '../config';
import SlidingGallery from './SlidingGallery';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Menu() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { isTWC } = useBrand();

  // ======== TWC: editorial collection (deck product-page language) ========
  if (isTWC) {
    return (
      <section
        id="menu"
        ref={sectionRef}
        className="twc-section"
        style={{ padding: 'clamp(96px, 12vw, 150px) 24px', background: '#E9E8E9', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            style={{ textAlign: 'center', marginBottom: 'clamp(64px, 8vw, 110px)' }}
          >
            <span className="twc-eyebrow" style={{ fontSize: '12px', display: 'block', marginBottom: '22px' }}>
              {twcMenuConfig.sectionLabel}
            </span>
            <h2 className="font-elegant twc-display" style={{ fontSize: 'clamp(34px, 5.4vw, 64px)' }}>
              {twcMenuConfig.title}
            </h2>
            <p
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: 'clamp(15px, 1.7vw, 18px)',
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: '#4a4a4a',
                maxWidth: '540px',
                margin: '24px auto 0',
              }}
            >
              {twcMenuConfig.subtitle}
            </p>
          </motion.div>

          {/* Alternating product rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(48px, 7vw, 96px)' }}>
            {twcMenuConfig.products.map((product, index) => (
              <TWCProductRow key={product.name} product={product} index={index} reversed={index % 2 === 1} />
            ))}
          </div>

          {/* Sliding Gallery */}
          <SlidingGallery />

          {/* Bespoke band */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            style={{
              marginTop: 'clamp(64px, 9vw, 120px)',
              background: '#1a1a1a',
              padding: 'clamp(52px, 7vw, 84px) clamp(28px, 6vw, 72px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '22px',
            }}
          >
            <span
              className="twc-eyebrow"
              style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}
            >
              {twcMenuConfig.bespokeEyebrow || 'Tailored to you'}
            </span>
            <h3
              className="font-elegant twc-display"
              style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', color: '#ffffff' }}
            >
              {twcMenuConfig.bespokeTitle}
            </h3>
            <p
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: 'clamp(15px, 1.6vw, 17px)',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.62)',
                maxWidth: '560px',
                margin: 0,
              }}
            >
              {twcMenuConfig.bespokeDescription}
            </p>
            <motion.a
              href={`https://api.whatsapp.com/send?phone=${twcConsultationConfig.whatsappNumber.replace(/\+/g, '')}&text=${encodeURIComponent(`Hi TWC, nama saya ____.\n\nSaya mau lihat katalog wedding cake-nya!\n\nApakah masih available utk wedding tanggal ___ dan berlokasi di venue ___?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="btn-twc-solid"
              style={{ marginTop: '14px', background: '#ffffff', color: '#1a1a1a', textDecoration: 'none', display: 'inline-block' }}
            >
              {twcMenuConfig.bespokeCta}
            </motion.a>
          </motion.div>
        </div>

        <span className="twc-watermark">@TiramisuWeddingCake&nbsp;&nbsp;|&nbsp;&nbsp;@HangriDessert</span>
      </section>
    );
  }

  // ======== Hangri Dessert menu (unchanged) ========
  return (
    <section
      id="menu"
      ref={sectionRef}
      style={{
        padding: '120px 24px',
        position: 'relative',
        backgroundColor: '#fdf6e3',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <span
            style={{
              fontFamily: 'Effra Trial Bold',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#e8954e',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            {menuConfig.sectionLabel}
          </span>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 300,
              color: '#2f2218',
              margin: '0 0 16px',
              lineHeight: 1.2,
            }}
          >
            {menuConfig.title}
          </h2>
          <p
            style={{
              fontFamily: 'Effra Trial Bold',
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#5a4a3a',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            {menuConfig.subtitle}
          </p>
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
          {menuConfig.products.map((product, index) => (
            <HangriProductCard key={product.name} product={product} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease }}
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
          <h3 className="font-serif" style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 300, color: '#fdf6e3', margin: 0 }}>
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
      transition={{ duration: 0.8, delay: index * 0.2, ease }}
      className="organic-card"
      style={{ background: '#fffdf7', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* Product Image */}
      <div style={{ width: '100%', height: '280px', overflow: 'hidden', borderRadius: '2rem 0.5rem 0 0' }}>
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease }}
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Product Info */}
      <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <h3 className="font-serif" style={{ fontSize: '28px', fontWeight: 400, color: '#2f2218', margin: 0, lineHeight: 1.2 }}>
          {product.name}
        </h3>
        <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', lineHeight: 1.7, color: '#5a4a3a', margin: 0, flex: 1 }}>
          {product.description}
        </p>
        {/* Sizes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px', borderTop: '1px solid #f0e6d3' }}>
          {product.sizes.map((size) => (
            <div key={size.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', color: '#5a4a3a' }}>{size.label}</span>
              <span className="font-script" style={{ fontSize: '20px', color: '#e8954e', fontWeight: 500 }}>{size.price}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ======== TWC Product Row (alternating editorial layout, no pricing) ======== */
function TWCProductRow({
  product,
  index,
  reversed,
}: {
  product: TWCProductConfig;
  index: number;
  reversed: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { once: true, margin: '-90px' });

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease }}
      className={`twc-product-row${reversed ? ' twc-product-row--rev' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: '#ffffff',
        boxShadow: '0 30px 70px -40px rgba(0,0,0,0.4)',
      }}
    >
      {/* Image */}
      <div
        className="twc-img-hover twc-product-img"
        style={{
          overflow: 'hidden',
          minHeight: '420px',
          gridColumn: reversed ? 2 : 1,
          gridRow: 1,
          position: 'relative',
          background: '#141414',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -10,
            backgroundImage: `url("${product.image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(16px) brightness(0.4)',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="twc-img-zoom"
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            minHeight: '420px',
            objectFit: 'contain',
            objectPosition: product.imagePosition || 'center',
            display: 'block',
          }}
        />
      </div>

      {/* Copy */}
      <div
        className="twc-product-copy"
        style={{
          gridColumn: reversed ? 1 : 2,
          gridRow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(40px, 5vw, 72px)',
        }}
      >
        <span className="twc-eyebrow" style={{ fontSize: '11px', marginBottom: '14px' }}>
          {`No. 0${index + 1}`}
        </span>
        <h3 className="font-elegant twc-display" style={{ fontSize: 'clamp(28px, 3.4vw, 42px)' }}>
          {product.name}
        </h3>
        <p
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            color: '#1a1a1a',
            margin: '12px 0 0',
          }}
        >
          {product.tagline}
        </p>
        <p
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: 'clamp(15px, 1.5vw, 16px)',
            lineHeight: 1.8,
            color: '#4a4a4a',
            margin: '20px 0 0',
          }}
        >
          {product.description}
        </p>

        {/* Highlights with grey-dot markers */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '26px 0 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {product.highlights.map((line) => (
            <li key={line} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <span className="twc-bullet-sm" />
              <span
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  lineHeight: 1.6,
                  color: '#2a2a2a',
                }}
              >
                {line}
              </span>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '30px' }}>
          <span className="twc-rule" style={{ width: '34px' }} />
          <span
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '14px',
              letterSpacing: '1px',
              color: '#6b6b6b',
            }}
          >
            {product.servingInfo}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
