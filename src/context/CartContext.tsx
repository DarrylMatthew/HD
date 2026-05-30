import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';
import {
  buildWhatsAppMessage,
  nextCartId,
  EMPTY_CHECKOUT,
  isCheckoutValid,
  fetchPickupHours,
} from '../sections/OrderingUtils';
import type { CartItem, CheckoutDetails, HoursSchedule } from '../sections/OrderingUtils';
import { CartBar, CartReview } from '../sections/OrderingUI';
import { orderingPageConfig } from '../config';

interface CartContextValue {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  checkout: CheckoutDetails;
  setCheckout: (d: CheckoutDetails) => void;
  isReadyToOrder: boolean;
  submitWhatsApp: () => void;
  hoursSchedule: HoursSchedule | null;
  hoursLoading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutDetails>(EMPTY_CHECKOUT);
  // Per-date pickup hours from the Google Sheet. Stays null until a successful
  // load; null also means "use config default hours" (see resolveDayHours).
  const [hoursSchedule, setHoursSchedule] = useState<HoursSchedule | null>(null);
  // Loading only while a Sheet URL is actually configured; flipped off in the
  // effect's async callbacks so we never call setState in the effect body.
  const [hoursLoading, setHoursLoading] = useState(() => !!orderingPageConfig.pickupHoursSheetUrl);

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

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.totalPrice, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const isReadyToOrder = useMemo(
    () => cart.length > 0 && isCheckoutValid(checkout, orderingPageConfig.pickupLocations, hoursSchedule),
    [cart, checkout, hoursSchedule],
  );

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    setCart((prev) => [...prev, { ...item, id: nextCartId() }]);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

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
        addToCart, removeFromCart, clearCart,
        showCart, setShowCart,
        checkout, setCheckout, isReadyToOrder,
        submitWhatsApp,
        hoursSchedule, hoursLoading,
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

// Single top-level renderer for the cart UI — mobile sticky bar + review modal.
// Desktop's cart entry-point lives in the navbar, so no bottom-right FAB anymore.
export function CartUI() {
  const isMobile = useIsMobile();
  const {
    cart, cartCount, cartTotal, removeFromCart,
    showCart, setShowCart,
    checkout, setCheckout, isReadyToOrder,
    submitWhatsApp, hoursSchedule, hoursLoading,
  } = useCart();
  return (
    <>
      <AnimatePresence>
        {isMobile && cartCount > 0 && (
          <CartBar count={cartCount} total={cartTotal} onClick={() => setShowCart(true)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCart && (
          <CartReview
            cart={cart}
            onRemove={removeFromCart}
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
    </>
  );
}
