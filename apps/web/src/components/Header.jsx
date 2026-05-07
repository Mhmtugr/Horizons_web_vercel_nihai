
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Hizmetler', path: '/services' },
    { name: 'Hakkında', path: '/about' },
    { name: 'SSS', path: '/faq' },
    { name: 'İletişim', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const openCalendar = () => {
    window.dispatchEvent(new Event('open-calendar-modal'));
    setMobileMenuOpen(false);
  };

  const openRequestForm = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { mode: 'request' } }));
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 transition-all duration-300">
              <span className="text-xl font-bold text-primary">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-tight tracking-tight">Nova Teknoloji</span>
              <span className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase">Otomasyon</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted hover:text-foreground hover:bg-card'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={openRequestForm}
              className="btn-premium py-2 px-5 min-h-[40px] text-sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span>Talep Gönder</span>
            </button>
            <button
              onClick={openCalendar}
              className="btn-premium py-2 px-5 min-h-[40px] text-sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>Toplantı Planla</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all duration-200 text-foreground focus-visible:ring-2 focus-visible:ring-primary outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border bg-background shadow-xl"
          >
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted hover:text-foreground hover:bg-card'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <button
                  onClick={openRequestForm}
                  className="btn-premium w-full mb-2"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Talep Gönder</span>
                </button>
                <button
                  onClick={openCalendar}
                  className="btn-premium w-full"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Toplantı Planla</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
