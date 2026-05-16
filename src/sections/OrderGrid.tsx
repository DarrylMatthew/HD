import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { orderingPageConfig } from '../config';
import type { OrderingCategory } from '../config';
import { Clock, ArrowLeft } from 'lucide-react';
import { getLenis } from '../hooks/useLenis';
import { formatRupiah, getInitialState, calcUnitPrice, buildWhatsAppMessage, nextCartId } from './OrderingUtils';
import type { CustomizeState, CartItem } from './OrderingUtils';
import { QuantitySelector, CartFAB, CartReview } from './OrderingUI';

function useIsMobile(bp = 768) {
  const [m, setM] = useState(typeof window !== 'undefined' ? window.innerWidth < bp : false);
  useEffect(() => { const h = () => setM(window.innerWidth < bp); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, [bp]);
  return m;
}

export default function OrderGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const isMobile = useIsMobile();
  const cats = orderingPageConfig.categories;
  const [filter, setFilter] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCat, setActiveCat] = useState<OrderingCategory | null>(null);
  const [cState, setCState] = useState<CustomizeState>({ selectedSize: '', selectedAddon: '', selectedDusting: '', customText: '', quantity: 1 });

  const filters = ['All', ...Array.from(new Set(cats.filter(c => !c.isTBD).map(c => c.name)))];
  const filtered = filter === 'All' ? cats : cats.filter(c => c.name === filter);

  const openCustomize = useCallback((cat: OrderingCategory) => {
    if (cat.isTBD) return;
    setActiveCat(cat); setCState(getInitialState(cat));
  }, []);
  const closeCustomize = useCallback(() => { setActiveCat(null); }, []);

  const addToCart = useCallback(() => {
    if (!activeCat) return;
    const up = calcUnitPrice(activeCat, cState);
    setCart(prev => [...prev, { id: nextCartId(), category: activeCat, selectedSize: cState.selectedSize, selectedAddon: cState.selectedAddon, selectedDusting: cState.selectedDusting, customText: cState.customText, quantity: cState.quantity, unitPrice: up, totalPrice: up * cState.quantity }]);
    closeCustomize();
  }, [activeCat, cState, closeCustomize]);

  const cartTotal = cart.reduce((s, i) => s + i.totalPrice, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const lenis = getLenis();
    if (activeCat || showCart) { document.body.style.overflow = 'hidden'; lenis?.stop(); }
    else { document.body.style.overflow = ''; lenis?.start(); }
    return () => { document.body.style.overflow = ''; lenis?.start(); };
  }, [activeCat, showCart]);

  const handleWhatsApp = () => {
    if (cart.length === 0) return;
    const msg = buildWhatsAppMessage(cart, cartTotal);
    const phone = orderingPageConfig.whatsappNumber.replace(/\+/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
    setCart([]); setShowCart(false);
  };

  return (
    <>
      <section id="order-grid" ref={sectionRef} style={{ padding: '100px 24px 80px', background: '#faf8f4', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ marginBottom: '40px' }}>
            <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#e8954e', display: 'block', marginBottom: '12px' }}>Our Collection</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300, color: '#2f2218', margin: 0 }}>Order Online</h2>
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
                <GridCard key={cat.id} cat={cat} index={i} isInView={isInView} onOrder={openCustomize} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Customize Drawer/Page */}
      <AnimatePresence>
        {activeCat && (
          <CustomizePanel cat={activeCat} state={cState} onChange={setCState} onClose={closeCustomize} onAddToCart={addToCart} isMobile={isMobile} />
        )}
      </AnimatePresence>

      {/* Cart FAB */}
      <AnimatePresence>
        {cartCount > 0 && <CartFAB count={cartCount} onClick={() => setShowCart(true)} />}
      </AnimatePresence>

      {/* Cart Review */}
      <AnimatePresence>
        {showCart && <CartReview cart={cart} onRemove={(id) => setCart(p => p.filter(x => x.id !== id))} onClose={() => setShowCart(false)} onSubmit={handleWhatsApp} total={cartTotal} />}
      </AnimatePresence>
    </>
  );
}

