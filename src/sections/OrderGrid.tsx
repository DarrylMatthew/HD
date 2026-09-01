import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { OrderingCategory } from '../config';
import { Clock } from 'lucide-react';
import { formatRupiah, getInitialState, cartItemFromState, handleImgError } from './OrderingUtils';
import type { CustomizeState } from './OrderingUtils';
import { CustomizePanel, MobilePreviewSheet } from './OrderingUI';
import { useCart } from '../context/CartContext';

function useIsMobile(bp = 768) {
  const [m, setM] = useState(typeof window !== 'undefined' ? window.innerWidth < bp : false);
  useEffect(() => { const h = () => setM(window.innerWidth < bp); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [bp]);
  return m;
}

export default function OrderGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const isMobile = useIsMobile();
  const { addToCart: pushToCart, menuGroups, menuCategories } = useCart();
  const [filter, setFilter] = useState('All');
  const [activeCat, setActiveCat] = useState<OrderingCategory | null>(null);
  // Mobile-only: item detail popup (image + description) shown when a card is tapped.
  const [previewCat, setPreviewCat] = useState<OrderingCategory | null>(null);
  const [cState, setCState] = useState<CustomizeState>({ selectedSize: '', selectedAddon: '', selectedSauce: '', selectedDusting: '', selectedTopper: '', selectedExtras: [], notes: '', wantsCustomText: false, customText: '', quantity: 1, customCardText: '', selectedGlassDish: '', customDustingText: '', selectedCandle: '', customCandleNumber: '' });

  const groupName = (cat: OrderingCategory) => menuGroups.find((g) => g.id === cat.groupId)?.name ?? '';
  const filters = ['All', ...menuGroups.filter((g) => menuCategories.some((c) => c.groupId === g.id)).map((g) => g.name)];
  const filtered = filter === 'All' ? menuCategories : menuCategories.filter((c) => groupName(c) === filter);

  const openCustomize = useCallback((cat: OrderingCategory) => {
    if (cat.isTBD) return;
    setActiveCat(cat); setCState(getInitialState(cat));
  }, []);
  const closeCustomize = useCallback(() => { setActiveCat(null); }, []);

  // Mobile taps preview the item first; desktop clicks go straight to ordering.
  const handleCardClick = useCallback((cat: OrderingCategory) => {
    if (isMobile) setPreviewCat(cat);
    else openCustomize(cat);
  }, [isMobile, openCustomize]);

  const addToCart = useCallback(() => {
    if (!activeCat) return;
    pushToCart(cartItemFromState(activeCat, cState));
    closeCustomize();
  }, [activeCat, cState, closeCustomize, pushToCart]);

  // Body-scroll locking is handled by useScrollLock inside each overlay
  // (CustomizePanel / MobilePreviewSheet / CartReview), so no manual lock here.

  return (
    <>
      <section id="order-grid" ref={sectionRef} style={{ padding: '100px 24px 80px', background: '#faf8f4', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ marginBottom: '40px' }}>
            <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#e8954e', display: 'block', marginBottom: '12px' }}>Our Collection</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300, color: '#2f2218', margin: 0 }}>{isMobile ? 'Menu' : 'Order Online'}</h2>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px', borderBottom: '1px solid #e8dcc6', paddingBottom: '16px' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', fontWeight: filter === f ? 700 : 400, color: filter === f ? '#2f2218' : '#999', background: filter === f ? '#fff' : 'transparent', border: filter === f ? '1.5px solid #2f2218' : '1.5px solid #ddd', borderRadius: '20px', padding: '6px 18px', cursor: 'pointer', transition: 'all 0.25s ease' }}>
                {f}
              </button>
            ))}
          </motion.div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((cat, i) => (
                <GridCard key={cat.id} cat={cat} groupName={groupName(cat)} index={i} isInView={isInView} onOrder={handleCardClick} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Mobile item detail popup (image, description, price) */}
      <AnimatePresence>
        {previewCat && (
          <MobilePreviewSheet
            cat={previewCat}
            onClose={() => setPreviewCat(null)}
            onAdd={(cat) => { setPreviewCat(null); openCustomize(cat); }}
          />
        )}
      </AnimatePresence>

      {/* Customize Drawer/Page */}
      <AnimatePresence>
        {activeCat && (
          <CustomizePanel cat={activeCat} state={cState} onChange={setCState} onClose={closeCustomize} onSubmit={addToCart} isMobile={isMobile} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ======== GRID CARD ======== */
function GridCard({ cat, groupName, index, isInView, onOrder }: { cat: OrderingCategory; groupName: string; index: number; isInView: boolean; onOrder: (c: OrderingCategory) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div layout initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => !cat.isTBD && onOrder(cat)} style={{ cursor: cat.isTBD ? 'default' : 'pointer' }}>
      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '4/3', marginBottom: '16px' }}>
        <motion.img animate={{ scale: hovered && !cat.isTBD ? 1.05 : 1 }} transition={{ duration: 0.5 }} src={cat.image} alt={cat.name} onError={handleImgError(cat.imageFallback)} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: cat.imagePosition ?? 'center center', filter: cat.isTBD ? 'grayscale(25%) brightness(0.9)' : 'none' }} />
        {cat.isTBD && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(47,34,24,0.85)', color: '#fdf6e3', fontFamily: 'Effra Trial Bold', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '5px 12px', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={10} />Coming Soon
          </div>
        )}
      </div>
      <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#e8954e', display: 'block', marginBottom: '6px' }}>{cat.isTBD ? 'Coming Soon' : (groupName || 'Hangri Dessert')}</span>
      <h3 style={{ fontFamily: 'Effra Trial Bold', fontSize: '17px', fontWeight: 700, color: '#2f2218', margin: '0 0 6px', lineHeight: 1.3 }}>{cat.name}</h3>
      {cat.isTBD ? (
        <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', fontStyle: 'italic', color: '#aaa' }}>Price TBD</span>
      ) : (
        <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 600, color: '#e8954e' }}>{cat.sizes.length > 0 && !cat.hideFromPrefix ? 'From ' : ''}{formatRupiah(cat.startingPrice)}</span>
      )}
    </motion.div>
  );
}
