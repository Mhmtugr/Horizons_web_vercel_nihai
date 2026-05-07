
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck, Globe, Star, ArrowUpRight, MessageSquare, Calendar } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { servicesData } from '../lib/data.js';
import { Badge } from '@/components/ui/badge';

function HomePage() {
  const [showScrollCTA, setShowScrollCTA] = useState(false);
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const documentHeight = document.body.scrollHeight - window.innerHeight;
      if (documentHeight > 0 && (scrollPosition / documentHeight) > 0.3) {
        setShowScrollCTA(true);
      } else {
        setShowScrollCTA(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroCTAClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const event = new CustomEvent('open-ai-chat', { 
      detail: { source: 'homepage-cta', timestamp: new Date().toISOString() } 
    });
    window.dispatchEvent(event);
  };

  const openCalendar = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-calendar-modal'));
  };

  const highlightedServices = servicesData.slice(0, 5);
  const MainService = highlightedServices[0];
  const MainIcon = MainService?.icon;
  const SecondService = highlightedServices[1];
  const SecondIcon = SecondService?.icon;
  const otherServices = highlightedServices.slice(2, 5);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Helmet>
        <title>Nova Teknoloji Otomasyon | Yapay Zeka & Endüstriyel Otonomi</title>
        <meta name="description" content="10+ yıllık saha deneyimi ile işletmenizi otonom geleceğe taşıyoruz. Global AI standartları, RPA otomasyonu ve yapay zeka analiz sistemleri." />
      </Helmet>

      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-background">
          <motion.div 
            style={{ y: yParallax }}
            className="absolute inset-0 z-0 gpu-accelerated opacity-20 mix-blend-luminosity"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1679986944940-c5001ec1c1da)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50"></div>
          </motion.div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap gap-3 mb-8 gpu-accelerated"
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 hover:bg-primary/20 transition-colors text-sm font-semibold">
                  <ShieldCheck className="w-4 h-4 mr-2" /> ISO Sertifikalı
                </Badge>
                <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1 hover:bg-secondary/20 transition-colors text-sm font-semibold">
                  <Globe className="w-4 h-4 mr-2" /> Global AI Partnerships
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-[1.1] gpu-accelerated"
              >
                ŞİRKETİNİZ HALA MANUEL KAYIT MI TUTUYOR?
                <br />
                <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent block mt-2">
                  RAKİPLERİNİZ OTONOM BÜYÜYOR.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-muted mb-10 max-w-2xl leading-relaxed border-l-4 border-primary pl-6 gpu-accelerated"
              >
                10+ yıllık saha endüstriyel deneyim, uluslararası AI ortaklıkları, global bilgi birikimi ve sektörel çalışmalar ile bilançonuzu dijital olarak korumaya alın.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 gpu-accelerated"
              >
                <button
                  onClick={openCalendar}
                  className="px-6 py-3 rounded-lg bg-card border border-border text-foreground font-bold text-base hover:bg-border/50 hover:border-primary/50 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-[44px] shadow-sm"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Toplantı Planla</span>
                </button>
                <button
                  onClick={handleHeroCTAClick}
                  aria-label="Open AI Assistant"
                  title="AI Satış Danışmanı ile görüşün"
                  className="btn-premium min-h-[44px]"
                >
                  <MessageSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                  <span>AI Asistan ile Sohbet Et</span>
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SERVICES BENTO GRID SECTION */}
        <section className="py-24 relative bg-card border-t border-border">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Otonom Çözüm Mimarisi</h2>
              <p className="text-lg text-muted">İşletmenizi uçtan uca dijitalleştiren yenilikçi yaklaşımlar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {MainService && (
                <div className="md:col-span-8">
                  <Link to={`/services/${MainService.slug}`} className="block h-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-2xl">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-background p-8 rounded-2xl h-full flex flex-col justify-between border border-border hover:border-primary/50 shadow-md hover:shadow-xl group transition-all duration-300 gpu-accelerated"
                    >
                      <div>
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                          {MainIcon && <MainIcon className="w-8 h-8" />}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{MainService.title}</h3>
                        <p className="text-muted text-lg mb-6 max-w-xl">{MainService.shortDesc}</p>
                      </div>
                      <div className="flex items-center text-primary font-semibold">
                        İncele <ArrowUpRight className="w-5 h-5 ml-2" />
                      </div>
                    </motion.div>
                  </Link>
                </div>
              )}

              {SecondService && (
                <div className="md:col-span-4">
                  <Link to={`/services/${SecondService.slug}`} className="block h-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-2xl">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="bg-primary/5 p-8 rounded-2xl h-full flex flex-col justify-between group border border-primary/10 hover:border-primary/50 shadow-md hover:shadow-xl transition-all duration-300 gpu-accelerated"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 text-primary">
                          {SecondIcon && <SecondIcon className="w-6 h-6" />}
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{SecondService.title}</h3>
                        <p className="text-muted text-sm mb-6">{SecondService.shortDesc}</p>
                      </div>
                      <div className="flex items-center text-primary font-semibold text-sm">
                        Detaylar <ArrowUpRight className="w-4 h-4 ml-1" />
                      </div>
                    </motion.div>
                  </Link>
                </div>
              )}

              {otherServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.slug} className="md:col-span-4">
                    <Link to={`/services/${service.slug}`} className="block h-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-2xl">
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-background p-6 rounded-2xl h-full flex flex-col group border border-border hover:border-primary/50 shadow-md hover:shadow-lg transition-all duration-300 gpu-accelerated"
                      >
                        <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center mb-4 text-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                          {Icon && <Icon className="w-5 h-5" />}
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                        <p className="text-muted text-sm line-clamp-3 mb-4">{service.shortDesc}</p>
                        <div className="mt-auto flex items-center text-muted group-hover:text-primary font-medium text-sm transition-colors">
                          Keşfet <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </motion.div>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Link to="/services" className="inline-flex items-center text-primary font-semibold hover:text-primary-hover transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md px-2 py-1">
                Tüm Çözümlerimizi İnceleyin <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF & SECTORS */}
        <section className="py-20 border-y border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-center text-lg font-medium text-muted mb-10 tracking-widest uppercase">
              Danışmanlık Verdiğimiz Sektörler
            </h3>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
              <span className="text-xl md:text-2xl font-bold font-sans text-foreground">Endüstri & Üretim</span>
              <span className="text-xl md:text-2xl font-bold font-sans text-foreground">Lojistik & Tedarik</span>
              <span className="text-xl md:text-2xl font-bold font-sans text-foreground">Enerji & Altyapı</span>
              <span className="text-xl md:text-2xl font-bold font-sans text-foreground">Finans & Sigorta</span>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-card relative overflow-hidden border-t border-border">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none gpu-accelerated" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Başarı Hikayeleri</h2>
              <p className="text-muted">Otonomiye geçiş yapan lider kurumların deneyimleri.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "K. Yılmaz", title: "Operasyon Direktörü", text: "Makine duruşlarımızı AI destekli bakım ile sıfıra yaklaştırdık. Nova'nın 48 saatlik modeli gerçekten beklentimizin ötesindeydi." },
                { name: "M. Demir", title: "CFO", text: "Dinamik fiyatlandırma ve teklif otomasyonu sayesinde kar marjımızı sadece 2 ayda %18 oranında koruduk ve artırdık." },
                { name: "A. Şahin", title: "İhracat Yöneticisi", text: "B2B Radarı ile her gün manuel yaptığımız ihale taramalarını tamamen bota devrettik. İki yeni pazara açıldık." }
              ].map((t, i) => (
                <div key={i} className="bg-background border border-border p-8 rounded-2xl relative shadow-md hover:border-primary/30 transition-colors">
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-foreground leading-relaxed mb-6">"{t.text}"</p>
                  <div>
                    <h4 className="font-bold text-foreground">{t.name}</h4>
                    <span className="text-sm text-muted">{t.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 relative border-t border-border bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5 gpu-accelerated" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Aksiyon Almayanlar, Otonom Rakiplerine Hizmet Edecek.
            </h2>
            <p className="text-xl text-muted mb-10">
              Bugün 15 dakikanızı ayırarak dijital bilançonuzu güvence altına alın.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={openCalendar}
                className="btn-premium inline-flex"
              >
                <Calendar className="w-5 h-5 mr-2" />
                15 Dk. Keşif Toplantısı Planla
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
