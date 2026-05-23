import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { orderingPageConfig } from '../config';
import type { OrderingCategory } from '../config';
import { ShoppingBag, ArrowLeft, Clock, Check } from 'lucide-react';
import { getLenis } from '../hooks/useLenis';
import { formatRupiah, getInitialState, calcUnitPrice, isCustomizeValid, CUSTOM_TEXT_MAX, NOTES_MAX } from './OrderingUtils';
import type { CustomizeState } from './OrderingUtils';
import { QuantitySelector } from './OrderingUI';
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
  const { addToCart: pushToCart, showCart, setShowCart } = useCart();
  const [mobileView, setMobileView] = useState<'list' | 'customize'>('list');
  const [activeCat, setActiveCat] = useState<OrderingCategory | null>(null);
  const [cState, setCState] = useState<CustomizeState>({ selectedSize: '', selectedAddon: '', selectedDusting: '', selectedTopper: '', notes: '', wantsCustomText: false, customText: '', quantity: 1 });

  const openCustomize = useCallback((cat: OrderingCategory) => {
    if (cat.isTBD) return;
    setActiveCat(cat);
    setCState(getInitialState(cat));
    if (isMobile) setMobileView('customize');
  }, [isMobile]);

  const closeCustomize = useCallback(() => {
    setActiveCat(null);
    if (isMobile) setMobileView('list');
  }, [isMobile]);

  const addToCart = useCallback(() => {
    if (!activeCat) return;
    const up = calcUnitPrice(activeCat, cState);
    pushToCart({ category: activeCat, selectedSize: cState.selectedSize, selectedAddon: cState.selectedAddon, selectedDusting: cState.selectedDusting, selectedTopper: cState.selectedTopper, notes: cState.notes, wantsCustomText: cState.wantsCustomText, customText: cState.customText, quantity: cState.quantity, unitPrice: up, totalPrice: up * cState.quantity });
    closeCustomize();
  }, [activeCat, cState, closeCustomize, pushToCart]);

  useEffect(() => {
    const lenis = getLenis();
    const locked = (isMobile && mobileView === 'customize') || showCart || (!isMobile && activeCat !== null);
    if (locked) { document.body.style.overflow = 'hidden'; lenis?.stop(); }
    else { document.body.style.overflow = ''; lenis?.start(); }
    return () => { document.body.style.overflow = ''; lenis?.start(); };
  }, [isMobile, mobileView, showCart, activeCat]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (showCart) setShowCart(false); else if (activeCat) closeCustomize(); } };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [activeCat, showCart, closeCustomize, setShowCart]);

  const sectionBgs = ['#f5ecd8', '#fffdf7', '#f5ecd8', '#fffdf7', '#f5ecd8'];

  return (
    <>
      <section id="ordering" ref={sectionRef} style={{ position: 'relative' }}>
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} style={{ textAlign: 'center', padding: '120px 24px 60px', backgroundColor: '#f5ecd8' }}>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#e8954e', display: 'block', marginBottom: '16px' }}>{orderingPageConfig.sectionLabel}</span>
          <h2 className="font-serif" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: '#2f2218', margin: '0 0 16px' }}>{orderingPageConfig.title}</h2>
          <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', lineHeight: 1.7, color: '#5a4a3a', maxWidth: '520px', margin: '0 auto' }}>{orderingPageConfig.subtitle}</p>
        </motion.div>

        {/* DESKTOP: Apple-style showcase */}
        {!isMobile && orderingPageConfig.categories.map((cat, i) => (
          <DesktopSection key={cat.id} cat={cat} index={i} bg={sectionBgs[i % sectionBgs.length]} isInView={isInView} onOrder={openCustomize} />
        ))}

        {/* MOBILE: GrabFood-style list */}
        {isMobile && mobileView === 'list' && (
          <div style={{ padding: '0 16px 100px', backgroundColor: '#f5ecd8' }}>
            {orderingPageConfig.categories.map((cat, i) => (
              <MobileListItem key={cat.id} cat={cat} index={i} isInView={isInView} onAdd={openCustomize} />
            ))}
          </div>
        )}
      </section>

      {/* MOBILE: Full-screen customize */}
      <AnimatePresence>
        {isMobile && mobileView === 'customize' && activeCat && (
          <CustomizePage cat={activeCat} state={cState} onChange={setCState} onBack={closeCustomize} onAddToCart={addToCart} />
        )}
      </AnimatePresence>

      {/* DESKTOP: Side drawer customize */}
      <AnimatePresence>
        {!isMobile && activeCat && (
          <DesktopDrawer cat={activeCat} state={cState} onChange={setCState} onClose={closeCustomize} onAddToCart={addToCart} />
        )}
      </AnimatePresence>

    </>
  );
}

