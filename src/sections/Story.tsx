import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { twcStoryConfig } from '../config';

const ease = [0.16, 1, 0.3, 1] as const;

// Editorial "Why Tiramisu" section — TWC only. Mirrors the brand-deck page:
// a full-height image beside a soft-grey heading chip and serif copy.
export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-120px' });
  const s = twcStoryConfig;

  return (
    <section
      id="story"
      ref={sectionRef}
      className="twc-section"
      style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }}
    >
      <div
        className="twc-story-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
          alignItems: 'stretch',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Image */}
        <motion.div
          className="twc-story-img twc-img-hover"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease }}
          style={{ overflow: 'hidden', minHeight: '520px', position: 'relative', background: '#141414' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -10,
              backgroundImage: `url("${s.image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(16px) brightness(0.4)',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          />
          <img
            src={s.image}
            alt={s.title}
            loading="lazy"
            className="twc-img-zoom"
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              minHeight: '520px',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Copy */}
        <div
          className="twc-story-copy"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(56px, 7vw, 100px) clamp(28px, 6vw, 88px)',
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="twc-eyebrow"
            style={{ fontSize: '12px', marginBottom: '22px' }}
          >
            {s.eyebrow}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            <h2 className="font-elegant twc-display" style={{ fontSize: 'clamp(32px, 4.6vw, 56px)', maxWidth: '11ch' }}>
              {s.title}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            style={{ marginTop: '34px', display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '480px' }}
          >
            <p
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: 'clamp(18px, 2vw, 22px)',
                fontStyle: 'italic',
                lineHeight: 1.6,
                color: '#1a1a1a',
                margin: 0,
                borderLeft: '2px solid #E9E8E9',
                paddingLeft: '22px',
              }}
            >
              {s.lead}
            </p>
            {s.body.map((para) => (
              <p
                key={para}
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: 'clamp(15px, 1.5vw, 17px)',
                  lineHeight: 1.85,
                  color: '#4a4a4a',
                  margin: 0,
                }}
              >
                {para}
              </p>
            ))}
          </motion.div>
        </div>
      </div>

      <span className="twc-watermark">@TiramisuWeddingCake&nbsp;&nbsp;|&nbsp;&nbsp;@HangriDessert</span>
    </section>
  );
}
