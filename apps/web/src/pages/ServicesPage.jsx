
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, ChevronRight, ChevronDown, Globe, TrendingUp, Rocket, Award, Target, Zap, Users, BarChart3, MessageCircle, Calendar } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { servicesData } from '../lib/data.js';
import { Input } from '@/components/ui/input';

function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState({});

  const filteredServices = servicesData.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const openCrisp = () => {
    const event = new CustomEvent('open-ai-chat', { 
      detail: { source: 'services-page', timestamp: new Date().toISOString() } 
    });
    window.dispatchEvent(event);
  };

  const openCalendar = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-calendar-modal'));
  };

  const mainServices = [
    {
      id: 'global-tender',
      icon: Globe,
      title: 'Küresel İhale Takibi & Analitik',
      shortDesc: 'Dünya genelindeki ihaleleri otomatik takip edin, fırsatları kaçırmayın.',
      fullDesc: 'Yapay zeka destekli ihale takip sistemimiz, 150+ ülkede yayınlanan kamu ve özel sektör ihalelerini gerçek zamanlı olarak tarar. Sektörünüze ve kriterlerinize uygun fırsatları anında bildirir, rekabet analizi yapar ve kazanma olasılığınızı hesaplar.',
      features: [
        'Gerçek zamanlı ihale bildirimleri (e-posta, SMS, WhatsApp)',
        'Yapay zeka destekli uygunluk analizi',
        'Rakip firma profilleme ve kazanma olasılığı tahmini',
        'Otomatik teklif hazırlama şablonları',
        'Geçmiş ihale veritabanı ve trend analizi',
        '150+ ülke, 50+ sektör kapsamı'
      ]
    },
    {
      id: 'growth-strategy',
      icon: TrendingUp,
      title: 'Kapsamlı Büyüme Stratejisi',
      shortDesc: 'SEO, dijital reklamcılık ve B2B lead generation ile büyümeyi hızlandırın.',
      fullDesc: 'Global çapta ihale takibinin yanı sıra; uluslararası pazarlara yönelik veri odaklı SEO, hiper-hedefli (geo-targeted) dijital reklam kampanyaları ve LinkedIn/B2B sosyal medya ağları üzerinden otonom nitelikli müşteri (lead) yaratma süreçlerini uçtan uca yönetiyoruz.',
      features: [
        'Veri odaklı SEO stratejisi',
        'Geo-targeted reklam kampanyaları',
        'LinkedIn B2B lead generation',
        'Nitelikli müşteri (lead) yaratma',
        'Uluslararası pazara giriş stratejisi',
        'Rekabet analizi ve konumlandırma'
      ]
    },
    {
      id: 'implementation',
      icon: Rocket,
      title: 'İmplementasyon Süreci',
      shortDesc: 'Hızlı, şeffaf ve sonuç odaklı uygulama metodolojisi.',
      fullDesc: 'Kanıtlanmış implementasyon metodolojimiz ile 48 saat içinde ilk sonuçları görmeye başlarsınız. Agile yaklaşımımız sayesinde sürekli iyileştirme ve hızlı adaptasyon sağlıyoruz.',
      features: [
        'İlk 48 saat: Keşif toplantısı, sistem analizi, roadmap oluşturma',
        '1. Hafta: Pilot uygulama, test ve optimizasyon',
        '2-4. Hafta: Tam entegrasyon, ekip eğitimi, go-live',
        'Devam eden destek: 7/24 teknik destek, aylık optimizasyon',
        'Şeffaf proje yönetimi: Haftalık raporlar, milestone tracking',
        'Risk yönetimi: Yedekleme, rollback planları, SLA garantisi'
      ]
    },
    {
      id: 'why-choose',
      icon: Award,
      title: 'Neden Bu Hizmeti Seçmelisiniz',
      shortDesc: 'Kanıtlanmış sonuçlar, global deneyim, yerel uzmanlık.',
      fullDesc: '10+ yıllık endüstriyel deneyimimiz, Fortune 500 şirketleriyle çalışma tecrübemiz ve global AI ortaklıklarımız ile işletmenizi geleceğe hazırlıyoruz. Sadece teknoloji değil, iş sonuçları odaklı çözümler sunuyoruz.',
      features: [
        'ISO 27001 sertifikalı güvenlik standartları',
        'Fortune 500 şirketleriyle çalışma deneyimi',
        'Global AI teknoloji ortaklıkları (OpenAI, Anthropic, Google)',
        'Ortalama %40 operasyonel maliyet düşüşü',
        'Ortalama %60 süreç hızlanması',
        'Para iade garantisi: İlk 30 günde memnun kalmazsanız tam iade'
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Helmet>
        <title>Hizmetler | Nova Teknoloji Otomasyon</title>
        <meta name="description" content="İşletmeniz için 10 farklı otonom yapay zeka ve süreç otomasyonu (RPA) çözümleri." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* HERO */}
        <section className="relative py-24 md:py-32 overflow-hidden border-b border-border">
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1629787155650-9ce3697dcb38)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Anasayfa</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Hizmetler</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Otonom İşletme Çözümleri
              </h1>
              <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-10">
                Kanıtlanmış metodolojiler ve ölçülebilir ROI metrikleri ile işletmenizin her departmanını dijitalleştiriyoruz.
              </p>

              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <Input
                  type="text"
                  placeholder="Hizmet ara... (Örn: RPA, Enerji, Tahmin)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 h-14 bg-card border-border text-foreground focus-visible:ring-primary rounded-xl shadow-sm placeholder:text-muted"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* MAIN SERVICES ACCORDION SECTION */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Kapsamlı Hizmet Portföyümüz</h2>
              <p className="text-lg text-muted">İşletmenizi uçtan uca dijitalleştiren entegre çözümler.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {mainServices.map((service, idx) => {
                const Icon = service.icon;
                const isExpanded = expandedCards[service.id];

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 shadow-lg relative overflow-hidden group transition-colors"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-primary/10"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Icon className="w-7 h-7" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-foreground mb-3">{service.title}</h3>
                      <p className="text-muted mb-6 leading-relaxed">{service.shortDesc}</p>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 overflow-hidden"
                          >
                            <p className="text-foreground mb-4 leading-relaxed">{service.fullDesc}</p>
                            <ul className="space-y-2">
                              {service.features.map((feature, i) => (
                                <li key={i} className="flex items-start space-x-2 text-sm text-muted">
                                  <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => toggleCard(service.id)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-background hover:bg-border/50 border border-border text-foreground font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
                        >
                          <span>{isExpanded ? 'Detayları Gizle' : 'Detayları Gör'}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                          onClick={openCrisp}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Daha Fazla Bilgi Al</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ADDITIONAL SERVICES GRID */}
        <section className="py-20 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Diğer Otomasyon Çözümleri</h2>
              <p className="text-lg text-muted">Sektöre özel yapay zeka ve RPA uygulamaları.</p>
            </div>

            {filteredServices.length === 0 ? (
              <div className="text-center py-20 text-muted">
                Aradığınız kriterlere uygun hizmet bulunamadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredServices.map((service, idx) => (
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <Link to={`/services/${service.slug}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
                      <div className="bg-background p-8 rounded-2xl h-full flex flex-col group border border-border hover:border-primary/30 shadow-md relative overflow-hidden transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-primary/10"></div>
                        
                        <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center mb-6 text-foreground group-hover:text-primary transition-colors relative z-10">
                          <service.icon className="w-7 h-7" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-3 relative z-10 group-hover:text-primary transition-colors">{service.title}</h3>
                        <p className="text-muted text-sm leading-relaxed mb-6 flex-grow relative z-10">
                          {service.shortDesc}
                        </p>
                        
                        <div className="mt-auto flex items-center text-sm font-semibold text-muted group-hover:text-primary transition-colors relative z-10">
                          Detayları İncele <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="py-24 relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8">
                <Target className="w-4 h-4" />
                <span>Ücretsiz Danışmanlık</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                İşletmeniz İçin Doğru Çözümü Birlikte Belirleyelim
              </h2>
              <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
                15 dakikalık ücretsiz keşif toplantısında ihtiyaçlarınızı analiz ediyor, size özel roadmap oluşturuyoruz.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={openCrisp}
                  className="btn-premium"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span>Ücretsiz Danışmanlık Al</span>
                </button>
                <button
                  onClick={openCalendar}
                  className="px-6 py-3 rounded-lg bg-card text-foreground border border-border hover:border-primary/50 font-bold text-base hover:bg-border/50 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Toplantı Planla</span>
                </button>
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span>Ortalama %40 maliyet düşüşü</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-secondary" />
                  <span>48 saat içinde ilk sonuçlar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span>30 gün para iade garantisi</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ServicesPage;
