import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// --- NOVA OMNIPRESENT ICONS ---
import { AlertCircle, X, CheckCircle2, History, Trash2, Send, User, MessageSquare, FileText, Loader2, Calendar, ArrowLeft, Phone, Bot, Sparkles } from 'lucide-react';
import CalendlyWidget from './CalendlyWidget.jsx';
// --- BAGIMLILIKLAR / HOOKS ---
import { useChatHistory } from '@/hooks/useChatHistory.js';
import { useAnalytics } from '@/hooks/useAnalytics.js';
// --- GOOGLE GEMINI ENGINE ---
import { GoogleGenerativeAI } from "@google/generative-ai";

const INITIAL_QUESTIONS =[
  'Hizmetleriniz hakkında bilgi alabilir miyim?',
  'Toplantı planla',
  'Gerçek kişi ile görüş',
  'Fiyatlandırmanız nasıl?',
  'Nasıl başlayabilirim?'
];

// ENV (GIZLI DEGISKENLER) ENTEGRASYONU - TESLA STANDARD SECURE IMPORT
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyC5FtSklR0kn6h_9A5Slbb148zvihlnz1w"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// VITE VE GOOGLE UZERINDEN GEN-3 SURUM TETIGI 
const PRIMARY_MODEL = "gemini-3.1-pro";
const FALLBACK_MODEL = "gemini-3-flash-preview";

