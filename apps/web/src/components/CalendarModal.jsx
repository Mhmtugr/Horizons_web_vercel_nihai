
import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsLoading(true);
    };
    window.addEventListener('open-calendar-modal', handleOpen);
    return () => window.removeEventListener('open-calendar-modal', handleOpen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Toplantı Planla"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden relative flex flex-col gpu-accelerated" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border bg-background shrink-0">
              <h2 className="text-lg font-bold text-foreground">Toplantı Planla</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 bg-card hover:bg-border/50 rounded-full text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 relative bg-background">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                  <p className="text-muted font-medium">Takvim yükleniyor...</p>
                </div>
              )}
              <iframe 
                src="https://cal.eu/novateknoloji" 
                className="w-full h-full border-0" 
                title="Nova Teknoloji Takvim"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
