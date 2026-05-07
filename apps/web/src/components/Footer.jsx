
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Linkedin, Twitter, Instagram, ShieldCheck, Globe, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function Footer() {
  const currentYear = new Date().getFullYear();

  const openCalendar = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-calendar-modal'));
  };

  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-xl font-bold text-primary">N</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground leading-tight">Nova Teknoloji</span>
                <span className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase">Otomasyon</span>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              İşletmenizi global standartlarda yapay zeka ve otonom süreçlerle geleceğe hazırlıyoruz. Limitleri aşan operasyonel mükemmellik.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 transition-colors">
                <ShieldCheck className="w-3 h-3 mr-1" /> ISO Sertifikalı
              </Badge>
              <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20 transition-colors">
                <Globe className="w-3 h-3 mr-1" /> Global AI Partneri
              </Badge>
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-6">
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Hızlı Bağlantılar</span>
            <nav className="mt-6 space-y-3">
              <Link to="/services" className="block text-sm text-muted hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm w-fit">
                Otonom Hizmetlerimiz
              </Link>
              <Link to="/about" className="block text-sm text-muted hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm w-fit">
                Hakkımızda & Ekip
              </Link>
              <Link to="/faq" className="block text-sm text-muted hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm w-fit">
                Sıkça Sorulan Sorular
              </Link>
              <button onClick={openCalendar} className="flex items-center text-sm text-muted hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm w-fit">
                <Calendar className="w-4 h-4 mr-2" /> Toplantı Planla
              </button>
            </nav>
          </div>

          <div className="lg:col-span-4">
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Bize Ulaşın</span>
            <div className="mt-6 space-y-4">
              <a href="tel:+905468667215" className="flex items-center space-x-3 text-sm text-muted hover:text-primary transition-colors group w-fit outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+90 546 866 72 15</span>
              </a>
              <a href="mailto:info@novateknoloji.com.tr" className="flex items-center space-x-3 text-sm text-muted hover:text-primary transition-colors group w-fit outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
                <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@novateknoloji.com.tr</span>
              </a>
              
              <div className="pt-4 flex items-center space-x-4">
                <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-lg bg-background border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-all text-muted outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-lg bg-background border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-all text-muted outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-lg bg-background border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-all text-muted outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-muted">
            © {currentYear} Nova Teknoloji Otomasyon. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="text-sm text-muted hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
              Gizlilik Politikası
            </Link>
            <Link to="/terms" className="text-sm text-muted hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
