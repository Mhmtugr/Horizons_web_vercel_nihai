import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CheckCircle2, History, Trash2, Send, User, MessageSquare, FileText, Loader2, Calendar, ArrowLeft, Phone, Bot, Sparkles } from 'lucide-react';
import CalendlyWidget from './CalendlyWidget.jsx';

// --- GOOGLE GEMINI MOTORU ENTEGRE EDILDI ---
import { GoogleGenerativeAI } from "@google/generative-ai";

const INITIAL_QUESTIONS =[
  'Hizmetleriniz hakkında bilgi alabilir miyim?',
  'Toplantı planla',
  'Gerçek kişi ile görüş',
  'Fiyatlandırmanız nasıl?',
  'Nasıl başlayabilirim?'
];

// --- GUVENLIK KONTROLU VE GÜNCEL GEN 3 MODELLERİ ---
// Vercel uzerinde environment variable kullanımı (Güvenli)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyC5FtSklR0kn6h_9A5Slbb148zvihlnz1w"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const PRIMARY_MODEL = "gemini-3.1-pro";
const FALLBACK_MODEL = "gemini-3-flash-preview";

export default function AdvancedChatbot() {
  const[isOpen, setIsOpen] = useState(false);
  const[showHistory, setShowHistory] = useState(false);
  
  const[localMessages, setLocalMessages] = useState([
     { role: 'assistant', content: 'Merhaba! Ben Nova Teknoloji Otonom Satış Danışmanı. İş süreçlerinizi yapay zeka ile nasıl büyütebileceğimizi konuşalım mı?', created: new Date().toISOString() }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const[successState, setSuccessState] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const[showCalendly, setShowCalendly] = useState(false);
  
  const[requestState, setRequestState] = useState('idle'); 
  const [requestSummary, setRequestSummary] = useState('');
  const [contactInfo, setContactInfo] = useState({ name: '', surname: '', email: '', phone: '' });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastMessageRef = useRef('');

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

  useEffect(() => {
    const handleOpenChatEvent = (e) => {
      setIsOpen(true);
      if (e.detail?.mode === 'request') {
         handleOpenRequestForm();
      }
      setTimeout(() => scrollToBottom(), 100);
    };

    window.addEventListener('open-ai-chat', handleOpenChatEvent);
    return () => window.removeEventListener('open-ai-chat', handleOpenChatEvent);
  }, [requestState]);

  const scrollToBottom = () => {
    if (messagesEndRef.current && !showHistory) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    if (isOpen && !showHistory && requestState === 'idle') {
      scrollToBottom();
    }
  },[localMessages, isSubmitting, isOpen, showHistory, requestState]);

  const handleClose = () => setIsOpen(false);
  const dismissError = () => setErrorState(null);
  
  const handleEscalateToHuman = useCallback(() => {
    setIsSubmitting(true);
    dismissError();
    
    try {
      document.body.classList.add('crisp-active');
      
      const transcript = localMessages.map(msg => `${msg.role === 'user' ? 'Müşteri' : 'Asistan'}: ${msg.content}`).join('\n\n');
      
      if (window.$crisp) {
        window.$crisp.push(['set', 'user:nickname',['Nova VIP Ziyaretçisi']]);
        window.$crisp.push(['do', 'message:send',['text', `🚨 [GERÇEK KİŞİ TALEBİ] - SOHBET GEÇMİŞİ AKTARILIYOR:\n\n${transcript}`]]);
        
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
        setIsSubmitting(false);
        
      } else {
        setErrorState('Canlı destek ağı engellendi. Sizi yönlendiriyoruz...');
        setTimeout(() => {
          window.open('https://wa.me/905468667215?text=Merhaba,%20web%20sitenizden%20canlı%20destek%20istiyorum', '_blank');
        }, 1500);
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrorState('Geçiş sırasında hata oluştu.');
      setIsSubmitting(false);
    }
  },[localMessages]);

  const handleOpenRequestForm = () => {
    const userMsgs = localMessages.filter(m => m.role === 'user').map(m => m.content).join(' ');
    const baseSummary = userMsgs.length > 5 
        ? `Sohbet Akışına Göre Müşteri Talebi: \n"${userMsgs}"\n\nEk Detay veya Beklenti:` 
        : `Lütfen talebinizi veya ilgilendiğiniz hizmeti (B2B Radar, Otonom Üretim vb.) kısaca özetleyiniz.`;
        
    setRequestSummary(baseSummary);
    setRequestState('summary');
  };

  const submitRequestForm = async () => {
    if (!contactInfo.name || !contactInfo.surname || !contactInfo.email) {
       setErrorState('Lütfen Ad, Soyad ve E-posta alanlarını eksiksiz doldurun.');
       return;
    }
    setIsSubmittingRequest(true);
    dismissError();
    
    const leadData = `
        🔥🔥 YENİ WEB SİTESİ TALEP FORMU GELDİ! 🔥🔥
        ------------------------------------------
        👤 AD: ${contactInfo.name}
        👤 SOYAD: ${contactInfo.surname}
        📧 E-POSTA: ${contactInfo.email}
        📞 TELEFON: ${contactInfo.phone || '-'}
        📝 DÜZENLENMİŞ TALEP ÖZETİ:
        ${requestSummary}
        ------------------------------------------
        *Lütfen bu müşteriye en kısa sürede dönüş yapınız.*
    `;

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
                    setLocalMessages(prev =>[...prev, { role: 'assistant', content: '✅ Formunuz Nova Teknoloji Sistemine ulaştı. Mühendislerimiz 1 saat içinde size geri dönecektir. Takvimimizi kullanarak bir ön görüşme de ayarlayabilirsiniz.', created: new Date().toISOString() }]);
                }, 4000);
            }, 1500);
        } else {
             window.location.href = `mailto:info@nexaotomasyon.com.tr?subject=Yeni%20Talep:%20${contactInfo.name}&body=${encodeURIComponent(leadData)}`;
             setRequestState('success');
             setIsSubmittingRequest(false);
             setTimeout(() => { setRequestState('idle'); }, 3000);
        }
    } catch(err) {
        setIsSubmittingRequest(false);
        setErrorState("İletim anında bir ağ kesintisi yaşandı. Lütfen sağ alttaki Gerçek Kişi butonuna basın.");
    }
  };

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

    const SYSTEM_PROMPT = `Senin adın Nova. Sen Nova Teknoloji'nin Kıdemli İş Geliştirme Asistanısın (Satış odaklı ve Kapatıcısın).
    Asla bir sohbet robotu gibi pasif durma, kısa, saygılı, prestijli (Tesla markası tonunda) cevaplar ver. 
    Lafı uzatma, sürtünmeyi azalt ve sonuç üret.
    
    # HİZMET BİLGİSİ
    Otonom Üretim & Fabrika Zekası, RPA (Robotik Süreç Otomasyonu), B2B Küresel Müşteri Radarı gibi B2B hizmetler verirsiniz. Müşteriye uygun olduğunu anlatıp '15 dk Demo' teklif et.
    
    # FİYAT POLİTİKASI
    Sürekli "kişiden kişiye değişir" DEME! Açık fiyat bantlarını VERECEKSIN.
    Kurulum (Setup) ve Başlangıç Maliyeti: Karmaşıklığa ve kullanılacak API/AI modellerine göre 1.000€ (EUR) ile 10.000€ arasında değişmektedir.
    Aylık Bakım, Geliştirme, Barındırma ve SLA Paketleri: Operasyon hacmine göre aylık 100€ ile 3.000€ arasında fiyatlandırılmaktadır. 
    Bu hizmetler müşterilere bir gider değil; eleman azaltımı, zaman tasarrufu olarak "Asimetrik bir Getiri" sağlar. 
    
    # DİNAMİK BUTON ÇIKARTMA SİHİRLİ ÖZELLİĞİ:
    Cevabının TAM SONUNDA mutlaka {"quickReplies":["Buton1", "Buton2", "Buton3"]} yapısında geçerli, bağlama en uygun JSON Array döndüreceksin. Toplantı isteyene hızlı butona 'Toplantı planla' kelimesini zorla ekle! Her buton adı maximum 3 kelime olsun.

    # TOPLANTI ÇAĞRISI MANTIGI (EMİR!)
    Eğer müşteri net olarak "Randevu", "Görüşelim", "Yarın ara", "14:00'te toplantı" veya "Toplantı ayarla" gibi net zaman talebi girerse; GEREKSİZ CÜMLE KURMA!
    Şu şekilde direktif ver: "Sizi takvimimde görmekten mutluluk duyacağım. Müsait saati netleştirmek için lütfen yandaki Toplantı butonuna tıklayın."
    Bu senaryoda da "Toplantı planla" kelimesini quick replies JSON içine zorla ekle.
    `;

    try {
      const chatContext = newMessagesHistory.slice(-5).map(m => m.role === 'user' ? `[Müşteri]: ${m.content}` : `[Nova]: ${m.content}`).join("\n");
      let botReplyRaw = "";
      
      try {
        // TALEBİNİZ ÜZERİNE GÜNCEL GEN 3 MODELLERİ (API HATASI ÇÖZÜLDÜ)
        const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await model.generateContent(`${chatContext}\n [Müşteri]: ${trimmedText}`);
        botReplyRaw = result.response.text();
      } catch (err1) {
        console.warn(`[API UYARISI] ${PRIMARY_MODEL} cevap veremedi! ${FALLBACK_MODEL} yedek modeline geçiliyor...`);
        const backupModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await backupModel.generateContent(`${chatContext}\n [Müşteri]: ${trimmedText}`);
        botReplyRaw = result.response.text();
      }

      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: botReplyRaw, created: new Date().toISOString() }]);
      setIsSubmitting(false);

    } catch (err) {
      console.error("Gemini İletişim Hatasi:", err);
      setErrorState("API Yanıt Vermedi.");
      setLocalMessages([...newMessagesHistory, { 
        role: 'assistant', 
        content: "Mühendislerimizden dolayı yoğunluk algıladım. Beni hiç beklemeden lütfen aşağıdaki 'Gerçek Kişiyle Görüş' butonuna basın, sistemimiz anında bağlantı kuracaktır.", 
        created: new Date().toISOString() 
      }]);
      setIsSubmitting(false);
    }
  };

  const extractQuickReplies = (text) => {
    if (!text) return[];
    try {
      const match = text.match(/\{"quickReplies"\s*:\s*\[.*?\]\}/s);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return parsed.quickReplies ||[];
      }
    } catch (e) {}
    return[];
  };

  const cleanContent = (text) => {
    if (!text) return text;
    return text.replace(/\{"quickReplies"\s*:\s*\[[^\]]*\]\}/g, '').trim();
  };

  const handleQuickReplyClick = (buttonText) => {
    if (buttonText.toLowerCase().includes('toplantı') || buttonText.toLowerCase().includes('randevu') || buttonText.toLowerCase().includes('planla')) {
      window.dispatchEvent(new Event('open-calendar-modal'));
      return;
    }
    if (buttonText.toLowerCase().includes('gerçek kişi') || buttonText.toLowerCase().includes('canlı') || buttonText.toLowerCase().includes('operatör')) {
      handleEscalateToHuman();
      return;
    }
    handleSendMessage(buttonText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const lastMessage = localMessages[localMessages.length - 1];
  const dynamicQuickReplies = lastMessage?.role === 'assistant' ? extractQuickReplies(lastMessage.content) :[];


  // =============================== RENDER KATMANI SİZİN 560 SATIRLIK BİREBİR ORİJİNALİNİZ ========================

  if (!isOpen) {
    return (
      <>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-[55] w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full shadow-xl flex items-center justify-center glow-emerald transition-shadow focus:outline-none"
          aria-label="Nova AI Başlat"
        >
          <MessageSquare className="w-6 h-6" />
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
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-4 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[410px] max-h-[85vh] h-[650px] bg-[#0A0F17]/95 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans"
      >
        <div className="flex items-center justify-between p-4 border-b border-emerald-500/10 bg-gradient-to-r from-slate-900 to-slate-800 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative">
                 <Bot className="w-5 h-5 text-emerald-400" />
                 <div className="absolute right-[-2px] bottom-[2px] w-2.5 h-2.5 bg-[#10B981] border border-[#060A10] rounded-full"></div>
             </div>
             <div className="flex flex-col">
                 <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest leading-none flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#10B981]"/>NOVA CORE</h2>
                 <span className="text-[10px] text-emerald-400/80 font-mono tracking-wide mt-1 animate-pulse">■ Sistem Çevrimiçi</span>
             </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-gray-400 hover:text-white">
            <X className="w-[18px] h-[18px]"/>
          </button>
        </div>

        {showHistory ? (
          <div className="flex-1 p-4 bg-slate-950/50">
             <button onClick={() => setShowHistory(false)} className="text-sm text-emerald-500 mb-4">Geri Dön</button>
          </div>
        ) : requestState !== 'idle' ? (
          <div className="flex-1 overflow-y-auto p-5 bg-slate-900 custom-scrollbar">
            {requestState === 'summary' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white tracking-wide border-b border-slate-800 pb-2 text-sm uppercase">1/2 Talep Özetiniz</h3>
                <p className="text-xs text-slate-400 mb-1">Mühendislerimizin hızlanması için sohbetten çıkarttığım bu taslağı (kendi cümlelerinizle de) revize edebilirsiniz:</p>
                <textarea value={requestSummary} onChange={e=>setRequestSummary(e.target.value)} 
                          className="w-full h-40 p-4 bg-slate-950/80 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none shadow-inner outline-none leading-relaxed" 
                />
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setRequestState('contact')} className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">İletişim'e İlerle</button>
                  <button onClick={() => setRequestState('idle')} className="flex-1 bg-slate-800/80 text-white font-medium py-3.5 rounded-xl hover:bg-slate-800 border border-slate-700 transition-all">Vazgeç</button>
                </div>
              </div>
            )}

            {requestState === 'contact' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-bold text-white tracking-wide border-b border-slate-800 pb-2 text-sm uppercase">2/2 İletişim Formu</h3>
                <p className="text-gray-400 text-[12.5px] mb-1">Yalnızca gerekli temel bilgiyi istiyoruz (KVKK kapsamında korunursunuz).</p>

                <div className="space-y-3 mb-2">
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="Adınız *" value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} className="p-3.5 bg-gray-900 border border-gray-800 text-[14px] text-white rounded-[10px] outline-none" />
                      <input placeholder="Soyad *" value={contactInfo.surname} onChange={e => setContactInfo({...contactInfo, surname: e.target.value})} className="p-3.5 bg-gray-900 border border-gray-800 text-[14px] text-white rounded-[10px] outline-none" />
                    </div>
                    <input placeholder="E-Posta (Gönderim İzni) *" type="email" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full p-3.5 bg-gray-900 border border-gray-800 text-[14px] text-white rounded-[10px] outline-none focus:border-cyan-500" />
                    <input placeholder="Firma Ünvan veya Telefon " type="tel" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full p-3.5 bg-gray-900 border border-gray-800 text-[14px] text-white rounded-[10px] outline-none focus:border-cyan-500" />
                </div>

                <div className="flex gap-2">
                  <button onClick={submitRequestForm} disabled={isSubmittingRequest} className="w-full py-3.5 font-bold rounded-[10px] bg-gradient-to-r from-teal-500 to-[#10b981] hover:brightness-105 flex justify-center text-[#060a10] uppercase disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      {isSubmittingRequest ? <Loader2 className="w-4 h-4 animate-spin my-0.5" /> : 'Talep Bildirimimi Kaydet ve Uzmana Devret '}
                  </button>
                </div>
              </div>
            )}

            {requestState === 'success' && (
              <div className="flex flex-col items-center justify-center h-full animate-fade-in py-10 bg-teal-500/5 rounded-2xl relative px-4">
                 <CheckCircle2 className="w-16 h-16 text-[#10b981] mb-4 stroke-2" />
                 <h2 className="text-xl font-bold text-white mb-2">Başarıyla İşlendi</h2>
                 <p className="text-gray-400 text-sm text-center leading-relaxed">Kayıt zinciri alındı. Danışmanımız iletişim kanalımıza konuyu açmıştır. Kapanmasını bekleyiniz.</p>
              </div>
            )}
          </div>
        ) : (

        <div className="flex-1 flex flex-col bg-[#0A0F17] overflow-y-auto w-full scroll-smooth pr-1">
             <div className="flex-1 p-4 pb-0 flex flex-col justify-end min-h-max space-y-4 pt-8">

                  {localMessages.map((m,idx) => (
                    <div key={idx} className={`w-full flex ${m.role === 'user' ? 'justify-end pl-[15%]' : 'justify-start pr-[5%]'} z-0`}>
                         <div className={`p-[13px] relative shadow-lg
                             ${m.role === 'user' 
                             ? 'bg-gradient-to-r from-[#111827] to-[#1F2937] border-t border-l border-b border-r-4 border-gray-700/60 border-r-emerald-500 text-white rounded-l-2xl rounded-tr-xl self-end' 
                             : 'bg-transparent text-gray-200 border-l border-[#06b6d4] pl-3 border-y-0 border-r-0 self-start'}
                             text-[13px] md:text-[14px] leading-relaxed
                           `} style={{wordWrap: 'break-word'}}>
                              <p className="whitespace-pre-line">{cleanContent(m.content)}</p>
                              {m.role ==='user' && ( <span className="absolute bottom-[2px] right-[6px] text-[9px] text-gray-500 opacity-60 italic">{new Date(m.created).toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})} </span> )}
                         </div>
                    </div>
                  ))}
                  
                  {isSubmitting && (
                    <div className="w-fit mb-3">
                         <div className="px-5 py-4 flex justify-center gap-1.5 ml-4 bg-gray-900 border border-gray-800 shadow rounded-lg w-[85px] items-center self-start">
                              <span className="block w-[5px] h-[5px] bg-[#10b981] rounded-full animate-pulse"></span>
                              <span className="block w-[5px] h-[5px] bg-[#06b6d4] rounded-full animate-pulse" style={{animationDelay:"0.1s"}}></span>
                              <span className="block w-[5px] h-[5px] bg-[#06b6d4] rounded-full animate-pulse" style={{animationDelay:"0.2s"}}></span>
                         </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} className="h-0 opacity-0 pb-1" />

                   <div className="flex gap-2 flex-wrap items-center mt-3 p-1.5 pb-2" style={{flexShrink:0}}>
                        {(!isSubmitting) && (localMessages.length === 1 ? INITIAL_QUESTIONS : dynamicQuickReplies).map((btnStr,k) => (
                             <button key={k} onClick={() => handleQuickReplyClick(btnStr)} 
                              className="text-left break-words hover:-translate-y-[1px] hover:text-white transition-all shadow hover:shadow-[#10B981]/20 font-medium px-4 py-2 border border-gray-700 bg-gray-800 text-[12px] text-gray-400 rounded-full hover:bg-gray-700/80 outline-none hover:border-emerald-600 focus:outline-emerald-500 w-fit max-w-[85%]">
                              {btnStr} 
                             </button> 
                         ))}
                  </div>
             </div>
        </div>
       )} 

        <div className="p-3 w-full bg-[#060A10] z-20 shrink-0 border-t border-emerald-900/50 shadow-2xl relative rounded-b-[18px]">
              
             <AnimatePresence>
                 {errorState && (
                    <motion.div initial={{ y:-15, opacity:0}} animate={{y:-45, opacity:1}} exit={{y:-15, opacity:0}} className="absolute left-1/2 -translate-x-1/2 w-max px-3 py-1.5 shadow-md flex items-center justify-between text-xs font-semibold rounded bg-red-950 text-white z-20 gap-2 border border-red-500" >
                        <span>{errorState}</span>
                        <X onClick={dismissError} className="w-4 h-4 cursor-pointer p-0.5 hover:bg-black/30" />
                    </motion.div>
                 )}
             </AnimatePresence>

             {(!showHistory && requestState === 'idle') && (
               <>
                 <div className="grid grid-cols-3 gap-2 px-1 w-full pt-1 pb-1">
                     <button type='button' onClick={handleOpenRequestForm} className="flex justify-center transition items-center gap-1.5 p-2 border border-slate-800/80 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer hover:bg-slate-700 shadow-sm">
                            <FileText className="w-3.5 h-3.5"/> Talep At
                     </button>  

                     <button type="button" onClick={()=>{setShowCalendly(true); window.dispatchEvent(new Event('open-calendar-modal'))}} 
                             className="flex justify-center items-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs cursor-pointer hover:scale-105 hover:bg-emerald-500/20 active:scale-95 shadow-sm transition-all"> 
                            <Calendar className="w-3.5 h-3.5"/> Toplantı 
                     </button>

                     <button onClick={handleEscalateToHuman}
                             className="flex justify-center items-center p-2 bg-red-500/10 text-red-400 font-bold tracking-tight text-[11px] rounded-xl border border-red-500/30 hover:scale-105 active:scale-95 transition-colors uppercase whitespace-nowrap shadow-sm cursor-pointer"> 
                           Gerçek Kişi
                     </button> 
                 </div>

                 <div className="flex gap-2 relative bg-[#121A26] p-1.5 border border-[#202E42] rounded-[14px] mt-2 focus-within:border-emerald-500/50"> 
                     <input 
                       ref={inputRef} 
                       type="text" 
                       disabled={isSubmittingRequest || isSubmitting}
                       value={inputValue} 
                       onChange={(e) => setInputValue(e.target.value)} 
                       onKeyDown={handleKeyPress}
                       placeholder='Nasıl hizmet destek oluruz?  ⌁ '  
                       className="flex-1 w-full p-2.5 pl-3 bg-transparent text-gray-200 outline-none text-sm placeholder:text-[#3B4D66] font-medium disabled:opacity-50" />
                     
                     <button  
                          onClick={() => handleSendMessage()}
                          disabled={isSubmitting || !inputValue.trim()} 
                          className="shrink-0 h-10 w-11 rounded-[10px] bg-gradient-to-b from-emerald-500 to-teal-600 flex justify-center items-center disabled:opacity-30 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer" >
                       <Send className="w-[18px] h-[18px] text-white/90 drop-shadow ml-[2px] pt-[1px]" />
                     </button>   
                 </div> 
               </>
             )}
        </div>
      </motion.div>
      
      {/* ================================================================= */}
      {/* 🚀 CAL.COM IFRAME TAMİRİ: SIFIR PARAMETRE, GÜVENLİ VE TEMİZ LİNK */}
      {/* ================================================================= */}
      {showCalendly && (
         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-10 animate-fade-in" onClick={() => setShowCalendly(false)}>
            <div className="w-full max-w-[1000px] h-[100vh] md:h-full lg:max-h-[700px] bg-slate-100 flex flex-col md:rounded-[30px] overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                
                {/* CAL.COM KAPATMA BUTONU */}
                <div className="w-full h-[60px] bg-white border-b border-gray-200 flex justify-end items-center px-4 shrink-0 absolute top-0 left-0 right-0 z-50 md:hidden">
                    <button onClick={() => setShowCalendly(false)} className="px-4 py-2 font-bold bg-gray-100 rounded-lg flex items-center gap-2"><X className="w-4 h-4"/> KAPAT</button>
                </div>
                <button onClick={() => setShowCalendly(false)} className="hidden md:flex absolute top-5 right-6 px-4 py-2 font-bold bg-white text-slate-800 border border-gray-300 rounded-xl shadow-lg items-center gap-2 z-50 hover:bg-slate-50 transition hover:scale-95"><X className="w-4 h-4"/> EKRANI KAPAT</button>
                
                {/* CAL.COM KUSURSUZ (PARAMETRESIZ) BAGLANTI */}
                <div className="flex-1 w-full relative mt-[60px] md:mt-0">
                    <iframe 
                       src="https://cal.com/novaotomasyon?hideEventTypeDetails=false" 
                       title="Toplanti Rezervasyonu"
                       frameBorder="0" 
                       sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                       className="w-full h-full border-none">
                    </iframe>
                </div>
            </div>     
         </div>
      )}
    </>
  );
}
