import { useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { footerConfig, twcFooterConfig, twcTheme } from '../config';
import { useBrand } from '../context/BrandContext';
import { getLenis } from '../hooks/useLenis';
import { Cake, Crown, Instagram, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });
  const { isTWC } = useBrand();

  const config = isTWC ? twcFooterConfig : footerConfig;
  const accentColor = isTWC ? twcTheme.accent : '#e8954e';
  const mutedTextColor = isTWC ? 'rgba(255,255,255,0.5)' : '#d8c3a5';
  const headingColor = isTWC ? twcTheme.accent : '#e8954e';

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const lenis = getLenis();
      if (lenis) { lenis.scrollTo(href); } else { const el = document.querySelector(href); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
    }
  };

  const whatsappNote = `Note to developer: WhatsApp Bot Integration\n\nTo enable order tracking via WhatsApp Bot:\n\n1. Sign up with a WhatsApp Business API provider:\n   - Twilio (twilio.com/whatsapp)\n   - WATI (wati.io)\n   - Fonnte (fonnte.com)\n   - 360dialog (360dialog.com)\n\n2. Configure webhook to receive incoming messages\n\n3. Bot features to implement:\n   - Notify business owner on new orders\n   - Send periodic reminders for uncompleted orders\n   - "Completed" button in WhatsApp to mark orders done\n   - Auto-mark pending orders after 24h reminder\n\n4. Required environment variables:\n   - WHATSAPP_API_KEY\n   - WHATSAPP_PHONE_NUMBER_ID\n   - WEBHOOK_SECRET`;

  return (
    <footer id="footer" ref={sectionRef} style={{ background: isTWC ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' : 'linear-gradient(135deg, #2f2218 0%, #4e3b31 100%)', padding: '80px 24px 32px', position: 'relative', transition: 'background 0.8s ease' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main Footer Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '60px' }}>
          {/* Brand Column */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: isTWC ? '0' : '50%', background: isTWC ? `linear-gradient(135deg, ${twcTheme.accent} 0%, #e8d5a3 100%)` : 'linear-gradient(135deg, #e8954e 0%, #d4a373 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-radius 0.6s ease, background 0.6s ease' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={isTWC ? 'crown' : 'cake'} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.3 }}>
                    {isTWC ? <Crown size={20} color="#fff" /> : <Cake size={20} color="#fff" />}
                  </motion.div>
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait">
                <motion.span key={config.brandName} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }} className={isTWC ? 'font-elegant' : 'font-script'} style={{ fontSize: isTWC ? '18px' : '28px', color: isTWC ? '#ffffff' : '#fdf6e3', fontWeight: 500, letterSpacing: isTWC ? '2px' : '0', textTransform: isTWC ? 'uppercase' : 'none' }}>{config.brandName}</motion.span>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={config.brandTagline} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', lineHeight: 1.7, color: mutedTextColor, margin: '0 0 24px', maxWidth: '280px' }}>{config.brandTagline}</motion.p>
            </AnimatePresence>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
                { icon: <MessageCircle size={18} />, href: `https://wa.me/${config.columns[1]?.links[0]?.href?.split('/').pop() || ''}`, label: 'WhatsApp' },
                { icon: <Mail size={18} />, href: config.columns[1]?.links[2]?.href || 'mailto:', label: 'Email' },
              ].map((social) => (
                <motion.a key={social.label} href={social.href} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} style={{ width: '40px', height: '40px', borderRadius: isTWC ? '0' : '50%', background: 'rgba(253, 246, 227, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedTextColor, textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = accentColor; (e.currentTarget as HTMLElement).style.color = '#fff'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(253, 246, 227, 0.1)'; (e.currentTarget as HTMLElement).style.color = mutedTextColor; }}>{social.icon}</motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {config.columns.map((column, colIndex) => (
            <motion.div key={column.heading} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: (colIndex + 1) * 0.1, ease: [0.16, 1, 0.3, 1] }}>
              <h4 style={{ fontFamily: isTWC ? "'Playfair Display', Georgia, serif" : 'Inter, system-ui, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: isTWC ? '3px' : '2px', textTransform: 'uppercase', color: headingColor, margin: '0 0 20px', transition: 'color 0.6s ease' }}>{column.heading}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {column.links.map((link) => (
                  <li key={link.label}><a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', color: mutedTextColor, textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#fdf6e3'; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.color = mutedTextColor; }}>{link.label}</a></li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: isTWC ? 'linear-gradient(to right, transparent, rgba(201, 169, 110, 0.2), transparent)' : 'linear-gradient(to right, transparent, rgba(216, 195, 165, 0.3), transparent)', marginBottom: '32px', transition: 'background 0.6s ease' }} />

        {/* Copyright */}
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.5 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <AnimatePresence mode="wait">
            <motion.p key={config.copyright} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', color: 'rgba(216, 195, 165, 0.6)', margin: 0, textAlign: 'center' }}>{config.copyright}</motion.p>
          </AnimatePresence>

          {/* Developer Note — only for Hangri */}
          {!isTWC && (
            <div style={{ maxWidth: '700px', width: '100%', marginTop: '16px', padding: '20px 24px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px', border: '1px dashed rgba(232, 149, 78, 0.3)' }}>
              <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px', color: 'rgba(216, 195, 165, 0.5)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Developer Note — WhatsApp Bot Integration</p>
              <pre style={{ fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.6, color: 'rgba(216, 195, 165, 0.45)', margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{whatsappNote}</pre>
            </div>
          )}
        </motion.div>
      </div>
    </footer>
  );
}
