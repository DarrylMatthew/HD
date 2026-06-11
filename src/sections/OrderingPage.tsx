import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { OrderingCategory, OrderingGroup } from '../config';
import { orderingPageConfig } from '../config';
import { ShoppingBag } from 'lucide-react';
import { getLenis } from '../hooks/useLenis';
import { formatRupiah, getInitialState, cartItemFromState, handleImgError } from './OrderingUtils';
import type { CustomizeState } from './OrderingUtils';
import { CustomizePanel } from './OrderingUI';
import { useCart } from '../context/CartContext';

function useIsMobile(bp = 768) {
  const [m, setM] = useState(typeof window !== 'undefined' ? window.innerWidth < bp : false);
  useEffect(() => { const h = () => setM(window.innerWidth < bp); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [bp]);
  return m;
}

export default function OrderingPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const isMobile = useIsMobile();
  const { addToCart: pushToCart, showCart, setShowCart, editingItem, menuGroups, menuCategories } = useCart();
  const [activeCat, setActiveCat] = useState<OrderingCategory | null>(null);
  // Mobile-only: item detail popup (image + description) shown when a list row is tapped.
  const [previewCat, setPreviewCat] = useState<OrderingCategory | null>(null);
  const [cState, setCState] = useState<CustomizeState>({ selectedSize: '', selectedAddon: '', selectedSauce: '', selectedDusting: '', selectedTopper: '', selectedExtras: [], notes: '', wantsCustomText: false, customText: '', quantity: 1 });

  const openCustomize = useCallback((cat: OrderingCategory) => {
    if (cat.isTBD) return;
    setActiveCat(cat);
    setCState(getInitialState(cat));
  }, []);

  const closeCustomize = useCallback(() => {
    setActiveCat(null);
  }, []);

  const addToCart = useCallback(() => {
    if (!activeCat) return;
    pushToCart(cartItemFromState(activeCat, cState));
    closeCustomize();
  }, [activeCat, cState, closeCustomize, pushToCart]);

  useEffect(() => {
    const lenis = getLenis();
    const locked = showCart || activeCat !== null || editingItem !== null || previewCat !== null;
    if (locked) { document.body.style.overflow = 'hidden'; lenis?.stop(); }
    else { document.body.style.overflow = ''; lenis?.start(); }
    return () => { document.body.style.overflow = ''; lenis?.start(); };
  }, [showCart, activeCat, editingItem, previewCat]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (showCart) setShowCart(false); else if (previewCat) setPreviewCat(null); else if (activeCat) closeCustomize(); } };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [activeCat, showCart, previewCat, closeCustomize, setShowCart]);

  const sectionBgs = ['#f5ecd8', '#fffdf7'];
  const groupsWithItems = menuGroups
    .map((group) => ({ group, items: menuCategories.filter((c) => c.groupId === group.id) }))
    .filter(({ items }) => items.length > 0);

  return (
    <>
      <section id="ordering" ref={sectionRef} style={{ position: 'relative' }}>
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: 'center', padding: '120px 24px 60px', backgroundColor: '#f5ecd8' }}>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#e8954e', display: 'block', marginBottom: '16px' }}>{orderingPageConfig.sectionLabel}</span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: '#2f2218', margin: '0 0 16px' }}>{orderingPageConfig.title}</h2>
          <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', lineHeight: 1.7, color: '#5a4a3a', maxWidth: '520px', margin: '0 auto' }}>{orderingPageConfig.subtitle}</p>
        </motion.div>

        {/* DESKTOP: one showcase section per menu group */}
        {!isMobile && groupsWithItems.map(({ group, items }, i) => (
          <DesktopGroupSection key={group.id} group={group} items={items} index={i} bg={sectionBgs[i % sectionBgs.length]} isInView={isInView} onOrder={openCustomize} />
        ))}

        {/* MOBILE: GrabFood-style grouped list */}
        {isMobile && (
          <div style={{ padding: '0 16px 100px', backgroundColor: '#f5ecd8' }}>
            {groupsWithItems.map(({ group, items }, gi) => (
              <div key={group.id}>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: gi * 0.05 }}
                  className="font-serif"
                  style={{ fontSize: '22px', fontWeight: 400, color: '#2f2218', margin: gi === 0 ? '8px 0 4px' : '32px 0 4px' }}>
                  {group.name}
                </motion.h3>
                {items.map((cat, i) => (
                  <MobileListItem key={cat.id} cat={cat} index={i} isInView={isInView} onAdd={openCustomize} onPress={setPreviewCat} />
                ))}
              </div>
            ))}
          </div>
        )}
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

      {/* Customize panel (full-screen on mobile, drawer on desktop) */}
      <AnimatePresence>
        {activeCat && (
          <CustomizePanel cat={activeCat} state={cState} onChange={setCState} onClose={closeCustomize} onSubmit={addToCart} isMobile={isMobile} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ======== DESKTOP GROUP SHOWCASE SECTION ======== */
function DesktopGroupSection({ group, items, index, bg, isInView, onOrder }: { group: OrderingGroup; items: OrderingCategory[]; index: number; bg: string; isInView: boolean; onOrder: (c: OrderingCategory) => void }) {
  const reverse = index % 2 === 1;
  // The big image follows whichever item the user is hovering; falls back to the
  // first item when nothing is hovered.
  const [hovered, setHovered] = useState<OrderingCategory | null>(null);
  const shown = hovered ?? items[0];
  return (
    <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: index * 0.1 }}
      style={{ background: bg, padding: '80px 48px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: reverse ? 'row-reverse' : 'row', alignItems: 'center', gap: '64px' }}>
        {/* Image — crossfades as you hover different items */}
        <motion.div initial={{ opacity: 0, x: reverse ? 60 : -60 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
          style={{ flex: '0 0 50%', position: 'relative' }}>
          <div style={{ position: 'relative', height: '400px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(47,34,24,0.15)' }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={shown?.id}
                src={shown?.image}
                alt={shown?.name ?? group.name}
                onError={handleImgError(shown?.imageFallback)}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: shown?.imagePosition ?? 'center center' }}
              />
            </AnimatePresence>
          </div>
        </motion.div>
        {/* Content */}
        <motion.div initial={{ opacity: 0, x: reverse ? -60 : 60 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
          style={{ flex: '0 0 45%' }}>
          <h3 className="font-serif" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, color: '#2f2218', margin: '0 0 16px', lineHeight: 1.2 }}>{group.name}</h3>
          {/* Sheet groups have no group-level description, so fall back to the shown item's */}
          {(group.description || shown?.description) && (
            <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', lineHeight: 1.8, color: '#5a4a3a', margin: '0 0 24px' }}>{group.description || shown?.description}</p>
          )}
          <div style={{ borderTop: '1px solid rgba(47,34,24,0.12)' }} onMouseLeave={() => setHovered(null)}>
            {items.map((cat) => {
              const active = shown?.id === cat.id;
              return (
              <div key={cat.id} onMouseEnter={() => setHovered(cat)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 12px', margin: '0 -12px', borderRadius: '12px', borderBottom: '1px solid rgba(47,34,24,0.12)', background: active ? 'rgba(232,149,78,0.08)' : 'transparent', transition: 'background 0.25s ease', cursor: 'pointer' }}
                onClick={() => onOrder(cat)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218' }}>{cat.name}</div>
                  <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#e8954e', fontWeight: 600, marginTop: '2px' }}>
                    {cat.sizes.length > 0 ? 'From ' : ''}{formatRupiah(cat.startingPrice)}
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); onOrder(cat); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'Effra Trial Bold', color: '#fdf6e3', background: 'linear-gradient(135deg, #4e3b31, #2f2218)', border: 'none', borderRadius: '14px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(78,59,49,0.25)', flexShrink: 0 }}>
                  <ShoppingBag size={14} />Order
                </motion.button>
              </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ======== MOBILE ITEM DETAIL POPUP (bottom sheet) ======== */
function MobilePreviewSheet({ cat, onClose, onAdd }: { cat: OrderingCategory; onClose: () => void; onAdd: (c: OrderingCategory) => void }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200 }} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 201, background: '#fffdf7', borderRadius: '24px 24px 0 0', padding: '12px 20px calc(20px + env(safe-area-inset-bottom))', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 -8px 40px rgba(47,34,24,0.25)' }}>
        {/* Drag handle */}
        <div style={{ width: '40px', height: '4px', borderRadius: '999px', background: '#d8c3a5', margin: '0 auto 16px' }} />
        <img src={cat.image} alt={cat.name} onError={handleImgError(cat.imageFallback)}
          style={{ width: '100%', height: '240px', objectFit: 'cover', objectPosition: cat.imagePosition ?? 'center center', borderRadius: '16px' }} />
        <h3 style={{ fontFamily: 'Effra Trial Bold', fontSize: '22px', fontWeight: 700, color: '#2f2218', margin: '20px 0 8px' }}>{cat.name}</h3>
        {cat.description && (
          <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', lineHeight: 1.6, color: '#5a4a3a', margin: '0 0 12px' }}>{cat.description}</p>
        )}
        <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '20px', fontWeight: 700, color: '#e8954e', margin: '0 0 20px' }}>
          {cat.isTBD ? 'Coming Soon' : `${cat.sizes.length > 0 ? 'From ' : ''}${formatRupiah(cat.startingPrice)}`}
        </div>
        {!cat.isTBD && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => onAdd(cat)}
            style={{ width: '100%', padding: '16px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #4e3b31, #2f2218)', color: '#fdf6e3', fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(78,59,49,0.3)' }}>
            Add to Cart
          </motion.button>
        )}
      </motion.div>
    </>
  );
}

/* ======== MOBILE MENU LIST ITEM ======== */
function MobileListItem({ cat, index, isInView, onAdd, onPress }: { cat: OrderingCategory; index: number; isInView: boolean; onAdd: (c: OrderingCategory) => void; onPress: (c: OrderingCategory) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={() => onPress(cat)}
      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid #e8dcc6', cursor: 'pointer' }}>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 600, color: '#2f2218', margin: '0 0 4px' }}>{cat.name}</h4>
        {cat.isTBD ? (
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', fontStyle: 'italic', color: '#a09488' }}>Coming Soon</span>
        ) : (
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 600, color: '#e8954e' }}>{cat.sizes.length > 0 ? 'From ' : ''}{formatRupiah(cat.startingPrice)}</span>
        )}
      </div>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={cat.image} alt={cat.name} onError={handleImgError(cat.imageFallback)} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', objectPosition: cat.imagePosition ?? 'center center', filter: cat.isTBD ? 'grayscale(30%) brightness(0.9)' : 'none' }} />
        {!cat.isTBD && (
          <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); onAdd(cat); }}
              style={{ padding: '4px 20px', borderRadius: '20px', border: '1.5px solid #4e3b31', background: '#fffdf7', fontFamily: 'Effra Trial Bold', fontSize: '12px', fontWeight: 600, color: '#4e3b31', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Add
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
