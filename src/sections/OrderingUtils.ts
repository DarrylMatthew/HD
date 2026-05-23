import type { OrderingCategory } from '../config';

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

export function buildWhatsAppMessage(cart: CartItem[], total: number): string {
  let msg = 'Halo Hangri Dessert! Saya ingin memesan:\n\n';
  cart.forEach((item, i) => {
    msg += `*${i + 1}. ${item.category.name}*\n`;
    if (item.selectedSize) msg += `-\u00A0Size: ${item.selectedSize}\n`;
    if (item.selectedAddon) msg += `-\u00A0Rum: ${item.selectedAddon}\n`;
    if (item.selectedDusting) msg += `-\u00A0Dusting: ${item.selectedDusting}\n`;
    if (item.selectedTopper) {
      const tp = item.category.toppers.find((x) => x.label === item.selectedTopper);
      msg += `-\u00A0Topper: ${item.selectedTopper}${tp && tp.price > 0 ? ` (+${formatRupiah(tp.price)})` : ''}\n`;
    }
    if (item.wantsCustomText && item.customText) {
      const cc = item.customText.length;
      const tp = cc * item.category.customTextPricePerChar;
      msg += `-\u00A0Custom Text: "${item.customText}" (${cc} character${cc === 1 ? '' : 's'} x ${formatRupiah(item.category.customTextPricePerChar)} = ${formatRupiah(tp)})\n`;
    }
    if (item.notes) msg += `-\u00A0Notes: ${item.notes}\n`;
    if (item.quantity > 1) msg += `-\u00A0Qty: ${item.quantity}\n`;
    msg += `-\u00A0Subtotal: ${formatRupiah(item.totalPrice)}\n\n`;
  });
  msg += `*Grand Total: ${formatRupiah(total)}*`;
  return msg;
}
