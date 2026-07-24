import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

// 28 Canva portfolio slides in public/images/twc/portfolio/ (excluding 21 and 30-33)
const portfolioSlideNumbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29
];

const portfolioSlides = portfolioSlideNumbers.map((num) => ({
  id: `portfolio-${num}`,
  image: `/images/twc/portfolio/${num}.webp`,
}));

export default function SlidingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Direction tracking ref for auto-slide ping-pong (1 = right, -1 = left)
  const autoSlideDirection = useRef(1);
  const isInteracting = useRef(false);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = window.innerWidth < 768 ? 280 : 360;

    // Set auto-slide direction matching button clicked
    const dir = direction === 'left' ? -1 : 1;
    autoSlideDirection.current = dir;

    // Pause auto-step during smooth scroll animation
    isInteracting.current = true;
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);

    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === 'right') {
      if (currentScroll >= maxScroll - 15) {
        // If at the end, wrap smoothly to start
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      if (currentScroll <= 15) {
        // If at the start, wrap smoothly to end
        container.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }

    touchTimeoutRef.current = setTimeout(() => {
      isInteracting.current = false;
    }, 800);
  };

  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const handleTouchStart = () => {
    isInteracting.current = true;
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      isInteracting.current = false;
    }, 1200);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    isInteracting.current = true;
    if (scrollContainerRef.current) {
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleMouseLeaveOrUp = () => {
    if (isMouseDown.current) {
      isMouseDown.current = false;
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = setTimeout(() => {
        isInteracting.current = false;
      }, 1200);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  // Continuous Auto-slide Loop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 0.6; // slow speed, 0.6px per frame

    const step = () => {
      if (!isInteracting.current) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 10) {
          let nextScroll = container.scrollLeft + speed * autoSlideDirection.current;
          
          if (nextScroll >= maxScroll) {
            nextScroll = maxScroll;
            autoSlideDirection.current = -1; // reverse direction to left when hitting end
          } else if (nextScroll <= 0) {
            nextScroll = 0;
            autoSlideDirection.current = 1; // reverse direction to right when hitting start
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

          {/* Navigation Controls */}
          <div style={{ display: 'flex', gap: '10px' }}>
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

      {/* Sliding Track - Native Touch & Mouse Swipe/Drag Enabled */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div
          ref={scrollContainerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          style={{
            display: 'flex',
            gap: 'clamp(16px, 2.5vw, 24px)',
            overflowX: 'auto',
            scrollSnapType: 'none',
            scrollbarWidth: 'none',
            padding: '0 max(24px, calc((100vw - 1180px) / 2))',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x pan-y',
            cursor: 'grab',
            userSelect: 'none',
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
                  aspectRatio: '1080 / 1920',
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
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
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
