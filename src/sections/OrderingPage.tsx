import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { orderingPageConfig } from '../config';
import type { OrderingCategory } from '../config';
import { ShoppingBag, X, MessageCircle, Type, Sparkles, ChevronRight, Clock } from 'lucide-react';
import { getLenis } from '../hooks/useLenis';

// ======== PRICE FORMATTING ========
function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

// ======== MODAL STATE ========
interface ModalState {
  selectedSize: string;
  selectedAddon: string;
  selectedDusting: string;
  customText: string;
}

function getInitialModalState(category: OrderingCategory): ModalState {
  return {
    selectedSize: category.sizes.length > 0 ? category.sizes[0].label : '',
    selectedAddon: category.addons.length > 0 ? category.addons[0].label : '',
    selectedDusting: category.dustingOptions.length > 0 ? category.dustingOptions[0] : '',
    customText: '',
  };
}

function calculateTotal(category: OrderingCategory, state: ModalState): number {
  let total = 0;
  // Base price from size
  const sizeOption = category.sizes.find((s) => s.label === state.selectedSize);
  if (sizeOption) total += sizeOption.price;
  // Addon price
  const addonOption = category.addons.find((a) => a.label === state.selectedAddon);
  if (addonOption) total += addonOption.price;
  // Custom text price
  if (category.hasCustomText && state.customText.length > 0) {
    total += state.customText.length * category.customTextPricePerChar;
  }
  return total;
}

