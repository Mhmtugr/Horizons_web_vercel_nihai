import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CheckCircle2, History, Trash2, Send, User, MessageSquare, FileText, Loader2, Calendar, ArrowLeft, Phone, Bot, Sparkles } from 'lucide-react';
import CalendlyWidget from './CalendlyWidget.jsx';
import { useChatHistory } from '@/hooks/useChatHistory.js';
import { useAnalytics } from '@/hooks/useAnalytics.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const INITIAL_QUESTIONS =[
  'Hizmetleriniz neler?',
  'Toplantı planlamak istiyorum',
  'Nasıl bir vizyon sunuyorsunuz?'
];

// --- GUVENLIK (ENV) ---
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const PRIMARY_MODEL = "gemini-3.1-pro";
const FALLBACK_MODEL = "gemini-3-flash-preview";

export default function AdvancedChatbot() {
  const[isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [localMessages, setLocalMessages] = useState([
     { role: 'assistant', content: 'Nova Teknoloji. Üretim bandınızdan yazılım altyapınıza kadar şirketinizi Otonom geleceğe taşımak için buradayım. Vizyonunuzu birlikte inşa edelim.', created: new Date().toISOString() }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [showCalendly, setShowCalendly] = useState(false);
  
  const[requestState, setRequestState] = useState('idle'); 
  const [requestSummary, setRequestSummary] = useState('');
  const [contactInfo, setContactInfo] = useState({ name: '', surname: '', email: '', phone: '' });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastMessageRef = useRef('');
  const sessionStartTime = useRef(Date.now());
  
  const { conversations, saveConversation, deleteConversation } = useChatHistory();
  const { trackEvent } = useAnalytics();

  // 1. CRISP ENTEGRASYONU (HAYALET MOD)
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
  }, [trackEvent, requestState]);

  const handleClose = () => {
    const timeSpent = Math.round((Date.now() - sessionStartTime.current) / 1000);
    if(trackEvent) trackEvent('time_spent', { seconds: timeSpent, component: 'chatbot' });
    if (saveConversation && localMessages.length > 0) saveConversation(null, `Chat ${new Date().toLocaleTimeString()}`, localMessages);
    setIsOpen(false);
  };
  const dismissError = () => setErrorState(null);

  // HUMAN HANDOFF 
  const handleEscalateToHuman = useCallback(() => {
    setIsSubmitting(true);
    dismissError();
    try {
      const transcript = localMessages.map(msg => `[${msg.role.toUpperCase()}]: ${cleanContent(msg.content)}`).join('\n\n');
      
      if (window.$crisp) {
        document.body.classList.add('crisp-active');
        window.$crisp.push(['set', 'user:nickname',['Nova Ziyaretçisi']]);
        window.$crisp.push(['do', 'message:send',['text', `🚨 VİP İLETİŞİM (CANLI): AI DEVREDİLDİ.\n\nSOHBET GEÇMİŞİ:\n${transcript}`]]);
        
        setLocalMessages(prev =>[...prev, {
             role: 'assistant',
             content: 'Başmühendislerimize doğrudan bir hat açıyorum. Lütfen ekrandan ayrılmayın, hemen sizinle olacağız.',
             created: new Date().toISOString()
        }]);

        setTimeout(() => {
            setIsOpen(false); 
            window.$crisp.push(['do', 'chat:show']);
            window.$crisp.push(['do', 'chat:open']);
        }, 1000);
      } else {
         window.open('https://wa.me/905468667215?text=Merhaba,%20hizmetleriniz%20hakkinda%20ust%20duzey%20bir%20uzmanla%20gorusmek%20istiyorum', '_blank');
      }
    } catch (error) {
      setErrorState('Handoff işlemi başlatılamadı. Ağı kontrol edin.');
    } finally {
       setIsSubmitting(false);
    }
  }, [localMessages]);

  // TALEP FORMU 
  const handleOpenRequestForm = () => {
    const userMsgs = localMessages.filter(m => m.role === 'user').map(m => m.content).join(' ');
    const autoSummary = userMsgs.length > 5 
        ? `Taslak İhtiyaç:\n${userMsgs}` 
        : `Kurumumuzun operasyonel yeteneklerini Otonom süreçlerle yükseltmek için ön fizibilite araştırması ve uzman görüşü talep ediyorum.`;
        
    setRequestSummary(autoSummary);
    setRequestState('summary');
  };

  const submitRequestForm = async () => {
    if (!contactInfo.name || !contactInfo.surname || !contactInfo.email) {
       setErrorState('İşlem güvenliği için Ad, Soyad ve E-Posta gereklidir.'); return;
    }
    setIsSubmittingRequest(true); dismissError();
    
    const leadData = `🔥 PROJE TALEBI 🔥\nAd: ${contactInfo.name} ${contactInfo.surname}\nE-Posta: ${contactInfo.email}\nTelefon: ${contactInfo.phone || 'Belirtilmedi'}\n\nTALEP ÖZETİ:\n${requestSummary}`;

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
                    setLocalMessages(prev =>[...prev, { role: 'assistant', content: 'Talebiniz kriptoluğumuzla güvenceye alınarak Nova Uzman Kuruluna iletildi. Detaylar ve randevu konfirmasyonunuz için size belirlediğiniz yollardan (Mail/GSM) çok yakında döneceğiz.', created: new Date().toISOString() }]);
                }, 3500);
            }, 600);
        } else {
             window.location.href = `mailto:info@nexaotomasyon.com.tr?subject=YENI_WEB_MUSTERI_TALEBI&body=${encodeURIComponent(leadData)}`;
             setRequestState('success'); setIsSubmittingRequest(false);
             setTimeout(() => setRequestState('idle'), 2500);
        }
    } catch(err) {
        setIsSubmittingRequest(false); setErrorState("Portal Reddedildi. Lütfen Gerçek Kişi iletişimine tıklayınız.");
    }
  };

  // --- 🔥 SİZİN İSTEĞİNİZE GÖRE ŞEKİLLENDİRİLMİŞ "TESLA STANDARD" YENİ AI BEYNİ 🔥 ---
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

    // 🛑 DÜNYANIN EN MÜKEMMEL PROJE YÖNETİCİSİ PROMPTU 🛑
    const SYSTEM_PROMPT = `
      # KİMLİK & TON
      Adın Nova. Sen sıradan bir chatbot değilsin; Nova Teknoloji'nin en saygın, elit (Apple/Tesla mühendisliği vizyonuna sahip) B2B Operasyon Yöneticisi ve Dijital Dönüşüm Uzmanısın. Müşteriyle konuşurken "satan" veya "aç bir esnaf" gibi asla davranmayacaksın. Ağırbaşlı, bilgi odaklı, karşı tarafa güven ve prestij hissettiren (Vizyoner) bir profesyonelsin. Sorulara aşırı uzun olmayan ama dopdolu "executive summary" (yönetici özeti) kalitesinde, anlaşılır paragraflarla yanıt ver. Asla arka arkaya soru sorarak müşteriyi bunaltma!
      
      # FİYATLANDIRMA İLKESİ (ZORUNLU)
      - İlk iletişimde, ne sağladığını ve vizyonu anlatmadan KESİNLİKLE VE ASLA fiyattan, bütçeden veya euro üzerinden tekliflerden BAHSETME. (Bunu bir gizlilik olarak değil, değer odaklı yaklaşımın için yap).
      - EĞER VE SADECE EĞER müşteri kendisi net bir şekilde "fiyatınız ne, bütçe ne kadar olmalı, kaça yapıyorsunuz" diye SPESİFİK olarak sorarsa şu kurumsal cevabı net bir dille (ama saygıyla) ilet: 
        "Hizmetlerimiz endüstriyel terzilik gerektirir. Sistemlerimize geçişteki kurulumlar projeye bağlı olarak 1.000€ ile 10.000€ arasında planlanır. Kesintisiz büyüme sağlayan Otonom bakım ve SLA (Hizmet Seviyesi Taahhüdü) paketlerimiz ise 100€ ile 3.000€ aralığında operasyonel hacminize uygun olarak kurgulanmaktadır." (Asla indirim var, kolaylık sağlarız vb amatör kelimeler kullanma).

      # HİZMET BİLGİSİ
      Uzmanlıkların: Endüstriyel Otonom Üretim, Süreç Mimarlığı, B2B Radarları, Fabrika Yazılım Dönüşümleri. Müşteriye "Yapay Zekanın onun zaman maliyetini" asimetrik şekilde bitireceğini göster.

      # TOPLANTI ÇAĞRISI İLKESİ (ZORUNLU!)
      Müşteri net bir randevu talebinde bulunduğunda veya saat verip "şimdi mi konuşalım/randevulaşalım/yarın arayın" dediğinde konuyu hemen kapat! Müşteriye ŞU NET MESAJI ver ve SUS: 
      "Uluslararası yoğun takvimimize göre sizin vizyon projenize yer ayırmaktan mutluluk duyarım. Görüşmemizi sisteme kayıtlamak için panelden veya hızlı yönlendirici butondan en müsait olduğunuz takvim periyodunu doğrudan planlayınız." (Mesajda asla başka şey yazma).

      # QUİCK REPLIES (BUTON ZORUNLULUĞU - UI JSON ENJEKSİYONU)
      Mesajlarının metinsel kısmı tamamen bittikten sonra EN ALTTA daima gizli bir JSON yollamalısın ki ben bunu tuş olarak çıkartabileyim. Müşterinin son cümlene verebileceği en "zekice ve vizyoner" 2-3 reaksiyonu buton olarak yaz.
      Eğer konuyu toplantıya getirmek istersen "Görüşme/Toplantı Planla", Teknik soruyorsa "Daha Derine İnelim", Çok teknik değilse "Talep Formunu Aktif Et" gibi maksimim 3 kelimelik Buton isimlerini belirle.
      KURAL Şudur (Her Mesajın SONUNA bu şablonda boşluk bırakıp sadece bu JSON objesini eklersin):
      {"quickReplies":["Kelim1", "Kelim2", "Kelim3"]}
    `;

    try {
      // Birlesik Konusma Metni olusumu (Max Performans Contexti)
      const chatContext = newMessagesHistory.slice(-5).map(m => m.role === 'user' ? `[Danışan Müşteri]: ${m.content}` : `[Nova AI]: ${m.content}`).join("\n");
      
      let aiResponseText = "";
      
      try {
        const proModel = genAI.getGenerativeModel({ model: PRIMARY_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await proModel.generateContent(`${chatContext}\n[Danışan Müşteri]: ${trimmedText}`);
        aiResponseText = result.response.text();
      } catch (proErr) {
        console.warn(`[Gen 3 Pro] yanıt yok, sistem düşüş engellendi, FLASH yedeği kullanılıyor.`, proErr);
        const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await fallbackModel.generateContent(`${chatContext}\n[Danışan Müşteri]: ${trimmedText}`);
        aiResponseText = result.response.text();
      }

      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: aiResponseText, created: new Date().toISOString() }]);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setErrorState("Uydudan/API'den iletişim kurulamıyor.");
      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: "Mevcut dijital otobanımızda anlık koruma algoritması bizi yavaşlatıyor. Hız kaybetmemeniz adına alttaki Canlı Operatöre Devret sistemiyle bizimle hızlı bağ kurabilirsiniz.", created: new Date().toISOString() }]);
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
    if (textLower.includes('gerçek kişi') || textLower.includes('canlı') || textLower.includes('operatör') || textLower.includes('uzman') || textLower.includes('yönetici')) {
      handleEscalateToHuman(); return;
    }
    if (textLower.includes('talep') || textLower.includes('form') || textLower.includes('bırak')) {
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

  const dismissError = () => setErrorState(null);
  const lastMessage = localMessages[localMessages.length - 1];
  const dynamicQuickReplies = lastMessage?.role === 'assistant' ? extractQuickReplies(lastMessage.content) :[];


  // =========================================================================
  // GÖRSEL (UI) KATMANI
  // =========================================================================
  
  if (!isOpen) {
    return (
      <>
        {/* ÇÖZÜLEN NOKTA: IKON ÜST ÜSTE BİNME. BOTTOM DEĞERİ (AŞAĞI-YUKARI UZAKLIK) "110px"E ÇEKILDI!! */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[110px] right-6 z-[60] w-[55px] h-[55px] bg-gradient-to-r from-emerald-500 to-teal-700 text-white rounded-full flex justify-center items-center shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.6)] focus:outline-none transition-all duration-300"
          title="Nova Otonom AI Asistanı"
        >
          <Bot className="w-7 h-7 text-white/95" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#121A26] rounded-full animate-pulse" />
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
        className="fixed bottom-[110px] right-4 sm:right-6 z-[65] w-[calc(100vw-2rem)] sm:w-[410px] h-[650px] max-h-[85vh] bg-[#0A0F17]/95 border border-[#10b981]/30 rounded-[20px] flex flex-col shadow-[0_15px_40px_-5px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden font-sans"
      >
        {/* ÜST HEADER KISMI */}
        <div className="flex justify-between items-center px-5 py-[14px] bg-[#060A10] border-b border-[#1E293B] shrink-0">
          <div className="flex items-center gap-3">
             <div className="relative flex justify-center items-center w-11 h-11 bg-[#121926] border border-emerald-500/20 rounded-full shadow-inner">
               <Sparkles className="w-5 h-5 text-emerald-400" />
               <span className="absolute bottom-[-1px] right-0 w-3.5 h-3.5 bg-emerald-500 border-[2.5px] border-[#060A10] rounded-full"></span>
             </div>
             <div>
                <p className="text-[14px] font-black text-white uppercase tracking-[0.2em]">NOVA CORE</p>
                <p className="text-[10.5px] text-emerald-500 font-bold uppercase tracking-wider animate-pulse opacity-90 mt-0.5">SİSTEM OTO</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-[6px] bg-[#121926] hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition">
            <X className="w-[18px] h-[18px]" strokeWidth={2.5}/>
          </button>
        </div>


        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-4 bg-[#0A0F17] custom-scrollbar z-0 flex flex-col space-y-3" style={{overscrollBehavior: 'contain'}}>
            <button onClick={() => setShowHistory(false)} className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-gray-200 text-[13.5px] font-bold w-fit hover:bg-slate-700 transition"><ArrowLeft className='w-[15px] h-[15px]'/> Asistan'a Dön</button>
            <p className="text-[11px] uppercase tracking-widest text-teal-400 font-extrabold pt-2">Lokal Zihin Belleğiniz:</p>
            {(!conversations || conversations.length === 0) ? (
               <div className="p-6 border border-dashed border-gray-700 rounded-xl flex items-center justify-center bg-gray-900/50 mt-2"><span className="text-gray-500 font-medium text-xs text-center">Analiz edebileceğim geçmiş arşiv bulunamadı.</span></div>
            ) : (
              conversations.map((conv, i) => (
                <div key={i} className="mb-2 p-[14px] bg-[#162131] border border-gray-800 rounded-xl flex flex-col">
                  <h4 className="text-emerald-100 font-bold text-[14px] leading-tight mb-2 truncate w-full">{conv.title}</h4>
                  <button onClick={() => deleteConversation(i)} className="flex self-end items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold uppercase rounded hover:bg-red-500/20 transition-all w-fit"><Trash2 className='w-[14px] h-[14px]'/> SİL</button>
                </div>
              ))
            )}
          </div>
        ) : requestState !== 'idle' ? (
           <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#0A0F17] flex flex-col">
               {requestState === 'summary' && (
                  <div className="flex flex-col flex-1 animate-fade-in-up">
                     <p className="text-[11px] uppercase text-[#10b981] font-black tracking-widest mb-[6px] pl-1">• Aşama 1: Yapay Zeka Özeti</p>
                     <p className="text-[13px] text-gray-400 font-medium leading-relaxed pl-1 pb-3 border-l-2 border-slate-700/60 ml-[2px]">İş ve üretim yetkililerine göndermek üzere yazdıklarınızı makine dilinden proje taslağına kodladım. Kendiniz ekleme yapabilir/değiştirebilirsiniz:</p>
                     <textarea value={requestSummary} onChange={e=>setRequestSummary(e.target.value)} 
                               className="flex-1 min-h-[160px] p-[16px] bg-[#121A26] border-[1.5px] border-[#2A374F] rounded-[14px] text-[14px] text-gray-200 resize-none outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition shadow-inner font-sans tracking-wide leading-7 custom-scrollbar mb-4" />
                     <div className="flex gap-[12px] h-[50px] shrink-0 mt-auto">
                        <button onClick={()=> setRequestState('idle')} className="w-1/3 bg-[#1E293B] rounded-xl text-gray-400 font-bold border border-gray-700 hover:text-white transition text-sm shadow">Çıkış</button>
                        <button onClick={()=> setRequestState('contact')} className="w-2/3 bg-emerald-500 rounded-xl text-[#0A0F17] font-extrabold hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition text-sm">PROJE VERİSİNİ İLET</button>
                     </div>
                  </div>
               )}
               {requestState === 'contact' && (
                  <div className="flex flex-col flex-1 animate-fade-in space-y-[18px]">
                     <div>
                       <p className="text-[11px] uppercase text-cyan-400 font-black tracking-widest mb-1">• Aşama 2: Bağlantı Profili</p>
                       <p className="text-[12.5px] text-gray-400">Teknik departman yalnızca onaylanmış kurumsal/kişisel direkt yollar üzerinden randevulanır.</p>
                     </div>
                     <div className="flex flex-col gap-3">
                         <div className="grid grid-cols-2 gap-3">
                           <input placeholder="Yetkili Ad *" value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} className="p-3.5 bg-[#121A26] border border-[#2A374F] text-[14px] font-medium text-white rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
                           <input placeholder="Soyad *" value={contactInfo.surname} onChange={e => setContactInfo({...contactInfo, surname: e.target.value})} className="p-3.5 bg-[#121A26] border border-[#2A374F] text-[14px] font-medium text-white rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
                         </div>
                         <input type="email" placeholder="Şahsi veya Kurumsal Mailiniz *" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full p-3.5 bg-[#121A26] border border-[#2A374F] text-[14px] font-medium text-white rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
                         <input type="tel" placeholder="Tüzel Kişi/GSM Numaranız" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full p-3.5 bg-[#121A26] border border-[#2A374F] text-[14px] font-medium text-white rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none" />
                     </div>
                     <button onClick={submitRequestForm} disabled={isSubmittingRequest} className="w-full mt-auto h-[55px] shrink-0 bg-emerald-500 text-[#060A10] font-black uppercase text-[15px] rounded-xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-[0_5px_15px_-4px_rgba(16,185,129,0.5)] disabled:opacity-60 disabled:active:scale-100 border border-emerald-400">
                          {isSubmittingRequest ? <Loader2 className="w-5 h-5 animate-spin" /> : 'TALEP EVRAK OLUŞTUR VE YÖNLENDİR'}
                     </button>
                  </div>
               )}
               {requestState === 'success' && (
                  <div className="flex-1 flex flex-col justify-center items-center py-6 text-center animate-fade-in bg-teal-900/10 border-2 border-dashed border-teal-500/40 rounded-[20px] p-6 m-1 my-5 relative overflow-hidden">
                     <CheckCircle2 className="w-[75px] h-[75px] text-[#10b981] mb-5 stroke-[1.5]" /> 
                     <h2 className="text-[22px] font-black text-white mb-2 tracking-tight">Kusursuz Veri Aktarımı</h2>
                     <p className="text-[13.5px] font-medium text-slate-300 leading-relaxed max-w-[90%]">Talebizi şifrelenmiş tüneller üzerinden merkeze raporladım. Kurul danışmanı size yanıt sağlayacaktır, sayfayı kapatabilirsiniz.</p>
                  </div>
               )}
           </div>
        ) : (

        /* ======================== CHAT PENCERESİ EKRANI (Ana Merkez) ===========================*/
        <div className="flex-1 flex flex-col bg-[#0A0F17] overflow-y-auto relative scroll-smooth pr-1" style={{overscrollBehavior: 'contain'}}>
             <div className="flex-1 p-3.5 pb-2 flex flex-col justify-end space-y-[18px]">
                  
                  {/* KONUSMALAR DONGUSU */}
                  {localMessages.map((m,idx) => (
                    <div key={idx} className={`w-full flex ${m.role === 'user' ? 'justify-end pl-[10%]' : 'justify-start pr-[5%]'} animate-fade-in`}>
                         <div className={`p-4 relative min-w-[30%]
                             ${m.role === 'user' 
                             ? 'bg-gradient-to-tr from-emerald-600 to-[#0f766e] text-emerald-50 rounded-[22px] rounded-br-[4px] shadow-[0_2px_10px_rgba(16,185,129,0.2)] self-end font-semibold border-t border-emerald-500/50' 
                             : 'bg-[#141C2B] text-slate-200 rounded-[20px] rounded-tl-sm border-l-2 border-[#10B981] shadow-[0_3px_15px_-2px_rgba(0,0,0,0.5)] border-t border-b border-r border-[#1e293b]/60'}
                             text-[14px] leading-7 font-sans break-words hyphens-auto shadow-md
                           `} style={{wordWrap: 'break-word', letterSpacing:'0.2px'}}>
                              <p className="whitespace-pre-wrap leading-relaxed">{cleanContent(m.content)}</p>
                              <span className={`block w-full text-right mt-[5px] text-[10px] italic font-semibold ${m.role === 'user' ? 'text-emerald-100/60' : 'text-slate-500/70'}`}>
                                 {new Date(m.created).toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})}
                              </span>
                         </div>
                    </div>
                  ))}
                  
                  {/* YAZIYOR.. SKELETON'U (Kalite Hissi İcin) */}
                  {isSubmitting && (
                    <div className="w-fit">
                         <div className="px-5 py-[18px] flex justify-center gap-1.5 ml-2 bg-[#141C2B] border-l-2 border-[#10B981] shadow-xl rounded-[18px] rounded-tl-sm items-center self-start h-[45px]">
                              <span className="block w-[6px] h-[6px] bg-emerald-500/70 rounded-full animate-bounce"></span>
                              <span className="block w-[6px] h-[6px] bg-teal-500/70 rounded-full animate-bounce" style={{animationDelay:"0.15s"}}></span>
                              <span className="block w-[6px] h-[6px] bg-cyan-500/70 rounded-full animate-bounce" style={{animationDelay:"0.3s"}}></span>
                         </div>
                    </div>
                  )}

                  {/* KUVVETLİ VE HATASIZ YAPI SCROLL TARGET */}
                  <div ref={messagesEndRef} className="h-0 p-0 m-0 w-full overflow-hidden block float-none" />

                  {/* DİNAMİK QUICK BUTONLAR DİZİSİ (AÇILIŞ VS DE DAHİL) - Tasarimı ve Rengi Prestije Odakli */}
                  {((dynamicQuickReplies.length > 0 && lastMessage.role !== 'user' && !isSubmitting) || (localMessages.length === 1 && !isSubmitting)) && (
                   <div className="flex gap-2 flex-wrap items-center pt-2 pb-0 w-full static shrink-0 select-none">
                        {(localMessages.length === 1 ? INITIAL_QUESTIONS : dynamicQuickReplies).map((btnStr, k) => (
                             <button key={k} onClick={() => handleQuickReplyClick(btnStr)} 
                              className="font-semibold text-left max-w-[85%] whitespace-pre-wrap transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] px-[18px] py-[10px] text-[12.5px] rounded-[18px] rounded-bl-sm 
                              bg-[#162234] border border-[#23354E] text-[#60a5fa] 
                              hover:bg-[#1C2C43] hover:text-[#38bdf8] hover:border-[#38bdf8]/40 hover:-translate-y-[2px] 
                              active:bg-[#1e293b] active:scale-[0.98] outline-none">
                                {btnStr}
                             </button> 
                         ))}
                    </div>
                  )}
             </div>
        </div>
       )} 
        {/* ===================== ASIL MAIN EKRAN BITIS =================== */}



        {/* ===================== CONTROL CENTER & INPUT BARI (SABİT EKRANA SIĞIK KALIR) =================== */}
        <div className="w-full shrink-0 border-t-2 border-[#1E293B] px-3.5 pt-[10px] pb-4 bg-[#060A10]/95 backdrop-blur-[40px] shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.5)] rounded-b-[20px] z-[120]" > 
             <AnimatePresence> 
               {errorState && (  
                  <motion.div initial={{ y:-10, opacity:0}} animate={{y: -35, opacity:1}} exit={{y:-10, opacity:0}} className="absolute top-0 left-[3%] right-[3%] px-4 py-2 flex items-center justify-between text-[11px] font-bold uppercase rounded-[12px] bg-red-950 text-white z-[200] border-2 border-red-500 shadow-[0_10px_20px_rgba(239,68,68,0.3)]"> 
                      <span>⛔ Hata Kodu : {errorState}</span> <X onClick={dismissError} className="w-5 h-5 p-0.5 cursor-pointer rounded-full bg-red-900/60 hover:bg-black transition-colors" />     
                  </motion.div>    
               )}   
             </AnimatePresence>

             {/* ÜST İŞLEM YÜZEYİ : ÜÇLÜ HARİKA MENÜ VE GERC. KISıYE ZAMANLI ATAMAYİ DA BURDA CÖZDÜK */}
             {(!showHistory && requestState === 'idle') && (   
              <> 
                 <div className="grid grid-cols-3 gap-[7px] w-full mb-2">
                     <button type='button' aria-label='Arşive Koy, Fikir iletisime Donus.' onClick={handleOpenRequestForm} className="group relative flex justify-center items-center gap-[5px] py-2 bg-[#121A26] rounded-xl border border-[#2A374F] hover:bg-[#1E293B] hover:border-[#475569] transition shadow-[0_3px_5px_-1px_rgba(0,0,0,0.3)] outline-none focus:outline-none">
                            <FileText className="w-[14px] h-[14px] text-gray-400 group-hover:text-emerald-400 transition-colors"/> <span className="text-[11.5px] font-bold text-gray-400 group-hover:text-white uppercase tracking-tight">Kayıt/Arşiv</span>
                     </button>  
                     <button type="button" onClick={()=>{setShowCalendly(true); window.dispatchEvent(new Event('open-calendar-modal'));}} className="group relative flex justify-center items-center gap-1 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 hover:from-emerald-500/20 hover:to-emerald-400/10 border border-emerald-500/20 rounded-xl transition hover:-translate-y-0.5 outline-none focus:outline-none shadow-md"> 
                            <Calendar className="w-[13.5px] h-[13.5px] text-emerald-500 group-hover:animate-bounce "/> <span className="text-[12px] font-black text-emerald-500 group-hover:text-emerald-300 uppercase tracking-wide">Rezervasyon</span>
                     </button>
                     <button onClick={handleEscalateToHuman} className="flex gap-[3px] items-center justify-center py-[7px] bg-[#3f0d0d] hover:bg-[#5a1313] border-[1px] border-[#ef4444]/40 hover:border-red-400 text-red-400 rounded-xl transition hover:scale-[1.02] shadow-[0_4px_10px_-2px_rgba(239,68,68,0.2)] focus:outline-none"> 
                         <Phone className="w-3.5 h-3.5 stroke-[2.5]" /> <span className="font-extrabold uppercase text-[10.5px] tracking-tight whitespace-nowrap overflow-hidden">VIP Acil Çözüm</span>
                     </button> 
                 </div>

                 {/* DUAL MODE TERNARY İNPUT BOX TASARIMI MİN YORULMA */}
                 <div className="flex items-stretch bg-[#121A26] rounded-[16px] border-2 border-[#1E293B] relative group transition-colors focus-within:border-emerald-500/60 focus-within:shadow-[0_0_10px_#10B98140] w-full mt-2 h-[48px] box-border p-[3px]"> 
                     <input 
                       ref={inputRef} type="text" disabled={isSubmittingRequest || isSubmitting} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyPress}
                       placeholder="Nova Merkez'le İletişime Geçin ⌁"  
                       className="flex-1 w-full bg-transparent px-[14px] text-[14px] text-gray-200 outline-none placeholder-slate-600 disabled:opacity-40 disabled:cursor-not-allowed font-medium h-full align-middle leading-normal mt-[1px]" />
                     <button aria-label='AI Komut İleri.' 
                          onClick={() => handleSendMessage(inputValue)} disabled={isSubmitting || !inputValue.trim()} 
                          className="shrink-0 h-full w-[42px] bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-[12px] flex justify-center items-center hover:brightness-110 active:scale-95 disabled:opacity-25 transition-all shadow-md shadow-[#10b981]/30">
                       <Send className="w-[18px] h-[18px] text-gray-950 pl-[1.5px]" strokeWidth={2.5}/>
                     </button>   
                 </div> 
                 <div className="w-full text-center mt-[8px]">
                     <p className='text-[#334155] text-[9.5px] uppercase font-bold tracking-widest leading-none'> NOVA GLOBAL ENGINES V3 PRO.0.8 🤖 </p>
                 </div>
               </>
             )} 
        </div>

      </motion.div>
      
      {/* 🚀 APPLE/TESLA MODULU: ÇAKMALAR ENGELENDİ CAL.COM 100% TEMİZ ÇIKIŞ! PARAMETRE ENJEKTELERI KALDIRILI (VITE GOMDUKLERI)! SADE. PÜRÜZSÜZ.*/}
      {showCalendly && (
         <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/70 backdrop-blur-sm pb-0 pt-0 sm:pt-4 sm:px-6 md:p-[50px] animate-fade-in" onClick={() => setShowCalendly(false)}>
           
            <div className="relative bg-[#F2F4F7] sm:bg-[#FAFAFA] sm:rounded-[24px] rounded-t-[20px] rounded-b-none overflow-hidden w-[100vw] h-[95vh] sm:h-full sm:max-w-[940px] sm:max-h-[820px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col m-auto border border-[#E5E7EB]" onClick={(e) => e.stopPropagation()}>
                
             {/* UST BANNER VE İHTİYAC DURUMU HEADER BARI */}
             <div className="w-full flex-shrink-0 bg-white border-b border-[#E5E7EB] py-3.5 px-5 flex items-center justify-between z-[50]">
               <div className="flex gap-2 items-center">
                    <span className="flex items-center justify-center bg-slate-900 w-8 h-8 rounded-xl shadow-inner border border-gray-700"> <Calendar className='text-emerald-400 w-[15px]'/></span>
                    <span className='font-bold text-[14px] text-gray-800 tracking-tight'> Dijital Ön Ajanda</span>
               </div>
               <button onClick={() => setShowCalendly(false)} className="flex items-center gap-1.5 px-4 py-[7px] text-[12.5px] text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 rounded-[10px] font-black uppercase tracking-widest transition-all">
                 <X className="w-4 h-4 stroke-[3]" /><span>Ekranı Daralt</span>
               </button>
             </div>
             
             {/* AMELE/BOZUK CSS'lerden arındırılmış TEMİZ GÖMME YAPISI */}
             <div className="w-full h-[calc(100%-62px)] pb-1 px-1 bg-[#FAFAFA] relative overflow-hidden sm:rounded-b-[24px]">
                  <iframe 
                    // EN KRITIK SATIR: SONUNA QUERY (?) YASAKTIR! Temiz link açilir
                    src="https://cal.com/novaotomasyon" 
                    title="Takvim Ajanda Rezerve Motoru" 
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads allow-top-navigation-by-user-activation"
                    className="absolute inset-0 w-[100.1%] h-full border-none object-contain">
                  </iframe>
              </div>
           </div>
         </div>
      )}
    </>
  );
}
