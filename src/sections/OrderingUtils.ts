import type { OrderingCategory, PickupLocation } from '../config';

export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export interface CustomizeState {
  selectedSize: string;
  selectedAddon: string;
  selectedDusting: string;
  selectedTopper: string;
  notes: string;
  wantsCustomText: boolean;
  customText: string;
  quantity: number;
}

export interface CartItem {
  id: string;
  category: OrderingCategory;
  selectedSize: string;
  selectedAddon: string;
  selectedDusting: string;
  selectedTopper: string;
  notes: string;
  wantsCustomText: boolean;
  customText: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const CUSTOM_TEXT_MAX = 30;
export const NOTES_MAX = 200;
export const CUSTOMER_NAME_MAX = 50;
export const PICKUP_LEAD_MINUTES = 5;
// Spacing between selectable pickup time slots, in minutes. Change here only.
export const SLOT_INTERVAL_MINUTES = 30;

export interface CheckoutDetails {
  customerName: string;
  pickupLocationId: string;
  pickupDate: string;
  pickupTime: string;
}

export const EMPTY_CHECKOUT: CheckoutDetails = {
  customerName: '',
  pickupLocationId: '',
  pickupDate: '',
  pickupTime: '',
};

// "HH:MM" <-> minutes-since-midnight helpers.
export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
  return h * 60 + m;
}
export function minutesToTime(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// All selectable pickup times for a store on a given date, spaced by
// SLOT_INTERVAL_MINUTES from openTime to closeTime (inclusive). For "today",
// slots earlier than now + PICKUP_LEAD_MINUTES are dropped. Returns [] when the
// location/date is missing or the store hours are invalid.
export function getAvailableTimeSlots(
  loc: PickupLocation | undefined,
  dateISO: string,
): string[] {
  if (!loc || !dateISO) return [];
  const open = timeToMinutes(loc.openTime);
  const close = timeToMinutes(loc.closeTime);
  if (Number.isNaN(open) || Number.isNaN(close) || close <= open) return [];

  let earliest = open;
  if (dateISO === todayISODate()) {
    const now = new Date();
    earliest = Math.max(earliest, now.getHours() * 60 + now.getMinutes() + PICKUP_LEAD_MINUTES);
  }

  const slots: string[] = [];
  for (let t = open; t <= close; t += SLOT_INTERVAL_MINUTES) {
    if (t >= earliest) slots.push(minutesToTime(t));
  }
  return slots;
}

// True if pickupDate+pickupTime are either not yet filled, OR the chosen time is
// one of the store's currently-available slots. When no location is supplied we
// fall back to the basic lead-time check.
export function isPickupTimeValid(d: CheckoutDetails, loc?: PickupLocation): boolean {
  if (!d.pickupDate || !d.pickupTime) return true;
  if (loc) return getAvailableTimeSlots(loc, d.pickupDate).includes(d.pickupTime);
  const dt = new Date(`${d.pickupDate}T${d.pickupTime}`);
  if (Number.isNaN(dt.getTime())) return false;
  return dt.getTime() >= Date.now() + PICKUP_LEAD_MINUTES * 60_000;
}

export function isCheckoutValid(d: CheckoutDetails, locations: PickupLocation[]): boolean {
  const loc = locations.find((l) => l.id === d.pickupLocationId);
  return (
    d.customerName.trim().length > 0 &&
    d.pickupLocationId.length > 0 &&
    d.pickupDate.length > 0 &&
    d.pickupTime.length > 0 &&
    isPickupTimeValid(d, loc)
  );
}

export function todayISODate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatPickupDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function isCustomizeValid(cat: OrderingCategory, s: CustomizeState): boolean {
  if (cat.hasCustomText && s.wantsCustomText && s.customText.trim().length === 0) return false;
  return true;
}

let _cartId = 0;
export function nextCartId(): string {
  return `cart-${++_cartId}`;
}

export function getInitialState(cat: OrderingCategory): CustomizeState {
  return {
    selectedSize: cat.sizes[0]?.label ?? '',
    selectedAddon: cat.addons[0]?.label ?? '',
    selectedDusting: cat.dustingOptions[0] ?? '',
    selectedTopper: cat.toppers[0]?.label ?? '',
    notes: '',
    wantsCustomText: false,
    customText: '',
    quantity: 1,
  };
}

export function calcUnitPrice(cat: OrderingCategory, s: CustomizeState): number {
  let t = 0;
  if (cat.sizes.length === 0) {
    t += cat.startingPrice;
  } else {
    const sz = cat.sizes.find((x) => x.label === s.selectedSize);
    if (sz) t += sz.price;
  }
  const ad = cat.addons.find((x) => x.label === s.selectedAddon);
  if (ad) t += ad.price;
  const tp = cat.toppers.find((x) => x.label === s.selectedTopper);
  if (tp) t += tp.price;
  if (cat.hasCustomText && s.wantsCustomText && s.customText.length > 0) {
    t += s.customText.length * cat.customTextPricePerChar;
  }
  return t;
}

export function buildWhatsAppMessage(
  cart: CartItem[],
  total: number,
  checkout: CheckoutDetails,
  locations: PickupLocation[],
): string {
  const loc = locations.find((l) => l.id === checkout.pickupLocationId);
  const name = checkout.customerName.trim();
  let msg = `Halo Hangri Dessert! Saya ${name} ingin memesan.\n\n`;
  msg += `--- DETAIL PICKUP ---\n\n`;
  msg += `Nama: ${name}\n`;
  if (loc) {
    msg += `Outlet: ${loc.name}\n`;
    msg += `Alamat outlet: ${loc.address}\n`;
    msg += `Google Maps: ${loc.mapsUrl}\n`;
  }
  msg += `Tanggal: ${formatPickupDate(checkout.pickupDate)}\n`;
  msg += `Jam: ${checkout.pickupTime}\n\n`;
  msg += `--- PESANAN ---\n\n`;
  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.category.name}\n`;
    if (item.selectedSize) msg += `   Size: ${item.selectedSize}\n`;
    if (item.selectedAddon) msg += `   Rum: ${item.selectedAddon}\n`;
    if (item.selectedDusting) msg += `   Dusting: ${item.selectedDusting}\n`;
    if (item.selectedTopper) {
      const tp = item.category.toppers.find((x) => x.label === item.selectedTopper);
      msg += `   Topper: ${item.selectedTopper}${tp && tp.price > 0 ? ` (+${formatRupiah(tp.price)})` : ''}\n`;
    }
    if (item.wantsCustomText && item.customText) {
      const cc = item.customText.length;
      const tp = cc * item.category.customTextPricePerChar;
      msg += `   Custom Text: "${item.customText}" (${cc} character${cc === 1 ? '' : 's'} x ${formatRupiah(item.category.customTextPricePerChar)} = ${formatRupiah(tp)})\n`;
    }
    if (item.notes) msg += `   Notes: ${item.notes}\n`;
    if (item.quantity > 1) msg += `   Qty: ${item.quantity}\n`;
    msg += `   Subtotal: ${formatRupiah(item.totalPrice)}\n\n`;
  });
  msg += `*GRAND TOTAL: ${formatRupiah(total)}*`;
  return msg;
}
