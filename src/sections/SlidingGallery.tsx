import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { twcTheme } from '../config';

const ease = [0.16, 1, 0.3, 1] as const;

interface SlideItem {
  image: string;
  title: string;
  tag: string;
  description: string;
}

const templateSlides: SlideItem[] = [
  {
    image: "/images/gallery-1.jpg",
    title: "The Ritz-Carlton, Jakarta",
    tag: "Tiramisu Tower · 7 Tiers",
    description: "An elegant setting featuring our signature Tiramisu Tower toast."
  },
  {
    image: "/images/gallery-2.jpg",
    title: "Amanjiwo, Borobudur",
    tag: "Bespoke Plated Dessert",
    description: "Bespoke outdoor reception surrounded by ancient architecture."
  },
  {
    image: "/images/gallery-3.jpg",
    title: "Alila Villas Uluwatu, Bali",
    tag: "Giant Whole Cake",
    description: "Crowned with fresh tropical florals for a cliffside sunset wedding."
  },
  {
    image: "/images/gallery-4.jpg",
    title: "The Langham, Jakarta",
    tag: "Long Sheet Cake",
    description: "A grand 1.2-meter cutting cake decorated with golden dust."
  },
  {
    image: "/images/gallery-5.jpg",
    title: "Mulia Resort, Nusa Dua",
    tag: "Dessert Table Collection",
    description: "An extensive luxury tiramisu pairing experience for 500 guests."
  }
];

export default function SlidingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // State to track if drag/press is active
  const [isDragging, setIsDragging] = useState(false);
  // State to track if user is interacting (hovering or touching)
  const [isInteracting, setIsInteracting] = useState(false);

  // Mouse Drag Scroll State Refs
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const clickStartX = useRef(0);
  const clickStartTime = useRef(0);

  // Direction tracking ref for auto-slide ping-pong
  const autoSlideDirection = useRef(1); // 1 = right, -1 = left

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = window.innerWidth < 768 ? 320 : 430; // slide width + gap
    const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // Mouse Drag Scroll Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    setIsDragging(true);
    clickStartX.current = e.pageX;
    clickStartTime.current = Date.now();

    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollSnapType = 'none'; // Disable snapping temporarily during drag
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeft.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    if (isDown.current && scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollSnapType = 'x mandatory'; // Re-enable snap
    }
    isDown.current = false;
    setIsDragging(false);
  };

  const handleMouseUp = (e: React.MouseEvent, area?: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollSnapType = 'x mandatory'; // Re-enable snap
    }

    if (isDown.current) {
      const diffX = Math.abs(e.pageX - clickStartX.current);
      const elapsedTime = Date.now() - clickStartTime.current;
      
      // If it was a quick click with minimal movement, trigger page scroll
      if (diffX < 6 && elapsedTime < 250) {
        if (area === 'left') {
          scroll('left');
        } else if (area === 'right') {
          scroll('right');
        }
      }
    }
    isDown.current = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Auto-slide Loop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 0.5; // slow speed, 0.5px per frame

    const step = () => {
      // Only auto-slide if not dragging, and not actively hovering/touching
      if (!isDown.current && !isInteracting) {
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
  }, [isInteracting]);

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
        @media (max-width: 768px) {
          .twc-gallery-press-area {
            display: none !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
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
        </div>
      </div>

      {/* Relative wrapper for track and fading overlay press areas */}
      <div
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setIsInteracting(false)}
        style={{ position: 'relative', width: '100%' }}
      >
        
        {/* Left Transparent Overlay Press Area */}
        <div
          className="twc-gallery-press-area"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={(e) => handleMouseUp(e, 'left')}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 'clamp(100px, 15vw, 200px)',
            height: 'clamp(340px, 35vw, 480px)',
            zIndex: 10,
            background: 'transparent',
            cursor: isDragging ? 'grabbing' : 'pointer',
            userSelect: 'none'
          }}
        />

        {/* Right Transparent Overlay Press Area */}
        <div
          className="twc-gallery-press-area"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={(e) => handleMouseUp(e, 'right')}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 'clamp(100px, 15vw, 200px)',
            height: 'clamp(340px, 35vw, 480px)',
            zIndex: 10,
            background: 'transparent',
            cursor: isDragging ? 'grabbing' : 'pointer',
            userSelect: 'none'
          }}
        />

        {/* Sliding Track - full bleed on right */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={(e) => handleMouseUp(e)}
          onMouseMove={handleMouseMove}
          style={{
            display: 'flex',
            gap: 'clamp(20px, 3vw, 30px)',
            overflowX: 'auto',
            scrollSnapType: isInteracting ? 'x mandatory' : 'none',
            scrollbarWidth: 'none',
            padding: '0 max(24px, calc((100vw - 1180px) / 2))',
            WebkitOverflowScrolling: 'touch',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
          className="hide-scrollbar"
        >
          {templateSlides.map((slide, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1, ease }}
              style={{
                flex: '0 0 auto',
                width: 'clamp(280px, 30vw, 400px)',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Card Image */}
              <div
                className="twc-img-hover"
                style={{
                  width: '100%',
                  height: 'clamp(340px, 35vw, 480px)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div
                  className="twc-img-zoom"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url("${slide.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              </div>

              {/* Editorial Caption */}
              <div style={{ marginTop: '18px', paddingRight: '12px' }}>
                <span
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: 'clamp(14px, 1.4vw, 16px)',
                    fontStyle: 'italic',
                    color: twcTheme.accent,
                    display: 'block',
                    marginBottom: '6px'
                  }}
                >
                  {slide.tag}
                </span>
                <h4
                  className="font-elegant"
                  style={{
                    fontSize: 'clamp(16px, 1.6vw, 19px)',
                    fontWeight: 500,
                    color: '#1a1a1a',
                    margin: '0 0 4px',
                    letterSpacing: '0.5px'
                  }}
                >
                  {slide.title}
                </h4>
                <p
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: 'clamp(13px, 1.3vw, 14px)',
                    color: '#555555',
                    lineHeight: 1.5,
                    margin: 0
                  }}
                >
                  {slide.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
