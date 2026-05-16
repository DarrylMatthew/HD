import type { OrderingCategory } from '../config';

export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export interface CustomizeState {
  selectedSize: string;
  selectedAddon: string;
  selectedDusting: string;
  customText: string;
  quantity: number;
}

export interface CartItem {
  id: string;
  category: OrderingCategory;
  selectedSize: string;
  selectedAddon: string;
  selectedDusting: string;
  customText: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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
    customText: '',
    quantity: 1,
  };
}

export function calcUnitPrice(cat: OrderingCategory, s: CustomizeState): number {
  let t = 0;
  const sz = cat.sizes.find((x) => x.label === s.selectedSize);
  if (sz) t += sz.price;
  const ad = cat.addons.find((x) => x.label === s.selectedAddon);
  if (ad) t += ad.price;
  if (cat.hasCustomText && s.customText.length > 0) {
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
    if (item.customText) {
      const cc = item.customText.length;
      const tp = cc * item.category.customTextPricePerChar;
      msg += `-\u00A0Custom Text: "${item.customText}" (${cc} huruf x ${formatRupiah(item.category.customTextPricePerChar)} = ${formatRupiah(tp)})\n`;
    }
    if (item.quantity > 1) msg += `-\u00A0Qty: ${item.quantity}\n`;
    msg += `-\u00A0Subtotal: ${formatRupiah(item.totalPrice)}\n\n`;
  });
  msg += `*Grand Total: ${formatRupiah(total)}*`;
  return msg;
}
