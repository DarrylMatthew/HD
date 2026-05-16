import { motion } from 'framer-motion';
import { Sparkles, Plus, Minus, ShoppingCart, Trash2, MessageCircle, ChevronRight, X } from 'lucide-react';
import type { CartItem } from './OrderingUtils';
import { formatRupiah } from './OrderingUtils';

export function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#e8954e', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Sparkles size={13} />{label}
      </label>
      {children}
    </div>
  );
}

export function OptionPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} style={{ padding: '10px 18px', borderRadius: '12px', border: selected ? '2px solid #e8954e' : '2px solid #f0e6d3', background: selected ? '#fdf6e3' : '#fffdf7', cursor: 'pointer', fontFamily: 'Effra Trial Bold', fontSize: '13px', fontWeight: selected ? 600 : 400, color: selected ? '#2f2218' : '#5a4a3a', transition: 'all 0.25s ease', boxShadow: selected ? '0 2px 8px rgba(232,149,78,0.15)' : 'none' }}>
      {label}
    </motion.button>
  );
}

export function QuantitySelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => onChange(Math.max(1, value - 1))} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #f0e6d3', background: '#fffdf7', color: value > 1 ? '#2f2218' : '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: value > 1 ? 'pointer' : 'default' }}>
        <Minus size={16} />
      </motion.button>
      <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '18px', fontWeight: 600, color: '#2f2218', minWidth: '24px', textAlign: 'center' }}>{value}</span>
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => onChange(value + 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#e8954e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <Plus size={16} />
      </motion.button>
    </div>
  );
}

export function CartFAB({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={onClick} style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 900, width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #4e3b31, #2f2218)', color: '#fdf6e3', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(47,34,24,0.4)' }}>
      <ShoppingCart size={24} />
      <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#e8954e', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Effra Trial Bold' }}>{count}</span>
    </motion.button>
  );
}

export function CartReview({ cart, onRemove, onClose, onSubmit, total }: { cart: CartItem[]; onRemove: (id: string) => void; onClose: () => void; onSubmit: () => void; total: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(47,34,24,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <motion.div data-lenis-prevent initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '560px', maxHeight: '80vh', background: '#fffdf7', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0e6d3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Effra Trial Bold', fontSize: '20px', color: '#2f2218', margin: 0 }}>Your Cart</h3>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a4a3a' }}><X size={20} /></motion.button>
        </div>
        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#a09488', textAlign: 'center', padding: '40px 0' }}>Your cart is empty</p>
          ) : cart.map((item) => (
            <div key={item.id} style={{ padding: '16px 0', borderBottom: '1px solid #f0e6d3', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <img src={item.category.image} alt={item.category.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', fontWeight: 600, color: '#2f2218' }}>{item.category.name} × {item.quantity}</div>
                <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#5a4a3a', marginTop: '2px' }}>
                  {[item.selectedSize, item.selectedAddon, item.selectedDusting].filter(Boolean).join(' · ')}
                  {item.customText && ` · "${item.customText}"`}
                </div>
                <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#e8954e', fontWeight: 600, marginTop: '4px' }}>{formatRupiah(item.totalPrice)}</div>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a09488', padding: '4px' }}><Trash2 size={16} /></motion.button>
            </div>
          ))}
        </div>
        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f0e6d3' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', fontWeight: 600, color: '#2f2218' }}>Grand Total</span>
              <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '22px', fontWeight: 600, color: '#2f2218' }}>{formatRupiah(total)}</span>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onSubmit} style={{ width: '100%', padding: '16px', fontSize: '16px', fontFamily: 'Effra Trial Bold', fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #25D366, #128C7E)', borderRadius: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(37,211,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <MessageCircle size={20} />Order via WhatsApp<ChevronRight size={16} />
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
