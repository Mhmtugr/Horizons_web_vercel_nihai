
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntegratedAi } from '@/hooks/use-integrated-ai.jsx';
import { AlertCircle, RefreshCcw, X, CheckCircle2, History, Trash2, Send, User, MessageSquare, FileText, Loader2, Calendar, ArrowLeft } from 'lucide-react';
import { useChatHistory } from '@/hooks/useChatHistory.js';
import { useAnalytics } from '@/hooks/useAnalytics.js';
import CalendlyWidget from './CalendlyWidget.jsx';

const INITIAL_QUESTIONS = [
  'Hizmetleriniz hakkında bilgi alabilir miyim?',
  'Toplantı planla',
  'Gerçek kişi ile görüş',
  'Fiyatlandırmanız nasıl?',
  'Nasıl başlayabilirim?'
];

function AdvancedChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [successState, setSuccessState] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [showCalendly, setShowCalendly] = useState(false);
  
  // Request Form States
  const [requestState, setRequestState] = useState('idle'); // 'idle' | 'summary' | 'contact' | 'success'
  const [requestSummary, setRequestSummary] = useState('');
  const [contactInfo, setContactInfo] = useState({ name: '', surname: '', email: '', phone: '' });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastMessageRef = useRef('');
  const sessionStartTime = useRef(Date.now());
  
  const { messages, sendMessage, isStreaming } = useIntegratedAi();
  const { conversations, searchQuery, setSearchQuery, saveConversation, deleteConversation, clearHistory } = useChatHistory();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const handleCrispClose = () => {
      document.body.classList.remove('crisp-active');
      setIsOpen(true);
    };

    const attachCrispEvents = () => {
      if (window.$crisp) {
        window.$crisp.push(["on", "chat:closed", handleCrispClose]);
      } else {
        setTimeout(attachCrispEvents, 1000);
      }
    };
    attachCrispEvents();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    const handleOpenChatEvent = (e) => {
      setIsOpen(true);
      trackEvent('chatbot_opened', { source: e.detail?.source || 'event' });
      
      if (e.detail?.mode === 'request') {
         handleOpenRequestForm();
      }

      setTimeout(() => {
        scrollToBottom();
        if (inputRef.current && requestState === 'idle') inputRef.current.focus();
      }, 100);
    };

    window.addEventListener('open-ai-chat', handleOpenChatEvent);
    return () => window.removeEventListener('open-ai-chat', handleOpenChatEvent);
  }, [trackEvent, localMessages, requestState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !showHistory && requestState === 'idle') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showHistory, requestState]);

  const scrollToBottom = () => {
    if (messagesEndRef.current && !showHistory) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen && !showHistory) {
      scrollToBottom();
    }
  }, [localMessages, isStreaming, isOpen, isSubmitting, errorState, successState, showHistory, requestState]);

  const handleClose = () => {
    const timeSpent = Math.round((Date.now() - sessionStartTime.current) / 1000);
    trackEvent('time_spent', { seconds: timeSpent, component: 'chatbot' });
    
    if (localMessages.length > 0) {
      saveConversation(null, `Chat ${new Date().toLocaleTimeString()}`, localMessages);
    }
    setIsOpen(false);
  };

  const handleError = (err) => {
    console.error(`❌ Chatbot Error:`, err);
    let msg = 'Bir hata oluştu. Lütfen tekrar deneyin.';
    if (err.name === 'AbortError') msg = 'Sunucu yanıt vermedi (Zaman aşımı).';
    if (err.message?.includes('Network') || err.message?.includes('fetch')) msg = 'Ağ bağlantısı kurulamadı.';
    setErrorState(msg);
  };

  const dismissError = () => setErrorState(null);

  const handleRetry = () => {
    dismissError();
    if (lastMessageRef.current) {
      setInputValue(lastMessageRef.current);
      handleSendMessage(lastMessageRef.current);
    }
  };

  const showSuccess = (message) => {
    setSuccessState(message);
    setTimeout(() => setSuccessState(null), 5000);
  };

  const handleSendMessage = async (retryText = null) => {
    const text = retryText || inputValue;
    
    if (!text || typeof text !== 'string' || !text.trim() || isSubmitting || isStreaming) return;

    if (text.length > 5000) {
      setErrorState('Mesaj en fazla 5000 karakter olmalıdır.');
      return;
    }

    const trimmedText = text.trim();
    lastMessageRef.current = trimmedText;
    
    if (!retryText) {
      setLocalMessages(prev => [...prev, { role: 'user', content: trimmedText, created: new Date().toISOString() }]);
    }
    
    setInputValue('');
    setIsSubmitting(true);
    dismissError();
    trackEvent('message_sent', { length: trimmedText.length });

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 15000);

    try {
      const timeoutPromise = new Promise((_, reject) => {
        abortController.signal.addEventListener('abort', () => reject(new Error('TIMEOUT_ERROR')));
      });

      await Promise.race([
        sendMessage(trimmedText),
        timeoutPromise
      ]);
      
      clearTimeout(timeoutId);
      if (inputRef.current && requestState === 'idle') inputRef.current.focus();
    } catch (err) {
      clearTimeout(timeoutId);
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEscalateToHuman = () => {
    setIsSubmitting(true);
    dismissError();
    
    try {
      document.body.classList.add('crisp-active');
      
      const transcript = localMessages.map(msg => `${msg.role === 'user' ? 'Müşteri' : 'Asistan'}: ${cleanContent(msg.content)}`).join('\n\n');
      
      if (window.$crisp) {
        window.$crisp.push(['set', 'user:nickname', ['Ziyaretçi']]);
        window.$crisp.push(['set', 'session:data', [['transcript', transcript], ['escalation_reason', 'User requested human support']]]);
        window.$crisp.push(['do', 'message:send', ['text', `📋 AI SOHBET GEÇMİŞİ\n\n${transcript}`]]);
        
        setIsOpen(false);
        window.$crisp.push(['do', 'chat:show']);
        window.$crisp.push(['do', 'chat:open']);
        
        setIsSubmitting(false);
        showSuccess('Operatöre başarıyla aktarıldınız.');
      } else {
        handleError(new Error('Canlı destek sistemi yüklenemedi.'));
        setIsSubmitting(false);
        document.body.classList.remove('crisp-active');
      }
    } catch (error) {
      handleError(error);
      setIsSubmitting(false);
      document.body.classList.remove('crisp-active');
    }
  };

  const handleOpenRequestForm = () => {
    const userMsgs = localMessages.filter(m => m.role === 'user').map(m => m.content);
    const summary = userMsgs.length > 0 ? userMsgs.join('\n\n') : '';
    setRequestSummary(summary);
    setRequestState('summary');
  };

  const submitRequestForm = async () => {
    if (!contactInfo.name || !contactInfo.surname || !contactInfo.email) {
       setErrorState('Lütfen ad, soyad ve e-posta alanlarını doldurun.');
       return;
    }
    
    setIsSubmittingRequest(true);
    dismissError();
    
    const leadData = `📝 Yeni Talep Formu:\nAd: ${contactInfo.name}\nSoyad: ${contactInfo.surname}\nE-posta: ${contactInfo.email}\nTelefon: ${contactInfo.phone || '-'}\nTalep Özeti: ${requestSummary}`;

    if (window.$crisp) {
      window.$crisp.push(['set', 'user:email', [contactInfo.email]]);
      window.$crisp.push(['set', 'user:nickname', [`${contactInfo.name} ${contactInfo.surname}`]]);
      window.$crisp.push(['do', 'message:send', ['text', leadData]]);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    setRequestState('success');
    setIsSubmittingRequest(false);

    setTimeout(() => {
      setRequestState('idle');
      setContactInfo({ name: '', surname: '', email: '', phone: '' });
      setRequestSummary('');
    }, 5000);
  };

  // DYNAMIC QUICK REPLIES & PARSING
  const extractQuickReplies = (text) => {
    if (!text) return [];
    try {
      const match = text.match(/\{"quickReplies"\s*:\s*\[.*?\]\}/s);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return parsed.quickReplies || [];
      }
    } catch (e) {}
    return [];
  };

  const cleanContent = (text, _isStreaming = false) => {
    if (!text) return text;
    let cleaned = text;

    // Remove complete JSON blocks with quickReplies
    cleaned = cleaned.replace(/\{"quickReplies"\s*:\s*\[[^\]]*\]\}/g, '');
    
    return cleaned.trim();
  };

  const handleQuickReplyClick = (buttonText) => {
    if (buttonText === 'Toplantı planla') {
      setShowCalendly(true);
      window.dispatchEvent(new Event('open-calendar-modal'));
      return;
    }
    if (buttonText === 'Gerçek kişi ile görüş') {
      handleEscalateToHuman();
      return;
    }
    handleSendMessage(buttonText);
  };

  const lastMessage = localMessages[localMessages.length - 1];
  const quickReplies = lastMessage?.role === 'assistant' ? extractQuickReplies(lastMessage.content) : [];

  // FIXED RENDER LOGIC FOR CLOSED STATE
  if (!isOpen) {
    return (
      <>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[60] w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center hover:shadow-primary/40 transition-shadow focus-visible:ring-2 focus-visible:ring-primary outline-none"
          aria-label="AI Asistanı Aç"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
        <CalendlyWidget isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 right-4 z-[60] w-96 max-w-[calc(100vw-2rem)] h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden gpu-accelerated"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <h2 className="text-sm font-bold text-foreground">AI Asistan</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-border rounded-lg transition-colors text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary outline-none"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT AREA */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            <button
              onClick={() => setShowHistory(false)}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover mb-4 focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-md"
            >
              <ArrowLeft className="w-4 h-4" /> Sohbete Dön
            </button>
            {conversations.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">Henüz sohbet geçmişi yok.</p>
            ) : (
              conversations.map((conv, i) => (
                <div key={i} className="p-3 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors">
                  <p className="text-xs font-medium text-muted mb-2">{conv.title}</p>
                  <p className="text-xs text-muted line-clamp-2">{conv.preview}</p>
                  <button
                    onClick={() => deleteConversation(i)}
                    className="mt-2 text-xs text-destructive hover:text-destructive-hover flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-destructive outline-none rounded-md"
                  >
                    <Trash2 className="w-3 h-3" /> Sil
                  </button>
                </div>
              ))
            )}
          </div>
        ) : requestState !== 'idle' ? (
          <div className="flex-1 overflow-y-auto p-4 bg-background">
            {requestState === 'summary' && (
              <div className="space-y-4">
                <h3 className="font-bold text-foreground">Talep Özeti</h3>
                <textarea
                  value={requestSummary}
                  onChange={(e) => setRequestSummary(e.target.value)}
                  className="w-full h-32 p-3 bg-background border border-border rounded-lg text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="Talep özetinizi düzenleyin..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setRequestState('contact')}
                    className="flex-1 bg-primary text-primary-foreground font-bold py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  >
                    Devam Et
                  </button>
                  <button
                    onClick={() => setRequestState('idle')}
                    className="flex-1 bg-background border border-border text-foreground font-bold py-2 rounded-lg hover:bg-border/50 transition-colors text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}

            {requestState === 'contact' && (
              <div className="space-y-3">
                <h3 className="font-bold text-foreground">İletişim Bilgileri</h3>
                <input
                  type="text"
                  placeholder="Ad"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                  className="w-full p-2 bg-background border border-border rounded-lg text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <input
                  type="text"
                  placeholder="Soyad"
                  value={contactInfo.surname}
                  onChange={(e) => setContactInfo({...contactInfo, surname: e.target.value})}
                  className="w-full p-2 bg-background border border-border rounded-lg text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <input
                  type="email"
                  placeholder="E-posta"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  className="w-full p-2 bg-background border border-border rounded-lg text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <input
                  type="tel"
                  placeholder="Telefon (opsiyonel)"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  className="w-full p-2 bg-background border border-border rounded-lg text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitRequestForm}
                    disabled={isSubmittingRequest}
                    className="flex-1 bg-primary text-primary-foreground font-bold py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary outline-none flex items-center justify-center"
                  >
                    {isSubmittingRequest ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gönder'}
                  </button>
                  <button
                    onClick={() => setRequestState('summary')}
                    className="flex-1 bg-background border border-border text-foreground font-bold py-2 rounded-lg hover:bg-border/50 transition-colors text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  >
                    Geri
                  </button>
                </div>
              </div>
            )}

            {requestState === 'success' && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-900/30 m-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-bold text-green-800 dark:text-green-300 mb-2 text-lg">Talebiniz Başarıyla Alındı!</h4>
                <p className="text-sm text-green-700 dark:text-green-400/80">
                  Uzmanlarımız en kısa sürede sizinle ({contactInfo.email || contactInfo.phone}) iletişime geçecektir.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background custom-scrollbar">
            {localMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="w-12 h-12 text-primary/30 mb-3" />
                <p className="text-sm text-muted">Merhaba! Size nasıl yardımcı olabilirim?</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-xs">
                  {INITIAL_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReplyClick(q)}
                      className="text-xs font-medium bg-card border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary px-3 py-2 rounded-full transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {localMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-background border border-border text-foreground rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{cleanContent(msg.content)}</p>
                    </div>
                  </div>
                ))}
                
                {/* Dynamic Quick Replies */}
                {quickReplies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 mt-3 ml-2"
                  >
                    {quickReplies.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReplyClick(q)}
                        className="text-xs font-medium bg-background border border-border text-muted-foreground hover:bg-card hover:text-foreground px-3 py-1.5 rounded-full transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {q}
                      </button>
                    ))}
                  </motion.div>
                )}
              </>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}

        {/* ERROR STATE */}
        <AnimatePresence>
          {errorState && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 py-3 bg-destructive/10 border-t border-destructive/20 text-destructive text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorState}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRetry}
                  className="text-xs font-bold hover:underline focus-visible:ring-2 focus-visible:ring-destructive outline-none rounded-sm"
                >
                  Tekrar
                </button>
                <button
                  onClick={dismissError}
                  className="text-xs font-bold hover:underline focus-visible:ring-2 focus-visible:ring-destructive outline-none rounded-sm"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INPUT AREA */}
        {!showHistory && requestState === 'idle' && (
          <div className="p-4 border-t border-border bg-card shrink-0 space-y-2">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                disabled={isSubmitting || isStreaming}
                rows={2}
                className="flex-1 p-2 bg-background border border-border rounded-lg text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSubmitting || isStreaming || !inputValue.trim()}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none flex items-center justify-center"
                aria-label="Gönder"
              >
                {isSubmitting || isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-1 text-muted hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-md px-2 py-1"
              >
                <History className="w-3 h-3" /> Geçmiş
              </button>
              <button
                onClick={handleEscalateToHuman}
                disabled={isSubmitting}
                className="flex items-center gap-1 text-muted hover:text-foreground transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-md px-2 py-1"
              >
                <User className="w-3 h-3" /> Gerçek Kişiyle Görüş
              </button>
              <button
                onClick={handleOpenRequestForm}
                className="flex items-center gap-1 text-muted hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-md px-2 py-1"
              >
                <FileText className="w-3 h-3" /> Talep
              </button>
            </div>
          </div>
        )}
      </motion.div>
      <CalendlyWidget isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
    </>
  );
}

export default AdvancedChatbot;
