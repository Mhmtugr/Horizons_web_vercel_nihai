import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CheckCircle2, History, Trash2, Send, User, MessageSquare, FileText, Loader2, Calendar, ArrowLeft, Bot, Sparkles, Phone } from 'lucide-react';
import CalendlyWidget from './CalendlyWidget.jsx';
import { useChatHistory } from '@/hooks/useChatHistory.js';
import { useAnalytics } from '@/hooks/useAnalytics.js';
// --- GOOGLE AI SDK ---
import { GoogleGenerativeAI } from "@google/generative-ai";

const INITIAL_QUESTIONS =[
  'Hizmetleriniz hakkında bilgi alabilir miyim?',
  'Toplantı planla',
  'Gerçek kişi ile görüş',
  'Fiyatlandırmanız nasıl?',
  'Nasıl başlayabilirim?'
];

// GÜVENLİ API VE MODEL TANIMLARI
const GEMINI_API_KEY = "AIzaSyC5FtSklR0kn6h_9A5Slbb148zvihlnz1w"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const PRIMARY_MODEL = "gemini-3.1-pro";
const FALLBACK_MODEL = "gemini-3-flash-preview";

export default function AdvancedChatbot() {
  // --- STATES (TAM KAPSAM) ---
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [localMessages, setLocalMessages] = useState([
     { role: 'assistant', content: 'Merhaba! Ben Nova Teknoloji Akıllı Danışmanı. İş süreçlerinizi optimize etmek için buradayım, nasıl yardımcı olabilirim?', created: new Date().toISOString() }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [showCalendly, setShowCalendly] = useState(false);
  
  // REQUEST FORM STATES
  const [requestState, setRequestState] = useState('idle'); 
  const [requestSummary, setRequestSummary] = useState('');
  const [contactInfo, setContactInfo] = useState({ name: '', surname: '', email: '', phone: '' });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // REFS & HOOKS
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastMessageRef = useRef('');
  const sessionStartTime = useRef(Date.now());
  
  const { conversations, saveConversation, deleteConversation } = useChatHistory();
  const { trackEvent } = useAnalytics();

  // 1. CRISP & GHOST MODE
  useEffect(() => {
    if (typeof window !== "undefined" && window.$crisp) {
        window.$crisp.push(["do", "chat:hide"]);
    }
    const handleCrispClose = () => {
      document.body.classList.remove('crisp-active');
      setIsOpen(true);
    };
    if (window.$crisp) {
      window.$crisp.push(["on", "chat:closed", handleCrispClose]);
    }
  }, []);

  // 2. SCROLL LOGIC
  const scrollToBottom = () => {
    if (messagesEndRef.current && !showHistory) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    if (isOpen && !showHistory && requestState === 'idle') {
      scrollToBottom();
    }
  }, [localMessages, isSubmitting, isOpen, showHistory, requestState]);

  // 3. GLOBAL TRIGGERS
  useEffect(() => {
    const handleOpenChatEvent = (e) => {
      setIsOpen(true);
      if(trackEvent) trackEvent('chatbot_opened', { source: e.detail?.source || 'event' });
      if (e.detail?.mode === 'request') handleOpenRequestForm();
      setTimeout(() => scrollToBottom(), 100);
    };
    window.addEventListener('open-ai-chat', handleOpenChatEvent);
    return () => window.removeEventListener('open-ai-chat', handleOpenChatEvent);
  }, [trackEvent, requestState]);

  const handleClose = () => {
    const timeSpent = Math.round((Date.now() - sessionStartTime.current) / 1000);
    if(trackEvent) trackEvent('time_spent', { seconds: timeSpent, component: 'chatbot' });
    if (localMessages.length > 0) saveConversation(null, `Chat ${new Date().toLocaleTimeString()}`, localMessages);
    setIsOpen(false);
  };

  const dismissError = () => setErrorState(null);

  // 4. SEAMLESS HANDOFF (CRISP)
  const handleEscalateToHuman = useCallback(() => {
    setIsSubmitting(true);
    dismissError();
    try {
      const transcript = localMessages.map(msg => `[${msg.role.toUpperCase()}]: ${cleanContent(msg.content)}`).join('\n\n');
      if (window.$crisp) {
        document.body.classList.add('crisp-active');
        window.$crisp.push(['set', 'user:nickname', ['Nova Ziyaretçisi']]);
        window.$crisp.push(['do', 'message:send', ['text', `🚨 CANLI DESTEK TALEBİ\n\nGeçmiş:\n${transcript}`]]);
        setIsOpen(false); 
        window.$crisp.push(['do', 'chat:show']);
        window.$crisp.push(['do', 'chat:open']);
      } else {
        window.open('https://wa.me/905468667215', '_blank');
      }
    } catch (error) {
      setErrorState('Bağlantı hatası.');
    } finally {
      setIsSubmitting(false);
    }
  }, [localMessages]);

  // 5. LEAD FORM LOGIC
  const handleOpenRequestForm = () => {
    const userMsgs = localMessages.filter(m => m.role === 'user').map(m => m.content).join(' ');
    setRequestSummary(userMsgs.length > 5 ? `Talebim: ${userMsgs}` : 'Hizmetleriniz hakkında detaylı bilgi ve fiyatlandırma dökümü rica ediyorum.');
    setRequestState('summary');
  };

  const submitRequestForm = async () => {
    if (!contactInfo.name || !contactInfo.surname || !contactInfo.email) {
       setErrorState('Lütfen gerekli alanları doldurun.'); return;
    }
    setIsSubmittingRequest(true);
    const leadData = `🌟 YENİ TALEP\nİsim: ${contactInfo.name} ${contactInfo.surname}\nMail: ${contactInfo.email}\nÖzet: ${requestSummary}`;
    try {
        if (window.$crisp) {
            window.$crisp.push(['set', 'user:email', [contactInfo.email]]);
            window.$crisp.push(['do', 'message:send', ['text', leadData]]);
            setTimeout(() => {
                setRequestState('success');
                setIsSubmittingRequest(false);
                setTimeout(() => setRequestState('idle'), 3000);
            }, 600);
        }
    } catch(err) { setIsSubmittingRequest(false); setErrorState("Hata oluştu."); }
  };

  // 6. NİHAİ AI MOTORU (GEMINI GEN 3)
  const handleSendMessage = async (textToProcess) => {
    const text = typeof textToProcess === 'string' ? textToProcess : inputValue;
    if (!text || !text.trim() || isSubmitting) return;

    const trimmedText = text.trim();
    lastMessageRef.current = trimmedText;
    const newMessagesHistory = [...localMessages, { role: 'user', content: trimmedText, created: new Date().toISOString() }];
    setLocalMessages(newMessagesHistory);
    setInputValue(''); 
    setIsSubmitting(true);
    dismissError();

    const SYSTEM_PROMPT = `Sen Nova Teknoloji şirketinin 'Kurumsal B2B Satış Stratejisti'sin. Tesla ve Apple profesyonelliğinde davran. 
    Fiyat sorulursa: 'Kurulum 1.000€-10.000€, Aylık Destek 100€-3.000€' bilgisini net ver. 
    Kullanıcı randevu/toplantı isterse LAF UZATMA, sadece 'Sizi takvimime davet ediyorum, lütfen aşağıdan seçiniz' yaz. 
    HER CEVABIN SONUNA ŞU FORMATTA JSON EKLE: {"quickReplies":["Hizmetler","Fiyatlar","Toplantı Planla"]}`;

    try {
      const chatContext = newMessagesHistory.slice(-5).map(m => `${m.role}: ${m.content}`).join("\n");
      let aiResponseText = "";
      try {
        const proModel = genAI.getGenerativeModel({ model: PRIMARY_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await proModel.generateContent(chatContext);
        aiResponseText = result.response.text();
      } catch (proErr) {
        const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await fallbackModel.generateContent(chatContext);
        aiResponseText = result.response.text();
      }
      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: aiResponseText, created: new Date().toISOString() }]);
    } catch (err) {
      setErrorState("API Hatası.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. HELPER FUNCTIONS
  const extractQuickReplies = (text) => {
    if (!text) return [];
    try {
      const match = text.match(/\{"quickReplies"\s*:\s*\[.*?\]\}/s);
      if (match) return JSON.parse(match[0]).quickReplies || [];
    } catch (e) {} return [];
  };

  const cleanContent = (text) => {
    if (!text) return text;
    return text.replace(/\{"quickReplies"\s*:\s*\[[^\]]*\]\}/g, '').trim();
  };

  const handleQuickReplyClick = (btnText) => {
    if (btnText.toLowerCase().match(/toplantı|randevu|planla/)) {
      setShowCalendly(true); return;
    }
    if (btnText.toLowerCase().match(/gerçek kişi|canlı|operatör/)) {
      handleEscalateToHuman(); return;
    }
    handleSendMessage(btnText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const lastMessage = localMessages[localMessages.length - 1];
  const dynamicQuickReplies = lastMessage?.role === 'assistant' ? extractQuickReplies(lastMessage.content) : [];

  if (!isOpen) {
    return (
      <>
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-28 right-6 z-[60] w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-600 text-white rounded-full flex justify-center items-center shadow-xl"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
        {showCalendly && <CalendlyWidget isOpen={showCalendly} onClose={() => setShowCalendly(false)} />}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-5 right-4 sm:right-6 z-[65] w-[calc(100vw-2rem)] sm:w-[410px] h-[650px] max-h-[85vh] bg-[#0A0F17] border border-emerald-500/30 rounded-[22px] flex flex-col shadow-2xl overflow-hidden font-sans"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#060A10]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative">
                 <Bot className="w-5 h-5 text-emerald-400" />
                 <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-pulse"></div>
             </div>
             <div>
                <h2 className="text-sm font-bold text-gray-100 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-emerald-400"/> NOVA CORE</h2>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Enterprise AI Asistanı</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-4 bg-[#0A0F17]">
            <button onClick={() => setShowHistory(false)} className="flex items-center gap-2 mb-4 text-xs font-bold text-emerald-500"><ArrowLeft size={14}/> Geri Dön</button>
            {conversations.map((conv, i) => (
              <div key={i} className="p-3 mb-2 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center">
                <span className="text-xs text-gray-300 truncate">{conv.title}</span>
                <Trash2 size={14} className="text-red-500 cursor-pointer" onClick={() => deleteConversation(i)}/>
              </div>
            ))}
          </div>
        ) : requestState !== 'idle' ? (
          <div className="flex-1 overflow-y-auto p-5 bg-slate-900">
             {requestState === 'summary' && (
                <div className="flex flex-col h-full animate-fade-in">
                   <p className="text-[10px] font-bold text-emerald-400 mb-2 uppercase">1/2 Talep Önizleme</p>
                   <textarea value={requestSummary} onChange={e=>setRequestSummary(e.target.value)} className="w-full flex-1 p-3 bg-black border border-gray-700 rounded-xl text-sm text-gray-200 resize-none outline-none focus:border-emerald-500" />
                   <div className="flex gap-2 mt-4"><button onClick={()=>setRequestState('idle')} className="flex-1 py-3 bg-gray-800 rounded-xl text-xs text-white">İptal</button><button onClick={()=>setRequestState('contact')} className="flex-1 py-3 bg-emerald-500 rounded-xl text-xs font-bold text-black">Devam Et</button></div>
                </div>
             )}
             {requestState === 'contact' && (
                <div className="flex flex-col h-full animate-fade-in space-y-3">
                   <p className="text-[10px] font-bold text-cyan-400 mb-1 uppercase">2/2 İletişim Bilgileri</p>
                   <div className="grid grid-cols-2 gap-2">
                      <input placeholder="Ad *" value={contactInfo.name} onChange={e=>setContactInfo({...contactInfo, name: e.target.value})} className="p-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500" />
                      <input placeholder="Soyad *" value={contactInfo.surname} onChange={e=>setContactInfo({...contactInfo, surname: e.target.value})} className="p-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500" />
                   </div>
                   <input placeholder="E-posta *" type="email" value={contactInfo.email} onChange={e=>setContactInfo({...contactInfo, email: e.target.value})} className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500" />
                   <input placeholder="Telefon" type="tel" value={contactInfo.phone} onChange={e=>setContactInfo({...contactInfo, phone: e.target.value})} className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white outline-none focus:border-cyan-500" />
                   <button onClick={submitRequestForm} disabled={isSubmittingRequest} className="w-full py-4 bg-emerald-500 rounded-xl font-bold text-sm text-black mt-auto uppercase shadow-lg shadow-emerald-500/20">{isSubmittingRequest ? <Loader2 className='animate-spin mx-auto'/> : 'Talebi İlet'}</button>
                </div>
             )}
             {requestState === 'success' && (
                <div className="h-full flex flex-col justify-center items-center text-center"><CheckCircle2 size={48} className="text-emerald-500 mb-4"/><h3 className="text-white font-bold">Başarıyla Alındı</h3><p className="text-gray-400 text-xs mt-2">Uzmanımız en kısa sürede dönüş yapacaktır.</p></div>
             )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0F17]">
            {localMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`p-3 max-w-[85%] text-[13.5px] leading-relaxed rounded-2xl ${m.role === 'user' ? 'bg-emerald-500 border border-emerald-600 text-black font-semibold rounded-tr-sm' : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-sm'}`}>
                  <p>{cleanContent(m.content)}</p>
                </div>
              </div>
            ))}
            {isSubmitting && <div className="flex gap-1 pl-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-75"></span><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></span></div>}
            <div ref={messagesEndRef} />
            <div className="flex flex-wrap gap-2 pt-2">
              {(localMessages.length === 1 ? INITIAL_QUESTIONS : dynamicQuickReplies).map((q, i) => (
                <button key={i} onClick={() => handleQuickReplyClick(q)} className="px-3 py-1.5 bg-gray-900 border border-gray-800 text-[11px] text-gray-400 rounded-full hover:border-emerald-500 hover:text-white transition-all">{q}</button>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM INPUT */}
        {requestState === 'idle' && !showHistory && (
          <div className="p-3 bg-[#060A10] border-t border-gray-800">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button onClick={handleOpenRequestForm} className="flex justify-center items-center gap-1 p-2 bg-gray-800 text-[10px] text-gray-400 font-bold rounded-lg border border-gray-700 hover:bg-gray-700"><FileText size={12}/> Talep At</button>
              <button onClick={() => setShowCalendly(true)} className="flex justify-center items-center gap-1 p-2 bg-emerald-500/10 text-[10px] text-emerald-400 font-bold rounded-lg border border-emerald-500/30 hover:bg-emerald-500/20"><Calendar size={12}/> Toplantı</button>
              <button onClick={handleEscalateToHuman} className="flex justify-center items-center p-2 bg-red-500/10 text-[10px] text-red-400 font-bold rounded-lg border border-red-500/30 hover:bg-red-500/20 uppercase">Gerçek Kişi</button>
            </div>
            <div className="flex gap-2 bg-[#121A26] border border-gray-700 rounded-xl p-1">
              <input type="text" ref={inputRef} value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyPress} placeholder="Mesajınız..." className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600" />
              <button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isSubmitting} className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center disabled:opacity-30"><Send size={18} className="text-black ml-0.5"/></button>
            </div>
          </div>
        )}
      </motion.div>
      <CalendlyWidget isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
    </>
  );
}
