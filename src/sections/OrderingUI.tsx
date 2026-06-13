import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Minus, ShoppingCart, Trash2, MessageCircle, ChevronRight, X, MapPin, User, Calendar, Clock, Check, ArrowLeft, Pencil } from 'lucide-react';
import type { CartItem, CheckoutDetails, HoursSchedule, DayHours, CustomizeState } from './OrderingUtils';
import { formatRupiah, todayISODate, CUSTOMER_NAME_MAX, isPickupTimeValid, getAvailableTimeSlots, resolveDayHours, formatTimeLabel, calcUnitPrice, isCustomizeValid, CUSTOM_TEXT_MAX, NOTES_MAX, handleImgError } from './OrderingUtils';
import type { OrderingCategory, PickupLocation } from '../config';
import { useIsMobile } from '../hooks/use-mobile';
import { useScrollLock } from '../hooks/useScrollLock';

/* ======== MOBILE ITEM DETAIL POPUP (bottom sheet) ======== */
export function MobilePreviewSheet({ cat, onClose, onAdd }: { cat: OrderingCategory; onClose: () => void; onAdd: (c: OrderingCategory) => void }) {
  useScrollLock();
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
          {cat.isTBD ? 'Coming Soon' : `${cat.sizes.length > 0 && !cat.hideFromPrefix ? 'From ' : ''}${formatRupiah(cat.startingPrice)}`}
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
  cart, onRemove, onEdit, onClose, onSubmit, total,
  checkout, onCheckoutChange, isReadyToOrder, pickupLocations,
  hoursSchedule, hoursLoading,
}: {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onEdit: (item: CartItem) => void;
  onClose: () => void;
  onSubmit: () => void;
  total: number;
  checkout: CheckoutDetails;
  onCheckoutChange: (d: CheckoutDetails) => void;
  isReadyToOrder: boolean;
  pickupLocations: PickupLocation[];
  hoursSchedule: HoursSchedule | null;
  hoursLoading: boolean;
}) {
  const isMobile = useIsMobile();
  useScrollLock();
  // Re-evaluate the time constraint every 30s so a user who picks a valid
  // time and then lingers doesn't sneak through after the 5-min window passes.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const minDate = todayISODate();
  const selectedLoc = pickupLocations.find((l) => l.id === checkout.pickupLocationId);
  const dayHours = resolveDayHours(selectedLoc, checkout.pickupDate, hoursSchedule);
  const nameMissing = checkout.customerName.trim().length === 0;
  const locMissing = checkout.pickupLocationId.length === 0;
  const dateMissing = checkout.pickupDate.length === 0;
  const timeMissing = checkout.pickupTime.length === 0;
  const timeInvalid = !dateMissing && !timeMissing && !isPickupTimeValid(checkout, dayHours);
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
              isMobile={isMobile}
              dayHours={dayHours}
              hoursLoading={hoursLoading}
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
                <img src={item.category.image} alt={item.category.name} onError={handleImgError(item.category.imageFallback)} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', fontWeight: 600, color: '#2f2218' }}>{item.category.name} × {item.quantity}</div>
                  <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#5a4a3a', marginTop: '2px' }}>
                    {[item.selectedSize, item.selectedAddon, item.selectedSauce, item.selectedDusting, item.selectedTopper, ...item.selectedExtras].filter(Boolean).join(' · ')}
                    {item.wantsCustomText && item.customText && ` · "${item.customText}"`}
                  </div>
                  {item.notes && (
                    <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', color: '#a09488', marginTop: '2px', fontStyle: 'italic' }}>Note: {item.notes}</div>
                  )}
                  <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#e8954e', fontWeight: 600, marginTop: '4px' }}>{formatRupiah(item.totalPrice)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => onEdit(item)} aria-label="Edit item" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e8954e', padding: '4px' }}><Pencil size={16} /></motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => onRemove(item.id)} aria-label="Remove item" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a09488', padding: '4px' }}><Trash2 size={16} /></motion.button>
                </div>
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
                  if (timeInvalid) return `Please pick a time within the store's pickup hours`;
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
  checkout, onChange, pickupLocations, minDate, isMobile, dayHours, hoursLoading,
}: {
  checkout: CheckoutDetails;
  onChange: (d: CheckoutDetails) => void;
  pickupLocations: PickupLocation[];
  minDate: string;
  isMobile: boolean;
  dayHours: DayHours;
  hoursLoading: boolean;
}) {
  const slots = getAvailableTimeSlots(dayHours, checkout.pickupDate);
  const slotsKey = slots.join(',');
  const locDatePicked = !!checkout.pickupLocationId && !!checkout.pickupDate;
  // Store is closed that date when hours resolved to null despite a valid pick.
  const closedThatDate = locDatePicked && !hoursLoading && dayHours === null;

  // If the chosen store/date changes such that the previously picked time is no
  // longer an available slot, clear it so the stale value can't be submitted.
  useEffect(() => {
    if (checkout.pickupTime && !slots.includes(checkout.pickupTime)) {
      onChange({ ...checkout, pickupTime: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotsKey, checkout.pickupTime]);

  const timePlaceholder = !checkout.pickupLocationId
    ? 'Select a location first'
    : !checkout.pickupDate
      ? 'Select a date first'
      : hoursLoading
        ? 'Loading hours…'
        : closedThatDate
          ? 'Closed on this date'
          : slots.length === 0
            ? 'No pickup times available'
            : 'Select a time';

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
          <select
            value={checkout.pickupTime}
            disabled={slots.length === 0}
            onChange={(e) => onChange({ ...checkout, pickupTime: e.target.value })}
            style={{
              ...baseInputStyle,
              appearance: 'none',
              cursor: slots.length === 0 ? 'not-allowed' : 'pointer',
              opacity: slots.length === 0 ? 0.6 : 1,
              color: checkout.pickupTime ? '#2f2218' : '#a09488',
            }}
          >
            <option value="">{timePlaceholder}</option>
            {slots.map((s) => (
              <option key={s} value={s} style={{ color: '#2f2218' }}>{s}</option>
            ))}
          </select>
          {locDatePicked && (
            <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', color: closedThatDate ? '#c0392b' : '#5a4a3a', marginTop: '6px' }}>
              {hoursLoading
                ? 'Loading hours…'
                : dayHours
                  ? `Open ${formatTimeLabel(dayHours.open)}–${formatTimeLabel(dayHours.close)}`
                  : 'Closed on this date'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ======== SHARED CUSTOMIZE PANEL (GrabFood style) ========
   One implementation for the ordering page, the order grid, and the cart's
   edit-item flow: full-screen sheet on mobile, right-side drawer on desktop. */

export function CustomizePanel({
  cat, state, onChange, onClose, onSubmit, submitLabel = 'Add to cart', isMobile,
}: {
  cat: OrderingCategory;
  state: CustomizeState;
  onChange: (s: CustomizeState) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  isMobile: boolean;
}) {
  useScrollLock();
  const total = calcUnitPrice(cat, state) * state.quantity;
  const canAdd = isCustomizeValid(cat, state);

  // Fixed: just the close bar so the dish title is always dismissable.
  const topBar = (pad: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: `16px ${pad}`, borderBottom: '1px solid #eee', flexShrink: 0 }}>
      <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2f2218', display: 'flex' }}><ArrowLeft size={22} /></motion.button>
      <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 600, color: '#2f2218' }}>Customize the dish</span>
    </div>
  );

  // Scrollable: picture + name/price + description sit at the top of the scroll
  // area (not pinned), so the customization window is as tall as possible.
  const intro = (pad: string) => (
    <>
      {/* Product picture — full-bleed across the padded scroll area */}
      <div style={{ height: '200px', margin: `0 -${pad}`, overflow: 'hidden' }}>
        <img src={cat.image} alt={cat.name} onError={handleImgError(cat.imageFallback)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: cat.imagePosition ?? 'center center' }} />
      </div>
      <div style={{ padding: '16px 0', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218' }}>{cat.name}</span>
          <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', fontWeight: 700, color: '#2f2218', flexShrink: 0 }}>{formatRupiah(calcUnitPrice(cat, state))}</span>
        </div>
        {/* Product description */}
        {cat.description && (
          <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', lineHeight: 1.6, color: '#5a4a3a', margin: '8px 0 0' }}>{cat.description}</p>
        )}
      </div>
    </>
  );

  const footer = (pad: string) => (
    <div style={{ flexShrink: 0, padding: `14px ${pad}`, borderTop: '1px solid #eee', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', color: '#666' }}>Item quantity</span>
        <QuantitySelector value={state.quantity} onChange={(q) => onChange({ ...state, quantity: q })} />
      </div>
      <motion.button whileTap={canAdd ? { scale: 0.97 } : undefined} onClick={canAdd ? onSubmit : undefined} disabled={!canAdd}
        style={{ width: '100%', padding: '14px', fontSize: '15px', fontFamily: 'Effra Trial Bold', fontWeight: 600, color: '#fff', background: canAdd ? '#4e3b31' : '#a09488', borderRadius: '24px', border: 'none', cursor: canAdd ? 'pointer' : 'not-allowed', opacity: canAdd ? 1 : 0.7 }}>
        {submitLabel} - {formatRupiah(total)}
      </motion.button>
    </div>
  );

  if (isMobile) {
    return (
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#fff', display: 'flex', flexDirection: 'column' }}>
        {topBar('20px')}
        <div data-lenis-prevent style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', padding: '0 20px 120px' }}>
          {intro('20px')}
          <CustomizeOptions cat={cat} state={state} onChange={onChange} />
        </div>
        {footer('20px')}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(47,34,24,0.5)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'flex-end' }}>
      <motion.div data-lenis-prevent initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()} style={{ width: '480px', maxWidth: '100vw', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        {topBar('24px')}
        <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '0 24px 120px' }}>
          {intro('24px')}
          <CustomizeOptions cat={cat} state={state} onChange={onChange} />
        </div>
        {footer('24px')}
      </motion.div>
    </motion.div>
  );
}

function CustomizeSectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ padding: '16px 0 8px' }}>
      <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', fontWeight: 700, color: '#2f2218' }}>{title}</div>
      {subtitle && <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#999', marginTop: '2px' }}>{subtitle}</div>}
    </div>
  );
}

function OptionRow({ label, price, selected, onClick, isLast }: { label: string; price?: string; selected: boolean; onClick: () => void; isLast?: boolean }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: isLast ? 'none' : '1px dotted #e0d5c4', cursor: 'pointer' }}>
      <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#2f2218' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {price && <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', color: '#666' }}>{price}</span>}
        <div style={{ width: '22px', height: '22px', borderRadius: '4px', border: selected ? '2px solid #4e3b31' : '2px solid #ccc', background: selected ? '#4e3b31' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          {selected && <Check size={14} color="#fff" strokeWidth={3} />}
        </div>
      </div>
    </div>
  );
}

