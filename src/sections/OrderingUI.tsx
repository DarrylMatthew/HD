import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Minus, ShoppingCart, Trash2, MessageCircle, ChevronRight, X, MapPin, User, Calendar, Clock, Check } from 'lucide-react';
import type { CartItem, CheckoutDetails } from './OrderingUtils';
import { formatRupiah, todayISODate, CUSTOMER_NAME_MAX, PICKUP_LEAD_MINUTES, isPickupTimeValid, minTimeForDate } from './OrderingUtils';
import type { PickupLocation } from '../config';
import { useIsMobile } from '../hooks/use-mobile';

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

export function CartBar({ count, total, onClick }: { count: number; total: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 250 }}
      style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', zIndex: 900 }}
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        style={{
          width: '100%', padding: '14px 20px',
          background: '#4e3b31', color: '#fff',
          borderRadius: '24px', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 600,
          boxShadow: '0 6px 20px rgba(47,34,24,0.35)',
        }}
      >
        <span>{count} item{count === 1 ? '' : 's'}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingCart size={18} />
          {formatRupiah(total)}
        </span>
      </motion.button>
    </motion.div>
  );
}

export function CartReview({
  cart, onRemove, onClose, onSubmit, total,
  checkout, onCheckoutChange, isReadyToOrder, pickupLocations,
}: {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  total: number;
  checkout: CheckoutDetails;
  onCheckoutChange: (d: CheckoutDetails) => void;
  isReadyToOrder: boolean;
  pickupLocations: PickupLocation[];
}) {
  const isMobile = useIsMobile();
  // Re-evaluate the time constraint every 30s so a user who picks a valid
  // time and then lingers doesn't sneak through after the 5-min window passes.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const minDate = todayISODate();
  const nameMissing = checkout.customerName.trim().length === 0;
  const locMissing = checkout.pickupLocationId.length === 0;
  const dateMissing = checkout.pickupDate.length === 0;
  const timeMissing = checkout.pickupTime.length === 0;
  const timeTooSoon = !dateMissing && !timeMissing && !isPickupTimeValid(checkout);
  const hasItems = cart.length > 0;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(47,34,24,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <motion.div data-lenis-prevent initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: isMobile ? '100%' : '560px', height: isMobile ? '100dvh' : 'auto', maxHeight: isMobile ? '100dvh' : '88vh', background: '#fffdf7', borderRadius: isMobile ? '0' : '24px 24px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0e6d3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'Effra Trial Bold', fontSize: '20px', color: '#2f2218', margin: 0 }}>Checkout</h3>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a4a3a' }}><X size={20} /></motion.button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {hasItems && (
            <CheckoutDetailsSection
              checkout={checkout}
              onChange={onCheckoutChange}
              pickupLocations={pickupLocations}
              minDate={minDate}
              minTime={minTimeForDate(checkout.pickupDate)}
              isMobile={isMobile}
            />
          )}

          {/* Items */}
          <div style={{ padding: '8px 24px 16px' }}>
            {hasItems && (
              <SectionLabel>Your Order</SectionLabel>
            )}
            {!hasItems ? (
              <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#a09488', textAlign: 'center', padding: '40px 0' }}>Your cart is empty</p>
            ) : cart.map((item) => (
              <div key={item.id} style={{ padding: '16px 0', borderBottom: '1px solid #f0e6d3', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <img src={item.category.image} alt={item.category.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', fontWeight: 600, color: '#2f2218' }}>{item.category.name} × {item.quantity}</div>
                  <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#5a4a3a', marginTop: '2px' }}>
                    {[item.selectedSize, item.selectedAddon, item.selectedDusting, item.selectedTopper].filter(Boolean).join(' · ')}
                    {item.wantsCustomText && item.customText && ` · "${item.customText}"`}
                  </div>
                  {item.notes && (
                    <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', color: '#a09488', marginTop: '2px', fontStyle: 'italic' }}>Note: {item.notes}</div>
                  )}
                  <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#e8954e', fontWeight: 600, marginTop: '4px' }}>{formatRupiah(item.totalPrice)}</div>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a09488', padding: '4px' }}><Trash2 size={16} /></motion.button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {hasItems && (
          <div style={{ padding: '16px 24px', paddingBottom: `calc(16px + env(safe-area-inset-bottom))`, borderTop: '1px solid #f0e6d3', flexShrink: 0, background: '#fffdf7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', fontWeight: 600, color: '#2f2218' }}>Grand Total</span>
              <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '22px', fontWeight: 600, color: '#2f2218' }}>{formatRupiah(total)}</span>
            </div>
            {!isReadyToOrder && (
              <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#c0392b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {(() => {
                  const missing = [nameMissing && 'name', locMissing && 'pickup location', dateMissing && 'date', timeMissing && 'time'].filter(Boolean);
                  if (missing.length > 0) return `Please complete: ${missing.join(', ')}`;
                  if (timeTooSoon) return `Pickup time must be at least ${PICKUP_LEAD_MINUTES} minutes from now`;
                  return null;
                })()}
              </div>
            )}
            <motion.button
              whileHover={isReadyToOrder ? { scale: 1.02 } : undefined}
              whileTap={isReadyToOrder ? { scale: 0.98 } : undefined}
              onClick={isReadyToOrder ? onSubmit : undefined}
              disabled={!isReadyToOrder}
              style={{
                width: '100%', padding: '16px', fontSize: '16px',
                fontFamily: 'Effra Trial Bold', fontWeight: 600, color: '#fff',
                background: isReadyToOrder
                  ? 'linear-gradient(135deg, #25D366, #128C7E)'
                  : '#c4b9a8',
                borderRadius: '16px', border: 'none',
                cursor: isReadyToOrder ? 'pointer' : 'not-allowed',
                boxShadow: isReadyToOrder ? '0 4px 20px rgba(37,211,102,0.3)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                opacity: isReadyToOrder ? 1 : 0.85,
                transition: 'background 0.2s ease',
              }}>
              <MessageCircle size={20} />Order via WhatsApp<ChevronRight size={16} />
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#e8954e', marginBottom: '8px' }}>
      {children}
    </div>
  );
}

