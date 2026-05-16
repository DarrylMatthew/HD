import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { orderConfig, menuConfig, twcConsultationConfig, twcTheme } from '../config';
import { useBrand } from '../context/BrandContext';
import { Check, Plus, Minus, ShoppingBag, Phone, User, Calendar, Clock, CreditCard, Truck, Store, MessageCircle, Crown, Sparkles } from 'lucide-react';

interface OrderItem { productName: string; size: string; quantity: number; }
interface FormData { name: string; phone: string; items: OrderItem[]; deliveryMethod: 'delivery' | 'pickup'; deliveryApp: string; date: string; time: string; paymentMethod: 'bank' | 'cash'; notes: string; }

export default function OrderForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { isTWC } = useBrand();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', items: [], deliveryMethod: 'pickup', deliveryApp: '', date: '', time: '', paymentMethod: 'cash', notes: '' });

  const addItem = (productName: string, size: string) => {
    setFormData((prev) => {
      const i = prev.items.findIndex((item) => item.productName === productName && item.size === size);
      if (i >= 0) { const u = [...prev.items]; u[i] = { ...u[i], quantity: u[i].quantity + 1 }; return { ...prev, items: u }; }
      return { ...prev, items: [...prev.items, { productName, size, quantity: 1 }] };
    });
  };
  const removeItem = (productName: string, size: string) => {
    setFormData((prev) => {
      const i = prev.items.findIndex((item) => item.productName === productName && item.size === size);
      if (i >= 0) { const u = [...prev.items]; if (u[i].quantity > 1) { u[i] = { ...u[i], quantity: u[i].quantity - 1 }; return { ...prev, items: u }; } return { ...prev, items: u.filter((_, idx) => idx !== i) }; }
      return prev;
    });
  };
  const getItemQuantity = (productName: string, size: string) => formData.items.find((i) => i.productName === productName && i.size === size)?.quantity || 0;

  const generateWhatsAppMessage = () => {
    const itemsList = formData.items.map((item) => `  - ${item.productName} (${item.size}) x${item.quantity}`).join('\n');
    const deliveryInfo = formData.deliveryMethod === 'delivery' ? `Delivery via: ${formData.deliveryApp || 'Third-party app'}` : 'Self Pickup';
    return `*New Order from Hangri Dessert* 🍰\n\n*Customer:* ${formData.name}\n*Phone:* ${formData.phone}\n\n*Items Ordered:*\n${itemsList}\n\n*Delivery Method:* ${deliveryInfo}\n*Preferred Date:* ${formData.date}\n*Preferred Time:* ${formData.time}\n*Payment Method:* ${formData.paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on Delivery/Pickup'}${formData.notes ? `\n\n*Notes:* ${formData.notes}` : ''}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) return;
    const message = encodeURIComponent(generateWhatsAppMessage());
    window.open(`https://api.whatsapp.com/send?phone=${orderConfig.whatsappNumber.replace(/\+/g, '')}&text=${message}`, '_blank');
    setShowConfirmation(true);
  };

  const handleTWCConsultation = () => {
    const msg = encodeURIComponent(`*Wedding Cake Inquiry* 💒\n\nHi, I'd like to try the wedding cake tester and discuss my wedding dessert options.\n\nPlease let me know the available dates for a consultation. Thank you!`);
    window.open(`https://api.whatsapp.com/send?phone=${twcConsultationConfig.whatsappNumber.replace(/\+/g, '')}&text=${msg}`, '_blank');
  };

  const inputBaseStyle: React.CSSProperties = { width: '100%', padding: '14px 16px 14px 44px', fontSize: '14px', fontFamily: 'Effra Trial Bold', background: '#fffdf7', border: '1px solid #d8c3a5', borderRadius: '12px', color: '#2f2218', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s' };

  return (
    <section id="order" ref={sectionRef} style={{ padding: '120px 24px', position: 'relative', backgroundColor: isTWC ? twcTheme.backgroundAlt : '#f5ecd8', transition: 'background-color 0.8s ease' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {isTWC ? (
            /* ======== TWC CONSULTATION CARD ======== */
            <motion.div key="twc-consultation" initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '11px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: twcTheme.accent, display: 'block', marginBottom: '16px' }}>{twcConsultationConfig.sectionLabel}</span>
              <h2 className="font-elegant" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400, color: twcTheme.foreground, margin: '0 0 16px', lineHeight: 1.2 }}>{twcConsultationConfig.title}</h2>
              <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', lineHeight: 1.7, color: twcTheme.muted, maxWidth: '500px', margin: '0 auto 48px' }}>{twcConsultationConfig.subtitle}</p>

              <div className="elegant-card" style={{ background: '#ffffff', padding: '56px 48px', border: `1px solid ${twcTheme.cardBorder}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
                <div style={{ width: '80px', height: '80px', background: twcTheme.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={36} color={twcTheme.accent} />
                </div>
                <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', lineHeight: 1.8, color: twcTheme.muted, maxWidth: '480px', margin: 0 }}>{twcConsultationConfig.description}</p>

                {/* Features */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%', maxWidth: '480px' }}>
                  {twcConsultationConfig.features.map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: twcTheme.backgroundAlt, border: `1px solid ${twcTheme.cardBorder}` }}>
                      <Sparkles size={14} color={twcTheme.accent} />
                      <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', color: twcTheme.foreground }}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <motion.button onClick={handleTWCConsultation} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="font-elegant" style={{ marginTop: '8px', padding: '18px 48px', fontSize: '14px', fontWeight: 600, color: '#ffffff', background: '#1a1a1a', border: 'none', cursor: 'pointer', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.3s' }}>
                  <MessageCircle size={18} />
                  {twcConsultationConfig.ctaText}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* ======== HANGRI ORDER FORM (unchanged) ======== */
            <motion.div key="hangri-order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {/* Section Header */}
              <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', marginBottom: '64px' }}>
                <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#e8954e', display: 'block', marginBottom: '16px' }}>{orderConfig.sectionLabel}</span>
                <h2 className="font-serif" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: '#2f2218', margin: '0 0 16px' }}>{orderConfig.title}</h2>
                <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '16px', lineHeight: 1.7, color: '#5a4a3a', maxWidth: '480px', margin: '0 auto' }}>{orderConfig.subtitle}</p>
              </motion.div>

              <AnimatePresence mode="wait">
                {showConfirmation ? (
                  <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="organic-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '56px 48px', background: '#fffdf7', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #e8954e 0%, #d4a373 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(232, 149, 78, 0.3)' }}><Check size={36} color="#fff" /></div>
                    <h3 className="font-serif" style={{ fontSize: '32px', fontWeight: 400, color: '#2f2218', margin: 0 }}>Order Sent!</h3>
                    <p style={{ fontFamily: 'Effra Trial Bold', fontSize: '15px', lineHeight: 1.7, color: '#5a4a3a', margin: 0 }}>Your order details have been sent via WhatsApp. We'll confirm your order shortly!</p>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowConfirmation(false); setFormData({ name: '', phone: '', items: [], deliveryMethod: 'pickup', deliveryApp: '', date: '', time: '', paymentMethod: 'cash', notes: '' }); }} className="btn-warm font-script" style={{ marginTop: '12px', fontSize: '18px', padding: '12px 32px', border: 'none', cursor: 'pointer' }}>Place Another Order</motion.button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '48px', alignItems: 'start' }}>
                    {/* Left: Image */}
                    <div className="organic-card" style={{ overflow: 'hidden', position: 'sticky', top: '120px' }}>
                      <img src={orderConfig.image} alt="Hangri Dessert" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    {/* Right: Order Form */}
                    <form onSubmit={handleSubmit} className="organic-card" style={{ background: '#fffdf7', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                      {/* Item Selector */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <label style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#e8954e', display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingBag size={16} />Select Items</label>
                        {menuConfig.products.map((product) => (
                          <div key={product.name} style={{ padding: '16px', background: '#fdf6e3', borderRadius: '12px', border: '1px solid #f0e6d3' }}>
                            <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '18px', fontWeight: 500, color: '#2f2218', display: 'block', marginBottom: '10px' }}>{product.name}</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {product.sizes.map((size) => { const qty = getItemQuantity(product.name, size.label); return (
                                <div key={size.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', color: '#5a4a3a' }}>{size.label}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => removeItem(product.name, size.label)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d8c3a5', background: qty > 0 ? '#4e3b31' : '#fffdf7', color: qty > 0 ? '#fff' : '#a09488', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: qty > 0 ? 'pointer' : 'default' }}><Minus size={14} /></motion.button>
                                    <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '14px', fontWeight: 600, color: '#2f2218', minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                                    <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => addItem(product.name, size.label)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#e8954e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={14} /></motion.button>
                                  </div>
                                </div>
                              ); })}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Customer Info */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ position: 'relative' }}><User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a09488' }} /><input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} style={inputBaseStyle} onFocus={(e) => { e.target.style.borderColor = '#e8954e'; e.target.style.boxShadow = '0 0 0 3px rgba(232, 149, 78, 0.15)'; }} onBlur={(e) => { e.target.style.borderColor = '#d8c3a5'; e.target.style.boxShadow = 'none'; }} /></div>
                        <div style={{ position: 'relative' }}><Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a09488' }} /><input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} style={inputBaseStyle} onFocus={(e) => { e.target.style.borderColor = '#e8954e'; e.target.style.boxShadow = '0 0 0 3px rgba(232, 149, 78, 0.15)'; }} onBlur={(e) => { e.target.style.borderColor = '#d8c3a5'; e.target.style.boxShadow = 'none'; }} /></div>
                      </div>
                      {/* Delivery Method */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#e8954e', display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={16} />Delivery Method</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {(['pickup', 'delivery'] as const).map((method) => (
                            <motion.button key={method} type="button" whileTap={{ scale: 0.98 }} onClick={() => setFormData((p) => ({ ...p, deliveryMethod: method }))} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: formData.deliveryMethod === method ? '2px solid #e8954e' : '2px solid #f0e6d3', background: formData.deliveryMethod === method ? '#fdf6e3' : '#fffdf7', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.3s' }}>
                              {method === 'pickup' ? <Store size={20} color={formData.deliveryMethod === method ? '#e8954e' : '#a09488'} /> : <Truck size={20} color={formData.deliveryMethod === method ? '#e8954e' : '#a09488'} />}
                              <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', fontWeight: formData.deliveryMethod === method ? 600 : 400, color: formData.deliveryMethod === method ? '#2f2218' : '#5a4a3a' }}>{method === 'pickup' ? 'Self Pickup' : 'Delivery'}</span>
                            </motion.button>
                          ))}
                        </div>
                        {formData.deliveryMethod === 'delivery' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} style={{ position: 'relative', marginTop: '4px' }}>
                            <MessageCircle size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a09488' }} />
                            <input type="text" placeholder="Delivery App (e.g., Grab, Gojek)" value={formData.deliveryApp} onChange={(e) => setFormData((p) => ({ ...p, deliveryApp: e.target.value }))} style={inputBaseStyle} onFocus={(e) => { e.target.style.borderColor = '#e8954e'; e.target.style.boxShadow = '0 0 0 3px rgba(232, 149, 78, 0.15)'; }} onBlur={(e) => { e.target.style.borderColor = '#d8c3a5'; e.target.style.boxShadow = 'none'; }} />
                          </motion.div>
                        )}
                      </div>
                      {/* Date & Time */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ position: 'relative' }}><Calendar size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a09488' }} /><input type="date" required value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} style={inputBaseStyle} onFocus={(e) => { e.target.style.borderColor = '#e8954e'; e.target.style.boxShadow = '0 0 0 3px rgba(232, 149, 78, 0.15)'; }} onBlur={(e) => { e.target.style.borderColor = '#d8c3a5'; e.target.style.boxShadow = 'none'; }} /></div>
                        <div style={{ position: 'relative' }}><Clock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a09488' }} /><input type="time" required value={formData.time} onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))} style={inputBaseStyle} onFocus={(e) => { e.target.style.borderColor = '#e8954e'; e.target.style.boxShadow = '0 0 0 3px rgba(232, 149, 78, 0.15)'; }} onBlur={(e) => { e.target.style.borderColor = '#d8c3a5'; e.target.style.boxShadow = 'none'; }} /></div>
                      </div>
                      {/* Payment Method */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontFamily: 'Effra Trial Bold', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#e8954e', display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={16} />Payment Method</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {([{ value: 'bank' as const, label: 'Bank Transfer' }, { value: 'cash' as const, label: 'Cash' }]).map((method) => (
                            <motion.button key={method.value} type="button" whileTap={{ scale: 0.98 }} onClick={() => setFormData((p) => ({ ...p, paymentMethod: method.value }))} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: formData.paymentMethod === method.value ? '2px solid #e8954e' : '2px solid #f0e6d3', background: formData.paymentMethod === method.value ? '#fdf6e3' : '#fffdf7', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.3s' }}>
                              <CreditCard size={20} color={formData.paymentMethod === method.value ? '#e8954e' : '#a09488'} />
                              <span style={{ fontFamily: 'Effra Trial Bold', fontSize: '13px', fontWeight: formData.paymentMethod === method.value ? 600 : 400, color: formData.paymentMethod === method.value ? '#2f2218' : '#5a4a3a' }}>{method.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      {/* Notes */}
                      <div><textarea placeholder="Special requests or notes... (optional)" rows={3} value={formData.notes} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))} style={{ ...inputBaseStyle, paddingLeft: '16px', resize: 'vertical' }} onFocus={(e) => { e.target.style.borderColor = '#e8954e'; e.target.style.boxShadow = '0 0 0 3px rgba(232, 149, 78, 0.15)'; }} onBlur={(e) => { e.target.style.borderColor = '#d8c3a5'; e.target.style.boxShadow = 'none'; }} /></div>
                      {/* Submit */}
                      <motion.button type="submit" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} disabled={formData.items.length === 0} className="font-script" style={{ width: '100%', padding: '18px', fontSize: '22px', color: formData.items.length === 0 ? '#a09488' : '#fdf6e3', background: formData.items.length === 0 ? '#f0e6d3' : 'linear-gradient(135deg, #4e3b31 0%, #2f2218 100%)', borderRadius: '2rem 0.5rem 2rem 0.5rem', border: 'none', cursor: formData.items.length === 0 ? 'not-allowed' : 'pointer', boxShadow: formData.items.length === 0 ? 'none' : '0 4px 16px rgba(78, 59, 49, 0.3)', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <MessageCircle size={22} />Send Order via WhatsApp
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
