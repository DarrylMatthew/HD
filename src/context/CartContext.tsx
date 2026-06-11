import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';
import { getLenis } from '../hooks/useLenis';
import {
  buildWhatsAppMessage,
  nextCartId,
  EMPTY_CHECKOUT,
  isCheckoutValid,
  fetchPickupHours,
  fetchSeasonalMenu,
  stateFromCartItem,
  cartItemFromState,
} from '../sections/OrderingUtils';
import type { CartItem, CheckoutDetails, HoursSchedule, CustomizeState } from '../sections/OrderingUtils';
import { CartBar, CartReview, CustomizePanel } from '../sections/OrderingUI';
import { orderingPageConfig } from '../config';
import type { OrderingCategory, OrderingGroup } from '../config';

interface CartContextValue {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartItem: (id: string, item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  // Item being edited from the cart review; non-null opens the customize panel.
  editingItem: CartItem | null;
  requestEdit: (item: CartItem) => void;
  cancelEdit: () => void;
  checkout: CheckoutDetails;
  setCheckout: (d: CheckoutDetails) => void;
  isReadyToOrder: boolean;
  submitWhatsApp: () => void;
  hoursSchedule: HoursSchedule | null;
  hoursLoading: boolean;
  // Config menu + seasonal Sheet items, merged. Sections render from these so
  // Sheet items (e.g. festive hampers) appear without a redeploy.
  menuGroups: OrderingGroup[];
  menuCategories: OrderingCategory[];
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [checkout, setCheckout] = useState<CheckoutDetails>(EMPTY_CHECKOUT);
  // Per-date pickup hours from the Google Sheet. Stays null until a successful
  // load; null also means "use config default hours" (see resolveDayHours).
  const [hoursSchedule, setHoursSchedule] = useState<HoursSchedule | null>(null);
  // Loading only while a Sheet URL is actually configured; flipped off in the
  // effect's async callbacks so we never call setState in the effect body.
  const [hoursLoading, setHoursLoading] = useState(() => !!orderingPageConfig.pickupHoursSheetUrl);
  // Seasonal items from the "Menu" Sheet tab; empty until loaded (or on failure).
  const [seasonalGroups, setSeasonalGroups] = useState<OrderingGroup[]>([]);
  const [seasonalCategories, setSeasonalCategories] = useState<OrderingCategory[]>([]);

  useEffect(() => {
    const url = orderingPageConfig.pickupHoursSheetUrl;
    if (!url) return; // no Sheet configured -> config default hours
    let cancelled = false;
    fetchPickupHours(url)
      .then((sched) => { if (!cancelled) setHoursSchedule(sched); })
      .catch((err) => { if (!cancelled) console.error('Failed to load pickup hours:', err); })
      .finally(() => { if (!cancelled) setHoursLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const url = orderingPageConfig.menuSheetUrl;
    if (!url) return;
    let cancelled = false;
    fetchSeasonalMenu(url)
      .then((menu) => {
        if (cancelled) return;
        setSeasonalGroups(menu.groups);
        setSeasonalCategories(menu.categories);
      })
      .catch((err) => { if (!cancelled) console.error('Failed to load seasonal menu:', err); });
    return () => { cancelled = true; };
  }, []);

  const menuGroups = useMemo(
    () => [...orderingPageConfig.groups, ...seasonalGroups],
    [seasonalGroups],
  );
  const menuCategories = useMemo(
    () => [...orderingPageConfig.categories, ...seasonalCategories],
    [seasonalCategories],
  );

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.totalPrice, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const isReadyToOrder = useMemo(
    () => cart.length > 0 && isCheckoutValid(checkout, orderingPageConfig.pickupLocations, hoursSchedule),
    [cart, checkout, hoursSchedule],
  );

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    setCart((prev) => [...prev, { ...item, id: nextCartId() }]);
  }, []);

  const updateCartItem = useCallback((id: string, item: Omit<CartItem, 'id'>) => {
    setCart((prev) => prev.map((x) => (x.id === id ? { ...item, id } : x)));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // Editing swaps the cart modal for the customize panel, then returns to it.
  const requestEdit = useCallback((item: CartItem) => {
    setEditingItem(item);
    setShowCart(false);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingItem(null);
    setShowCart(true);
  }, []);

  const submitWhatsApp = useCallback(() => {
    if (cart.length === 0 || !isCheckoutValid(checkout, orderingPageConfig.pickupLocations, hoursSchedule)) return;
    const msg = buildWhatsAppMessage(cart, cartTotal, checkout, orderingPageConfig.pickupLocations);
    const phone = orderingPageConfig.whatsappNumber.replace(/\+/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
    setCart([]);
    setCheckout(EMPTY_CHECKOUT);
    setShowCart(false);
  }, [cart, cartTotal, checkout, hoursSchedule]);

  return (
    <CartContext.Provider
      value={{
        cart, cartCount, cartTotal,
        addToCart, updateCartItem, removeFromCart, clearCart,
        showCart, setShowCart,
        editingItem, requestEdit, cancelEdit,
        checkout, setCheckout, isReadyToOrder,
        submitWhatsApp,
        hoursSchedule, hoursLoading,
        menuGroups, menuCategories,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// Customize panel pre-filled from a cart item; saving overwrites that item.
function EditItemPanel({ item }: { item: CartItem }) {
  const isMobile = useIsMobile();
  const { updateCartItem, cancelEdit } = useCart();
  const [state, setState] = useState<CustomizeState>(() => stateFromCartItem(item));

  useEffect(() => {
    const lenis = getLenis();
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cancelEdit(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [cancelEdit]);

  const save = () => {
    updateCartItem(item.id, cartItemFromState(item.category, state));
    cancelEdit();
  };

  return (
    <CustomizePanel
      cat={item.category}
      state={state}
      onChange={setState}
      onClose={cancelEdit}
      onSubmit={save}
      submitLabel="Update cart"
      isMobile={isMobile}
    />
  );
}

// Single top-level renderer for the cart UI — mobile sticky bar + review modal.
// Desktop's cart entry-point lives in the navbar, so no bottom-right FAB anymore.
export function CartUI() {
  const isMobile = useIsMobile();
  const {
    cart, cartCount, cartTotal, removeFromCart,
    showCart, setShowCart,
    editingItem, requestEdit,
    checkout, setCheckout, isReadyToOrder,
    submitWhatsApp, hoursSchedule, hoursLoading,
  } = useCart();
  return (
    <>
      <AnimatePresence>
        {isMobile && cartCount > 0 && !showCart && !editingItem && (
          <CartBar count={cartCount} total={cartTotal} onClick={() => setShowCart(true)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCart && (
          <CartReview
            cart={cart}
            onRemove={removeFromCart}
            onEdit={requestEdit}
            onClose={() => setShowCart(false)}
            onSubmit={submitWhatsApp}
            total={cartTotal}
            checkout={checkout}
            onCheckoutChange={setCheckout}
            isReadyToOrder={isReadyToOrder}
            pickupLocations={orderingPageConfig.pickupLocations}
            hoursSchedule={hoursSchedule}
            hoursLoading={hoursLoading}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editingItem && <EditItemPanel key={editingItem.id} item={editingItem} />}
      </AnimatePresence>
    </>
  );
}