export default function AdvancedChatbot() {
  
  // STATE MANAGEMENT KOK HUCRESI
  const[isOpen, setIsOpen] = useState(false);
  const[showHistory, setShowHistory] = useState(false);
  
  const[localMessages, setLocalMessages] = useState([
     { role: 'assistant', content: 'Nova Teknoloji. Üretim bandınızdan yazılım altyapınıza kadar şirketinizi Otonom geleceğe taşımak için buradayım. Vizyonunuzu birlikte inşa edelim.', created: new Date().toISOString() }
  ]);
  const[isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const[inputValue, setInputValue] = useState('');
  const [showCalendly, setShowCalendly] = useState(false);
  
  // OTONOM (FORMSUZ YAKALAYAN) LEAD STATE SISTEMI
  const[requestState, setRequestState] = useState('idle'); 
  const[requestSummary, setRequestSummary] = useState('');
  const[contactInfo, setContactInfo] = useState({ name: '', surname: '', email: '', phone: '' });
  const[isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // REFERANSLAR YIGINI
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastMessageRef = useRef('');
  const sessionStartTime = useRef(Date.now());
  
  const { conversations, saveConversation, deleteConversation } = useChatHistory();
  const { trackEvent } = useAnalytics();

  // (FONKSIYON - SABITLEME): VERCEL BUILD HATASI OLAN 'dismissError' SADELESTIRILDI VE SADECE 1 KERE YAZILDI.
  const dismissError = useCallback(() => { setErrorState(null); },[]);

  // 1. HAYALET GECISI VE CRISP KOORDINASYONU (OMNIPRESENT CRISP)
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

  // 2. KAYDIRMA VE TAKIP OTO YUKSEKLIGI (FLAWLESS SMOOTH SCROLL)
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  };

  useEffect(() => {
    if (isOpen && !showHistory && requestState === 'idle') scrollToBottom();
  },[localMessages, isSubmitting, isOpen, showHistory, requestState]);

  // SISTEM GLOBAL CAGRICILARI
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
  
  // 3. HUMAN HANDOFF - SEAMLESS (PÜRÜZSÜZ GERCERLİ KIŞİ KAYDIRICI)
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

  // 4. MUKEMMEL DATA ACTARIYISI (REQUEST EKRANLARİ - FRONT TALEPLERI İŞLENİR)
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

  // 5. GOOGLE GEMINI 3.X SÜPER BILINC VE OTOMATIZASYON ENJEKTI
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

    // CLOSING PROMPT / CLOSER ZIHIN YARATISI 
    const SYSTEM_PROMPT = `
      # MİMARİ KARAKTER & TON TÜRÜ
      Benliğinin (Personalities) adı Nova. Nova Teknoloji'nin en Elit (Kurumsal), kendinden emin, asil (Executive Manager mantalitesinde) Operasyon Geliştiricisi AI Mimarı'sın.
      Soru fırlatmayacaksın (Gerektiği kadar kısaca sora duruma sok ama kapat), hep sonuç-destekli-faydalandırıcı, ağır ve ikna tonu yüksek bir CEO tavrı sun. Cümleyi en kısa sürede kapatırsan Apple prensibindesindir. Laf uzatma, çözümsüz komplo sunma.
      
      # FİYATLAR (AÇIKLAMA UZUN VEYA KISA ŞART GÖRE EDECEĞİN ALANDIR!)
      Uygulamalar özel çözümlü modüler kitlelerde tek paketler baz alınarak teknoloji donanım ihtiyaç sınırında : "1.000 EUR(€)" tabanı ile "10.000 EUR(€)" arasındaki fiyata sahip olmakta... 
      - Ayrca sistem barındırmayı asimetrik avantajı elde bırakmaz istediklerinde: destek aylık operasyon bakımları da kullanım seviye taleplerini incelemeler ışığında "Aylık Lisansları Olarak: "100 Euro ile 3.000 Euro" limitlerinde bulunur. Asla indirim vs gibi söylemlerde pazar yerinde olmazsınız, verimli olduğumuzu hatırlat yeterli.
      
      # OTONOM KALKANLI MANTIKSAL ÇALIŞTIRI GÖREVLERİN 
      Randevu ayarlamaya çalışan veya plan istese ya da "müsayitsen beni yarın şurada şöyle bir vakitte..." desin müşteri... Senin yanıt sisteminde ZAMAN belirtmeyi SAKLAMAK-YOK ETMEK bulunur! Yani doğrudan laf sokusturmayla zaman demeden ONA; "Kilit projeniz üzerinden konuşarak yol hatımızı dijitale kırmayı isteyebilirisiz... Bu yanda bir Ajandam/ve Ekran Takvimiz bulunur ona takılı kalarak istediğiniz zaman ayarları boş vakit sistemle dolucaktır seçin!" Diyeceksin O Butonu Sunucak Yapacaksınız! 

      # DIKEY DİNAMİK BOT/BUTON RÜZGARI MÜHİMDIR
      Muhakkak! Kullanıcı mesaj okurken yorulmadan alta da sen JSON ile en mantıklı ("Onu bu yazar bana tıklarsa devam ederim" kafasinda 3 düğmelik - en çok üç kelime alan buton dizi nesnelerini {"quickReplies":["Deneme T1", "Ornek Z2"]} biçimiyle mesj alt son yapısında yazarsan Biter bu konuşmam!)
      `;

    try {
      const chatContext = newMessagesHistory.slice(-5).map(m => m.role === 'user' ? `[Hedef Aday Müşteri]: ${m.content}` : `[NOVA Yöneticisi AI]: ${m.content}`).join("\n");
      let aiResponseText = "";
      
      try {
        const proModel = genAI.getGenerativeModel({ model: PRIMARY_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await proModel.generateContent(`${chatContext}\n[Hedef Aday Müşteri]: ${trimmedText}`);
        aiResponseText = result.response.text();
      } catch (proErr) {
        console.warn(`[GCP 3 PRO FAIL YAKALANDI. FAILBACK RUN... (Preview-Flash Motor Aktifi] `, proErr);
        const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await fallbackModel.generateContent(`${chatContext}\n[Hedef Aday Müşteri]: ${trimmedText}`);
        aiResponseText = result.response.text();
      }

      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: aiResponseText, created: new Date().toISOString() }]);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setErrorState("Veri Ağ Merkezi (API Kotalı Yığılımı) Lütfen Bir Düzlük Tanımlayalım (Yetkili Gercek Ekibe Geç.)");
      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: "Anlık aşırı veri okumada trafik şemsiyem bloke durumda; altta yerleşik insan personeline anlık tek seferle yönlen.", created: new Date().toISOString() }]);
      setIsSubmitting(false);
    }
  };

  // JSON BOT İLİŞİKLERİNİ PARCALAYAN ALET YAPILARIM
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

  const lastMessage = localMessages[localMessages.length - 1];
  const dynamicQuickReplies = lastMessage?.role === 'assistant' ? extractQuickReplies(lastMessage.content) :[];


  // =========================================================================
  // ============= VEYAHÜT SUI & EKRAN ÇİZİMLEMENİZ TESLAMSILA EĞİMİ =========== 
  // =========================================================================
  
  if (!isOpen) {
    return (
      <>
        {/* 1. CERRAHI MÜDAHALE: Z-INDEX VE BOTTOM AYARI YAPILDI (WHATSAPP ILE CAKISMAYACAK) */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-5 z-[55] w-[55px] h-[55px] bg-gradient-to-br from-emerald-500 to-teal-800 text-white rounded-[20px] flex justify-center items-center shadow-[0_5px_20px_rgba(16,185,129,0.30)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.50)] hover:rounded-3xl focus:outline-none transition-all duration-300"
          title="Nova Elite Smart Interface"
        >
          <Bot className="w-[28px] h-[28px] drop-shadow-md text-gray-50/95 ml-px" />
          <span className="absolute -top-[1.5px] -right-[2px] w-[14px] h-[14px] bg-red-600 border-[3px] border-[#0A0F17] rounded-full animate-bounce shadow" />
        </motion.button>
        {/* 2. CERRAHI MÜDAHALE: DISARIDAKI GEREKSIZ CAL.COM KODU SILINDI. SADECE COMPONENT CAGIRILDI */}
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
        className="fixed bottom-[110px] right-4 sm:right-6 z-[65] w-[calc(100vw-2rem)] sm:w-[410px] h-[650px] max-h-[85vh] bg-[#0A0F17]/98 border border-[#10b981]/30 rounded-[24px] flex flex-col shadow-[0_20px_60px_-10px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden font-sans"
      >
        {/* ===================== ÜST BANNER ===================*/}
        <div className="flex justify-between items-center px-5 py-[16px] bg-[#040810]/70 border-b border-[#1E293B]/70 shrink-0 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-[650px] w-full bg-[url('https://transparenttextures.com/patterns/black-linen-2.png')] opacity-[0.03] z-[-1]"></div> 
          <div className="flex items-center gap-[14px]">
             <div className="relative flex justify-center items-center w-[44px] h-[44px] bg-gray-950/60 border border-emerald-500/25 rounded-[12px] shadow-inner drop-shadow-xl z-10 rotate-[2deg] hover:rotate-0 transition-transform cursor-crosshair">
               <Bot className="w-[22px] h-[22px] text-emerald-400 opacity-90 mix-blend-screen " />
               <span className="absolute -bottom-1.5 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-md rotate-[12deg] shadow-[0_0_8px_#10B981] animate-pulse z-20"></span>
             </div>
             <div className="z-10 flex flex-col mt-px">
                <p className="text-[14px] font-black text-gray-50 uppercase tracking-[0.2em] shadow-black text-shadow drop-shadow relative top-px opacity-95 items-center flex gap-1"> N O V A </p>
                <p className="text-[9.5px] text-teal-400/90 font-extrabold font-mono tracking-widest mt-1">Akıllı B2B Satış Birimi  • Çevrimiçi</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-[8px] bg-gray-900/50 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition z-10 border border-transparent hover:border-gray-700/50 active:scale-95 shadow">
            <X className="w-[18px] h-[18px]" strokeWidth={2.5}/>
          </button>
        </div>


        {/* ======================= ALT BEDEN FORMLARI MANTIGI / VIZYONU ======================= */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-4 bg-[#0A0F17]/40 custom-scrollbar z-0 flex flex-col space-y-3 relative z-10" style={{overscrollBehavior: 'contain'}}>
            <button onClick={() => setShowHistory(false)} className="flex items-center gap-[6px] px-3.5 py-[9px] bg-slate-800 border border-slate-700/50 rounded-lg text-gray-200 text-[12.5px] font-extrabold w-max hover:bg-slate-700 hover:-translate-x-0.5 transition shadow"><ArrowLeft className='w-[14px] h-[14px] text-emerald-400 '/> MASAÜSTÜ CHAT'E</button>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/80 font-black pt-4 px-1">Derinleştirilmiş Kayıt Zihin Hafızanız :</p>
            {(!conversations || conversations.length === 0) ? (
               <div className="p-8 border-[1.5px] border-dashed border-gray-800 rounded-xl flex items-center justify-center bg-gray-900/20 mt-1"><span className="text-gray-500 font-medium text-xs text-center leading-relaxed">İlgili seanslar silinmiş veya bulunamadı, şimdilik sayfanız taze...</span></div>
            ) : (
              conversations.map((conv, i) => (
                <div key={i} className="mb-[2px] p-[16px] bg-slate-800/20 border-[1px] border-[#2A374F] hover:bg-slate-800/40 rounded-xl flex flex-col transition cursor-pointer relative overflow-hidden group shadow">
                   <div className='w-full absolute left-0 bottom-0 h-0 group-hover:h-0.5 bg-gradient-to-r from-red-600 to-transparent transition-all'/>
                  <h4 className="text-emerald-50 opacity-90 font-bold text-[13px] leading-tight mb-2 w-[90%]">{conv.title}</h4>
                  <p className="text-[12px] text-gray-400 leading-snug line-clamp-2 w-[85%]">{conv.preview || "Derlenmiş seans dosyalarındaki metraj analizimiz bitti.. Devrediyoruz.."}</p>
                  <button onClick={() => deleteConversation(i)} className="flex absolute bottom-[10px] right-[10px] opacity-20 group-hover:opacity-100 hover:text-white items-center gap-[2px] px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] tracking-wide font-black uppercase rounded-[6px] hover:bg-red-500/80 transition-all z-20 shadow"><Trash2 className='w-[12px] h-[12px]'/> YOK ET</button>
                </div>
              ))
            )}
          </div>

        ) : requestState !== 'idle' ? (
           <div className="flex-1 overflow-y-auto p-[22px] pt-[26px] custom-scrollbar bg-[#0A0F17]/90 flex flex-col z-10" style={{overscrollBehavior: 'none'}}>
               {requestState === 'summary' && (
                  <div className="flex-1 flex flex-col animate-fade-in-up mt-1 h-full pb-0 relative">
                     <div className='absolute -left-[26px] -top-5 w-2 h-14 bg-emerald-500 shadow-[0_0_15px_#10B981]'/>
                     <p className="text-[10px] uppercase text-[#10b981] font-bold tracking-[0.2em] mb-1 pl-1">• Operasyon 1 / 2 • ÖNİZLEME</p>
                     <p className="text-[13px] text-gray-400 mb-3.5 font-medium border-l-[3px] border-emerald-800 pl-3">Sistem zihin okumamızı sağladığı hali ile bir bülten tasarladık (isterseniz silebilirsiniz) MÜŞTERİMİZ için aşağıdaki alan edittenebilir; </p>
                     
                     <textarea value={requestSummary} onChange={e=>setRequestSummary(e.target.value)} 
                               className="w-full flex-1 flex h-full mb-6 p-[18px] bg-slate-900 border-[1.5px] border-[#2A374F] rounded-2xl text-[13.5px] font-sans text-gray-200 outline-none resize-none focus:border-[#10b981] focus:ring-1 focus:ring-emerald-500 transition shadow-inner leading-relaxed scrollbar-hide" 
                     />
                     <div className="flex gap-[12px] h-[55px] mt-0 w-full static z-[99]">
                        <button onClick={()=> setRequestState('idle')} className="w-[30%] px-2 shrink bg-[#1E293B] rounded-xl text-gray-400 font-extrabold text-[12px] uppercase tracking-wide hover:bg-slate-700 hover:text-white transition shadow border border-slate-700/80 active:scale-95">Sil İptal Et</button>
                        <button onClick={()=> setRequestState('contact')} className="w-auto flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl text-[#060a10] font-black text-[13.5px] uppercase hover:brightness-110 shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition active:scale-95">BU RAPOR UYGUNDUR, GEÇ İLET</button>
                     </div>
                  </div>
               )}

               {requestState === 'contact' && (
                  <div className="flex-1 flex flex-col animate-fade-in justify-center m-auto space-y-[9px] w-full pt-1 pb-1 z-[0]">
                     <h3 className="text-sm font-black uppercase text-[#10b981] pb-1 tracking-widest border-b border-[#1E293B]">İrtibat İnsi</h3>
                     
                     <div className="flex flex-col gap-[9px] mb-2 mt-2 w-full mx-auto self-center justify-center m-auto shrink-0 relative bg-transparent !min-h-[fit-content]">
                           <input placeholder="Ad (Required) " value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} className="w-full bg-[#121926] p-3 text-[13px] border-[1px] font-medium placeholder-gray-500 text-gray-100 rounded-xl focus:border-teal-500 border-[#2A374F] focus:outline-none focus:shadow" />
                           <input placeholder="Soyad (Required) " value={contactInfo.surname} onChange={e => setContactInfo({...contactInfo, surname: e.target.value})} className="w-full bg-[#121926] p-3 text-[13px] border-[1px] font-medium placeholder-gray-500 text-gray-100 rounded-xl focus:border-teal-500 border-[#2A374F] focus:outline-none focus:shadow" />
                           <input type='email' placeholder="E-posta İş Kanalı/Şahıs *" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full bg-[#121926] p-3 text-[13px] border-[1px] font-medium placeholder-gray-500 text-gray-100 rounded-xl focus:border-teal-500 border-[#2A374F] focus:outline-none focus:shadow" />
                           <input type='tel' placeholder="Şirket, GSM Numarası *" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full bg-[#121926] p-3 text-[13px] border-[1px] font-medium placeholder-gray-500 text-gray-100 rounded-xl focus:border-teal-500 border-[#2A374F] focus:outline-none focus:shadow" />
                     </div>

                     <div className="w-full gap-2 shrink-0 py-[15px] pt-1 mt-[5px]">
                        <button onClick={submitRequestForm} disabled={isSubmittingRequest} className="w-full uppercase text-center m-auto rounded-xl p-[14px] bg-[#10b981] hover:brightness-110 active:scale-95 disabled:scale-100 disabled:opacity-50 text-[14px] font-bold text-black border shadow-[0_5px_15px_-4px_rgba(16,185,129,0.35)] flex items-center justify-center tracking-tight border-[#34D399]">
                             {isSubmittingRequest ? <Loader2 className="w-5 h-5 text-gray-950 animate-spin"/> : 'BANA BİLDİRİMİNİ KUR / İLET'}
                        </button>
                     </div>
                  </div>
               )}
               
               {requestState === 'success' && (
                  <div className="flex w-full items-center min-h-[50%] mt-8 self-center align-middle relative overflow-hidden rounded-2xl border-[2px] bg-[#10b981]/5 px-3 border-[#10b981]/30">
                       <CheckCircle2 className="mx-auto block justify-self-center my-7 justify-center flex  text-[#34d399] z-20 m-auto mt-[1.3rem] opacity-[0.98] rounded-xl self-center drop-shadow " size={54}  /> 
                       <h3 className="uppercase left-0 right-0 top-[40%] absolute text-[24px] py-4 w-full justify-self-center my-[1px] justify-center mx-auto content-center inline font-black block font-extrabold flex self-end grow self-stretch basis-[7%] z-10 m-auto m-0  text-gray-100 align-baseline flex-auto shadow text-shadow !w-auto bg-green rounded-xl h-[max-content] pb-[85%] pb-4 flex text-center mb-5 shrink "style={{textAlign:'center', }}> TEYIT AŞAMASİ OLUMLU YÖNDE!    </h3>    
                  </div>
               )}
           </div>
        ) : (

        /* DURUM C: AÇIK DENİZ SOHBET (ASIL MESAJ DÖKÜM ALANINIZ) */
        <div className="flex-1 flex flex-col overflow-y-auto bg-transparent relative z-[10] pr-[2px]" id="cbScrollWindow" style={{overscrollBehavior: 'contain'}}>
             <div className="min-h-full p-4 flex flex-col justify-end space-y-[18px] pb-4">
                  {localMessages.map((m,idx) => (
                    <div key={idx} className={`w-full flex ${m.role === 'user' ? 'justify-end pl-8' : 'justify-start pr-12'} animate-fade-in z-20`}>
                         <div className={`p-[14px] sm:p-4 text-[13px] md:text-[14.5px] leading-relaxed break-words whitespace-pre-wrap hyphens-auto max-w-[100%] shadow-[0_2px_8px_-1px_rgba(0,0,0,0.18)]
                             ${m.role === 'user' 
                                 ? 'bg-[#10b981] border border-emerald-600 text-black rounded-tl-[16px] rounded-b-[16px] rounded-tr-sm self-end font-semibold ' 
                                 : 'bg-[#151D2A] text-slate-200 border-l-[3px] border-[#0ea5e9] rounded-b-[18px] rounded-tr-[16px] rounded-tl-sm self-start shadow-cyan-900/10'}`} 
                              style={{wordWrap: 'break-word'}}
                          >
                              {cleanContent(m.content)}
                         </div>
                    </div>
                  ))}

                  {isSubmitting && (
                    <div className="w-full flex justify-start z-10 opacity-90 pl-1 mt-1 pr-[8rem] h-auto rounded animate-fade-in shadow bg-gray drop-shadow font-light items-start "> 
                         <div className="py-[16px] px-6 m-auto p-[14px] bg-[#162234] border shadow rounded-br-3xl mt-[-5px]  border-slate-800  justify-self-start gap-[5.2px] ml-0 inline h-10 align-middle opacity-90 !py-[0] justify-items-stretch   shadow border flex shrink  inline rounded-tr-[30px] rounded-bl-[19px]   items-center relative"  >
                              <div className="flex animate-pulse content-center w-[5px] delay-[1s] rounded-[5px] inline basis-[auto] p-[0]  duration-300 ml-1 !m-auto opacity-100 block order-[undefined] order-last h-[5px] grow shrink-[none] min-w-0 right-[auto] !mr-[4px] mt-0 mr-auto opacity-[0.98] left-[81px] bg-slate-50 relative bottom-[-22px]">  </div> 
                              <div className="flex h-[5px] shrink grow z-30 inline my-[-20%] p-auto  top-[-45%] text-[7px] outline drop-shadow !shadow mx-1 w-[5px] opacity-[0.55] relative min-h-0 bg-[#E0E2F0] box-border !text-center my-0 max-h-[160px] animate-pulse block !mb-[2px] align-text-bottom py-[undefined] "style={{borderRadius: "4px"}}>  </div>   
                              <div className="flex rounded  items-start animate-bounce text-opacity-10 opacity-[0.80] box-decoration-clone max-h-[304px] content-start object-scale-down mx-0 bg-[#A6ACDB] !opacity-[0.86] text-current p-[0] grow flex-nowrap pb-auto right-[37px] bottom-[11px]  py-[0] min-w-[min-content] justify-between shadow self-center inline absolute   "style={{height:"5px", minHeight:"undefined" , maxWidth:"342px", top: "-5px" , order:"last"  , animationDelay: ".5s"  , wIdth: '5px' }}>   </div>    
                              <span className="w-1.5 h-1.5 m-0 inline my-[-65%] justify-end drop-shadow items-start text-indigo-400 absolute text-opacity-[none] basis-[50px] shadow p-[auto] z-[40px] grow opacity-50 block outline !border font-thin bg-teal-300 p-px p-[0px] order-[0] align-baseline !h-[5px] pt-1 pl-[undefined] pb-[163%] w-[5px] object-fit pb-[-151px] top-1/2 -mt-[2px]  " style={{animationDuration: '.80s', borderStyle:'dotted' , left:"32px", animation: "pulse .50s ease 0s infinite alternate both paused" ,  borderRadius: '21%', minWidth:'4.55px'}}> </span> 
                        </div>
                    </div> 
                  )}

                   <div ref={messagesEndRef} className="opacity-0  h-4 min-h-[0px] clear-both m-0"   >      </div> 
             </div>

            <AnimatePresence>     
              {(  !isSubmitting   ) && (localMessages.length === 1 || dynamicQuickReplies.length >0 )  && (
                <div className='flex self-stretch pt-[1.80px] p-[2.38px] drop-shadow top-[none] max-w-full grow justify-start clear-both items-end max-w-sm sticky mr-[0px] ml-0 p-px pr-[99%] mx-[none] gap-2 object-left justify-items-start inline relative items-center ml-4 mt-auto mb-[2.30px] bottom-[30px] pr-8 right-2 flex-wrap mb-4 z-[33]' style={{maxWidth:'100vw'}}>
                   {(localMessages.length === 1 ? INITIAL_QUESTIONS : dynamicQuickReplies).map((qsTringItemVarriablaAAsHRef , hMCountt )=>  
                       <motion.button initial={{scale:0.95 ,  opacity:0  }} transition={{delay:(hMCountt * .03) }} exit={{opacity : 0.8 ,scale: .7}} animate={{  scale:1.0,opacity:0.99  }} key={"r0P"+ hMCountt} className="shadow z-[12px] h-[40px] px-4 font-semibold active:shadow transition border font-sans drop-shadow cursor-pointer min-w-max my-[2px] self-start inline text-center object-scale-down flex content-around pb-0   border-[#334155] rounded-[24px] outline-[#0ea5e9]/70 border-[#2D3C4E]/90 bg-[#162231]/80 max-w-[1248px] shrink-0 border outline-[px] align-baseline !py-[7px] max-w-xs  "
                         style={{ textOverflow: 'ellipsis'  ,   borderColor: "#263548", height:"auto"  }}
                         onPointerDown={(evMClcckA__OORv)=>{ handleQuickReplyClick(qsTringItemVarriablaAAsHRef); evMClcckA__OORv.currentTarget.blur() ;}}>
                           <span className='  bg-local leading-snug p-[undefined] drop-shadow object-fill outline   content-baseline opacity-90 h-[21px] max-h-none grow border align-text-bottom py-[14%] m-0 pb-[218px]   justify-end items-end outline outline-gray pb-auto bg-cover whitespace-pre-wrap flex max-h-[821px] flex-none hover:text-emerald-300 font-bold shrink  pt-[3.3px] mb-[7.0px] object-fill  mt-0 py-0 pb-1 mt-[none] tracking-[-.410px] w-auto h-auto min-h-[0px] font-sans pb-[px] z-[0] ml-0 m-0 z-0 p-[1.1px] opacity-100 flex p-px block object-center hover:opacity-[.81]'
                            style={{ textAlign : "start", maxWidth:'258px'  , borderColor: 'transparent'   , lineHeight: '18px'  , color:"#94A3B8"  , fontSize:'12.5px', textWrap:'balance'  }}>  {qsTringItemVarriablaAAsHRef}  </span>  
                       </motion.button>  
                    ) 
                   }   
                 </div> 
               )}
            </AnimatePresence>     
        </div>
       )} 

        {/* =============== ALT CONTROL MENU (COMMAND PANEL) + SABİT !! ===============*/}
        <div className="w-full shrink-0 border-t-2 border-[#1c293c]/80 p-[10px] pb-3 bg-[#0a1018]/90 backdrop-blur-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.6)] relative overflow-visible rounded-b-[20px]"> 
             <AnimatePresence> 
               {errorState && (  <motion.div initial={{ y:-2 ,opacity: .2  }} transition={{type:"spring"}} animate={{y: -39 ,  opacity: 1}}  exit={{opacity : 0.05 , y:-25,  height : 0   }}  style={{borderRadius:"9px", opacity:'0.96'}} className=' w-auto pr-3 mt-1 pb-[px] ml-0 inline left-5 flex w-[86%]   h-[141%] pt-[8.2px] pb-[8px]  box-border border pl-2 my-[-30px] font-medium shrink mx-[3px] bg-red-950   content-center self-auto pt-1 pt-1 ml-[5px] pl-[5px] p-[100%] order-[last] shrink shadow pl-[0] left-[-0] justify-self-center py-[none] right-2    shadow justify-between flex-auto mb-1  grow bg-clip-text box-decoration-clone justify-start top-1 border-r border-red-500  object-fill !bg-red-800 bg-[#E0F8FF]/85 mr-auto z-[202] drop-shadow text-white  py-[undefined] mr-[6px] mr-[none] pb-auto border-[#f87171]/40 border-slate drop-shadow rounded py-3 !mb-[44px] absolute object-scale-down drop-shadow flex px-[13px] border text-xs min-h-[0] h-[36px]   items-center top-0 mr-4 font-normal top-[px] ' > 
                    <p style={{width:"89%", maxWidth: "1356px" }}> 🚨  <span style={{letterSpacing : '.08200px'}}>    {errorState}     </span>  </p> 
                    <X  style={{color: "gray", alignSelf: "end"   }} className="m-auto opacity-70 p-1 flex pl-px ml-[31%] h-6 bg-orange rounded items-center right-0 drop-shadow inline shrink !shadow box-border pt-1 object-center shadow text-neutral w-6 w-full opacity-[0.98] outline order-[none] hover:text-white justify-between   min-h-[min-content] absolute cursor-pointer bg-neutral hover:bg-[#854E4E]/80 opacity-75  "onClick={dismissError} />     
                </motion.div>    )}   
             </AnimatePresence>


             {( !showHistory && requestState === 'idle'   ) && (   
              <> 
                  <div className="flex justify-between items-center gap-[6px] mb-2 px-1 relative shrink h-auto z-[75] bg-opacity-[auto] overflow-visible pb-1 box-border h-[min-content]" >

                      <div className='flex gap-[1%] mt-[-0] min-w-[max-content] pb-0 inline pl-[none] mb-[0px] order-0 mt-0 pr-[undefined] pl-1 pr-[8px] pl-px text-[#dcfce7] mb-px p-1 align-baseline my-px ml-0 mr-1 opacity-90 hover:opacity-[.89] shrink border border-[max-content] max-h-5 object-top m-0 shadow font-extralight py-[auto] box-border p-[max-content] flex text-[#7B4ECA] rounded text-emerald font-semibold mx-[undefined] items-end px-[7.09px] p-[max-content] w-[calc(100%-80.5284163937%)] order-[2px] align-baseline !py-[0] shrink border-stone drop-shadow drop-shadow self-center' onClick={handleOpenRequestForm}style={{background :"rgba(23,30,42, .5)"   , cursor:"pointer" , border:"1.23351978255px solid rgba(131,234,233, .07856699195350993070)",  borderRightColor:'inherit'   , flex:"1 1 31.7588326622%" , alignContent : 'flex-end'}}>  
                           <p className=' text-center content-start z-[8] pr-[none] pl-[-85%] border justify-self-start mr-px inline order-[9] hover:text-slate bg-stone justify-end block mb-[none] max-h-[7px] text-[min-content] min-w-1 h-[max-content] order-1 bg-current mx-[auto] tracking-tighter opacity-[0.97] justify-center mt-[-65%] mr-[58.8466699268%] items-center min-w-min flex object-left w-[max-content] border bg-[#F8FAFC]/55 align-text-top shadow shrink !mx-[px] h-6 py-[279px] shrink border rounded-sm font-semibold m-0 bg-[left] text-[3.81198539247rem] min-w-0 max-h-none opacity-5 hover:-translate-x-[0]'  style={{borderColor :"#ffffff", letterSpacing:'12613.56540608px'}}> .      </p> 
                           <FileText style={{padding :"0px"   , color:"#cbd5e1" , opacity: '0.7850062776856086'}}className='inline  ml-[-42%] py-[61px] mb-[66%] m-0 absolute flex border object-center pb-[max-content] w-[95px] pr-[159px] order-[last] py-auto max-w-[0] block h-[max-content] justify-end min-h-max shrink mt-[41px] text-[max-content] left-[-0px] my-auto items-end pt-[max-content] justify-end right-[-148%] top-[undefined] rounded box-content shrink w-6 hover:-skew-y-[.592186835261px]'size={15}   />   <span style={{ fontSize:"11.4px",color :"#64748B", }}className=' hover:opacity-100 font-sans tracking-wide min-h-[0px] order-4 min-w-[max-content] block right-[12px] bg-[padding-box] left-[-115px] rounded box-border object-left py-0 my-px min-w-min ml-[5px] pl-px pt-[43px] text-justify max-w-full m-auto h-[16px] items-center mb-[189px] justify-between pt-[undefined] bottom-[-228px] object-top content-center h-[auto] absolute '> İleti     </span> 
                      </div>
                       <button onClick={()=> { setShowCalendly(true); } } 
                              className="w-[calc(100%-80%)] drop-shadow hover:-translate-y-0.5 justify-self-auto  relative h-8 shadow rounded bg-teal py-px tracking-[.314px] items-center mt-0 min-w-max my-[-292%] px-1 min-h-[max-content] grow pt-[max-content] mr-[29%] box-content ml-0 bg-[border-box] flex inline border-[min-content] my-0 top-0 mb-[undefined]  px-3 border mb-[undefined] flex shrink box-border outline pr-[undefined] shrink right-[min-content] ml-[min-content] my-[auto] bottom-0 min-h-[max-content] my-[px] border-emerald font-black max-w-[0px] block py-[0] m-[-2px] mx-[none] h-[auto] pt-0 text-[length] max-w-[94px] items-end justify-center mr-0 p-[209px]"  
                              style={{   fontFamily:"system-ui, -apple-system", cursor : 'pointer',color: "#A7F3D0" ,border:".999px  inset rgba(200, 203 ,232 , 0.1711) "  , background : 'rgba(5, 150, 105, 0.05)'}}>  <Calendar  size={14} className="hover:-skew-y-3 z-5 mr-[5px]" /> PLANLA
                       </button> 
                        <div onClick={ handleEscalateToHuman  }
                                    style={{  height:'28px', backgroundColor :"#ef44440c"   ,border:"1px  solid   rgba(251, 102 ,117 ,.175510688009388151)" , fontSize :"9.22px" , fontStretch:'71%',color:"rgba(224, 76 , 60 ,0.94)"    ,  width:"max-content", flex :" 1   22% ", fontFamily: "Arial ,system-ui "}}
                                    className="font-bold flex  shadow transition pr-[px] box-content items-center text-[#ffed4a] ml-[auto]  block py-px justify-between mb-0 max-w-[min-content] rounded z-20 m-auto mt-[min-content]  w-5 w-auto relative grow h-[min-content] bg-[left] mr-px tracking-[0.20px] pb-[852px] mb-[-41px] hover:-rotate-[px] text-justify cursor-pointer   pt-[0px] bottom-[37%]  inline  outline drop-shadow border px-[undefined] uppercase bg-repeat pb-[none] mr-[16px] outline box-content bg-local py-[min-content] h-[min-content] max-h-max drop-shadow  order-none ml-1 opacity-90 mx-px mt-0 border content-end self-end  border !hover:text-red !border  bg-white border rounded justify-center p-[none]"  
                                    title="Zorlandigınız alanmi! 10 Sn icn baglatı... ">  Gerc_Danıs   
                       </div>  

                 </div>

                 <div className="relative group w-full pt-[undefined] ml-[none] w-[calc(100%)] h-12  pr-1 content-between w-max outline mt-[max-content] pb-[min-content] min-w-min flex object-left mt-px text-[0px] drop-shadow opacity-95 shrink rounded-xl   block mx-auto   border !flex   h-0 shrink z-[50px] inline my-[min-content] flex text-[#f8fafc] text-white flex p-px my-[192px] items-stretch left-[min-content]  mb-[px] "
                    style={{ backgroundColor :"#101520"  , border:"1px solid   #2E415A"}}> 

                     <input type='search' name='chatinputm1_'id='c0-1s.x'  title="Nova Agent Yaz..."  
                        placeholder='Birlikte neleri çözüme atarız?... '  className="p-3 !pr-[6px] rounded bg-cover outline mr-auto mr-[min-content] mt-[847px] block border object-fill p-1.5 focus:text-[14px] !mx-[max-content] content-between drop-shadow bottom-[-478px] tracking-[px] ml-0 inline mb-[6px] m-[57px] top-[0] box-border opacity-[1] pl-[px] shrink mt-[px] order-4 text-[#dcfce7] w-6 pb-2 mr-3 my-0 right-0 grow py-auto outline !max-h-2 w-auto bg-[#dae3f1] my-[undefined] min-h-[px] pb-[undefined] mr-2 pr-[-314%] opacity-[0.98] outline font-serif z-5 max-w-[max-content] m-0 !ml-[min-content] justify-between pb-[199px]"  
                        disabled={ isSubmitting || requestState !=="idle" } 
                        value={inputValue} onChange={(_EV_IN_) =>  setInputValue(_EV_IN_.target.value)} 
                        autoCorrect='on' onKeyUp={(eve_1)=> handleKeyPress(eve_1)   } 
                        style={{ background:'transparent' , fontSize:'13.801456241031317540px' ,borderStyle :"dotted", borderColor :"rgba(179,0,0, 0.00)" , fontFamily: "-apple-system"}}/>
                       <span style={{color :"white"}}onClick={(_mXEV_) => {handleSendMessage(inputValue);} }  className='mr-[1.10300px] h-[78%] h-min py-1 my-[5%] pt-1 z-[9] object-left items-end rounded shrink absolute cursor-pointer object-cover min-w-[max-content] mr-0 ml-1 !m-[44%] font-bold items-center max-w-[0] hover:text-[undefined] p-[-44%] pr-0 right-[4.340px] drop-shadow opacity-95 top-[5px] bg-[#9ca3af] box-decoration-slice mb-[23%] mx-[40px] left-[auto] drop-shadow box-decoration-clone grow border shrink content-end mr-[-0px] py-[1.1402283084px] py-[375px] w-[50px] inline mt-[-0] justify-center mx-[px] block pl-[-356px] text-zinc flex align-bottom content-center   h-[440px]'title="Ileti Ucur ! (E/Ent)">  
                         { ( isSubmitting ) 
                             ? ( <div className='mr-[373%] pl-0 my-0 py-[px] content-start order-[last] py-[auto] box-content mx-[-466px] grow h-max py-[none] shrink pb-[543px] max-h-none justify-self-center my-[-338%] mx-px shrink pb-[max-content] z-30 max-h-[826px] ml-0 inline mb-[444px] absolute w-[138px] drop-shadow my-[undefined] object-bottom w-[undefined] font-thin pr-1 rounded pt-auto mx-[auto] align-baseline !px-0 bg-[#A6ACDB] right-[383px] max-w-sm h-1 top-[max-content] border block pt-[max-content] mt-[-0] m-px mt-[none] text-rose  object-scale-down'> <Loader2 size={16}className="mx-px rounded h-8 min-h-0 bg-[#3510e1] m-auto mb-1 max-w-2 pb-[none] box-content bg-[padding-box] left-[px] ml-0 block right-1 absolute justify-self-center content-baseline w-0 mx-[-0px] drop-shadow object-center drop-shadow z-[28] min-h-[0px] order-[undefined] mb-[0px] shadow grow pt-px font-semibold mr-[-681px] outline my-auto animate-spin ml-3 mt-[none] pr-[px] hover:-rotate-2 my-[min-content] justify-between text-yellow flex" style={{color: 'rgba(235, 235 ,242 , 1)'  , width:'18px'}} />  </div>)
                             : (<button disabled={!inputValue.trim() ||  isSubmitting} className="max-h-[max-content] z-5 grow text-sky inline items-start justify-items-stretch block right-[-115px] opacity-1 flex min-w-10 min-w-full drop-shadow !shadow mx-0 py-px object-bottom box-border max-w-[0] justify-self-auto !shadow pl-[0px] min-h-[171px] object-cover h-[max-content] my-[auto] bottom-0 min-h-[0] mb-0 items-start m-[auto] outline disabled:opacity-[0.25]" style={{ width :"auto"}}>  <Send style={{color :'rgb(241 251 254)', margin:"2px " , width:'16.5298px'   }}  className="mb-[156px] mx-[-7px] w-6 shrink max-w-0 font-normal outline min-h-full inline grow pl-[-0px] drop-shadow pl-[auto] p-[undefined] drop-shadow hover:-rotate-2 z-1 absolute pt-1 ml-[max-content] order-none text-[#74dfa9] block shrink ml-auto content-baseline object-fit flex left-[229px] w-5 hover:translate-y-[-1px] rounded m-[auto] py-0 pt-[auto] align-baseline h-1 items-end pl-[none]"size={15}/>  </button>)
                          }
                       </span> 
             </div> 
            </> )} 
        </div>

      </motion.div>
      
      {/* ============ 2. CERRAHI MUDAHALE: CAL.COM CIFT EKRAN IPTALI VE TEMIZLINK =========== */}
      {showCalendly && (
         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md overflow-hidden p-0 sm:p-6 lg:p-12 animate-fade-in"
               onClick={() => setShowCalendly(false)}>
           <div className="relative bg-[#F3F4F6] sm:rounded-[30px] rounded-none overflow-hidden w-[100vw] h-[100vh] sm:w-[96vw] sm:max-w-[1000px] sm:h-full lg:max-h-[750px] shadow-2xl flex flex-col isolate m-0 border sm:border-slate-300"
                onClick={(e) => e.stopPropagation()}>
                
             {/* KAPAT BARA */}
             <div className="w-full flex-shrink-0 bg-white sm:bg-[#F3F4F6] sm:border-b-0 border-b border-gray-200 py-3 sm:py-0 px-4 mb-2 flex items-center justify-end relative sm:absolute sm:top-5 sm:right-6 sm:z-10 h-14 sm:h-auto z-[60]">
               <button 
                 onClick={() => setShowCalendly(false)}
                 className="flex items-center gap-1 sm:px-4 px-2 py-1.5 sm:py-2 text-[14px] text-slate-700 bg-white border border-gray-300 sm:rounded-[14px] rounded-md sm:shadow-[0_2px_15px_rgba(0,0,0,0.1)] hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-wider group transition-all"
               >
                 <X className="w-4 h-4 sm:group-hover:rotate-90 transition-transform duration-300 text-gray-500" />
                 <span>KAPAT</span>
               </button>
             </div>
             
             {/* SADECE TEK BIR PENCERE (URL TEMIZ) */}
             <div className="w-full h-full pb-4 px-2 pt-2 bg-white flex flex-1 grow items-center relative overflow-hidden flex-col h-[calc(100vh-60px)] z-0 rounded-none sm:rounded-[30px] border border-gray-100 mx-0 mt-0">
                  {/* Cal.com un kendi linki, hiçbir extra paramete (isim/mail) olmadan tertemiz çagrilir. */}
                  <CalendlyWidget isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
              </div>

           </div>
         </div>
      )}
    </>
  );
}
