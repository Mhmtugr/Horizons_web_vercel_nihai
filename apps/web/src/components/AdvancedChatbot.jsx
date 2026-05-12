import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Tümü eksiksiz
import { AlertCircle, X, CheckCircle2, History, Trash2, Send, User, MessageSquare, FileText, Loader2, Calendar, ArrowLeft, Bot, Sparkles } from 'lucide-react';
import CalendlyWidget from './CalendlyWidget.jsx';
import { useChatHistory } from '@/hooks/useChatHistory.js';
import { useAnalytics } from '@/hooks/useAnalytics.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const INITIAL_QUESTIONS =[
  'Hizmetleriniz hakkında bilgi alabilir miyim?',
  'Toplantı planla',
  'Gerçek kişi ile görüş',
  'Fiyatlandırmanız nasıl?',
  'Nasıl başlayabilirim?'
];

// Güvenli Key Importu (Vite üzerinden)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyC5FtSklR0kn6h_9A5Slbb148zvihlnz1w"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const PRIMARY_MODEL = "gemini-3.1-pro";
const FALLBACK_MODEL = "gemini-3-flash-preview";

export default function AdvancedChatbot() {
  
  // -- STATES (Aynen Korundu) --
  const[isOpen, setIsOpen] = useState(false);
  const[showHistory, setShowHistory] = useState(false);
  const[localMessages, setLocalMessages] = useState([
     { role: 'assistant', content: 'Nova Teknoloji. Üretim bandınızdan yazılım altyapınıza kadar şirketinizi Otonom geleceğe taşımak için buradayım. Vizyonunuzu birlikte inşa edelim.', created: new Date().toISOString() }
  ]);
  const[isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const[inputValue, setInputValue] = useState('');
  const [showCalendly, setShowCalendly] = useState(false);
  
  const[requestState, setRequestState] = useState('idle'); 
  const[requestSummary, setRequestSummary] = useState('');
  const[contactInfo, setContactInfo] = useState({ name: '', surname: '', email: '', phone: '' });
  const[isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // -- REFERENCES --
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastMessageRef = useRef('');
  const sessionStartTime = useRef(Date.now());
  const { conversations, saveConversation, deleteConversation } = useChatHistory();
  const { trackEvent } = useAnalytics();

  const dismissError = useCallback(() => { setErrorState(null); },[]);

  // 1. CRISP GHOST MODE (Aynen korundu)
  useEffect(() => {
    const applyGhostMode = () => {
      if (typeof window !== "undefined" && window.$crisp) {
          window.$crisp.push(["do", "chat:hide"]);
          window.$crisp.push(["on", "chat:closed", () => {
             document.body.classList.remove('crisp-active');
             setIsOpen(true);
             window.$crisp.push(["do", "chat:hide"]); 
          }]);
      }
    };
    applyGhostMode();
    const interval = setInterval(() => { if(window.$crisp) { applyGhostMode(); clearInterval(interval); } }, 1000);
    return () => clearInterval(interval);
  },[]);

  // 2. SMOOTH SCROLL (Aynen Korundu)
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  };

  useEffect(() => {
    if (isOpen && !showHistory && requestState === 'idle') scrollToBottom();
  },[localMessages, isSubmitting, isOpen, showHistory, requestState]);

  useEffect(() => {
    const handleOpenChatEvent = (e) => {
      setIsOpen(true);
      if(trackEvent) trackEvent('chatbot_opened', { source: e.detail?.source || 'event' });
      if (e.detail?.mode === 'request') handleOpenRequestForm();
    };
    window.addEventListener('open-ai-chat', handleOpenChatEvent);
    return () => window.removeEventListener('open-ai-chat', handleOpenChatEvent);
  },[trackEvent, requestState]);

  const handleClose = () => {
    const timeSpent = Math.round((Date.now() - sessionStartTime.current) / 1000);
    if(trackEvent) trackEvent('time_spent', { seconds: timeSpent, component: 'chatbot' });
    if (saveConversation && localMessages.length > 0) saveConversation(null, `Sohbet - ${new Date().toLocaleTimeString()}`, localMessages);
    setIsOpen(false);
  };
  
  // 3. HUMAN HANDOFF (Aynen Korundu)
  const handleEscalateToHuman = useCallback(() => {
    setIsSubmitting(true);
    dismissError();
    try {
      const transcript = localMessages.map(msg => `[${msg.role.toUpperCase()}]: ${cleanContent(msg.content)}`).join('\n\n');
      
      if (window.$crisp) {
        document.body.classList.add('crisp-active');
        window.$crisp.push(['set', 'user:nickname',['Nova Müşteri Danışanı']]);
        window.$crisp.push(['do', 'message:send',['text', `🚨 VIP (YÜZ YÜZE/MOBIL CANLI DANIŞMA) TALEBİ GELDİ:\n\nDIOLOG MİRASI:\n${transcript}`]]);
        
        setLocalMessages(prev =>[...prev, {
             role: 'assistant',
             content: 'Departmanlarımız üzerinden Nova yöneticilerini bağlıyorum, pencereden lütfen ayrılmayın...',
             created: new Date().toISOString()
        }]);

        setTimeout(() => {
            setIsOpen(false); 
            window.$crisp.push(['do', 'chat:show']);
            window.$crisp.push(['do', 'chat:open']);
        }, 1200); 
      } else {
         window.open('https://wa.me/905468667215?text=Merhaba%20Kurumsal%20Destek,%20otomasyon%20uygulamaları%20hakkinda%20konusmak%20icin%20aktarildim', '_blank');
      }
    } catch (error) {
      setErrorState('VIP Hata: İnternet ağı yavaşlığı.');
    } finally {
       setIsSubmitting(false);
    }
  }, [localMessages, dismissError]);

  // 4. MUKEMMEL TALEP FORMU ACTARIMI (Aynen Korundu)
  const handleOpenRequestForm = () => {
    const userMsgs = localMessages.filter(m => m.role === 'user').map(m => m.content).join(' ');
    const autoSummary = userMsgs.length > 5 
        ? `Süreç Girdisi:\n${userMsgs}` 
        : `Kurumumuzun potansiyel otonom süreçler ve donanımlarla revize edilmesi üzerine fiyat aralığı bilgisi veya teklif toplantısı arzu etmekteyiz.`;
        
    setRequestSummary(autoSummary);
    setRequestState('summary');
  };

  const submitRequestForm = async () => {
    if (!contactInfo.name || !contactInfo.surname || !contactInfo.email) {
       setErrorState('Zorunlu Güvenlik İlkesi: Mail Adresi, Ad ve Soyad zorunludur.'); return;
    }
    setIsSubmittingRequest(true); dismissError();
    
    const leadData = `📌 ARAYÜZ (WEB TALEP KAYDI)\nSİM-SYD: ${contactInfo.name} ${contactInfo.surname}\nMAIL: ${contactInfo.email}\nGSM/ŞTİ: ${contactInfo.phone || 'Söylenmedi'}\n\nKONU TALEBI ÖZET:\n${requestSummary}`;

    try {
        if (window.$crisp) {
            window.$crisp.push(['set', 'user:email', [contactInfo.email]]);
            window.$crisp.push(['set', 'user:nickname',[`${contactInfo.name} ${contactInfo.surname}`]]);
            window.$crisp.push(['do', 'message:send', ['text', leadData]]);
            
            setTimeout(() => {
                setRequestState('success');
                setIsSubmittingRequest(false);
                setTimeout(() => {
                    setRequestState('idle');
                    setContactInfo({ name: '', surname: '', email: '', phone: '' });
                    setRequestSummary('');
                    setLocalMessages(prev =>[...prev, { role: 'assistant', content: 'Onay protokolü başarıya ulaştı ve gizli yönergeler merkez sunucu yöneticisine devredildi. Sizi diğer ihtiyaçlarınızla bekliyor, dilerseniz online ajanda toplantısına tıklamayı teşvik ediyorum.', created: new Date().toISOString() }]);
                }, 3800);
            }, 600);
        } else {
             window.location.href = `mailto:info@nexaotomasyon.com.tr?subject=DIJITAL_EKRAN_ILETISI_ALIMI&body=${encodeURIComponent(leadData)}`;
             setRequestState('success'); setIsSubmittingRequest(false);
             setTimeout(() => setRequestState('idle'), 2300);
        }
    } catch(err) {
        setIsSubmittingRequest(false); setErrorState("Portal Korumalı.");
    }
  };

  // 5. GOOGLE GEMINI SÜPER BİLİNC (Aynen Korundu)
  const handleSendMessage = async (textToProcess) => {
    const text = typeof textToProcess === 'string' ? textToProcess : inputValue;
    if (!text || typeof text !== 'string' || !text.trim() || isSubmitting) return;

    const trimmedText = text.trim();
    lastMessageRef.current = trimmedText;
    if(trackEvent) trackEvent('message_sent', { length: trimmedText.length });

    const newMessagesHistory =[...localMessages, { role: 'user', content: trimmedText, created: new Date().toISOString() }];
    setLocalMessages(newMessagesHistory);
    setInputValue(''); 
    setIsSubmitting(true);
    dismissError();

    const SYSTEM_PROMPT = `
      # MİMARİ KARAKTER & TON TÜRÜ
      Benliğinin adı Nova. Nova Teknoloji'nin en Elit, kendinden emin, asil Operasyon Geliştiricisi AI Mimarı'sın.
      Soru fırlatmayacaksın (Kısa tut), hep sonuç-destekli, ağır ve ikna tonu yüksek bir CEO tavrı sun. Laf uzatma, çözümsüz komplo sunma.
      
      # FİYATLAR (AÇIKÇA SÖYLE)
      Uygulamalar özel çözümlü modüler kitlelerde tek paketler baz alınarak teknoloji donanım ihtiyaç sınırında : "1.000 EUR(€)" tabanı ile "10.000 EUR(€)" arasındaki fiyata sahip olmakta... 
      - Destek aylık operasyon bakımları "Aylık Lisans Olarak: "100 Euro ile 3.000 Euro" limitlerinde bulunur. Verimli olduğumuzu hatırlat.
      
      # OTONOM KALKANLI MANTIKSAL ÇALIŞTIRI
      Randevu ayarlamaya çalışan veya "plan" isteyene zaman belirterek LAF UZATMA: "Planlarınızı konuşmak için yanda bir Ekran Takvimiz bulunur ona takılı kalarak istediğiniz zaman seçin!" Diyeceksin O Butonu Sunucak Yapacaksınız! 

      # DIKEY DİNAMİK BUTON (ŞARTTIR)
      Muhakkak her cevabının SONUNA JSON Formatında buton ekleyeceksin! (Örnek: {"quickReplies":["Tavsiye 1", "Tavsiye 2"]}) 
      Toplantı geçiyorsa JSON objesine 'Toplantı Planla' da mutlaka olsun, 3 kelimeyi aşmasın.
      `;

    try {
      const chatContext = newMessagesHistory.slice(-5).map(m => m.role === 'user' ? `[Hedef Aday Müşteri]: ${m.content}` : `[NOVA Yöneticisi AI]: ${m.content}`).join("\n");
      let aiResponseText = "";
      
      try {
        const proModel = genAI.getGenerativeModel({ model: PRIMARY_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await proModel.generateContent(`${chatContext}\n[Hedef Aday Müşteri]: ${trimmedText}`);
        aiResponseText = result.response.text();
      } catch (proErr) {
        console.warn(`[GCP 3 PRO FAIL YAKALANDI. FAILBACK RUN...]`, proErr);
        const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await fallbackModel.generateContent(`${chatContext}\n[Hedef Aday Müşteri]: ${trimmedText}`);
        aiResponseText = result.response.text();
      }

      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: aiResponseText, created: new Date().toISOString() }]);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setErrorState("Veri Ağ Merkezi Yığılımı! Lütfen Yetkili Gerçek Ekibe Geçin.");
      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: "Anlık aşırı veri okumada trafik blokesi yaşıyoruz; lütfen 'Gerçek Kişiyle Görüş' tuşundan bağlanın.", created: new Date().toISOString() }]);
      setIsSubmitting(false);
    }
  };

  const extractQuickReplies = (text) => {
    if (!text) return[];
    try {
      const match = text.match(/\{"quickReplies"\s*:\s*\[.*?\]\}/s);
      if (match) return JSON.parse(match[0]).quickReplies ||[];
    } catch (e) {} return[];
  };

  const cleanContent = (text) => {
    if (!text) return text;
    return text.replace(/\{"quickReplies"\s*:\s*\[[^\]]*\]\}/g, '').trim();
  };

  const handleQuickReplyClick = (btnText) => {
    const textLower = btnText.toLowerCase();
    if (textLower.includes('toplantı') || textLower.includes('randevu') || textLower.includes('planla')) {
      setShowCalendly(true); return;
    }
    if (textLower.includes('gerçek kişi') || textLower.includes('canlı') || textLower.includes('operatör') || textLower.includes('uzman')) {
      handleEscalateToHuman(); return;
    }
    if (textLower.includes('talep') || textLower.includes('form')) {
        handleOpenRequestForm(); return;
    }
    handleSendMessage(btnText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const lastMessage = localMessages[localMessages.length - 1];
  const dynamicQuickReplies = lastMessage?.role === 'assistant' ? extractQuickReplies(lastMessage.content) :[];


  // =========================================================================
  // GÖRSEL (UI) RENDERS: ÇAKIŞMALAR BURADA DÜZELTİLDİ 
  // =========================================================================
  
  if (!isOpen) {
    return (
      <>
        {/* ÇÖZÜM 1: WHATSAPP ÇAKIŞMASI BİTTİ (Buton Yüksekliği ve Z-Index Sabitlendi) */}
        {/* WhatsApp butonunuz varsayilan olarak "bottom-6" gibi bir hizada oldugundan biz botu ondan 80px yukari asiyoruz (bottom-[90px]) */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[110px] md:bottom-[90px] right-6 z-[60] w-14 h-14 rounded-full flex justify-center items-center cursor-pointer transition-shadow"
          style={{ background: 'linear-gradient(to right, #10b981, #06b6d4)', boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)' }}
          title="Nova Akıllı Otomasyon Asistanı"
        >
          <Bot className="w-7 h-7 text-white" />
        </motion.button>
        {showCalendly && (<CalendlyWidget isOpen={showCalendly} onClose={() => setShowCalendly(false)} />)}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        // Açılır Pencerenin Konumu WhatsApp ile örtüşmesin diye biraz yukari cekildi (bottom-5 yerine bottom-24 (mobilde) yapıldı).
        className="fixed bottom-[95px] right-4 sm:right-6 z-[70] w-[calc(100vw-2rem)] sm:w-[410px] h-[650px] max-h-[75vh] bg-[#0A0F17]/95 border border-[#10b981]/25 rounded-[22px] flex flex-col shadow-[0_15px_40px_-5px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden font-sans"
      >
        {/* ÜST BİLGİ PANELİ (HEADER) */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#060A10] shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border border-gray-700 bg-gray-800 flex justify-center items-center relative">
               <Bot className="w-5 h-5 text-emerald-400" />
               <div className="absolute right-[-2px] bottom-[2px] w-2.5 h-2.5 bg-[#10b981] border border-[#060A10] rounded-full animate-pulse"></div>
             </div>
             <div>
                <p className="text-[13px] text-gray-100 font-bold uppercase tracking-widest flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#10B981]"/> N O V A</p>
                <p className="text-[10px] text-gray-400">Enterprise AI Asistanı</p>
             </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-white p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition">
             <X className="w-4 h-4"/>
          </button>
        </div>


        {/* FORMLAR, ONAYLAR VE MESAJLAŞMA */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-900 custom-scrollbar z-0 flex flex-col space-y-3" style={{overscrollBehavior: 'contain'}}>
            <button onClick={() => setShowHistory(false)} className="flex gap-2 p-2 hover:bg-white/5 transition items-center font-bold tracking-tight bg-gray-800 border border-gray-700 shadow-sm text-xs text-gray-300 w-fit rounded-lg"><ArrowLeft className='w-4 h-4' /> Sohbet'e Dön </button>
            <p className="text-[10px] uppercase font-bold text-cyan-500 tracking-widest mt-2 mb-1">Geçmiş Konuşmalar</p>
            {(!conversations || conversations.length === 0) ? (
               <div className="p-6 border-dashed border border-gray-700 text-center text-gray-500 text-xs rounded-xl bg-gray-900/50">Görüntülenecek bir geçmiş bulunmamaktadır.</div>
            ) : (
              conversations.map((conv, i) => (
                <div key={i} className="bg-slate-800/60 p-3 border border-gray-700 rounded-xl hover:border-emerald-600/30 transition shadow-inner">
                  <h4 className="text-[13px] text-emerald-100 font-semibold truncate mb-1">{conv.title}</h4>
                  <p className="text-[11.5px] text-gray-400 leading-snug line-clamp-2">{conv.preview}</p>
                  <button onClick={() => deleteConversation(i)} className="mt-2 text-[10px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 uppercase"><Trash2 className='w-3 h-3'/> Sil</button>
                </div>
              ))
            )}
          </div>

        ) : requestState !== 'idle' ? (
           <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#0A0F17] flex flex-col z-0">
               {requestState === 'summary' && (
                  <div className="flex-1 flex flex-col animate-fade-in-up mt-1">
                     <p className="text-[11px] uppercase text-emerald-400 font-bold tracking-widest mb-3">• 1/2 Talep Önizleme </p>
                     <p className="text-xs text-gray-400 mb-2">Hızlı ilerlemek adına konuyu özetledik, aşağıdan düzenleyebilirsiniz:</p>
                     <textarea value={requestSummary} onChange={e=>setRequestSummary(e.target.value)} 
                               className="w-full flex-1 p-3.5 mb-2 rounded-xl border border-gray-700 bg-gray-900 text-[13px] text-gray-200 outline-none resize-none focus:border-emerald-500 transition-colors shadow-inner leading-relaxed" 
                     />
                     <div className="grid grid-cols-2 gap-3 mt-2 shrink-0">
                        <button onClick={()=> setRequestState('idle')} className="py-2.5 bg-gray-800 rounded-lg text-gray-400 hover:bg-gray-700 border border-gray-700 font-medium text-xs">Vazgeç</button>
                        <button onClick={()=> setRequestState('contact')} className="py-2.5 bg-[#10b981] rounded-lg text-slate-900 hover:brightness-110 font-bold text-sm shadow">Sonraki Adım</button>
                     </div>
                  </div>
               )}

               {requestState === 'contact' && (
                  <div className="flex-1 flex flex-col animate-fade-in justify-center space-y-4 pt-1 z-0">
                     <div>
                       <p className="text-[11px] uppercase text-cyan-400 font-bold tracking-widest mb-1">• 2/2 İrtibat Bilgileri</p>
                       <p className="text-gray-400 text-xs">Talebinizle eşleşmesi için (KVKK Onaylı Alan)</p>
                     </div>
                     <div className="flex flex-col gap-2.5">
                           <input placeholder="Ad (Zorunlu)" value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} className="w-full bg-[#121926] p-3.5 text-xs border border-gray-800 text-white rounded-xl focus:border-teal-500 outline-none" />
                           <input placeholder="Soyad (Zorunlu)" value={contactInfo.surname} onChange={e => setContactInfo({...contactInfo, surname: e.target.value})} className="w-full bg-[#121926] p-3.5 text-xs border border-gray-800 text-white rounded-xl focus:border-teal-500 outline-none" />
                           <input type='email' placeholder="E-Posta Adresi (Zorunlu)" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full bg-[#121926] p-3.5 text-xs border border-gray-800 text-white rounded-xl focus:border-teal-500 outline-none" />
                           <input type='tel' placeholder="Telefon / Firma Unvanı" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full bg-[#121926] p-3.5 text-xs border border-gray-800 text-white rounded-xl focus:border-teal-500 outline-none" />
                     </div>
                     <div className="w-full mt-2">
                        <button onClick={submitRequestForm} disabled={isSubmittingRequest} className="w-full uppercase text-center rounded-xl p-3.5 bg-[#10b981] hover:brightness-110 disabled:opacity-50 text-[13.5px] font-bold text-gray-900 border shadow flex items-center justify-center">
                             {isSubmittingRequest ? <Loader2 className="w-4 h-4 text-gray-900 animate-spin"/> : 'TALEBİ GÜVENLE GÖNDER'}
                        </button>
                     </div>
                  </div>
               )}
               
               {requestState === 'success' && (
                  <div className="flex w-full items-center justify-center flex-col min-h-full py-10 animate-fade-in bg-teal-900/10 border border-teal-500/20 rounded-2xl">
                       <CheckCircle2 className="w-16 h-16 text-[#34d399] mb-4 stroke-2" /> 
                       <h3 className="text-xl font-bold text-white mb-2">Başarıyla İletildi</h3>
                       <p className="text-xs text-gray-400 text-center px-4 leading-relaxed">Bilgileriniz ve talebiniz kurumsal sisteme güvenle işlendi. Kısa sürede yetkililer sizinle temas kuracaktır.</p>    
                  </div>
               )}
           </div>
        ) : (

        /* SOHBET / ASIL CHAT EKRANI */
        <div className="flex-1 flex flex-col bg-transparent overflow-y-auto w-full custom-scrollbar pr-1 relative" style={{overscrollBehavior: 'contain'}}>
             <div className="flex-1 p-4 flex flex-col justify-end space-y-4 pt-6">

                  {localMessages.map((m,idx) => (
                    <div key={idx} className={`w-full flex pb-0.5 animate-fade-in ${m.role === 'user' ? 'justify-end pl-12' : 'justify-start pr-8'} `}>
                         <div className={`px-4 py-3 text-[13.5px] leading-relaxed break-words shadow-lg
                             ${m.role === 'user' 
                             ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-50 rounded-[16px] rounded-br-sm self-end font-medium' 
                             : 'bg-slate-800 text-slate-200 border border-[#1e293b] rounded-[16px] rounded-tl-sm self-start'} `} 
                          style={{wordWrap: 'break-word', whiteSpace:'pre-wrap' }}>
                              <p>{cleanContent(m.content)}</p>
                              {m.role === 'user' && (<span className="block mt-1 text-[9px] font-mono tracking-wider text-emerald-100/50 uppercase">İletildi</span>)}
                         </div>
                    </div>
                  ))}
                  
                  {/* BEKLEME EFEKTİ */}
                  {isSubmitting && (
                    <div className="w-full flex justify-start pr-8 z-0 pb-1 mt-1">
                       <div className="px-5 py-4 flex gap-1.5 bg-slate-800 border border-slate-700/50 shadow rounded-[16px] rounded-tl-sm w-fit self-start">
                         <span className="block w-[5px] h-[5px] bg-[#10b981] rounded-full animate-pulse"></span>
                         <span className="block w-[5px] h-[5px] bg-[#06b6d4] rounded-full animate-pulse" style={{animationDelay:"0.15s"}}></span>
                         <span className="block w-[5px] h-[5px] bg-[#06b6d4] rounded-full animate-pulse" style={{animationDelay:"0.3s"}}></span>
                       </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} className="pb-1 block w-full h-1" />

                  {/* QUICK BUTONLAR ALT ZINCIR */}
                   {((!isSubmitting) && (localMessages.length === 1 || dynamicQuickReplies.length > 0)) && (
                       <div className="flex flex-wrap gap-2 w-full pt-1 px-1 mt-1">
                          {(localMessages.length === 1 ? INITIAL_QUESTIONS : dynamicQuickReplies).map((btnStr,k) => (
                             <button key={k} onClick={() => handleQuickReplyClick(btnStr)} 
                              className="w-fit text-left break-words hover:-translate-y-px transition-all font-medium px-4 py-2 border border-slate-700 bg-slate-800 text-[12px] text-gray-300 rounded-full hover:bg-slate-700 hover:text-white focus:outline-none max-w-[90%]" >
                                {btnStr}
                              </button> 
                           ))}
                       </div>
                   )}
             </div>
        </div>
       )} 


        {/* YAZI GIRIS & MENÜ PANELLERİ (ALTA ZIMBALANMIŞ) */}
        <div className="w-full shrink-0 border-t border-slate-800 p-3 bg-[#0A0F17]/95 z-[100] relative rounded-b-[20px] backdrop-blur-xl"> 

             <AnimatePresence> 
               {errorState && (  
                  <motion.div initial={{ y:-10, opacity:0}} animate={{y: -30, opacity:1}} exit={{opacity:0, y:-10}} className="absolute left-3 right-3 top-[-40px] px-3 py-2 shadow-md flex items-center justify-between text-xs font-semibold rounded-lg bg-red-950 text-white z-50 border border-red-500/50"> 
                    <div className='flex gap-2 items-center'>
                       <AlertCircle className='w-[14px] shrink-0 text-red-500' /> <span> {errorState} </span> 
                    </div> 
                    <X className="w-4 h-4 cursor-pointer text-gray-400 hover:text-white transition" onClick={dismissError} />     
                  </motion.div>    
               )}   
             </AnimatePresence>

             {(!showHistory && requestState === 'idle') && (   
              <> 
                 <div className="grid grid-cols-3 gap-2 px-1 w-full mb-3">  
                    <button type='button' onClick={handleOpenRequestForm} className="flex h-[34px] hover:bg-slate-700 border border-slate-700 transition items-center justify-center gap-1.5 bg-slate-800 font-bold text-[11px] uppercase rounded-lg text-slate-300 outline-none shadow-sm">
                        <FileText className="w-[12px] opacity-70" /> TALEP İLET 
                    </button>  
                    <button type="button" onClick={()=>{setShowCalendly(true); window.dispatchEvent(new Event('open-calendar-modal'))}}  className="flex h-[34px] hover:-translate-y-px transition items-center justify-center gap-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold text-[11px] uppercase rounded-lg outline-none cursor-pointer shadow-sm"> 
                        <Calendar className="w-3 opacity-[0.9]" /> RANDEVU
                    </button>
                    <button onClick={handleEscalateToHuman} className="flex h-[34px] items-center justify-center border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold text-[11px] uppercase rounded-lg transition-colors cursor-pointer shadow-sm">
                        <User className="w-[12px] h-[12px] mr-1" /> G. KİŞİ
                    </button>
                 </div>

                 <div className="flex bg-[#121A26] border border-slate-700/80 p-1.5 focus-within:border-emerald-500/60 rounded-[14px] items-center transition-colors"> 
                     <input type="text" ref={inputRef} disabled={isSubmitting || requestState !=="idle"} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyPress} placeholder='Mesajınızı yazın... '  className="flex-1 w-full bg-transparent px-3 text-[14px] text-gray-200 outline-none placeholder:text-gray-500 disabled:opacity-50" />  
                     <button disabled={!inputValue.trim() || isSubmitting} onClick={() => handleSendMessage(inputValue)} className="w-10 h-10 shrink-0 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:opacity-50 rounded-[10px] flex items-center justify-center shadow-lg transition-all cursor-pointer border border-emerald-400/20"> 
                         {isSubmitting ? <Loader2 className='w-[18px] animate-spin text-slate-900' /> : <Send className="w-5 text-slate-900 ml-[2px]" />}   
                     </button> 
                 </div>
               </>
             )} 
        </div>

      </motion.div>
      
      {/* ÇÖZÜM 2: TERTEMIZ VE KİMLİKSİZ CAL.COM IFRAMESİ (MODAL ICI) */}
      {showCalendly && (
         <div className="fixed inset-0 z-[1000] flex sm:items-center sm:justify-center bg-black/70 p-0 sm:p-[5%] backdrop-blur-sm animate-fade-in" onClick={() => setShowCalendly(false)}>  
            <div className="w-full sm:w-[96vw] max-w-[1000px] h-[100vh] sm:h-[90vh] lg:max-h-[750px] bg-slate-100 flex flex-col sm:rounded-[24px] relative overflow-hidden shadow-2xl border sm:border-slate-300" onClick={(e) => e.stopPropagation()}> 
               
               <div className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-end px-4 sm:absolute sm:top-4 sm:right-4 sm:bg-transparent sm:border-none sm:z-10 shrink-0">
                    <button onClick={() => setShowCalendly(false)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 sm:bg-white text-gray-700 hover:text-black font-bold text-xs uppercase rounded-lg border border-gray-300 shadow-sm transition-transform hover:scale-95"> 
                        <X className="w-4 h-4" /> Kapat 
                    </button> 
               </div> 

               <div className="w-full flex-1 grow relative overflow-hidden bg-white sm:pt-4 sm:px-2 rounded-b-[24px]">    
                    <iframe 
                       src="https://cal.com/novaotomasyon?hideEventTypeDetails=false" 
                       title="Toplantı Rezervasyonu" 
                       frameBorder="0" 
                       className="w-full h-full border-none">
                    </iframe> 
               </div>
            </div>     
         </div>
      )}

    </>
  );
}
