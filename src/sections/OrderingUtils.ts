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

// One store's hours for one date. `null` means closed / no hours posted.
export type DayHours = { open: string; close: string } | null;

// Per-date, per-store schedule loaded from the Google Sheet.
// Key = `${locationId}__${dateISO}`. A `null` value means explicitly closed.
// `null` for the whole schedule means "not loaded" (use config defaults).
export type HoursSchedule = Record<string, DayHours>;

export function hoursKey(locationId: string, dateISO: string): string {
  return `${locationId}__${dateISO}`;
}

// Effective hours for a store on a date (default-hours model):
//  - schedule loaded + row exists -> that row (a "closed" row resolves to null)
//  - schedule loaded + no row      -> the store's default openTime/closeTime
//  - schedule NOT loaded / failed   -> the store's default openTime/closeTime
// So the Sheet is only for EXCEPTIONS (special hours or closing a day); normal
// days fall back to the default hours and need no row.
export function resolveDayHours(
  loc: PickupLocation | undefined,
  dateISO: string,
  schedule: HoursSchedule | null,
): DayHours {
  if (!loc || !dateISO) return null;
  const fallback: DayHours =
    loc.openTime && loc.closeTime ? { open: loc.openTime, close: loc.closeTime } : null;
  if (schedule) {
    const key = hoursKey(loc.id, dateISO);
    return key in schedule ? schedule[key] : fallback;
  }
  return fallback;
}

// "HH:MM" <-> minutes-since-midnight helpers.
export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
  return h * 60 + m;
}
export function minutesToTime(total: number): string {
  const h = Math.floor(total / 60) % 24; // 1440 (24:00) wraps to "00:00"
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Display label for an "HH:MM" config value, normalizing "24:00" -> "00:00".
export function formatTimeLabel(hhmm: string): string {
  const min = timeToMinutes(hhmm);
  return Number.isNaN(min) ? hhmm : minutesToTime(min);
}

// All selectable pickup times for the given day's hours, spaced by
// SLOT_INTERVAL_MINUTES from open to close (inclusive). For "today", slots
// earlier than now + PICKUP_LEAD_MINUTES are dropped. Returns [] when the store
// is closed that date (hours === null) or the hours are invalid.
export function getAvailableTimeSlots(hours: DayHours, dateISO: string): string[] {
  if (!hours || !dateISO) return [];
  const open = timeToMinutes(hours.open);
  const close = timeToMinutes(hours.close);
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
// one of the store's available slots for that day's resolved hours.
export function isPickupTimeValid(d: CheckoutDetails, hours: DayHours): boolean {
  if (!d.pickupDate || !d.pickupTime) return true;
  return getAvailableTimeSlots(hours, d.pickupDate).includes(d.pickupTime);
}

export function isCheckoutValid(
  d: CheckoutDetails,
  locations: PickupLocation[],
  schedule: HoursSchedule | null,
): boolean {
  const loc = locations.find((l) => l.id === d.pickupLocationId);
  const hours = resolveDayHours(loc, d.pickupDate, schedule);
  return (
    d.customerName.trim().length > 0 &&
    d.pickupLocationId.length > 0 &&
    d.pickupDate.length > 0 &&
    d.pickupTime.length > 0 &&
    isPickupTimeValid(d, hours)
  );
}

// --- Google Sheet hours loading ---------------------------------------------

// Split one CSV line, honoring simple double-quoted fields.
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

// Parse the published Google Sheet CSV into an HoursSchedule.
// Columns (header row, case-insensitive): date, location, open, close
//  - date: YYYY-MM-DD
//  - location: must match a PickupLocation id (e.g. "bsd", "tambora")
//  - open/close: "HH:MM". If open is empty or "closed"/"tutup"/"libur"/"-", the
//    store is closed that date.
export function parseHoursCsv(csv: string): HoursSchedule {
  const schedule: HoursSchedule = {};
  const lines = csv.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) return schedule;

  let idx = { date: 0, location: 1, open: 2, close: 3 };
  let start = 0;
  const header = splitCsvLine(lines[0]).map((c) => c.trim().toLowerCase());
  if (header.includes('date') && header.includes('location')) {
    idx = {
      date: header.indexOf('date'),
      location: header.indexOf('location'),
      open: header.indexOf('open'),
      close: header.indexOf('close'),
    };
    start = 1;
  }

  for (let i = start; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const date = (cells[idx.date] ?? '').trim();
    const location = (cells[idx.location] ?? '').trim();
    const openRaw = (cells[idx.open] ?? '').trim();
    const closeRaw = (cells[idx.close] ?? '').trim();
    if (!date || !location) continue;

    const lc = openRaw.toLowerCase();
    const isClosed = lc === '' || lc === 'closed' || lc === 'tutup' || lc === 'libur' || lc === '-';
    schedule[hoursKey(location, date)] = isClosed || !closeRaw
      ? null
      : { open: openRaw, close: closeRaw };
  }
  return schedule;
}

export async function fetchPickupHours(url: string): Promise<HoursSchedule> {
  // Cache-busting param so browsers/proxies don't serve a stale copy. (Note:
  // Google's "Publish to web" CSV has its own ~5-min server cache this can't
  // bypass; the gviz/export CSV endpoints honor this and update near-instantly.)
  const sep = url.includes('?') ? '&' : '?';
  const res = await fetch(`${url}${sep}_=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Hours fetch failed: ${res.status}`);
  return parseHoursCsv(await res.text());
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
