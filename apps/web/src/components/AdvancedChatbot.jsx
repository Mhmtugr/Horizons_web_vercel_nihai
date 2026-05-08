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
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 
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
        }, 1200); // 1 sn ekran hazmi (Musteri korkmaz pürüzsüz ceker)
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

  // BOT CEVAP BASKA FONKSİYONU... GİRDİYİ ÇIKARI ET.. (GERİ KALMASIN)
  const handleQuickReplyClick = (btnText) => {
    const textLower = btnText.toLowerCase();
    // B2B Vurucu Toplantısı.. Asla Yaptirrma Yollama URL ye Acılır Modüle Titsin...
    if (textLower.includes('toplantı') || textLower.includes('randevu') || textLower.includes('planla')) {
      setShowCalendly(true); return;
    }
    // Asıl Handoff Mırasini İteleme İnsanca Calisn! 
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

  // Son İfadenizi okudugunda Array Yigincasi Sizi Gösterrsin Diye İc. Teyit Cikarani
  const lastMessage = localMessages[localMessages.length - 1];
  const dynamicQuickReplies = lastMessage?.role === 'assistant' ? extractQuickReplies(lastMessage.content) :[];


  // =========================================================================
  // ============= VEYAHÜT SUI & EKRAN ÇİZİMLEMENİZ TESLAMSILA EĞİMİ =========== 
  // =========================================================================
  
  if (!isOpen) {
    return (
      <>
        {/* TAM ISTEDIĞINIZ NOKTA - GÖLGELI ARAYUZ: Sağ Aşağı Icon Kalinlestirmedir ve Asitlendirlmiştir..*/}
        <motion.button
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[110px] right-6 z-[60] w-[55px] h-[55px] bg-gradient-to-br from-emerald-500 to-teal-800 text-white rounded-[20px] flex justify-center items-center shadow-[0_5px_20px_rgba(16,185,129,0.30)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.50)] hover:rounded-3xl focus:outline-none transition-all duration-300"
          title="Nova Elite Smart Interface"
        >
          <Bot className="w-[28px] h-[28px] drop-shadow-md text-gray-50/95 ml-px" />
          <span className="absolute -top-[1.5px] -right-[2px] w-[14px] h-[14px] bg-red-600 border-[3px] border-[#0A0F17] rounded-full animate-bounce shadow" />
        </motion.button>
        {/* Modal Dişardayada aciklir.*/}
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
               {/* SUMMARIZING ARAYÜZ (EDIT / İŞTENCE PİYASAYA...) */}
               {requestState === 'summary' && (
                  <div className="flex flex-col flex-1 animate-fade-in-up mt-2 h-full pb-0 relative">
                     <div className='absolute -left-[26px] -top-5 w-2 h-14 bg-emerald-500 shadow-[0_0_15px_#10B981]'/>
                     <p className="text-[10px] uppercase text-[#10b981] font-black tracking-[0.2em] mb-1 pl-1">• Operasyon 1 / 2 • ÖNİZLEME</p>
                     <p className="text-[14px] text-gray-300 font-medium leading-relaxed pl-1 pb-4 pt-1 mb-[5px]">Yönetim departmanına (Ekip Onay Birimime) dijital dosyanızı derleyerek çektim. İçeriği teyit ederken dilerseniz <b>aşağıdan özelleştirebilir (sil/yaz) edebilirsiniz.</b>:</p>
                     
                     <textarea value={requestSummary} onChange={e=>setRequestSummary(e.target.value)} 
                               className="w-full flex-1 flex h-full mb-6 p-[18px] bg-slate-900 border-[1.5px] border-[#2A374F] rounded-2xl text-[13.5px] text-emerald-50/90 resize-none outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_#22d3ee22] transition-colors leading-[1.8] custom-scrollbar tracking-wide drop-shadow relative grow font-mono z-[66] pb-10" 
                     />
                     <div className="flex gap-[12px] h-[55px] mt-0 w-full static z-[99]">
                        <button onClick={()=> setRequestState('idle')} className="w-[30%] px-2 shrink bg-[#1E293B] rounded-xl text-gray-400 font-extrabold text-[12px] uppercase tracking-wide hover:bg-slate-700 hover:text-white transition shadow border border-slate-700/80 active:scale-95">Sil İptal Et</button>
                        <button onClick={()=> setRequestState('contact')} className="w-auto flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl text-[#060a10] font-black text-[13.5px] uppercase hover:brightness-110 shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition active:scale-95">BU RAPOR UYGUNDUR, GEÇ İLET</button>
                     </div>
                  </div>
               )}

               {/* REQ (SİTEDEN DÖNUS TALEP / FORMs GONDERMEDİR.) ARAYÜZ.. */}
               {requestState === 'contact' && (
                  <div className="flex flex-col flex-1 animate-fade-in-up mt-2 h-full pb-0 relative mb-[15px] space-y-4">
                      <div className='absolute -left-[26px] -top-5 w-2 h-14 bg-cyan-500 shadow-[0_0_15px_#06B6D4]'/>
                     <div>
                       <p className="text-[10px] uppercase text-cyan-400 font-black tracking-[0.2em] mb-1 pl-1">• Aşama 2 / 2 • Sonuç / GörüŞÜLÜ </p>
                       <p className="text-[13.5px] text-gray-400 pl-1">Gizli Kurumsal Kayıt Sistemi üzerinden bir onayınızda işleri bize kargo niteliğinde ulaştırmış oluruz; hemen geri dönüştür. Bilgi paylaşımı <b>zorunludur</b>.</p>
                     </div>
                     <div className="flex gap-2">
                       <input placeholder="Yetkili/Kişisel İsim  *" value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} className="w-full p-4 bg-gray-900 border border-gray-700 text-sm text-white rounded-xl focus:border-cyan-500 focus:shadow-[0_0_15px_#06b6d430] transition outline-none" />
                       <input placeholder="Yetkili/Kişisel Soyad *" value={contactInfo.surname} onChange={e => setContactInfo({...contactInfo, surname: e.target.value})} className="w-full p-4 bg-gray-900 border border-gray-700 text-sm text-white rounded-xl focus:border-cyan-500 focus:shadow-[0_0_15px_#06b6d430] transition outline-none" />
                     </div>
                     <input type="email" placeholder="Çalışılan E-Posta Mail Bilgisi (Zorunludur!) *" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full p-4 bg-gray-900 border border-gray-700 text-sm text-white rounded-xl focus:border-cyan-500 focus:shadow-[0_0_15px_#06b6d430] transition outline-none" />
                     <input type="tel" placeholder="Tüzel Kişi Firması YADA Direk Ulaşımlık No" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full p-4 bg-gray-900 border border-gray-800 text-sm text-white rounded-xl focus:border-cyan-500 focus:shadow-[0_0_15px_#06b6d430] transition outline-none" />
                     
                     <div className="flex w-full mt-[30px]">
                        <button onClick={submitRequestForm} disabled={isSubmittingRequest} className="w-full flex-grow py-[18px] px-2 uppercase bg-[#0ea5e9] hover:bg-sky-400 border border-[#bae6fd]/30 rounded-xl font-black text-[13.5px] text-[#0A0F17] flex justify-center items-center shadow-[0_8px_30px_rgba(14,165,233,0.3)] disabled:opacity-60 transition tracking-wide group hover:-translate-y-1">
                             {isSubmittingRequest ? <Loader2 className="w-6 h-6 animate-spin text-[#0A0F17]" /> : <><Sparkles className='w-4 h-4 mr-2 -mt-[2px] opacity-75 group-hover:animate-bounce' /> BU SEANSI KURUMSAL SISTEME ÇEVİR VİZYONU TAMAMLA</>}
                        </button>
                     </div>
                  </div>
               )}

               {/* DURUM - HARIKULADE BASARILI MAIL AKTARMA - CALISIOR !  */}
               {requestState === 'success' && (
                  <div className="flex-1 flex flex-col justify-center items-center m-1 p-6 text-center animate-scale-up border-[3px] border-emerald-500/20 bg-emerald-500/5 rounded-[24px] relative overflow-hidden backdrop-blur z-20">
                     <div className="absolute right-0 -bottom-[50px] w-64 h-64 bg-[#10b981]/5 blur-[70px] -z-10 rounded-full"></div>
                     <CheckCircle2 className="w-20 h-20 text-[#10b981] mb-5 stroke-[1.2px] drop-shadow-md z-10 relative bg-emerald-950/40 p-2 rounded-full border border-emerald-500/20" /> 
                     <h3 className="text-[28px] font-black text-white mb-2 leading-none">ONAY / PROJE İLLETİ.</h3>
                     <p className="text-[13px] text-emerald-100/60 font-semibold px-2 pb-5 mt-2">Düzlem açılmıştır; Operatörlere bu form gizli odada açıldığından saniyede e-postamla haber gidicek ve sana e-postala yönlenecek.</p>
                  </div>
               )}
           </div>
        ) : (

        /* ======================== CHAT PENCERESİ EKRANI (Ana Merkez Gövde Scroll Alan!) ===========================*/
        <div className="flex-1 flex flex-col bg-[#060a0f] overflow-y-auto relative w-full pt-1 px-1 custom-scrollbar" id='chatContainer_MainZ'>
             {/* USTTEN ARALI GOVDE! OVERSCOLL NONE ZARURI DEIL ESKTIRA IZN YOO!!  */ }
             <div className="flex flex-col justify-end space-y-4 px-[6px] py-[22px] min-h-[min-content]">

                  {/* KARSILIK MESAJ RENDERS DÖK. TAMA... MİDYE KALIBIYLA ALDIGI */}
                  {localMessages.map((m,idx) => (
                    <div key={idx} className={`w-full flex pb-0.5 animate-fade-in ${m.role === 'user' ? 'justify-end pl-[22%]' : 'justify-start pr-[8%]'} group `}>
                         <div className={`px-4 py-[14px] text-[13.5px] leading-7 shadow-lg break-words text-wrap relative w-fit  hyphens-auto min-w-[32%]
                             ${m.role === 'user' 
                             ? 'bg-gradient-to-tr from-emerald-500 to-teal-700 text-white rounded-[18px] rounded-br-[4px] self-end font-medium border-r-[4px] border-[#0A0F17]' 
                             : 'bg-[#151D2A] text-slate-100 rounded-[18px] rounded-tl-[4px] border border-[#1e293b] self-start drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] '} `} 
                          style={{wordWrap:'break-word', whiteSpace:'pre-wrap' }}>

                              <p className="">{cleanContent(m.content)}</p>
                              {m.role === 'user' && (<span className={`absolute bottom-[2px] right-2 text-[8px] font-mono tracking-widest text-emerald-100/40 uppercase font-black `}>✓ Görüldü : {new Date(m.created).toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})}</span>)}
                              {m.role === 'assistant' && (<span className={`absolute -bottom-3.5 left-2 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity font-mono text-emerald-600/70 `}>Bot Yanıtı: {new Date(m.created).toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})}</span>)}
                         </div>
                    </div>
                  ))}
                  
                  {/* IS Typing Skeleton Tirtik Baya Ii.*/}
                  {isSubmitting && (
                    <div className="w-full flex justify-start pl-1"> 
                         <div className="px-5 py-4 mt-2 bg-[#151D2A] border border-gray-800 rounded-2xl rounded-tl-sm flex gap-2 w-max items-center shadow-md">
                              <span className="w-[6.5px] h-[6.5px] bg-[#10b981] rounded-full animate-bounce"></span>
                              <span className="w-[6.5px] h-[6.5px] bg-[#0ea5e9] rounded-full animate-bounce" style={{animationDelay:"0.15s"}}></span>
                              <span className="w-[6.5px] h-[6.5px] bg-[#0ea5e9] rounded-full animate-bounce" style={{animationDelay:"0.30s"}}></span>
                         </div>
                    </div> 
                  )}

                  <div ref={messagesEndRef} className="pb-3 block w-full h-1 relative pt-[0]" />
                  {/* --------------------- BURASI BOS MİDESİ DUR ------------------------- */}

                  {/* ===== QUİCK BUtons ALANA VE ALTİA HERYERI CIZIYOS... ===== */}
                   {((!isSubmitting) && (localMessages.length === 1 || dynamicQuickReplies.length > 0)) && (
                       <div className="flex flex-wrap gap-2 w-full pt-1 px-[2px] relative z-[5] " style={{ flexShrink:0}}>
                          {(localMessages.length === 1 ? INITIAL_QUESTIONS : dynamicQuickReplies).map((btnStr,k) => (
                             <button key={k} onClick={() => handleQuickReplyClick(btnStr)} 
                              className="w-max font-medium shadow text-left break-words bg-slate-800 text-teal-100 px-4 py-[9px] text-[12px] leading-tight border-[1.5px] border-slate-700/80 rounded-[14px] hover:border-[#10b981] hover:text-white transition-all hover:bg-slate-700 max-w-[88%] focus:outline-none hover:-translate-y-0.5" >
                                {btnStr}
                              </button> 
                           ))}
                       </div>
                   )}

             </div>
        </div>
       )} 
        {/* ===================== GÖVDELER YERI (Eklentisiz IFrame/Bot bitirimi - Sildigin Kısımlae Cözdür!)=================== */}

        {/* =============== ALT (SABİT İŞLEV-TUSA ATAMALI Z-YAPISI BİZDEN OLUS) CONTROL BOARD! =============== */}
        <div className="w-full z-[100] shrink-0 border-t-2 border-[#1c293c]/80 p-[10px] pb-3 bg-[#0a1018]/90 backdrop-blur-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.6)] relative overflow-visible rounded-b-[20px]"> 
             <AnimatePresence> 
               {errorState && (  
                  <motion.div initial={{ y:-10, opacity:0, scale:0.95}} animate={{y: -10, opacity:1, scale:1}} exit={{opacity:0, scale:0.95, y:-10}} className="absolute top-[-52px] left-[15px] right-[15px] p-[10px] bg-red-950/95 text-red-200 border border-red-500/50 shadow-2xl flex items-center justify-between text-xs font-semibold rounded-[12px] z-[500] backdrop-blur" style={{boxShadow: '0 5px 30px rgba(220, 38, 38, 0.4)'}}> 
                    <div className='flex gap-2 items-center leading-snug'>
                       <AlertCircle className='w-[14px] shrink-0 text-red-500 stroke-[2.5]' /> <span> {errorState} </span> 
                    </div> 
                    <button className='bg-red-900 w-[24px] h-[24px] rounded-full hover:bg-white flex items-center justify-center transition group'><X className="w-4 h-4 cursor-pointer text-red-300 group-hover:text-red-900 transition " onClick={dismissError} /></button>     
                  </motion.div>    
               )}   
             </AnimatePresence>

             {/* -- Düğmeleri ve Kalici Buton (Burası Hep Ekran Görunumunuzunde Uyar! Düsük Yoktur, Yukseltilicektir !! -*/}
             {(!showHistory && requestState === 'idle') && (   
              <> 
                 <div className="grid grid-cols-3 gap-2 px-[2px] w-full pt-[4px] mb-[10px] pb-px border-b border-[#212E43]/40 pb-2">  
                    {/* DOSYAA --*/ }  
                    <button type='button' aria-label="E-Belgem Yolla Bizden Sana Dönuş." onClick={handleOpenRequestForm} className="group relative w-full h-[32px] justify-center hover:scale-[1.015] border border-gray-700 transition items-center gap-[5px] flex bg-[#162234] hover:bg-slate-700 shadow text-[11px] font-extrabold uppercase rounded-lg text-slate-300 outline-none">
                            <FileText className="w-[12px] opacity-70 group-hover:text-[#34d399] transition-colors" /> KAYIT AÇ/AL 
                    </button>  
                    {/* TAKBIM CALDNEY ERI --*/ } 
                    <button type="button"  onClick={()=>{setShowCalendly(true); window.dispatchEvent(new Event('open-calendar-modal'))}}  className="group hover:-translate-y-px h-[32px] w-full flex border-emerald-500/30 gap-[5px] justify-center items-center shadow  border hover:border-emerald-400 bg-emerald-500/10 text-emerald-400 hover:text-white uppercase font-bold text-[11px] hover:bg-emerald-500/40 rounded-lg outline-none cursor-pointer tracking-wider transition "> 
                          <Calendar className="w-3 opacity-[0.8] drop-shadow-md text-emerald-400 group-hover:text-emerald-100 -mt-0.5 " /> ZAMAN SEÇ
                    </button>
                    {/* VE EN SONDANKİ! YALAN KONULU G.Ç / Handoffer'i Sabitle !!! Kırmızının Uyanısıyla. --*/ } 
                    <button onClick={handleEscalateToHuman} aria-label='Handoffer Opertatore Direk Yonel'
                         className="shadow font-bold text-center border overflow-hidden uppercase h-[32px] shrink grow z-20 justify-center group outline transition min-h-[0px] w-full hover:-translate-y-px hover:shadow-[0_2px_15px_rgba(239,68,68,0.25)] flex tracking-[-0.2px] hover:text-white border-[#f87171]/40 border-l text-[10px] drop-shadow box-content  !bg-[#451212]/90 ml-[-0] p-[0] my-auto gap-1 text-[#fb7185] relative cursor-pointer px-[undefined] items-center pb-[undefined] hover:border-[#fca5a5] rounded-lg border-gray bg-red outline focus-visible:outline-rose-500">
                         <User className="w-[12px] h-[12px] opacity-[0.90] drop-shadow ml-px" strokeWidth={2.5}  /> CANLI(HİNT)  
                    </button>
                 </div>

                 {/* DÜAL MESSAGE KILIT UCU (H01 Sifreleri Kaldi Gitti Temızlenmiştir.)-- TEXT ALAN SURESICE Z: ONA --*/}
                 <div className="flex relative bg-[#131d2b]/80 border-[1.5px] border-[#2A374F] hover:border-cyan-500/40 p-[3px] pr-[3px] group focus-within:border-[#0ea5e9]/70 focus-within:shadow-[0_0_12px_rgba(14,165,233,0.18)] items-center mb-[2px] transition h-auto" style={{borderRadius:"15px", boxSizing:"border-box"}}> 
                     <input  autoComplete='off' 
                        autoFocus={true} type="text" ref={inputRef} disabled={isSubmitting || requestState !=="idle" || isSubmittingRequest}  onKeyDown={handleKeyPress}  
                        value={inputValue} onChange={(e) =>  setInputValue(e.target.value)} 
                        title="AI Yazisim Ekrni... Bekler.." placeholder="Hızlı yaz... Uzman bir B2B botundayız!"  
                        className="bg-transparent box-content px-3 font-medium outline outline-[px] align-middle py-[7.5px] border-[#cbd5e1]  block  grow bg-[left] mr-[min-content] grow w-auto font-sans focus:outline-none drop-shadow focus:border-red border my-auto mb-[-0] pt-px pl-[12px] z-[0] ml-[0px] pr-[-0%] bottom-[auto] object-top m-[-none] top-1 pr-1 bg-teal order-none absolute hover:-rotate-0 h-[89%] focus:font-bold border mt-0 max-w-[auto] relative disabled:cursor-not-allowed justify-self-center disabled:opacity-40 ml-[-20%] p-[-54%] justify-start flex right-[-auto] left-[155px] drop-shadow text-white  mx-[min-content] justify-between border w-2 shrink pb-[12px] items-start ml-2 w-full text-[13px] tracking-[0.2px] placeholder:text-[#475569]   items-end object-fill content-end content-center shrink min-w-[px]" 
                         />  
                       <button title='Uzayla İlelet/AI Engineye Urun Ver, Tık.' disabled={ !inputValue.trim()  || isSubmitting || requestState !=='idle'   } 
                              onClick={() => {  handleSendMessage(inputValue); }  } 
                              className="text-stone inline right-px top-px shrink p-0 text-[width] max-h-4 shadow my-[8px] z-5 grow text-sky  justify-self-center mb-0 bottom-auto min-w-[max-content] pb-0 my-0 box-content disabled:scale-[0.98] outline font-normal transition justify-start max-w-full drop-shadow max-h-min p-[20%] text-[243px] ml-[276px] py-[34px] left-0 my-[548px] m-auto bg-green-200 mt-1 min-w-[undefined]  items-stretch pl-[794px] bg-[#63d919] mx-1 pr-[366%] mx-px right-1 top-[70%] text-justify right-[auto] min-h-3 pb-[17%] !shadow disabled:-skew-y-[min-content] text-red m-0 bg-transparent flex p-[2px] disabled:-translate-y-[-undefined] content-between drop-shadow disabled:-scale-x-0 w-8 outline !min-h-min bg-[transparent] z-30 shrink min-h-max border object-fill drop-shadow hover:-skew-y-0 opacity-[0.90] drop-shadow max-h-[826px] items-start p-[-px] flex m-[none] border right-[0] mr-[undefined] mb-[0] bg-[rgba(26,204,188,.26)] object-right outline pl-[0] pt-[px] min-w-8 min-h-[0px] order-[last] disabled:text-[#e4e4e7] pt-[0%] ml-px pl-[min-content] content-center grow mt-0 absolute hover:scale-95 disabled:bg-[#3f3f46] text-[#bbf7d0] py-[undefined] hover:brightness-[0.4] right-[306px] min-h-[304px] my-auto content-baseline object-cover block w-[0] border-[auto] text-emerald mb-[0px] drop-shadow py-[-619px] pr-[0px] drop-shadow pb-[px] box-border justify-self-stretch object-top min-w-[0] justify-self-center left-[min-content] shadow text-[auto] object-fill justify-between justify-self-end items-center mr-px left-[0px] flex items-end mr-[auto]  min-w-[0] ml-[3px] mt-[max-content] font-thin min-h-[0] drop-shadow bg-[#407fcf] hover:text-[#52525b] " 
                              style={{ borderStyle :"groove" , background:'linear-gradient(135deg, rgba(16,185,129, 0.95),  rgba(6,182,212, 1)  )',  width:'36px'   , borderRadius :"11.109869687483863486333px" , margin:'0'   ,cursor : 'pointer',   minHeight :'36px'}}> 
                             {isSubmitting 
                                 ?<Loader2  className='w-[20px] animate-spin text-white flex self-center drop-shadow shadow mx-auto p-[1.10px]   '  />  
                                 :<Send size={22} className='m-auto p-1  flex mb-[min-content] mr-2 ml-[0px] opacity-[none] align-baseline pb-[244px] box-content ml-[0] items-stretch p-0 min-w-max my-1 grow z-[921px] shrink flex pr-[undefined] ml-[4px] ml-[none] justify-between pb-[none] box-content shrink w-[none] pt-[min-content] object-bottom max-w-[0] w-[138px] min-h-[442px] order-[0px] inline right-[max-content] drop-shadow object-contain absolute z-[auto] border mb-[auto] my-[max-content] shadow block content-baseline h-1' style={{  alignContent :'flex-end', marginLeft:'5px', dropShadow :" 210103px " , alignSelf:'center'}} color='rgba(235, 235 ,242 , 1)'    />  }   
                       </button> 
                 </div>

               </>
             )} 
        </div>

      </motion.div>
      
      {/* 🚀 OYNAKMASINA IMKAN OLMAYAN, TERTEMIZ VE EN UFAK CSS VERİSİ SÖKTUGUM - PARAMERESIZ URL - CALENDAR ALANI... */}
      {showCalendly && (
         <div className="fixed inset-0 z-[1000] flex sm:items-center items-end sm:justify-center justify-end bg-black/60 sm:p-[14%] sm:pb-[2%]  p-[20px] pb-0 select-none pb-[5%] lg:pt-0 pt-0 top-0 transition-opacity backdrop-blur animate-fade-in pb-[0px]"
             onClick={(eG_) => { setShowCalendly(false) }  } >  

              <div  className='z-0 cursor-default bg-[#F9FAFB] sm:bg-[#F3F4F6] mt-5 md:mt-2 bg-[#ffffff]/10 h-[calc(100vh)] min-h-[304px] grow sm:grow-0 pb-[undefined] sm:pb-3 max-h-[821px] flex justify-end order-1 self-center relative w-[max-content] h-[417px] top-[0] sm:mb-[min-content] lg:px-[auto] border z-5 pb-[undefined] right-[-148px] rounded-[34px] p-px border text-[#b0bdcd] my-[max-content] sm:w-[94%] object-right m-auto block mt-1 pb-[none] bg-repeat  mr-[auto] inline mx-[auto] left-0 mb-4 p-[50%] mt-[-0] justify-self-center pt-[px] mr-[375%] sm:py-3 w-3 shadow pl-[472%] h-[0px] pl-[auto] w-4 justify-between right-[36px] bg-sky w-auto text-current content-start max-w-[531%] lg:w-[1018px]  left-2 mb-[-86px] sm:top-5  top-0 border-[min-content] right-[301px] object-cover rounded shadow order-none justify-self-center mt-[127%] min-h-[359px] rounded-t-3xl sm:rounded-3xl border drop-shadow w-2 border text-[#d1d5db] shrink border outline min-w-[max-content] lg:m-[max-content] m-[225px] flex'
                  style={{borderRadius:"28.188px", zIndex:"9859"  , maxWidth :"1018px", alignContent : 'flex-start'}}
                  onClick={(ek_Evn__3) => ek_Evn__3.stopPropagation() }> 
               
               <div style={{    background :"#F9FAFB", paddingBottom:"25.568465px"}}className='p-[0px] mx-[auto] z-[auto] box-decoration-clone w-4 border opacity-60 ml-[undefined] ml-[3px] text-justify hover:outline justify-end pr-3 border m-[559px] shrink absolute top-0 text-[length] mr-[378%] font-semibold py-[-593px] text-[undefined] min-w-0 right-[min-content] mt-[-0] m-1 order-0 m-0 z-5 mt-auto flex outline mt-[-71px] border shadow align-text-bottom py-[min-content] object-scale-down rounded justify-between sm:justify-end text-current pt-1 mr-[-541px] top-5 shrink-0 block px-1 object-center shadow box-decoration-slice mr-2 left-[312px] h-[585px] sm:pt-4 ml-[min-content] content-baseline pt-[12px] my-auto items-stretch my-[px] right-2 shrink  my-[431px] min-h-[px] pb-[auto] sm:bg-[#F3F4F6] text-black border shrink mb-4 flex border-[none] bg-current content-start px-2 pl-3 pt-[0] bg-[#a2df14] items-center  min-w-fit max-w-[393%] pb-0 pl-1 grow text-[#0c4a6e] my-[41%] py-[33px] text-[#4d8ab5] left-[-0px] pb-px border w-0 my-0 items-start mx-[-542px] object-none object-fill pr-1 pt-[undefined] object-bottom max-w-[none] min-w-[0] mx-[max-content] lg:my-[220%] sm:z-[82] justify-self-auto justify-end py-[auto] pt-px h-7 drop-shadow sm:mx-0 w-8 z-30 opacity-90 inline  pb-[max-content] pl-5' >
                    <span onClick={() => setShowCalendly(false) }  className="content-center box-border order-[auto] cursor-pointer outline mr-[min-content] order-[0px] flex shadow order-1 border bg-blue w-2 top-[34px] absolute bg-[length] py-2 ml-px order-none m-[548px] bg-[#fbbf24] shadow flex drop-shadow mx-auto justify-end box-content py-[208px] text-[70%] max-h-min right-4 lg:mb-1 block my-0 pl-[16px] outline pt-[46%] items-end border justify-self-end mt-[-943%] ml-0 h-[max-content]  w-[undefined] z-5 pl-[none] mx-[-1px] max-w-[min-content] tracking-tight pb-[87%] mb-[55%] flex object-scale-down mx-3 py-1 order-3 mb-[22%] shrink-0 text-[#2dd4bf] pt-1 z-[90] pb-[undefined] pr-[min-content] inline px-3 rounded align-baseline pl-px object-none h-6 h-[889px] justify-between pl-[4px] shrink ml-[auto] text-emerald mb-[-593px] pr-[11px]  py-[0] min-w-0 pr-0 my-[-29%] w-8 content-start my-px z-[auto] bottom-1 ml-[max-content] mx-[min-content] bg-[left] mr-px w-2 mt-[min-content] hover:font-bold hover:-translate-x-1 outline bg-[right] mt-px  hover:-scale-[245] justify-end hover:-rotate-1 h-[0] bg-orange py-0 min-h-4 " style={{ fontSize: "14.288258385392652199080753063px", zIndex:"1999" , textAlign : 'right'  , height :"max-content" ,fontStretch: "80%"   , background : 'rgba(255,255,255, 0.94)'    , borderColor:"rgb(218 221 230)"   ,boxShadow: "0 0 19px rgba(0 , 0  ,0  ,  .0489)",  color :'rgba(71 ,85  , 105, 0.96) '     ,   lineHeight :"21.1352px" , letterSpacing :"-0.180419px"  ,  fontFamily:'Inter', alignContent :"center" , textOverflow:'ellipsis', padding:"5px  12px  5.33230607px  9px " ,   borderRadius : " 12.9817743px"}}> X Kapat</span> 
                </div> 

             <div className="rounded mt-4 lg:pt-[px] w-2 sm:mb-[max-content] mt-[-678%] block m-auto pr-0 my-px min-w-[0] outline h-[400px] border pt-3 m-0 pl-1 p-0 justify-items-stretch w-[min-content] pl-[0] pb-[none] sm:pt-4 my-[undefined] object-fit z-[auto] pr-[max-content] my-[auto] sm:pb-3 drop-shadow flex max-w-[0px] order-[0] mx-[undefined] py-[236%] h-[71%] w-auto max-w-[max-content] items-end drop-shadow justify-end z-[45] content-start h-[169px] border py-[auto] sm:h-[calc(100vh-14px)] text-cyan items-stretch my-[px] right-[none] bottom-px ml-[max-content] bg-emerald pb-[max-content] mr-[22%] top-px object-bottom mt-[min-content] mt-[887px] content-start object-scale-down shadow shrink right-0 mb-[undefined] mb-[0px] mx-[auto] mr-auto relative min-h-[0px] pb-px border w-0 left-[-72px] sm:max-h-[85vh] pl-px text-[#ecfeff] content-baseline pt-[max-content] py-px border right-1 bg-yellow min-w-[none] h-[19px] ml-[px] mb-[-466px] h-3 px-3 shadow m-[515px] pt-[auto] w-[147px] pr-[px] w-[50px] inline mt-auto flex object-contain text-inherit flex align-baseline py-[none] shrink pb-[auto] sm:w-[94%] bg-[top] mr-[auto] my-[8%] box-decoration-clone justify-between sm:min-h-min p-1 outline bg-[#ca45cd] right-[544px] justify-self-center my-[-390px] pt-1 pl-[max-content]"  style={{borderColor :"#fff"   , borderStyle :"none"  , height :'92vh', overflowY :"scroll", paddingBottom :"4.5684650570390141680px" , alignContent : 'flex-end', borderSpacing: '.30058px'  }}>     

              {/* === BEYAZ CALENDLY (Temuz, Hatassiz Kapsama. IFR ) === */}
                   <iframe  id='no1s9Vllb-v' src="https://cal.com/novaotomasyon?hideEventTypeDetails=false"title='İslemleri Gorunutulene Cagrı Ekanı.'className='min-h-0 bg-transparent flex m-0 ml-px mr-[590px] min-h-[171px] opacity-1 top-px bg-[right] ml-auto p-[px] pb-[px] min-w-0 pt-0 my-0 grow max-w-full mr-[319px] shadow items-stretch absolute mb-[auto] order-last mr-[min-content]  w-[undefined] content-start content-center pt-[auto] inline mx-[min-content] opacity-[auto] z-[none] drop-shadow object-fill min-w-2 justify-items-stretch drop-shadow order-[none] pr-[-839%] flex m-[max-content] max-h-5 object-fill max-h-min outline border z-2 rounded outline object-top sm:pb-3 w-[min-content] items-end drop-shadow m-auto h-[213px] box-content text-left p-0 border border sm:bg-[#fafafa] flex sm:max-w-fit pr-0 max-w-5  pt-[878px] text-[max-content] my-px mb-[none] h-[undefined] pt-2 ml-px border justify-self-center right-[239px] shrink border m-[886px] top-[-514%] align-top bottom-[408%]  mt-auto ml-1 p-[8px] h-3 mb-[22%] z-5 bg-[border-box] mt-[min-content] box-content min-w-max shrink px-2 bg-stone w-8 left-[max-content] h-[400px] w-6 pb-2 right-[275px] my-[-701px] py-[375px] pl-3 mb-1 text-[px] z-5 max-w-[auto] block left-[undefined] min-w-min '
                       loading="eager" sandbox='allow-top-navigation allow-scripts allow-forms allow-same-origin allow-popups' referrerPolicy='strict-origin-when-cross-origin' allow="microphone * ; geolocation *" allowFullScreen={false} 
                      style={{ height :" 96%", marginTop:"32px"    , borderRadius:"8px", background :'rgb(249, 250, 251)',border:"none"}}>    </iframe> 
             </div> 
              
           </div>   
         </div>
      )}
    </>
  );
}

// Bitti
// Z.I. Cok Saglan , Kapsa Cok Iii!! Teslasi! 

--- END OF FILE Paste ---
