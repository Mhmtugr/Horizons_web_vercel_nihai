import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flame, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShown')) {
        setIsOpen(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleCalendly = () => {
    window.open('https://calendly.com/novateknoloji', '_blank');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden shadow-2xl border border-primary/20"
          >
            {/* Urgency Banner */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-2 px-4 flex items-center justify-center space-x-2">
              <Flame className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-foreground">Sınırlı Süreli: İlk 5 müşteri için %20 indirim fırsatı!</span>
            </div>

            <button
              onClick={handleClose}
              className="absolute top-12 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ayrılmadan önce, 15 dakikalık keşif toplantısı için takvim açalım mı?
              </h2>
              
              <p className="text-muted-foreground mb-8">
                İşletmenizin otonom geleceğini ertelemeyin. Rakipleriniz şu an dijital dönüşümlerini tamamlıyor.
              </p>

              <Button
                onClick={handleCalendly}
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg glow-emerald mb-4 h-14"
              >
                Hemen Ücretsiz Keşif Toplantısı Seçin
              </Button>

              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-secondary" />
                <span>Şu anda <strong className="text-foreground">3 şirket</strong> danışmanlık alıyor.</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ExitIntentPopup;