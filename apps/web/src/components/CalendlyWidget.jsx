
import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendlyWidget({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl h-[85vh] bg-card rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b border-border bg-background">
              <h3 className="font-semibold text-foreground">Toplantı Planla</h3>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-card text-muted-foreground hover:text-foreground hover:bg-border/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full bg-background overflow-hidden relative">
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