/* ======== DESKTOP SHOWCASE SECTION ======== */
function DesktopSection({ cat, index, bg, isInView, onOrder }: { cat: OrderingCategory; index: number; bg: string; isInView: boolean; onOrder: (c: OrderingCategory) => void }) {
  const reverse = index % 2 === 1;
  return (
    <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: index * 0.1 }}
      style={{ background: bg, padding: '80px 48px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: reverse ? 'row-reverse' : 'row', alignItems: 'center', gap: '64px' }}>
        {/* Image */}
        <motion.div initial={{ opacity: 0, x: reverse ? 60 : -60 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
          style={{ flex: '0 0 50%', position: 'relative' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: cat.isTBD ? 'none' : '0 20px 60px rgba(47,34,24,0.15)' }}>
            <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '400px', objectFit: 'cover', filter: cat.isTBD ? 'grayscale(30%) brightness(0.9)' : 'none' }} />
          </div>
          {cat.isTBD && (
            <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(47,34,24,0.85)', color: '#fdf6e3', fontFamily: 'Effra Trial Bold', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 16px', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(8px)' }}>
              <Clock size={11} />Coming Soon
            </div>
          )}
        </motion.div>
        {/* Content */}
        <motion.div initial={{ opacity: 0, x: reverse ? -60 : 60 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
          style={{ flex: '0 0 45%' }}>
          <h3 className="font-serif" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, color: '#2f2218', margin: '0 0 16px', lineHeight: 1.2 }}>{cat.name}</h3>
          <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', lineHeight: 1.8, color: '#5a4a3a', margin: '0 0 24px' }}>{cat.description}</p>
          {!cat.isTBD && (
            <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#5a4a3a', margin: '0 0 32px' }}>
              Starting from <span style={{ fontSize: '24px', color: '#e8954e', fontWeight: 600 }}>{formatRupiah(cat.startingPrice)}</span>
            </p>
          )}
          <motion.button whileHover={cat.isTBD ? {} : { scale: 1.05 }} whileTap={cat.isTBD ? {} : { scale: 0.95 }} onClick={() => onOrder(cat)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '14px', fontWeight: 600, fontFamily: 'Effra Trial Bold', color: cat.isTBD ? '#a09488' : '#fdf6e3', background: cat.isTBD ? '#e0d5c4' : 'linear-gradient(135deg, #4e3b31, #2f2218)', border: 'none', borderRadius: '16px', cursor: cat.isTBD ? 'default' : 'pointer', boxShadow: cat.isTBD ? 'none' : '0 4px 16px rgba(78,59,49,0.25)' }}>
            <ShoppingBag size={16} />{cat.isTBD ? 'Coming Soon' : 'Customize & Order'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ======== DESKTOP CUSTOMIZE DRAWER ======== */
function DesktopDrawer({ cat, state, onChange, onClose, onAddToCart }: { cat: OrderingCategory; state: CustomizeState; onChange: (s: CustomizeState) => void; onClose: () => void; onAddToCart: () => void }) {
  const total = calcUnitPrice(cat, state) * state.quantity;
  const txtPrice = cat.hasCustomText && state.wantsCustomText && state.customText.length > 0 ? state.customText.length * cat.customTextPricePerChar : 0;
  const canAdd = isCustomizeValid(cat, state);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(47,34,24,0.5)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'flex-end' }}>
      <motion.div data-lenis-prevent initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()} style={{ width: '480px', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', borderBottom: '1px solid #eee', flexShrink: 0 }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2f2218', display: 'flex' }}><ArrowLeft size={22} /></motion.button>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 600, color: '#2f2218' }}>Customize the dish</span>
        </div>
        {/* Product name + price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #eee' }}>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218' }}>{cat.name}</span>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218' }}>{formatRupiah(calcUnitPrice(cat, state))}</span>
        </div>
        {/* Scrollable options */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 120px' }}>
          <CustomizeOptions cat={cat} state={state} onChange={onChange} txtPrice={txtPrice} />
        </div>
        {/* Sticky bottom */}
        <div style={{ flexShrink: 0, padding: '14px 24px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', color: '#666' }}>Item quantity</span>
            <QuantitySelector value={state.quantity} onChange={(q) => onChange({ ...state, quantity: q })} />
          </div>
          <motion.button whileTap={canAdd ? { scale: 0.97 } : undefined} onClick={canAdd ? onAddToCart : undefined} disabled={!canAdd}
            style={{ width: '100%', padding: '14px', fontSize: '15px', fontFamily: 'Effra Trial Bold', fontWeight: 600, color: '#fff', background: canAdd ? '#4e3b31' : '#a09488', borderRadius: '24px', border: 'none', cursor: canAdd ? 'pointer' : 'not-allowed', opacity: canAdd ? 1 : 0.7 }}>
            Add to cart - {formatRupiah(total)}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ======== MOBILE MENU LIST ITEM ======== */
function MobileListItem({ cat, index, isInView, onAdd }: { cat: OrderingCategory; index: number; isInView: boolean; onAdd: (c: OrderingCategory) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid #e8dcc6' }}>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 600, color: '#2f2218', margin: '0 0 4px' }}>{cat.name}</h4>
        {cat.isTBD ? (
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', fontStyle: 'italic', color: '#a09488' }}>Coming Soon</span>
        ) : (
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 600, color: '#e8954e' }}>{formatRupiah(cat.startingPrice)}</span>
        )}
      </div>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={cat.image} alt={cat.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', filter: cat.isTBD ? 'grayscale(30%) brightness(0.9)' : 'none' }} />
        {!cat.isTBD && (
          <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => onAdd(cat)}
              style={{ padding: '4px 20px', borderRadius: '20px', border: '1.5px solid #4e3b31', background: '#fffdf7', fontFamily: 'Effra Trial Bold', fontSize: '12px', fontWeight: 600, color: '#4e3b31', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Add
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ======== MOBILE FULL-SCREEN CUSTOMIZE ======== */
function CustomizePage({ cat, state, onChange, onBack, onAddToCart }: { cat: OrderingCategory; state: CustomizeState; onChange: (s: CustomizeState) => void; onBack: () => void; onAddToCart: () => void }) {
  const total = calcUnitPrice(cat, state) * state.quantity;
  const txtPrice = cat.hasCustomText && state.wantsCustomText && state.customText.length > 0 ? state.customText.length * cat.customTextPricePerChar : 0;
  const canAdd = isCustomizeValid(cat, state);
  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid #eee', flexShrink: 0 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2f2218', display: 'flex' }}><ArrowLeft size={22} /></motion.button>
        <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 600, color: '#2f2218' }}>Customize the dish</span>
      </div>
      {/* Product name + price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px', borderBottom: '1px solid #eee' }}>
        <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218' }}>{cat.name}</span>
        <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218' }}>{formatRupiah(calcUnitPrice(cat, state))}</span>
      </div>
      {/* Scrollable content */}
      <div data-lenis-prevent style={{ flex: 1, overflowY: 'auto', padding: '0 20px 120px' }}>
        <CustomizeOptions cat={cat} state={state} onChange={onChange} txtPrice={txtPrice} />
      </div>
      {/* Sticky bottom bar */}
      <div style={{ flexShrink: 0, padding: '14px 20px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', color: '#666' }}>Item quantity</span>
          <QuantitySelector value={state.quantity} onChange={(q) => onChange({ ...state, quantity: q })} />
        </div>
        <motion.button whileTap={canAdd ? { scale: 0.97 } : undefined} onClick={canAdd ? onAddToCart : undefined} disabled={!canAdd}
          style={{ width: '100%', padding: '14px', fontSize: '15px', fontFamily: 'Effra Trial Bold', fontWeight: 600, color: '#fff', background: canAdd ? '#4e3b31' : '#a09488', borderRadius: '24px', border: 'none', cursor: canAdd ? 'pointer' : 'not-allowed', opacity: canAdd ? 1 : 0.7 }}>
          Add to cart - {formatRupiah(total)}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ======== SECTION HEADER ======== */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ padding: '16px 0 8px' }}>
      <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 700, color: '#2f2218' }}>{title}</div>
      {subtitle && <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#999', marginTop: '2px' }}>{subtitle}</div>}
    </div>
  );
}

/* ======== RADIO ROW ======== */
function RadioRow({ label, price, selected, onClick, isLast }: { label: string; price?: string; selected: boolean; onClick: () => void; isLast?: boolean }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: isLast ? 'none' : '1px dotted #e0d5c4', cursor: 'pointer' }}>
      <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#2f2218' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {price && <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', color: '#666' }}>{price}</span>}
        <div style={{ width: '22px', height: '22px', borderRadius: '4px', border: selected ? '2px solid #4e3b31' : '2px solid #ccc', background: selected ? '#4e3b31' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          {selected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
      </div>
    </div>
  );
}

/* ======== SHARED CUSTOMIZE OPTIONS ======== */
function CustomizeOptions({ cat, state, onChange, txtPrice }: { cat: OrderingCategory; state: CustomizeState; onChange: (s: CustomizeState) => void; txtPrice: number }) {
  return (
    <>
      {cat.sizes.length > 0 && (
        <div>
          <SectionHeader title={`Size for ${cat.name}`} subtitle={`Required · Select 1`} />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.sizes.map((sz, i) => (
              <RadioRow key={sz.label} label={sz.label} price={formatRupiah(sz.price)} selected={state.selectedSize === sz.label} onClick={() => onChange({ ...state, selectedSize: sz.label })} isLast={i === cat.sizes.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.addons.length > 0 && (
        <div>
          <SectionHeader title="Rum" subtitle="Required · Select 1" />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.addons.map((ad, i) => (
              <RadioRow key={ad.label} label={ad.label} price={ad.price > 0 ? `+${formatRupiah(ad.price)}` : 'Free'} selected={state.selectedAddon === ad.label} onClick={() => onChange({ ...state, selectedAddon: ad.label })} isLast={i === cat.addons.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.dustingOptions.length > 0 && (
        <div>
          <SectionHeader title="Cake Dusting" subtitle="Required · Select 1" />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.dustingOptions.map((opt, i) => (
              <RadioRow key={opt} label={opt} price="Free" selected={state.selectedDusting === opt} onClick={() => onChange({ ...state, selectedDusting: opt })} isLast={i === cat.dustingOptions.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.toppers.length > 0 && (
        <div>
          <SectionHeader title="Cake Topper" subtitle="Required · Select 1" />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.toppers.map((tp, i) => (
              <RadioRow key={tp.label} label={tp.label} price={tp.price > 0 ? `+${formatRupiah(tp.price)}` : 'Free'} selected={state.selectedTopper === tp.label} onClick={() => onChange({ ...state, selectedTopper: tp.label })} isLast={i === cat.toppers.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.hasCustomText && (
        <div>
          <SectionHeader title="Custom Text" subtitle={`Optional · ${formatRupiah(cat.customTextPricePerChar)} per character (white chocolate)`} />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            <CustomTextCheckbox
              checked={state.wantsCustomText}
              onToggle={() => onChange({ ...state, wantsCustomText: !state.wantsCustomText, customText: state.wantsCustomText ? '' : state.customText })}
            />
          </div>
          <AnimatePresence initial={false}>
            {state.wantsCustomText && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginTop: '12px' }}>
                <textarea
                  placeholder="JESSICA"
                  value={state.customText}
                  maxLength={CUSTOM_TEXT_MAX}
                  onChange={(e) => onChange({ ...state, customText: e.target.value.toUpperCase().slice(0, CUSTOM_TEXT_MAX) })}
                  rows={2}
                  style={{ width: '100%', padding: '12px', fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#2f2218', background: '#f5f5f5', border: '1px solid #e8dcc6', borderRadius: '10px', resize: 'none', boxSizing: 'border-box', outline: 'none', textTransform: 'uppercase' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: state.customText.trim().length === 0 ? '#c0392b' : '#999' }}>
                    {state.customText.trim().length === 0 ? 'Please enter your custom text' : ' '}
                  </span>
                  <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#999' }}>{state.customText.length}/{CUSTOM_TEXT_MAX}</span>
                </div>
                {state.customText.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', marginTop: '4px' }}>
                    <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#5a4a3a' }}>{state.customText.length} character{state.customText.length === 1 ? '' : 's'} × {formatRupiah(cat.customTextPricePerChar)}</span>
                    <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#e8954e', fontWeight: 600 }}>{formatRupiah(txtPrice)}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      <div>
        <SectionHeader title="Notes" subtitle="Optional" />
        <div style={{ borderTop: '1px solid #e8dcc6', paddingTop: '12px' }}>
          <textarea placeholder="Write special requests here" value={state.notes} maxLength={NOTES_MAX} onChange={(e) => onChange({ ...state, notes: e.target.value.slice(0, NOTES_MAX) })} rows={3} style={{ width: '100%', padding: '12px', fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#2f2218', background: '#f5f5f5', border: '1px solid #e8dcc6', borderRadius: '10px', resize: 'none', boxSizing: 'border-box', outline: 'none' }} />
          <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#999', marginTop: '4px', textAlign: 'right' }}>{state.notes.length}/{NOTES_MAX}</div>
        </div>
      </div>
    </>
  );
}

function CustomTextCheckbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 0', cursor: 'pointer', userSelect: 'none' }}>
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#2f2218' }}>Yes, add custom text on the cake</span>
      <span aria-hidden="true" style={{
        width: '22px', height: '22px', borderRadius: '4px', flexShrink: 0,
        border: `2px solid ${checked ? '#4e3b31' : '#ccc'}`,
        background: checked ? '#4e3b31' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}>
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </span>
    </label>
  );
}

