
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, MessageSquare, RefreshCcw, Calendar } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '', suggestion: '' });

  const sanitizeInput = (str) => {
    if (!str) return '';
    return str
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  };

  const validateField = useCallback((name, value) => {
    const sanitizedValue = sanitizeInput(value).trim();
    let error = undefined;

    switch (name) {
      case 'name':
        if (!sanitizedValue) error = 'Ad Soyad alanı zorunludur.';
        else if (sanitizedValue.length < 2) error = 'Ad Soyad en az 2 karakter olmalıdır.';
        else if (sanitizedValue.length > 100) error = 'Ad Soyad en fazla 100 karakter olmalıdır.';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!sanitizedValue) error = 'E-posta alanı zorunludur.';
        else if (!emailRegex.test(sanitizedValue)) error = 'Lütfen geçerli bir e-posta adresi giriniz (örn: isim@sirket.com).';
        break;
      case 'message':
        if (!sanitizedValue) error = 'Mesaj alanı zorunludur.';
        else if (sanitizedValue.length > 5000) error = 'Mesaj en fazla 5000 karakter olmalıdır.';
        break;
      case 'phone':
        if (sanitizedValue && sanitizedValue.length < 10) error = 'Telefon numarası en az 10 karakter olmalıdır.';
        break;
      case 'company':
        if (sanitizedValue && sanitizedValue.length > 100) error = 'Şirket adı en fazla 100 karakter olmalıdır.';
        break;
      case 'service':
        const validServices = ['RPA', 'B2B Radar', 'AI Eğitim', 'Global İhale Takibi', 'Diğer'];
        if (!sanitizedValue) error = 'Lütfen ilgilendiğiniz hizmeti seçiniz.';
        else if (!validServices.includes(sanitizedValue)) error = 'Lütfen listeden geçerli bir hizmet seçiniz.';
        break;
      default:
        break;
    }
    return error;
  }, []);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Lütfen formdaki hataları düzeltin.',
        suggestion: 'Kırmızı ile işaretlenmiş alanları kontrol ediniz.'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus({ type: null, message: '', suggestion: '' });

      // Send basic info to Crisp if available
      if (window.$crisp) {
        window.$crisp.push(['set', 'user:email', [formData.email]]);
        window.$crisp.push(['set', 'user:nickname', [formData.name]]);
        const crispMessage = `📝 İletişim Formu Dolduruldu:\nİsim: ${formData.name}\nE-posta: ${formData.email}\nHizmet: ${formData.service}\nMesaj: ${formData.message}`;
        window.$crisp.push(['do', 'message:send', ['text', crispMessage]]);
      }

      // Simulate a network delay instead of an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSubmitStatus({ 
        type: 'success', 
        message: 'Talebiniz başarıyla alınmıştır.',
        suggestion: 'Satış ekibimiz en kısa sürede sizinle iletişime geçecektir.'
      });
      setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' });
      setErrors({});
      setTouched({});
      
      setTimeout(() => {
        setSubmitStatus({ type: null, message: '', suggestion: '' });
      }, 5000);

    } catch (error) {
      console.error(`Form submission error:`, error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        suggestion: 'Lütfen daha sonra tekrar deneyiniz.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAiChat = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { source: 'contact-page' } }));
  };

  const openCalendar = () => {
    window.dispatchEvent(new Event('open-calendar-modal'));
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Helmet>
        <title>İletişim | Nova Teknoloji Otomasyon</title>
        <meta name="description" content="Nova Teknoloji ile iletişime geçin. Otonom yapay zeka çözümleri ve işletmenize özel süreç otomasyonları için bize ulaşın." />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* HERO */}
        <section className="relative py-16 md:py-20 overflow-hidden border-b border-border bg-card">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none gpu-accelerated"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 gpu-accelerated"
            >
              Geleceği Birlikte <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">İnşa Edelim</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto gpu-accelerated"
            >
              Sorularınız veya projeleriniz için bize ulaşın. Satış uzmanlarımız veya AI danışmanımız size hemen yardımcı olsun.
            </motion.p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-12 md:py-20 bg-background relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* CONTACT INFO */}
              <div className="lg:col-span-5 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card p-8 rounded-2xl border border-border shadow-lg gpu-accelerated"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">İletişim Bilgileri</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20" aria-hidden="true">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-muted mb-1 uppercase tracking-wide">Telefon / WhatsApp</h3>
                        <a href="tel:+905468667215" className="text-foreground font-medium hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm" aria-label="Bizi arayın: +90 546 866 72 15">+90 (546) 866 72 15</a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20" aria-hidden="true">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-muted mb-1 uppercase tracking-wide">E-Posta</h3>
                        <a href="mailto:info@nexaotomasyon.com.tr" className="text-foreground font-medium hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm" aria-label="Bize e-posta gönderin: info@nexaotomasyon.com.tr">info@nexaotomasyon.com.tr</a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20" aria-hidden="true">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-muted mb-1 uppercase tracking-wide">Çalışma Saatleri</h3>
                        <p className="text-foreground font-medium">Pazartesi - Cuma: 09:00 - 18:00</p>
                        <p className="text-sm text-muted mt-1">AI Asistanımız 7/24 hizmet vermektedir.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border space-y-3">
                    <button
                      onClick={openAiChat}
                      aria-label="AI Asistan ile Görüş"
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-background hover:bg-primary/10 border border-border hover:border-primary/50 text-primary font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-[44px]"
                    >
                      <span className="relative flex h-3 w-3 mr-1" aria-hidden="true">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                      <span>Hemen AI Asistan ile Görüş</span>
                    </button>
                    <button
                      onClick={openCalendar}
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-background hover:bg-border/50 border border-border text-foreground font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-[44px]"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Toplantı Planla</span>
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* CONTACT FORM */}
              <div className="lg:col-span-7">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="form-container-premium"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Proje Başvurusu</h2>
                  <p className="text-sm sm:text-base text-muted mb-6 sm:mb-8">Hizmetlerimiz hakkında detaylı bilgi almak veya projenizi değerlendirmek için formu doldurun.</p>

                  <div aria-live="polite" aria-atomic="true">
                    <AnimatePresence>
                      {submitStatus.message && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`p-4 rounded-xl mb-6 gpu-accelerated ${
                            submitStatus.type === 'success' 
                              ? 'theme-success animate-success-pulse' 
                              : 'theme-error'
                          }`}
                          role="alert"
                        >
                          <div className="flex items-start space-x-3">
                            {submitStatus.type === 'success' ? (
                              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                            ) : (
                              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                            )}
                            <div className="flex-1">
                              <h4 className="font-bold text-sm mb-1">{submitStatus.message}</h4>
                              {submitStatus.suggestion && (
                                <p className="text-xs opacity-90">{submitStatus.suggestion}</p>
                              )}
                              
                              {submitStatus.type === 'error' && (
                                <div className="mt-3 flex gap-2">
                                  <button 
                                    onClick={handleSubmit}
                                    className="inline-flex items-center gap-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-md transition-colors font-bold focus-visible:ring-2 focus-visible:ring-red-400 outline-none text-red-300 border border-red-500/30"
                                  >
                                    <RefreshCcw className="w-3.5 h-3.5" />
                                    Tekrar Dene
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-bold text-muted uppercase tracking-wide">Ad Soyad <span className="text-destructive" aria-hidden="true">*</span></label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                          aria-required="true"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                          className={`input-premium w-full ${errors.name ? 'border-destructive focus:border-destructive focus:ring-destructive/20 bg-destructive/5' : touched.name && !errors.name ? 'border-primary focus:border-primary' : ''}`}
                          placeholder="Örn: Maya Chen"
                        />
                        <AnimatePresence>
                          {errors.name && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="name-error" className="text-xs font-medium text-destructive mt-1" role="alert">{errors.name}</motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-muted uppercase tracking-wide">E-Posta <span className="text-destructive" aria-hidden="true">*</span></label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                          aria-required="true"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                          className={`input-premium w-full ${errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/20 bg-destructive/5' : touched.email && !errors.email ? 'border-primary focus:border-primary' : ''}`}
                          placeholder="maya.chen@sirket.com"
                        />
                        <AnimatePresence>
                          {errors.email && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="email-error" className="text-xs font-medium text-destructive mt-1" role="alert">{errors.email}</motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-bold text-muted uppercase tracking-wide">Telefon</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "phone-error" : undefined}
                          className={`input-premium w-full ${errors.phone ? 'border-destructive focus:border-destructive focus:ring-destructive/20 bg-destructive/5' : touched.phone && !errors.phone && formData.phone ? 'border-primary focus:border-primary' : ''}`}
                          placeholder="+90 (555) 000 00 00"
                        />
                        <AnimatePresence>
                          {errors.phone && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="phone-error" className="text-xs font-medium text-destructive mt-1" role="alert">{errors.phone}</motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="company" className="text-sm font-bold text-muted uppercase tracking-wide">Şirket Adı</label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                          aria-invalid={!!errors.company}
                          aria-describedby={errors.company ? "company-error" : undefined}
                          className={`input-premium w-full ${errors.company ? 'border-destructive focus:border-destructive focus:ring-destructive/20 bg-destructive/5' : touched.company && !errors.company && formData.company ? 'border-primary focus:border-primary' : ''}`}
                          placeholder="Örn: Meridian Labs"
                        />
                        <AnimatePresence>
                          {errors.company && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="company-error" className="text-xs font-medium text-destructive mt-1" role="alert">{errors.company}</motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="service" className="text-sm font-bold text-muted uppercase tracking-wide">İlgilendiğiniz Hizmet <span className="text-destructive" aria-hidden="true">*</span></label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        aria-required="true"
                        aria-invalid={!!errors.service}
                        aria-describedby={errors.service ? "service-error" : undefined}
                        className={`input-premium w-full appearance-none ${errors.service ? 'border-destructive focus:border-destructive focus:ring-destructive/20 bg-destructive/5' : touched.service && !errors.service ? 'border-primary focus:border-primary' : ''}`}
                      >
                        <option value="" className="bg-background">Seçiniz...</option>
                        <option value="RPA" className="bg-background">RPA (Robotik Süreç Otomasyonu)</option>
                        <option value="B2B Radar" className="bg-background">B2B Radar (Potansiyel Müşteri Bulma)</option>
                        <option value="AI Eğitim" className="bg-background">Kurumsal AI Eğitimi</option>
                        <option value="Global İhale Takibi" className="bg-background">Global İhale Takibi</option>
                        <option value="Diğer" className="bg-background">Diğer</option>
                      </select>
                      <AnimatePresence>
                        {errors.service && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="service-error" className="text-xs font-medium text-destructive mt-1" role="alert">{errors.service}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-bold text-muted uppercase tracking-wide">Mesajınız <span className="text-destructive" aria-hidden="true">*</span></label>
                      <textarea
                        id="message"
                        name="message"
                        maxLength={5000}
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        aria-required="true"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        className={`input-premium w-full resize-none ${errors.message ? 'border-destructive focus:border-destructive focus:ring-destructive/20 bg-destructive/5' : touched.message && !errors.message && formData.message ? 'border-primary focus:border-primary' : ''}`}
                        placeholder="Projenizden veya ihtiyaçlarınızdan kısaca bahsedin..."
                      />
                      <AnimatePresence>
                        {errors.message && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} id="message-error" className="text-xs font-medium text-destructive mt-1" role="alert">{errors.message}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-label={isSubmitting ? "Form gönderiliyor, lütfen bekleyin" : "Formu Gönder"}
                      className="btn-premium w-full"
                    >
                      {isSubmitting && (
                        <div className="absolute inset-0 bg-background/20 animate-pulse-fast pointer-events-none rounded-lg"></div>
                      )}
                      
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin shrink-0 mr-2" aria-hidden="true" />
                          <span>Gönderiliyor...</span>
                        </>
                      ) : (
                        <>
                          <span className="mr-2">Gönder</span>
                          <Send className="w-5 h-5 shrink-0" aria-hidden="true" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-muted mt-4">
                      Bilgileriniz güvende tutulmaktadır. Satış ekibimiz en kısa sürede size dönüş yapacaktır.
                    </p>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ContactPage;
