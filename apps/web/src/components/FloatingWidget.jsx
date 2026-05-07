import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiServerClient from '@/lib/apiServerClient';

function FloatingWidget() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleWhatsAppClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await apiServerClient.fetch('/analytics/log-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: `visitor-${Date.now()}`,
          message: 'Clicked WhatsApp button',
          timestamp: new Date().toISOString(),
          source: 'whatsapp'
        })
      });
    } catch (error) {
      console.error('Analytics logging failed (non-blocking):', error);
    }
    
    const phoneNumber = '905468667215';
    const message = encodeURIComponent('Merhaba Nova Teknoloji, web sitenizdeki hizmetler hakkında bilgi almak istiyorum');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-24 right-6 md:right-8 z-[50] flex flex-col items-end pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        className="pointer-events-auto relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-card border border-border text-foreground text-sm font-medium rounded-xl shadow-2xl whitespace-nowrap pointer-events-none gpu-accelerated"
              role="tooltip"
              id="whatsapp-tooltip"
            >
              WhatsApp Destek Hattı
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-card"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleWhatsAppClick}
          onTouchEnd={handleWhatsAppClick}
          className="w-[56px] h-[56px] sm:w-[60px] sm:h-[60px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300 focus-visible:ring-4 focus-visible:ring-[#25D366] focus-visible:outline-none gpu-accelerated"
          title="WhatsApp ile İletişime Geçin"
          aria-label="WhatsApp ile İletişim"
          aria-describedby="whatsapp-tooltip"
          tabIndex="0"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="w-8 h-8 drop-shadow-sm"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.422-.272.347-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </motion.div>
    </div>
  );
}

export default FloatingWidget;