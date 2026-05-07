import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';

function FloatingWidgets() {
  const handleOpenChat = () => {
    window.dispatchEvent(new Event('open-ai-chat'));
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/905468667215', '_blank');
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 p-6 flex flex-col gap-4 pointer-events-none">
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenChat}
        className="relative pointer-events-auto w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center glow-emerald shadow-2xl transition-all duration-200"
        aria-label="AI Asistan ile Sohbet Et"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWhatsApp}
        className="pointer-events-auto w-14 h-14 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center glow-cyan shadow-2xl transition-all duration-200"
        aria-label="WhatsApp İletişim"
      >
        <Send className="w-6 h-6 ml-1" />
      </motion.button>
    </div>
  );
}

export default FloatingWidgets;