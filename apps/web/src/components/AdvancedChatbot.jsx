import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CheckCircle2, History, Send, MessageSquare, FileText, Loader2, Calendar, Bot, Sparkles } from 'lucide-react';
import CalendlyWidget from './CalendlyWidget.jsx';

// --- GOOGLE AI INTEGRASYONU ---
import { GoogleGenerativeAI } from "@google/generativeai";

// STATIK BUTONLAR - Başlangıçta görünür
const INITIAL_QUESTIONS =[
  'Hizmetleriniz hakkında bilgi alabilir miyim?',
  'Toplantı planla',
  'Gerçek kişi ile görüş',
  'Fiyatlandırmanız nasıl?',
  'Nasıl başlayabilirim?'
];

// --- GUVENLIK: API KEY ---
const GEMINI_API_KEY = "AIzaSyC5FtSklR0kn6h_9A5Slbb148zvihlnz1w"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function AdvancedChatbot() {
  // --- STATE (DURUM) YONETIMI ---
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const[localMessages, setLocalMessages] = useState([
     { role: 'assistant', content: 'Nova Teknoloji Akıllı Sistemine hoş geldiniz. Ben yapay zeka entegre otonom iş geliştirme asistanıyım. Kurumunuzun otomasyon ve yazılım süreçlerini nasıl optimize edebilirim?', created: new Date().toISOString() }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const[showCalendly, setShowCalendly] = useState(false);
  
  // FORM STATES (TALEP SISTEMI)
  const[requestState, setRequestState] = useState('idle'); 
  const [requestSummary, setRequestSummary] = useState('');
  const[contactInfo, setContactInfo] = useState({ name: '', surname: '', email: '', phone: '' });
  const[isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // REFERANSLAR
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastMessageRef = useRef('');

  // 1. CRISP ENTEGRASYONU (HAYALET MOD)
  useEffect(() => {
    if (typeof window !== "undefined" && window.$crisp) {
        window.$crisp.push(["do", "chat:hide"]);
    }
    
    const handleCrispClose = () => {
      document.body.classList.remove('crisp-active');
      setIsOpen(true);
      window.$crisp.push(["do", "chat:hide"]); 
    };

    if (window.$crisp) {
      window.$crisp.push(["on", "chat:closed", handleCrispClose]);
    }
  },[]);

  // 2. SCROLL OPTIMIZASYONU
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  };

  useEffect(() => {
    if (isOpen && !showHistory && requestState === 'idle') {
      scrollToBottom();
    }
  },[localMessages, isSubmitting, isOpen, showHistory, requestState]);

  const handleClose = () => setIsOpen(false);
  const dismissError = () => setErrorState(null);

  // 3. HUMAN HANDOFF (KESINTISIZ GECIS)
  const handleEscalateToHuman = useCallback(() => {
    dismissError();
    try {
      const transcript = localMessages
        .map(msg => `[${msg.role.toUpperCase()}] : ${msg.content}`)
        .join('\n\n');
      
      if (window.$crisp) {
        window.$crisp.push(['set', 'user:nickname', ['Nova VIP Ziyaretçisi']]);
        window.$crisp.push(['do', 'message:send', ['text', `🔔[GERÇEK KİŞİ DEVREYE GİRSİN]\n🚨 BOT DEVRİ TALEBİ!\n\n📋 İlgili kişinin şimdiye kadarki diyalogu:\n${transcript}`]]);
        
        setLocalMessages(prev =>[...prev, {
             role: 'assistant',
             content: 'Yetkili uzmanımızı sohbete dahil ediyorum, lütfen bu ekranda kalınız...',
             created: new Date().toISOString()
        }]);

        setTimeout(() => {
            setIsOpen(false); 
            window.$crisp.push(['do', 'chat:show']);
            window.$crisp.push(['do', 'chat:open']);
        }, 800);
        
      } else {
        window.open('https://wa.me/905468667215?text=Merhaba,%20canli%20uzman%20ile%20gorusmek%20istiyorum', '_blank');
      }
    } catch (error) {
      setErrorState('Bağlantı koptu. Sağ alttaki WhatsApp üzerinden ulaşabilirsiniz.');
    }
  }, [localMessages]);

  // 4. INTERAKTIF FORM MİMARİSİ
  const handleOpenRequestForm = () => {
    const userMsgs = localMessages.filter(m => m.role === 'user').map(m => m.content).join('\n• ');
    const autoSummary = userMsgs.length > 5 
        ? `[TALEBİM]:\n• ${userMsgs}\n\nLütfen ilgili ürün ve çözümler ile teknik ekibin benimle temas etmesini rica ederim.` 
        : `Detaylı kurumsal bilgi talep ediyorum. İş akışı optimizasyonu seçeneklerini tarafıma iletin lütfen.`;
        
    setRequestSummary(autoSummary);
    setRequestState('summary');
  };

  const submitRequestForm = async () => {
    if (!contactInfo.name || !contactInfo.surname || !contactInfo.email) {
       setErrorState('Güvenli iletişim için Ad, Soyad ve Kurumsal/Kişisel Mail adresi zorunludur.');
       return;
    }
    
    setIsSubmittingRequest(true);
    dismissError();
    
    const leadData = `
⚡ YENİ WEB SİTESİ TALEP FORMU!
AD-SOYAD: ${contactInfo.name} ${contactInfo.surname}
MAIL: ${contactInfo.email}
TELEFON: ${contactInfo.phone || 'Girilmedi'}
TALEBİ: ${requestSummary}`;

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
                    setLocalMessages(prev =>[...prev, { role: 'assistant', content: '✅ Formunuz başarı ile teknik danışmanlarımıza şifreli olarak iletildi. Görüşmek dileğiyle.', created: new Date().toISOString() }]);
                }, 4000);
            }, 500);
        } else {
             window.location.href = `mailto:info@nexaotomasyon.com.tr?subject=YENI_TALEBI_${contactInfo.name}&body=${encodeURIComponent(leadData)}`;
             setRequestState('success');
             setIsSubmittingRequest(false);
             setTimeout(() => { setRequestState('idle'); }, 2000);
        }
    } catch(err) {
        setIsSubmittingRequest(false);
        setErrorState("Ağ hatası. Lütfen formu WhatsApp ikonundan bize iletin.");
    }
  };


  // 5. MUKEMMEL YAPAY ZEKA MIMARISI (FALLBACK & SMART SELECTION)
  const handleSendMessage = async (textToProcess) => {
    const text = typeof textToProcess === 'string' ? textToProcess : inputValue;
    
    if (!text || typeof text !== 'string' || !text.trim() || isSubmitting) return;

    const trimmedText = text.trim();
    lastMessageRef.current = trimmedText;
    
    const newMessagesHistory =[...localMessages, { role: 'user', content: trimmedText, created: new Date().toISOString() }];
    setLocalMessages(newMessagesHistory);
    
    setInputValue(''); 
    setIsSubmitting(true);
    dismissError();

    const SYSTEM_PROMPT = `
      Sen Nova Teknoloji'nin Kıdemli Otonom B2B Satış Yöneticisisin. Lütfen konuyu dağıtma, çok kısa, profesyonel (Tesla Mühendisi vizyonuyla), doğrudan sonuca yönelik net cevaplar ver. 
      Hiçbir koşulda kullanıcıya arka arkaya ardışık sorular sorarak müşteriyi yorma. Cevabını ver, ikna et ve Toplantı Planlama / Gerçek Kişiye Aktar gibi kapılara yönlendir.

      *MALİYET KISMI*: Sorulursa asla 'değişkendir' deyip geçiştirme. Şu bilgiyi net ver: 
      Başlangıç yatırım maliyetlerimiz (Özel AI yazılım entegrasyonu) projenin gereksinimine bağlı olarak 1.000 Euro ile 10.000 Euro aralığındadır. Kurumunuza atanacak Tam otonom Aylık destek ve geliştirme SLA sözleşmelerimiz ise kullanım limitlerine bağlı 100 Euro - 3.000 Euro bareminde konumlandırılmıştır.
      
      *TOPLANTI ÇAĞRISI MANTIGI (ZORUNLU!)*
      Müşteri takvim ayarlama/randevu komutu yazarsa: ŞU YAZIYI AYNEN GÖNDER VE SUS: 
      "Detaylı bir iş keşif oturumu için en hızlı ve güvenli adım yandaki dijital takvim panelimizdir. Sizin için hazırlayacağımız prototipi ve kazanımlarınızı ölçmek üzere zaman aralığınızı belirtiniz. Aşağıdan seçiminizi gerçekleştirebilirsiniz." 
      Bu metne kesinlikle {"quickReplies":["Toplantı Planla", "Hizmetlerimiz", "Gerçek Kişiye Bağlan"]} JSON dizisi de ekle![BUTON/QUICK REPLY OZELLİĞİ ZORUNLUDUR!]: BÜTÜN konuşmalarının en altına gizli {"quickReplies":["Bağlama_Uygun_Buton1", "Buton_2", "Buton_3"]} formatını eklemek ZORUNDASIN. Kullanıcı manuel metin girmesin seninle tıklayarak konuşsun! İçeriğe toplantı geçerse buton "Toplantı planla" olsun.
    `;

    try {
      const chatContext = newMessagesHistory.slice(-5).map(m => m.role === 'user' ? `[Müşteri]: ${m.content}` : `[Nova]: ${m.content}`).join("\n");
      
      let aiResponseText = "";
      
      // 🌟 KADEMELI MODEL MIMARISI: ONCE EN KALITELISI (PRO), CÖKERSE HIZLISI (FLASH)🌟
      try {
          const proModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", systemInstruction: SYSTEM_PROMPT });
          const result = await proModel.generateContent(chatContext);
          aiResponseText = result.response.text();
      } catch (proErr) {
          console.warn("Pro modeli dolu/gecikmeli. Flash devreye alınıyor.");
          const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT });
          const result = await flashModel.generateContent(chatContext);
          aiResponseText = result.response.text();
      }

      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: aiResponseText, created: new Date().toISOString() }]);
      setIsSubmitting(false);

    } catch (err) {
      console.error(err);
      setErrorState("Sunucu trafiği yoğun. Veri bütünlüğünü sağlamak için sağ alttan insan yetkiliyle bağlantıya geçebilirsiniz.");
      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: "Bağlantıda paket kaybı yaşıyoruz, isterseniz manuel yetkili modülüne ('Gerçek Kişiyle Görüş') geçiniz.", created: new Date().toISOString() }]);
      setIsSubmitting(false);
    }
  };


  // 6. JSON CÖZÜCÜ (SIFIR YAZIM HATASI OLMALI)
  const extractQuickReplies = (text) => {
    if (!text) return[];
    try {
      const match = text.match(/\{"quickReplies"\s*:\s*\[.*?\]\}/s);
      if (match) return JSON.parse(match[0]).quickReplies ||[];
    } catch (e) {}
    return[];
  };

  const cleanContent = (text) => {
    if (!text) return text;
    return text.replace(/\{"quickReplies"\s*:\s*\[[^\]]*\]\}/g, '').trim();
  };

  const handleQuickReplyClick = (btnString) => {
    if (btnString.toLowerCase().includes('toplantı') || btnString.toLowerCase().includes('randevu') || btnString.toLowerCase().includes('planla')) {
      setShowCalendly(true);
      return;
    }
    if (btnString.toLowerCase().includes('gerçek kişi') || btnString.toLowerCase().includes('canlı') || btnString.toLowerCase().includes('operatör')) {
      handleEscalateToHuman();
      return;
    }
    handleSendMessage(btnString);
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

  
  // =============================== MAIN RENDER LAYER ========================

  if (!isOpen) {
    return (
      <>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-5 z-[55] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-shadow"
          style={{ background: 'linear-gradient(to right, #10b981, #06b6d4)', boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)' }}
          aria-label="Akıllı Otomasyon Asistanı"
        >
          <Bot className="w-[26px] h-[26px] text-white" />
        </motion.button>
        {showCalendly && (
           <CalendlyWidget isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-5 right-4 sm:right-6 z-[65] w-[calc(100vw-2rem)] sm:w-[410px] h-[650px] max-h-[85vh] bg-[#0A0F17]/95 border border-[#10b981]/20 rounded-2xl flex flex-col shadow-2xl backdrop-blur-3xl overflow-hidden font-sans"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#060A10]">
           <div className="flex gap-3">
             <div className="w-[38px] h-[38px] rounded-full border border-gray-700 bg-gray-800 flex justify-center items-center relative shadow-inner">
               <Bot className="w-5 h-5 text-gray-200" />
               <div className="absolute right-[-2px] bottom-[2px] w-2.5 h-2.5 bg-[#10B981] border border-[#060A10] rounded-full"></div>
             </div>
             <div>
                <p className="text-[13px] text-gray-100 font-bold tracking-widest flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#10B981]"/> N O V A</p>
                <p className="text-[10px] text-gray-400">Enterprise AI Asistanı</p>
             </div>
           </div>
           <button onClick={handleClose} className="text-gray-400 hover:text-white p-1">
             <X className="w-[18px] h-[18px]"/>
           </button>
        </div>


        {requestState !== 'idle' ? (
           <div className="flex-1 p-5 overflow-y-auto flex flex-col" style={{overscrollBehavior: 'contain'}}>
               {requestState === 'summary' && (
                  <div className="flex-1 flex flex-col animate-fade-in">
                     <p className="text-[12px] uppercase text-emerald-400 font-bold tracking-widest mb-4">Adım 1/2: Talep Önizleme</p>
                     <p className="text-[12.5px] text-gray-400 mb-2 leading-tight">Zamanınızı çalmamak adına aşağıdaki taslağı diyaloglarınızdan kurdum, gerekirse üzerinde değişiklik yapın ve onaylayın:</p>
                     <textarea value={requestSummary} onChange={e=>setRequestSummary(e.target.value)} 
                               className="w-full grow bg-[#040810] border border-gray-700 rounded-lg p-3 text-[14px] text-gray-300 resize-none outline-none focus:border-[#10b981]" />
                     <div className="grid grid-cols-2 gap-3 mt-4">
                        <button onClick={()=> setRequestState('idle')} className="py-2.5 text-gray-300 bg-gray-800 rounded-xl hover:bg-gray-700 border border-gray-600 font-medium text-[13.5px]">İptal</button>
                        <button onClick={()=> setRequestState('contact')} className="py-2.5 text-[#040810] bg-[#10b981] rounded-xl hover:brightness-110 font-bold text-[13.5px]">Sonraki Adım</button>
                     </div>
                  </div>
               )}
               {requestState === 'contact' && (
                  <div className="flex-1 flex flex-col animate-fade-in justify-center gap-2">
                     <p className="text-[12px] uppercase text-cyan-400 font-bold tracking-widest mb-1">Adım 2/2: Size Nasıl Ulaşalım?</p>
                     <p className="text-gray-400 text-[12.5px] mb-1">Yalnızca gerekli iletişim bilgilerini istiyoruz (Güvenli Alan).</p>
                     <div className="space-y-3 mb-2">
                         <div className="grid grid-cols-2 gap-3">
                           <input placeholder="Adınız *" value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} className="p-3.5 bg-gray-900 border border-gray-800 text-[14px] text-white rounded-[10px] outline-none" />
                           <input placeholder="Soyad *" value={contactInfo.surname} onChange={e => setContactInfo({...contactInfo, surname: e.target.value})} className="p-3.5 bg-gray-900 border border-gray-800 text-[14px] text-white rounded-[10px] outline-none" />
                         </div>
                         <input placeholder="E-Posta (Zorunlu)*" type="email" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full p-3.5 bg-gray-900 border border-gray-800 text-[14px] text-white rounded-[10px] outline-none focus:border-cyan-500" />
                         <input placeholder="Telefon / Ünvan (Opsiyonel)" type="tel" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full p-3.5 bg-gray-900 border border-gray-800 text-[14px] text-white rounded-[10px] outline-none focus:border-cyan-500" />
                     </div>
                     <div className="flex gap-2">
                        <button onClick={submitRequestForm} disabled={isSubmittingRequest} className="w-full flex-grow py-3.5 font-bold rounded-[10px] bg-gradient-to-r from-teal-500 to-[#10b981] hover:brightness-105 flex justify-center text-[#060a10] uppercase">
                            {isSubmittingRequest ? <Loader2 className="w-4 h-4 animate-spin my-0.5" /> : 'Kayıt ve Uzman Atama'}
                        </button>
                     </div>
                  </div>
               )}
               {requestState === 'success' && (
                  <div className="h-full w-full flex flex-col justify-center items-center animate-fade-in py-10 border border-teal-500/20 bg-teal-500/5 rounded-2xl px-4 relative overflow-hidden">
                     <CheckCircle2 className="w-16 h-16 text-[#10b981] mb-4 stroke-2 relative z-10" />
                     <h2 className="text-xl font-bold text-white mb-2 relative z-10">Talebiniz Kaydedildi!</h2>
                     <p className="text-gray-400 text-sm text-center font-normal relative z-10">Birazdan uzmanımız sizinle ilettiğiniz adres ({contactInfo.email}) üzerinden görüşme açacaktır.</p>
                  </div>
               )}
           </div>
        ) : (
        <div className="flex-1 flex flex-col h-full bg-[#0A0F17] overflow-y-auto w-full custom-scrollbar-minimal scroll-smooth pr-1">
             <div className="flex-1 p-4 pb-0 flex flex-col justify-end min-h-max space-y-4 pt-8">

                  {localMessages.map((m,idx) => (
                    <div key={idx} className={`w-full animate-fade-in-up flex ${m.role === 'user' ? 'justify-end pl-[15%]' : 'justify-start pr-[5%]'}`}>
                         <div className={`p-[13px] relative shadow-lg
                             ${m.role === 'user' 
                             ? 'bg-gradient-to-r from-[#111827] to-[#1F2937] border-t border-l border-b border-r-4 border-gray-700/60 border-r-emerald-500 text-white rounded-l-2xl rounded-tr-xl' 
                             : 'bg-transparent text-gray-200 border-l border-[#06b6d4] pl-3 border-y-0 border-r-0 '}
                             text-[13px] md:text-[14px] leading-relaxed
                           `}>
                              <p className="whitespace-pre-wrap" style={{wordBreak:"break-word"}}>{cleanContent(m.content)}</p>
                         </div>
                    </div>
                  ))}
                  
                  {isSubmitting && (
                    <div className="w-fit mb-3">
                         <div className="px-5 py-4 flex justify-center gap-1.5 ml-4 bg-gray-900 border border-gray-800 shadow rounded-lg items-center ">
                              <span className="block w-[5px] h-[5px] bg-[#10b981] rounded-full animate-bounce"></span>
                              <span className="block w-[5px] h-[5px] bg-[#06b6d4] rounded-full animate-bounce" style={{animationDelay:"0.1s"}}></span>
                              <span className="block w-[5px] h-[5px] bg-[#06b6d4] rounded-full animate-bounce" style={{animationDelay:"0.2s"}}></span>
                         </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} className="h-0 opacity-0 pb-1" />

                   <div className="flex gap-2 flex-wrap items-center mt-3 p-1.5 pb-2">
                        {(!isSubmitting) && (localMessages.length === 1 ? INITIAL_QUESTIONS : dynamicQuickReplies).map((btnStr, k) => (
                             <button key={k} onClick={() => handleQuickReplyClick(btnStr)} 
                             className="text-left whitespace-normal break-words hover:-translate-y-[1px] hover:text-white transition-all shadow hover:shadow-[#10B981]/20 font-medium px-4 py-2 border border-gray-700 bg-gray-800 text-[12px] text-gray-400 rounded-full hover:bg-gray-700/80 outline-none hover:border-emerald-600 w-max max-w-[85%]">{btnStr} </button> 
                         ))}
                    </div>
             </div>
        </div>
       )} 


        {/* COMMAND ÇUBUĞU (KİLİTLİ, SABİT!) */}
        <div className="p-3 w-full bg-[#060A10] shrink-0 border-t border-emerald-900/50 shadow-2xl relative rounded-b-[18px]">
             
             <AnimatePresence>
                 {errorState && (
                    <motion.div initial={{ y:-15, opacity:0}} animate={{y:-50, opacity:1}} exit={{y:-15, opacity:0}} className="absolute left-0 right-0 mx-2 px-3 py-2 shadow-md flex items-center justify-between text-xs font-semibold rounded bg-red-900 text-white z-50 border border-red-500" >
                        <span>{errorState}</span>
                        <X onClick={dismissError} className="w-4 h-4 cursor-pointer p-0.5 hover:bg-black/30" />
                    </motion.div>
                 )}
             </AnimatePresence>

             <div className="grid grid-cols-3 gap-2 px-1 w-full pb-2">
                 <button onClick={handleOpenRequestForm} className="flex gap-2 items-center justify-center p-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition shadow">
                    <FileText className="w-3.5 h-3.5" /> Talep Ekle
                 </button>  
                 <button onClick={()=>{setShowCalendly(true); window.dispatchEvent(new Event('open-calendar-modal'))}} 
                           className="flex gap-1 items-center justify-center p-2 rounded-xl text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition shadow"> 
                          <Calendar className="w-3.5 h-3.5 opacity-70 "/> Toplantı
                 </button>
                 <button onClick={handleEscalateToHuman} className="flex gap-1 items-center justify-center p-2 rounded-xl text-[10.5px] tracking-tight font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 uppercase transition border border-red-500/30"> 
                         G. Kişi (Canlı)
                 </button> 
             </div>

             <div className="flex gap-2 relative bg-[#121A26] p-1.5 border border-[#202E42] rounded-[14px]"> 
                 <input 
                   ref={inputRef} 
                   type="text" 
                   disabled={isSubmittingRequest || isSubmitting}
                   value={inputValue} 
                   onChange={(e) => setInputValue(e.target.value)} 
                   onKeyDown={handleKeyPress}
                   placeholder='Nasıl hizmet destek oluruz?  ⌁ '  
                   className="flex-1 w-full p-2 pl-3 bg-transparent text-gray-200 outline-none placeholder:text-gray-500 text-sm disabled:opacity-50" />
                 
                 <button  
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={isSubmitting || !inputValue.trim()} 
                      className="w-10 h-10 rounded-[10px] bg-gradient-to-b from-emerald-500 to-teal-600 flex justify-center items-center disabled:opacity-40 transition-shadow shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                   <Send className="w-[18px] h-[18px] text-white/90 drop-shadow ml-0.5" />
                 </button>   
             </div> 
        </div>

      </motion.div>
      
      {/* 🚀 APPLE/TESLA MODULU: SAF CAL.COM IFRAME */}
      {showCalendly && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md overflow-hidden p-0 sm:p-6 lg:p-12 animate-fade-in"
               onClick={() => setShowCalendly(false)}>
           <div className="relative bg-[#F3F4F6] sm:rounded-[30px] rounded-none overflow-hidden w-[100vw] h-[100vh] sm:w-[96vw] sm:max-w-[1000px] lg:max-h-[750px] shadow-2xl flex flex-col border sm:border-slate-300"
                onClick={(e) => e.stopPropagation()}>
                
             <div className="w-full flex-shrink-0 bg-white sm:bg-[#F3F4F6] border-b border-gray-200 sm:border-b-0 py-3 sm:py-0 px-4 mb-2 flex items-center justify-end relative sm:absolute sm:top-5 sm:right-6 sm:z-10 h-14 sm:h-auto z-[60]">
               <button 
                 onClick={() => setShowCalendly(false)}
                 className="flex items-center gap-1 sm:px-4 px-2 py-1.5 sm:py-2 text-[14px] text-slate-700 bg-white border border-gray-300 sm:rounded-[14px] rounded-md hover:bg-gray-100 font-semibold uppercase tracking-wider transition-all"
               >
                 <X className="w-4 h-4 text-gray-500" />
                 <span>KAPAT</span>
               </button>
             </div>
             
             <div className="w-full h-[calc(100vh-60px)] pb-4 px-2 pt-2 bg-white flex grow items-center relative overflow-hidden sm:rounded-[30px] border border-gray-100 mt-0">
                  <iframe 
                    src="https://cal.com/novaotomasyon?hideEventTypeDetails=false" 
                    title="Takvim Randevusu" 
                    frameBorder="0" 
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    className="absolute inset-0 w-full h-[calc(100vh-1rem)] md:h-[calc(100vh-60px)] lg:h-[750px] top-0 left-0 right-0 overflow-y-scroll max-w-[100vw]">
                  </iframe>
              </div>
           </div>
         </div>
      )}
    </>
  );
}