/* ======== GRID CARD ======== */
function GridCard({ cat, index, isInView, onOrder }: { cat: OrderingCategory; index: number; isInView: boolean; onOrder: (c: OrderingCategory) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div layout initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => !cat.isTBD && onOrder(cat)} style={{ cursor: cat.isTBD ? 'default' : 'pointer' }}>
      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '4/3', marginBottom: '16px' }}>
        <motion.img animate={{ scale: hovered && !cat.isTBD ? 1.05 : 1 }} transition={{ duration: 0.5 }} src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: cat.isTBD ? 'grayscale(25%) brightness(0.9)' : 'none' }} />
        {cat.isTBD && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(47,34,24,0.85)', color: '#fdf6e3', fontFamily: 'Effra Trial Bold', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '5px 12px', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={10} />Coming Soon
          </div>
        )}
      </div>
      <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#e8954e', display: 'block', marginBottom: '6px' }}>{cat.isTBD ? 'Coming Soon' : 'Hangri Dessert'}</span>
      <h3 style={{ fontFamily: 'Effra Trial Bold', fontSize: '17px', fontWeight: 700, color: '#2f2218', margin: '0 0 6px', lineHeight: 1.3 }}>{cat.name}</h3>
      {cat.isTBD ? (
        <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', fontStyle: 'italic', color: '#aaa' }}>Price TBD</span>
      ) : (
        <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 600, color: '#e8954e' }}>{formatRupiah(cat.startingPrice)}</span>
      )}
    </motion.div>
  );
}