function FieldLabel({ icon, children, required }: { icon: React.ReactNode; children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Effra Trial Bold', fontSize: '13px', fontWeight: 600, color: '#2f2218', marginBottom: '8px' }}>
      <span style={{ color: '#5a4a3a', display: 'flex' }}>{icon}</span>
      {children}
      {required && <span style={{ color: '#e8954e' }}>*</span>}
    </label>
  );
}

const baseInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  fontFamily: 'Effra Trial Bold',
  fontSize: '14px',
  color: '#2f2218',
  background: '#fff',
  border: '1.5px solid #e8dcc6',
  borderRadius: '12px',
  outline: 'none',
  boxSizing: 'border-box',
};

function CheckoutDetailsSection({
  checkout, onChange, pickupLocations, minDate, minTime, isMobile,
}: {
  checkout: CheckoutDetails;
  onChange: (d: CheckoutDetails) => void;
  pickupLocations: PickupLocation[];
  minDate: string;
  minTime: string;
  isMobile: boolean;
}) {
  return (
    <div style={{ padding: '20px 24px 8px', borderBottom: '1px solid #f0e6d3', background: '#fdf6e3' }}>
      <SectionLabel>Pickup Details</SectionLabel>

      {/* Name */}
      <div style={{ marginBottom: '16px' }}>
        <FieldLabel icon={<User size={14} />} required>Your name</FieldLabel>
        <input
          type="text"
          placeholder="e.g. Jessica"
          value={checkout.customerName}
          maxLength={CUSTOMER_NAME_MAX}
          onChange={(e) => onChange({ ...checkout, customerName: e.target.value.slice(0, CUSTOMER_NAME_MAX) })}
          style={baseInputStyle}
        />
      </div>

      {/* Location cards */}
      <div style={{ marginBottom: '16px' }}>
        <FieldLabel icon={<MapPin size={14} />} required>Pick up location</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
          {pickupLocations.map((loc) => {
            const selected = checkout.pickupLocationId === loc.id;
            return (
              <motion.button
                key={loc.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange({ ...checkout, pickupLocationId: loc.id })}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  background: selected ? '#fffdf7' : '#fff',
                  border: selected ? '2px solid #4e3b31' : '1.5px solid #e8dcc6',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  border: selected ? '6px solid #4e3b31' : '2px solid #ccc',
                  background: '#fff', flexShrink: 0, marginTop: '2px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border 0.2s ease',
                }}>
                  {selected && <Check size={10} color="#4e3b31" strokeWidth={0} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', fontWeight: 600, color: '#2f2218', marginBottom: '2px' }}>{loc.name}</div>
                  <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#5a4a3a', lineHeight: 1.45 }}>{loc.address}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Date & Time */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '4px' }}>
        <div>
          <FieldLabel icon={<Calendar size={14} />} required>Date</FieldLabel>
          <input
            type="date"
            min={minDate}
            value={checkout.pickupDate}
            onChange={(e) => onChange({ ...checkout, pickupDate: e.target.value })}
            style={baseInputStyle}
          />
        </div>
        <div>
          <FieldLabel icon={<Clock size={14} />} required>Time</FieldLabel>
          <input
            type="time"
            min={minTime || undefined}
            value={checkout.pickupTime}
            onChange={(e) => onChange({ ...checkout, pickupTime: e.target.value })}
            style={baseInputStyle}
          />
          {minTime && (
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', color: '#5a4a3a', marginTop: '6px' }}>
              Earliest pickup today: {minTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
