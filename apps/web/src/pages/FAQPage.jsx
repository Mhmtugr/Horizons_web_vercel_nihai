import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { faqData } from '../lib/data.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function FAQPage() {
  const openAIChat = () => {
    window.dispatchEvent(new Event('open-ai-chat'));
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Helmet>
        <title>Sıkça Sorulan Sorular | Nova Teknoloji</title>
        <meta name="description" content="AI süreç otomasyonu, implementasyon ve fiyatlandırma hakkında merak edilenler." />
      </Helmet>

      <Header />

      <main className="pt-32 pb-24 min-h-[80vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">Sıkça Sorulan Sorular</h1>
            <p className="text-muted text-lg">
              Operasyonel otonomi yolculuğunuzda aklınıza takılan soruların yanıtları.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card px-6 rounded-xl border border-border shadow-sm">
                  <AccordionTrigger className="text-left font-bold text-lg text-foreground hover:text-primary transition-colors py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted leading-relaxed pb-6 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-16 text-center bg-card p-8 rounded-2xl border border-border shadow-lg"
          >
            <h3 className="text-xl font-bold text-foreground mb-4">Aradığınız cevabı bulamadınız mı?</h3>
            <p className="text-muted mb-6">Nova AI Asistanımız 7/24 hizmetinizde.</p>
            <button 
              onClick={openAIChat}
              className="btn-premium flex items-center justify-center space-x-2 mx-auto"
            >
              <MessageSquare className="w-5 h-5" />
              <span>AI Danışmanımızla Sohbet Edin</span>
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FAQPage;