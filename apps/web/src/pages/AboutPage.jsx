import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Shield, Globe2, Award } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { Badge } from '@/components/ui/badge';

function AboutPage() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Helmet>
        <title>Hakkımızda | Nova Teknoloji Otomasyon</title>
        <meta name="description" content="10+ yıllık endüstriyel deneyim, global AI standartları ve uzman kadromuzla tanışın." />
      </Helmet>

      <Header />

      <main className="pt-20">
        <section className="relative py-24 md:py-32 overflow-hidden border-b border-border bg-background">
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1697638164340-6c5fc558bdf2)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 text-sm font-semibold">Kurumsal Vizyonumuz</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                İnsan Limitlerini Aşan<br/>Organizasyonlar İnşa Ediyoruz
              </h1>
              <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
                Sadece bir yazılım şirketi değiliz; işletmelerin otonom geleceğini tasarlayan, global standartlarda bir mühendislik ve strateji merkezidir.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl font-bold text-foreground mb-6">10+ Yıllık Endüstriyel Saha Deneyimi</h2>
                <div className="space-y-6 text-muted leading-relaxed text-lg">
                  <p>
                    Nova Teknoloji Otomasyon olarak, masa başında yazılan teorik kodlarla değil; tozlu fabrika zeminlerinde, karmaşık tedarik zincirlerinde ve stresli yönetim kurullarında edindiğimiz 10 yılı aşkın tecrübe ile hareket ediyoruz.
                  </p>
                  <p>
                    Uluslararası yapay zeka standartlarını, yerel endüstrinin gerçek ihtiyaçlarıyla sentezliyor, uygulanabilir ve anında ROI üreten sistemler kuruyoruz. Amacımız şirketinizin dijital bir kopyasını çıkarmak değil, kendi kendini yönetebilen otonom bir versiyonunu yaratmaktır.
                  </p>
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-6">
                <div className="bg-background border border-border shadow-lg p-6 rounded-2xl text-center">
                  <Globe2 className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-foreground text-2xl mb-1">20+</h3>
                  <p className="text-sm text-muted">Ülkeye İhracat Ağı</p>
                </div>
                <div className="bg-background border border-border shadow-lg p-6 rounded-2xl text-center mt-8">
                  <Shield className="w-10 h-10 text-secondary mx-auto mb-4" />
                  <h3 className="font-bold text-foreground text-2xl mb-1">%100</h3>
                  <p className="text-sm text-muted">Veri Güvenliği</p>
                </div>
                <div className="bg-background border border-border shadow-lg p-6 rounded-2xl text-center -mt-8">
                  <Target className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-foreground text-2xl mb-1">50+</h3>
                  <p className="text-sm text-muted">Otonom Proje</p>
                </div>
                <div className="bg-background border border-border shadow-lg p-6 rounded-2xl text-center">
                  <Award className="w-10 h-10 text-secondary mx-auto mb-4" />
                  <h3 className="font-bold text-foreground text-2xl mb-1">Fortune</h3>
                  <p className="text-sm text-muted">Danışmanlık Standardı</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;