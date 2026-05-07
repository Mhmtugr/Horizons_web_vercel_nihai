
import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdvancedChatbot from '@/components/AdvancedChatbot.jsx';
import FloatingWidget from '@/components/FloatingWidget.jsx';
import CalendarModal from '@/components/CalendarModal.jsx';

function CrispManager() {
  useEffect(() => {
    const initCrisp = () => {
      if (window.$crisp) {
        window.$crisp.push(["config", "hide:on:desktop", true]);
        window.$crisp.push(["config", "hide:on:mobile", true]);
      } else {
        setTimeout(initCrisp, 500);
      }
    };
    initCrisp();
  }, []);

  return null;
}

function App() {
  useEffect(() => {
    const handleOpenAiChat = (e) => {
      console.log('✅ Global event received: open-ai-chat', e.detail);
    };

    window.addEventListener('open-ai-chat', handleOpenAiChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenAiChat);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <CrispManager />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      
      {/* Global Persistent Overlays */}
      <FloatingWidget />
      <AdvancedChatbot />
      <CalendarModal />
      
      <Toaster position="top-center" richColors theme="dark" />
    </Router>
  );
}

export default App;