// ======== MAIN COMPONENT ========
export default function OrderingPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState<OrderingCategory | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    selectedSize: '',
    selectedAddon: '',
    selectedDusting: '',
    customText: '',
  });

  const openModal = useCallback((category: OrderingCategory) => {
    if (category.isTBD) return;
    setActiveCategory(category);
    setModalState(getInitialModalState(category));
  }, []);

  const closeModal = useCallback(() => {
    setActiveCategory(null);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    const lenis = getLenis();
    if (activeCategory) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [activeCategory]);

  const handleWhatsAppOrder = () => {
    if (!activeCategory) return;
    const total = calculateTotal(activeCategory, modalState);

    // You can customize the WhatsApp message format here:
    let message = `Halo Hangri Dessert! Saya ingin memesan:\n\n*${activeCategory.name}*`;
    
    if (modalState.selectedSize) message += `\n- Size: ${modalState.selectedSize}`;
    if (modalState.selectedAddon) message += `\n- Rum: ${modalState.selectedAddon}`;
    if (modalState.selectedDusting) message += `\n- Dusting: ${modalState.selectedDusting}`;
    
    if (activeCategory.hasCustomText && modalState.customText.length > 0) {
      const charCount = modalState.customText.length;
      const textPrice = charCount * activeCategory.customTextPricePerChar;
      message += `\n- Custom Text: "${modalState.customText}" (${charCount} huruf x ${formatRupiah(activeCategory.customTextPricePerChar)} = ${formatRupiah(textPrice)})`;
    }
    
    message += `\n\n*Total: ${formatRupiah(total)}*`;

    const phoneNumber = orderingPageConfig.whatsappNumber.replace(/\+/g, '');
    const encoded = encodeURIComponent(message);
    
    // Using api.whatsapp.com instead of wa.me avoids a known character corruption bug on WhatsApp Desktop for Windows
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encoded}`, '_blank');
  };

  return (
    <>
      <section
        id="ordering"
        ref={sectionRef}
        style={{
          padding: '120px 24px',
          position: 'relative',
          backgroundColor: '#f5ecd8',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', marginBottom: '72px' }}
          >
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#e8954e',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              {orderingPageConfig.sectionLabel}
            </span>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 300,
                color: '#2f2218',
                margin: '0 0 16px',
              }}
            >
              {orderingPageConfig.title}
            </h2>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '16px',
                lineHeight: 1.7,
                color: '#5a4a3a',
                maxWidth: '520px',
                margin: '0 auto',
              }}
            >
              {orderingPageConfig.subtitle}
            </p>
          </motion.div>

          {/* Product Card Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '32px',
            }}
          >
            {orderingPageConfig.categories.map((category, index) => (
              <ProductCard
                key={category.id}
                category={category}
                index={index}
                isInView={isInView}
                onOrder={openModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Order Modal */}
      <AnimatePresence>
        {activeCategory && (
          <OrderModal
            category={activeCategory}
            state={modalState}
            onChange={setModalState}
            onClose={closeModal}
            onSubmit={handleWhatsAppOrder}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ======== PRODUCT CARD ========
function ProductCard({
  category,
  index,
  isInView,
  onOrder,
}: {
  category: OrderingCategory;
  index: number;
  isInView: boolean;
  onOrder: (c: OrderingCategory) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="organic-card"
      style={{
        background: '#fffdf7',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: category.isTBD ? 'default' : 'pointer',
        position: 'relative',
      }}
      onClick={() => onOrder(category)}
      whileHover={category.isTBD ? {} : { y: -6 }}
    >
      {/* TBD Badge */}
      {category.isTBD && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 2,
            background: 'rgba(47, 34, 24, 0.85)',
            color: '#fdf6e3',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Clock size={11} />
          Coming Soon
        </div>
      )}

      {/* Product Image */}
      <div
        style={{
          width: '100%',
          height: '240px',
          overflow: 'hidden',
          borderRadius: '2rem 0.5rem 0 0',
          position: 'relative',
        }}
      >
        <motion.img
          whileHover={category.isTBD ? {} : { scale: 1.08 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          src={category.image}
          alt={category.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: category.isTBD ? 'grayscale(30%) brightness(0.92)' : 'none',
            transition: 'filter 0.4s ease',
          }}
        />
        {/* Gradient overlay for TBD */}
        {category.isTBD && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(47,34,24,0.15) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Product Info */}
      <div
        style={{
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
        }}
      >
        <h3
          className="font-serif"
          style={{
            fontSize: '24px',
            fontWeight: 500,
            color: '#2f2218',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {category.name}
        </h3>

        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '13px',
            lineHeight: 1.7,
            color: '#5a4a3a',
            margin: 0,
            flex: 1,
          }}
        >
          {category.description}
        </p>

        {/* Price & CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '12px',
            borderTop: '1px solid #f0e6d3',
            marginTop: '4px',
          }}
        >
          {category.isTBD ? (
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '13px',
                fontStyle: 'italic',
                color: '#a09488',
              }}
            >
              Price TBD
            </span>
          ) : (
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '13px',
                color: '#5a4a3a',
              }}
            >
              Starting from{' '}
              <span
                className="font-script"
                style={{ fontSize: '20px', color: '#e8954e', fontWeight: 600 }}
              >
                {formatRupiah(category.startingPrice)}
              </span>
            </span>
          )}

          {!category.isTBD && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onOrder(category);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.5px',
                color: '#fdf6e3',
                background: 'linear-gradient(135deg, #4e3b31 0%, #2f2218 100%)',
                border: 'none',
                borderRadius: '2rem 0.3rem 2rem 0.3rem',
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(78, 59, 49, 0.25)',
                transition: 'box-shadow 0.3s',
              }}
            >
              <ShoppingBag size={14} />
              Order Now
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ======== ORDER MODAL ========
function OrderModal({
  category,
  state,
  onChange,
  onClose,
  onSubmit,
}: {
  category: OrderingCategory;
  state: ModalState;
  onChange: (s: ModalState) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const total = calculateTotal(category, state);
  const customTextPrice =
    category.hasCustomText && state.customText.length > 0
      ? state.customText.length * category.customTextPricePerChar
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(47, 34, 24, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        data-lenis-prevent
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#fffdf7',
          borderRadius: '2rem 0.5rem 2rem 0.5rem',
          boxShadow: '0 24px 80px rgba(47, 34, 24, 0.35)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(253, 246, 227, 0.9)',
            border: '1px solid rgba(216, 195, 165, 0.5)',
            color: '#4e3b31',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          <X size={18} />
        </motion.button>

        {/* Product Image Header */}
        <div
          style={{
            width: '100%',
            height: '220px',
            overflow: 'hidden',
            borderRadius: '2rem 0.5rem 0 0',
            position: 'relative',
          }}
        >
          <img
            src={category.image}
            alt={category.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(to top, #fffdf7 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Modal Content */}
        <div style={{ padding: '8px 32px 32px' }}>
          {/* Product Name */}
          <h3
            className="font-serif"
            style={{
              fontSize: '32px',
              fontWeight: 400,
              color: '#2f2218',
              margin: '0 0 24px',
              lineHeight: 1.2,
            }}
          >
            {category.name}
          </h3>

          {/* Customization Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Size Selector */}
            {category.sizes.length > 0 && (
              <OptionGroup label="Size">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {category.sizes.map((size) => (
                    <OptionPill
                      key={size.label}
                      label={`${size.label} — ${formatRupiah(size.price)}`}
                      selected={state.selectedSize === size.label}
                      onClick={() => onChange({ ...state, selectedSize: size.label })}
                    />
                  ))}
                </div>
              </OptionGroup>
            )}

            {/* Rum / Addon Selector */}
            {category.addons.length > 0 && (
              <OptionGroup label="Rum">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {category.addons.map((addon) => (
                    <OptionPill
                      key={addon.label}
                      label={
                        addon.price > 0
                          ? `${addon.label} (+${formatRupiah(addon.price)})`
                          : `${addon.label}`
                      }
                      selected={state.selectedAddon === addon.label}
                      onClick={() => onChange({ ...state, selectedAddon: addon.label })}
                    />
                  ))}
                </div>
              </OptionGroup>
            )}

            {/* Dusting Selector */}
            {category.dustingOptions.length > 0 && (
              <OptionGroup label="Cake Dusting">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {category.dustingOptions.map((opt) => (
                    <OptionPill
                      key={opt}
                      label={opt}
                      selected={state.selectedDusting === opt}
                      onClick={() => onChange({ ...state, selectedDusting: opt })}
                    />
                  ))}
                </div>
              </OptionGroup>
            )}

            {/* Custom Text Input */}
            {category.hasCustomText && (
              <OptionGroup label="Custom Text">
                <div style={{ position: 'relative' }}>
                  <Type
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#a09488',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="e.g. SELAMAT ULANG TAHUN"
                    value={state.customText}
                    onChange={(e) => onChange({ ...state, customText: e.target.value })}
                    className="input-warm"
                    style={{
                      paddingLeft: '44px',
                    }}
                  />
                </div>
                {/* Live character count & price */}
                <AnimatePresence>
                  {state.customText.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        marginTop: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: '#fdf6e3',
                        borderRadius: '8px',
                        border: '1px solid #f0e6d3',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '12px',
                          color: '#5a4a3a',
                        }}
                      >
                        {state.customText.length} huruf × {formatRupiah(category.customTextPricePerChar)}
                      </span>
                      <span
                        className="font-script"
                        style={{ fontSize: '18px', color: '#e8954e', fontWeight: 600 }}
                      >
                        {formatRupiah(customTextPrice)}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </OptionGroup>
            )}

            {/* Divider */}
            <div style={{ height: '1px', background: '#f0e6d3', margin: '4px 0' }} />

            {/* Live Price Total */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(232,149,78,0.08) 0%, rgba(232,149,78,0.03) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(232, 149, 78, 0.2)',
              }}
            >
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#2f2218',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                Total
              </span>
              <motion.span
                key={total}
                initial={{ scale: 1.15, color: '#e8954e' }}
                animate={{ scale: 1, color: '#2f2218' }}
                transition={{ duration: 0.3 }}
                className="font-serif"
                style={{
                  fontSize: '28px',
                  fontWeight: 500,
                }}
              >
                {formatRupiah(total)}
              </motion.span>
            </div>

            {/* WhatsApp Order Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSubmit}
              className="font-script"
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '22px',
                color: '#ffffff',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                borderRadius: '2rem 0.5rem 2rem 0.5rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
                transition: 'box-shadow 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <MessageCircle size={22} />
              Order via WhatsApp
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======== REUSABLE UI COMPONENTS ========

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: '#e8954e',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <Sparkles size={13} />
        {label}
      </label>
      {children}
    </div>
  );
}

function OptionPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        padding: '10px 18px',
        borderRadius: '12px',
        border: selected ? '2px solid #e8954e' : '2px solid #f0e6d3',
        background: selected ? '#fdf6e3' : '#fffdf7',
        cursor: 'pointer',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '13px',
        fontWeight: selected ? 600 : 400,
        color: selected ? '#2f2218' : '#5a4a3a',
        transition: 'all 0.25s ease',
        boxShadow: selected ? '0 2px 8px rgba(232, 149, 78, 0.15)' : 'none',
      }}
    >
      {label}
    </motion.button>
  );
}
