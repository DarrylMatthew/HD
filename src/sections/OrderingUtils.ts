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

export function isCheckoutValid(d: CheckoutDetails): boolean {
  return (
    d.customerName.trim().length > 0 &&
    d.pickupLocationId.length > 0 &&
    d.pickupDate.length > 0 &&
    d.pickupTime.length > 0
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
