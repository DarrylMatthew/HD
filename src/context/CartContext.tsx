import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/use-mobile';
import { buildWhatsAppMessage, nextCartId } from '../sections/OrderingUtils';
import type { CartItem } from '../sections/OrderingUtils';
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
  submitWhatsApp: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.totalPrice, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    setCart((prev) => [...prev, { ...item, id: nextCartId() }]);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const submitWhatsApp = useCallback(() => {
    if (cart.length === 0) return;
    const msg = buildWhatsAppMessage(cart, cartTotal);
    const phone = orderingPageConfig.whatsappNumber.replace(/\+/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
    setCart([]);
    setShowCart(false);
  }, [cart, cartTotal]);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, cartTotal, addToCart, removeFromCart, clearCart, showCart, setShowCart, submitWhatsApp }}
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
  const { cart, cartCount, cartTotal, removeFromCart, showCart, setShowCart, submitWhatsApp } = useCart();
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
          />
        )}
      </AnimatePresence>
    </>
  );
}