export function CustomizeOptions({ cat, state, onChange }: { cat: OrderingCategory; state: CustomizeState; onChange: (s: CustomizeState) => void }) {
  const txtPrice = cat.hasCustomText && state.wantsCustomText && state.customText.length > 0 ? state.customText.length * cat.customTextPricePerChar : 0;
  const toggleExtra = (label: string) => {
    const selectedExtras = state.selectedExtras.includes(label)
      ? state.selectedExtras.filter((x) => x !== label)
      : [...state.selectedExtras, label];
    onChange({ ...state, selectedExtras });
  };
  return (
    <>
      {cat.sizes.length > 0 && (
        <div>
          <CustomizeSectionHeader title={`Size for ${cat.name}`} subtitle="Required · Select 1" />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.sizes.map((sz, i) => (
              <OptionRow key={sz.label} label={sz.label} price={formatRupiah(sz.price)} selected={state.selectedSize === sz.label} onClick={() => onChange({ ...state, selectedSize: sz.label })} isLast={i === cat.sizes.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.addons.length > 0 && (
        <div>
          <CustomizeSectionHeader title="Rum" subtitle="Required · Select 1" />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.addons.map((ad, i) => (
              <OptionRow key={ad.label} label={ad.label} price={ad.price > 0 ? `+${formatRupiah(ad.price)}` : 'Free'} selected={state.selectedAddon === ad.label} onClick={() => onChange({ ...state, selectedAddon: ad.label })} isLast={i === cat.addons.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.sauces.length > 0 && (
        <div>
          <CustomizeSectionHeader title="Sauce" subtitle="Required · Select 1" />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.sauces.map((sauce, i) => (
              <OptionRow key={sauce} label={sauce} price="Free" selected={state.selectedSauce === sauce} onClick={() => onChange({ ...state, selectedSauce: sauce })} isLast={i === cat.sauces.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.dustingOptions.length > 0 && (
        <div>
          <CustomizeSectionHeader title="Cake Dusting" subtitle="Required · Select 1" />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.dustingOptions.map((opt, i) => (
              <OptionRow key={opt} label={opt} price="Free" selected={state.selectedDusting === opt} onClick={() => onChange({ ...state, selectedDusting: opt })} isLast={i === cat.dustingOptions.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.toppers.length > 0 && (
        <div>
          <CustomizeSectionHeader title="Cake Topper" subtitle="Required · Select 1" />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.toppers.map((tp, i) => (
              <OptionRow key={tp.label} label={tp.label} price={tp.price > 0 ? `+${formatRupiah(tp.price)}` : 'Free'} selected={state.selectedTopper === tp.label} onClick={() => onChange({ ...state, selectedTopper: tp.label })} isLast={i === cat.toppers.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.extras.length > 0 && (
        <div>
          <CustomizeSectionHeader title="Add-ons" subtitle="Optional" />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            {cat.extras.map((ex, i) => (
              <OptionRow key={ex.label} label={ex.label} price={ex.price > 0 ? `+${formatRupiah(ex.price)}` : 'Free'} selected={state.selectedExtras.includes(ex.label)} onClick={() => toggleExtra(ex.label)} isLast={i === cat.extras.length - 1} />
            ))}
          </div>
        </div>
      )}
      {cat.hasCustomText && (
        <div>
          <CustomizeSectionHeader title="Custom Text" subtitle={`Optional · ${formatRupiah(cat.customTextPricePerChar)} per character (white chocolate)`} />
          <div style={{ borderTop: '1px solid #e8dcc6' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 0', cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={state.wantsCustomText} onChange={() => onChange({ ...state, wantsCustomText: !state.wantsCustomText, customText: state.wantsCustomText ? '' : state.customText })} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
              <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#2f2218' }}>Yes, add custom text on the cake</span>
              <span aria-hidden="true" style={{
                width: '22px', height: '22px', borderRadius: '4px', flexShrink: 0,
                border: `2px solid ${state.wantsCustomText ? '#4e3b31' : '#ccc'}`,
                background: state.wantsCustomText ? '#4e3b31' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}>
                {state.wantsCustomText && <Check size={14} color="#fff" strokeWidth={3} />}
              </span>
            </label>
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
                    {state.customText.trim().length === 0 ? 'Please enter your custom text' : ' '}
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
        <CustomizeSectionHeader title="Notes" subtitle="Optional" />
        <div style={{ borderTop: '1px solid #e8dcc6', paddingTop: '12px' }}>
          <textarea placeholder="Write special requests here" value={state.notes} maxLength={NOTES_MAX} onChange={(e) => onChange({ ...state, notes: e.target.value.slice(0, NOTES_MAX) })} rows={3} style={{ width: '100%', padding: '12px', fontFamily: 'Effra Trial Bold', fontSize: '14px', color: '#2f2218', background: '#f5f5f5', border: '1px solid #e8dcc6', borderRadius: '10px', resize: 'none', boxSizing: 'border-box', outline: 'none' }} />
          <div style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', color: '#999', marginTop: '4px', textAlign: 'right' }}>{state.notes.length}/{NOTES_MAX}</div>
        </div>
      </div>
    </>
  );
}
