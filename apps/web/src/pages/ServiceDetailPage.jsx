import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, CheckCircle2, TrendingUp, Cpu } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { servicesData } from '../lib/data.js';

function ServiceDetailPage() {
  const { slug } = useParams();
  const service = servicesData.find(s => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const otherServices = servicesData.filter(s => s.slug !== slug).slice(0, 3);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Helmet>
        <title>{`${service.title} | Nova Teknoloji`}</title>
        <meta name="description" content={service.shortDesc} />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* HERO */}
        <section className="bg-card py-16 md:py-24 border-b border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-card z-0"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center space-x-2 text-sm text-muted mb-8">
              <Link to="/" className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">Anasayfa</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/services" className="hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">Hizmetler</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{service.title}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 border border-primary/20">
                  <service.icon className="w-10 h-10" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {service.title}
                </h1>
                <p className="text-xl text-muted leading-relaxed">
                  {service.shortDesc}
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-background p-8 rounded-2xl border border-border relative shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 text-primary mr-2" /> Öngörülen ROI
                </h3>
                <p className="text-lg text-primary font-bold mb-8">
                  {service.roi}
                </p>
                
                <a 
                  href="https://calendly.com/novateknoloji" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-premium w-full text-center"
                >
                  Bu Hizmet İçin Görüşelim
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* DETAILS */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16">
            
            {/* Benefits */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-foreground mb-8">Neden Bu Hizmeti Seçmelisiniz?</h2>
              <div className="space-y-4">
                {service.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mr-4 mt-0.5" />
                    <span className="text-lg text-muted">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Implementation Process */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-foreground mb-8">İmplementasyon Süreci</h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
                {service.process.map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-background text-primary flex-shrink-0 z-10 font-bold">
                      {i + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border p-4 rounded-xl ml-4 md:ml-0 md:group-odd:mr-4 md:group-even:ml-4 shadow-sm">
                      <p className="text-muted font-medium">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>

        {/* RELATED */}
        <section className="py-20 bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-10 flex items-center">
              <Cpu className="w-6 h-6 mr-3 text-primary" /> Birlikte Kullanılabilecek Hizmetler
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherServices.map(s => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                  <div className="bg-background p-6 rounded-xl h-full border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md group">
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-sm text-muted line-clamp-2 mb-4">{s.shortDesc}</p>
                    <span className="text-xs font-bold text-primary flex items-center">
                      İncele <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default ServiceDetailPage;