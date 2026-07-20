import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

// 31 Canva portfolio slides in public/images/twc/portfolio/ (excluding 21 and 33)
const portfolioSlideNumbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
];

const portfolioSlides = portfolioSlideNumbers.map((num) => ({
  id: `portfolio-${num}`,
  image: `/images/twc/portfolio/${num}.png`,
}));

export default function SlidingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Direction tracking ref for auto-slide ping-pong
  const autoSlideDirection = useRef(1); // 1 = right, -1 = left
  const isArrowScrolling = useRef(false);
  const arrowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = window.innerWidth < 768 ? 280 : 360; // slide width + gap

    // Set auto-slide direction to match arrow click
    autoSlideDirection.current = direction === 'left' ? -1 : 1;

    // Temporarily pause 60fps frame overwrite so smooth scroll animation executes cleanly
    isArrowScrolling.current = true;
    if (arrowTimeoutRef.current) clearTimeout(arrowTimeoutRef.current);

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });

    arrowTimeoutRef.current = setTimeout(() => {
      isArrowScrolling.current = false;
    }, 700);
  };

  // Continuous Auto-slide Loop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 0.6; // slow speed, 0.6px per frame

    const step = () => {
      if (!isArrowScrolling.current) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
          let nextScroll = container.scrollLeft + speed * autoSlideDirection.current;
          
          if (nextScroll >= maxScroll) {
            nextScroll = maxScroll;
            autoSlideDirection.current = -1; // reverse direction to left
          } else if (nextScroll <= 0) {
            nextScroll = 0;
            autoSlideDirection.current = 1; // reverse direction to right
          }
          
          container.scrollLeft = nextScroll;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(64px, 8vw, 110px) 0',
        backgroundColor: '#E9E8E9',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <span className="twc-eyebrow" style={{ fontSize: '11px', display: 'block', marginBottom: '14px' }}>
              Previous Celebrations
            </span>
            <h2 className="font-elegant twc-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', margin: 0 }}>
              Stories of Love
            </h2>
          </motion.div>

          {/* Navigation Controls - Exclusively active */}
          <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto', zIndex: 10 }}>
            <button
              onClick={() => scroll('left')}
              aria-label="Previous slide"
              style={{
                width: '42px',
                height: '42px',
                border: '1px solid rgba(0,0,0,0.2)',
                background: '#ffffff',
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next slide"
              style={{
                width: '42px',
                height: '42px',
                border: '1px solid rgba(0,0,0,0.2)',
                background: '#ffffff',
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Sliding Track - Non-interactive (Unable to be hovered or clicked) */}
      <div style={{ position: 'relative', width: '100%', pointerEvents: 'none', userSelect: 'none' }}>
        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            gap: 'clamp(16px, 2.5vw, 24px)',
            overflowX: 'auto',
            scrollSnapType: 'none',
            scrollbarWidth: 'none',
            padding: '0 max(24px, calc((100vw - 1180px) / 2))',
            WebkitOverflowScrolling: 'touch',
            cursor: 'default',
          }}
          className="hide-scrollbar"
        >
          {portfolioSlides.map((slide, i) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: (i % 6) * 0.08, ease }}
              style={{
                flex: '0 0 auto',
                width: 'clamp(240px, 26vw, 340px)',
              }}
            >
              {/* Canva Slide Card */}
              <div
                style={{
                  width: '100%',
                  height: 'clamp(380px, 42vw, 540px)',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#ffffff',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <img
                  src={slide.image}
                  alt={`Stories of Love ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <span className="twc-watermark">@TiramisuWeddingCake&nbsp;&nbsp;|&nbsp;&nbsp;@HangriDessert</span>
    </section>
  );
}