/* ======== CUSTOMIZE PANEL (shared for mobile & desktop) ======== */
function CustomizePanel({ cat, state, onChange, onClose, onAddToCart, isMobile }: { cat: OrderingCategory; state: CustomizeState; onChange: (s: CustomizeState) => void; onClose: () => void; onAddToCart: () => void; isMobile: boolean }) {
  const total = calcUnitPrice(cat, state) * state.quantity;
  const txtPrice = cat.hasCustomText && state.customText.length > 0 ? state.customText.length * cat.customTextPricePerChar : 0;

  // Full-screen on mobile, side drawer on desktop
  if (isMobile) {
    return (
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid #eee', flexShrink: 0 }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2f2218', display: 'flex' }}><ArrowLeft size={22} /></motion.button>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 600, color: '#2f2218' }}>Customize the dish</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218' }}>{cat.name}</span>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218' }}>{formatRupiah(calcUnitPrice(cat, state))}</span>
        </div>
        <div data-lenis-prevent style={{ flex: 1, overflowY: 'auto', padding: '0 20px 120px' }}>
          <COptions cat={cat} state={state} onChange={onChange} txtPrice={txtPrice} />
        </div>
        <div style={{ flexShrink: 0, padding: '12px 20px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#666', marginRight: '4px' }}>Qty</span>
            <QuantitySelector value={state.quantity} onChange={(q) => onChange({ ...state, quantity: q })} />
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onAddToCart} style={{ flex: 1, padding: '14px', fontSize: '15px', fontFamily: 'Effra Trial Bold', fontWeight: 600, color: '#fff', background: '#4e3b31', borderRadius: '24px', border: 'none', cursor: 'pointer' }}>
            Add to cart - {formatRupiah(total)}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(47,34,24,0.5)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'flex-end' }}>
      <motion.div data-lenis-prevent initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()} style={{ width: '480px', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', borderBottom: '1px solid #eee', flexShrink: 0 }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2f2218', display: 'flex' }}><ArrowLeft size={22} /></motion.button>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 600, color: '#2f2218' }}>Customize the dish</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #eee' }}>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218' }}>{cat.name}</span>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218' }}>{formatRupiah(calcUnitPrice(cat, state))}</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 120px' }}>
          <COptions cat={cat} state={state} onChange={onChange} txtPrice={txtPrice} />
        </div>
        <div style={{ flexShrink: 0, padding: '12px 24px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', color: '#666', marginRight: '8px' }}>Item quantity</span>
            <QuantitySelector value={state.quantity} onChange={(q) => onChange({ ...state, quantity: q })} />
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onAddToCart} style={{ flex: 1, padding: '14px', fontSize: '15px', fontFamily: 'Effra Trial Bold', fontWeight: 600, color: '#fff', background: '#4e3b31', borderRadius: '24px', border: 'none', cursor: 'pointer' }}>
            Add to cart - {formatRupiah(total)}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ======== CUSTOMIZE OPTIONS (GrabFood style) ======== */
function COptions({ cat, state, onChange, txtPrice }: { cat: OrderingCategory; state: CustomizeState; onChange: (s: CustomizeState) => void; txtPrice: number }) {
  return (
    <>
      {cat.sizes.length > 0 && (
        <div>
          <div style={{ padding: '16px 0 8px' }}>
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 700, color: '#2f2218' }}>Size for {cat.name}</div>
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#999', marginTop: '2px' }}>Required · Select 1</div>
          </div>
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.sizes.map((sz, i) => (
              <RRow key={sz.label} label={sz.label} price={formatRupiah(sz.price)} sel={state.selectedSize === sz.label} onClick={() => onChange({ ...state, selectedSize: sz.label })} last={i === cat.sizes.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.addons.length > 0 && (
        <div>
          <div style={{ padding: '16px 0 8px' }}>
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 700, color: '#2f2218' }}>Rum</div>
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#999', marginTop: '2px' }}>Required · Select 1</div>
          </div>
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.addons.map((ad, i) => (
              <RRow key={ad.label} label={ad.label} price={ad.price > 0 ? `+${formatRupiah(ad.price)}` : 'Free'} sel={state.selectedAddon === ad.label} onClick={() => onChange({ ...state, selectedAddon: ad.label })} last={i === cat.addons.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.dustingOptions.length > 0 && (
        <div>
          <div style={{ padding: '16px 0 8px' }}>
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 700, color: '#2f2218' }}>Cake Dusting</div>
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#999', marginTop: '2px' }}>Required · Select 1</div>
          </div>
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.dustingOptions.map((opt, i) => (
              <RRow key={opt} label={opt} price="Free" sel={state.selectedDusting === opt} onClick={() => onChange({ ...state, selectedDusting: opt })} last={i === cat.dustingOptions.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.hasCustomText && (
        <div>
          <div style={{ padding: '16px 0 8px' }}>
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 700, color: '#2f2218' }}>Notes</div>
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#999', marginTop: '2px' }}>Optional</div>
          </div>
          <div style={{ borderTop: '1px solid #e8dcc6', paddingTop: '12px' }}>
            <textarea placeholder="Write special requests here" value={state.customText} onChange={(e) => onChange({ ...state, customText: e.target.value })} rows={3}
              style={{ width: '100%', padding: '12px', fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#2f2218', background: '#f5f5f5', border: '1px solid #e8dcc6', borderRadius: '10px', resize: 'none', boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#999', marginTop: '4px' }}>{state.customText.length}/200</div>
            {state.customText.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#5a4a3a' }}>{state.customText.length} huruf × {formatRupiah(cat.customTextPricePerChar)}</span>
                <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#e8954e', fontWeight: 600 }}>{formatRupiah(txtPrice)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function RRow({ label, price, sel, onClick, last }: { label: string; price?: string; sel: boolean; onClick: () => void; last?: boolean }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: last ? 'none' : '1px dotted #e0d5c4', cursor: 'pointer' }}>
      <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#2f2218' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {price && <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', color: '#666' }}>{price}</span>}
        <div style={{ width: '22px', height: '22px', borderRadius: '4px', border: sel ? '2px solid #4e3b31' : '2px solid #ccc', background: sel ? '#4e3b31' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          {sel && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      </div>
    </div>
  );
}
