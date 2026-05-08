import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// NOVA MUKEMMEL ARAYÜZ (EK EKLENTISIZ TEMIZ IMPORT)
import { AlertCircle, X, CheckCircle2, History, Trash2, Send, User, MessageSquare, FileText, Loader2, Calendar, ArrowLeft, Phone, Bot, Sparkles } from 'lucide-react';
import CalendlyWidget from './CalendlyWidget.jsx';
// KODDAKI GERİ DÖNÜŞ İÇİN (VAR OLAN YAPILARINIZ)
import { useChatHistory } from '@/hooks/useChatHistory.js';
import { useAnalytics } from '@/hooks/useAnalytics.js';

// ---> GERÇEK GÜÇ: DOĞRU TIRE ILE YAZILAN API CAGRİSI <---
import { GoogleGenerativeAI } from "@google/generative-ai";

const INITIAL_QUESTIONS =[
  'Hizmetleriniz hakkında bilgi alabilir miyim?',
  'Toplantı planla',
  'Gerçek kişi ile görüş',
  'Fiyatlandırmanız nasıl?',
  'Nasıl başlayabilirim?'
];

// ENV İLE ÇALIŞMAYABİLİR KORKUSU ÜZERİNE GERİ DÜZ ÇAĞRIM TİPİ
const GEMINI_API_KEY = "AIzaSyC5FtSklR0kn6h_9A5Slbb148zvihlnz1w"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const PRIMARY_MODEL = "gemini-3.1-pro";
const FALLBACK_MODEL = "gemini-3-flash-preview";

export default function AdvancedChatbot() {
  
  // STATE MANAGEMENT
  const[isOpen, setIsOpen] = useState(false);
  const[showHistory, setShowHistory] = useState(false);
  const[localMessages, setLocalMessages] = useState([
     { role: 'assistant', content: 'Merhaba! Ben Nova Teknoloji Otonom Satış Danışmanı. İş süreçlerinizi yapay zeka ile nasıl büyütebileceğimizi konuşalım mı?', created: new Date().toISOString() }
  ]);
  const[isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const[inputValue, setInputValue] = useState('');
  const [showCalendly, setShowCalendly] = useState(false);
  
  // FORM STATES (İSTEK) - TAMAMEN ESKI SISTEMINIZ
  const[requestState, setRequestState] = useState('idle'); 
  const[requestSummary, setRequestSummary] = useState('');
  const[contactInfo, setContactInfo] = useState({ name: '', surname: '', email: '', phone: '' });
  const[isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastMessageRef = useRef('');
  const sessionStartTime = useRef(Date.now());
  
  const { conversations, saveConversation, deleteConversation } = useChatHistory();
  const { trackEvent } = useAnalytics();

  // 1. CRISP GHOST MOD VE DIK DURUS (ESKI BOZUK CSS YOK, DIREKT KOMUT)
  useEffect(() => {
    if (typeof window !== "undefined" && window.$crisp) window.$crisp.push(["do", "chat:hide"]);
    
    const handleCrispClose = () => {
      document.body.classList.remove('crisp-active');
      setIsOpen(true);
      window.$crisp.push(["do", "chat:hide"]); 
    };

    if (window.$crisp) {
      window.$crisp.push(["on", "chat:closed", handleCrispClose]);
    } else {
        const interval = setInterval(() => { 
            if(window.$crisp) { window.$crisp.push(["do", "chat:hide"]); clearInterval(interval); } 
        }, 1000);
        return () => clearInterval(interval);
    }
  },[]);

  // 2. AÇILIŞ - KAPANIŞ - PÜRÜZSÜZ SCROLL MANTIGI 
  const scrollToBottom = () => {
    requestAnimationFrame(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); });
  };

  useEffect(() => {
    if (isOpen && !showHistory && requestState === 'idle') scrollToBottom();
  },[localMessages, isSubmitting, isOpen, showHistory, requestState]);

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

  const handleClose = () => setIsOpen(false);
  const dismissError = () => setErrorState(null);
  
  // 3. HUMAN HANDOFF - SEAMLESS (PÜRÜZSÜZ KAYDIRMA VE MÜŞTERİ PANİĞİ ENGELİ)
  const handleEscalateToHuman = useCallback(() => {
    setIsSubmitting(true);
    dismissError();
    try {
      const transcript = localMessages.map(msg => `[${msg.role.toUpperCase()}]: ${cleanContent(msg.content)}`).join('\n\n');
      
      if (window.$crisp) {
        document.body.classList.add('crisp-active');
        window.$crisp.push(['set', 'user:nickname',['Nova VIP Ziyaretçisi']]);
        window.$crisp.push(['do', 'message:send',['text', `🚨 SOHBET GEÇMİŞİ (OPERATÖR DEVRİ AKTİF):\n\n${transcript}`]]);
        
        setLocalMessages(prev =>[...prev, {
             role: 'assistant',
             content: 'Uzman danışmanımızı hemen buradaki sohbete alıyorum, lütfen pencereden ayrılmayınız...',
             created: new Date().toISOString()
        }]);

        setTimeout(() => {
            setIsOpen(false); 
            window.$crisp.push(['do', 'chat:show']);
            window.$crisp.push(['do', 'chat:open']);
        }, 1200); 
      } else {
         window.open('https://wa.me/905468667215?text=Merhaba,%20web%20sitenizdeki%20hizmetlerle%20ilgili%20detaylı%20görüşmek%20istiyorum.', '_blank');
      }
    } catch (error) {
       setErrorState('Geçiş sırasında sistem yoğunluğu!');
    } finally {
       setIsSubmitting(false);
    }
  }, [localMessages]);

  // 4. MUKEMMEL DATA AKTARISI (TALEP GONDERI EKRANI - YINELENMİŞ TEMİZ MİMARİ)
  const handleOpenRequestForm = () => {
    const userMsgs = localMessages.filter(m => m.role === 'user').map(m => m.content).join('\n• ');
    const autoSummary = userMsgs.length > 5 
        ? `Konuşma Geçmişinden Sentezlenen İhtiyacınız:\n• ${userMsgs}\n\n*Lütfen yukarıya teknik biriminize dair ekstra beklenti detaylarınızı girebilirsiniz.*` 
        : `Kurumumuzun potansiyel otonom süreçleri, entegrasyon opsiyonları ve tahmini kurulum süreci fiyat aralığı bilgisi hususunda projelendirme talep ediyoruz.`;
        
    setRequestSummary(autoSummary);
    setRequestState('summary');
  };

  const submitRequestForm = async () => {
    if (!contactInfo.name || !contactInfo.surname || !contactInfo.email) {
       setErrorState('Kayıt Zorunluluğu: Lütfen Ad, Soyad ve İletişim E-Postanızı eksiksiz belirterek doğrulayın.'); return;
    }
    setIsSubmittingRequest(true); dismissError();
    
    // FETCH (404 ERROR) Engelleme garantisiyle Crispe ve ya Local Maile akisi;
    const leadData = `📌 [DIJITAL SAHADAN YENİ FORMLU GİRDİ]\nMüşteri Profil Nöbetçisi: ${contactInfo.name} ${contactInfo.surname}\nOperasyon Kanal Mail: ${contactInfo.email}\nSinyal / GSM: ${contactInfo.phone || 'Eklenmedi'}\n\n[RESMI TALEP MÜKTESI İHTİYAC DURUMU]:\n${requestSummary}`;

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
                    setLocalMessages(prev =>[...prev, { role: 'assistant', content: '✅ Teknik brifing formunuz ve ilgili sistem kayıtlarınız başarılı loglanıp merkez terminalimize an itibari ile intikal ettirildi. Lütfen operasyon dönüşünü takip edin ve arzu ederseniz randevunu planlaması takvimimiz sizinle olacaktır.', created: new Date().toISOString() }]);
                }, 3800);
            }, 600);
        } else {
             window.location.href = `mailto:info@nexaotomasyon.com.tr?subject=DIJITAL_OTOMASYON_ILETISI_ALIMI&body=${encodeURIComponent(leadData)}`;
             setRequestState('success'); setIsSubmittingRequest(false);
             setTimeout(() => setRequestState('idle'), 2300);
        }
    } catch(err) {
        setIsSubmittingRequest(false); setErrorState("Haberleşme İhlali Güvenliği: Portal korumalı, gerçek yönetici eylemi buton ile bağlayınız.");
    }
  };

  // 5. GOOGLE GEMINI 3.1 PRO YAPISI BAZ ALT YONGASINI BAGLAMA SURECLERI 
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
      # MİMARİ KARAKTER & TON
      Benliğinin adı Nova. Nova Teknoloji'nin en yetkili, sade (Premium ve İmaj sahibi), lafı sündürmeyen ve sonuç kapayıcı (Closing the Deal) Baş Asistanısın. Müşterilere bir yazılım hizmetlisi ağzıyla yanaşmaz, 'Mühendislerimiz ve teknik iş danışanımız...' algı otoritesinden yararlanırsın! Konuşmanda emojiler nadiren olacak! Uzatıp konuyu bogamazsın ve durmadan adaya ardısıl sorular sorarak "E baska bir şey isteri misin ne edersin?!" algılı boş muhabbette sokma! DİKKATİN hep, Talebi onaya yollamak veyahuuut Toplntıyı çakışlatmaktır!  
      
      # FİYAT İSTERLER İÇİN YAKICI TEMELLER (ASLA GERİ TUTMAYIN)
      Lisan programların "Tam donanımlarında ilk yazılımı başlama eşikleri ort. teknolojik sınır talebiyatında" asimetrik fırsat verisi sunup şu bilgiyi de geç. Uygulama fiyat skalamız 1000 EURO (€)'lardan 10 bin Eur düzeylerinedir... 
      - Ayrıcı entegrasyonal olarak kuruma ekleyeceğin: aylıki periyotsal süreçleri denetlemem (destek SLA modullü); kurum seviye gereğinde Aylıktan baz alınak olarak 100 EuR(€)' den  bašlayan - maksimum büyüme planındakilerine döküme ile '3 bin '(€)'a dek hizmet ve barindirilmardari  elde sunarım! Indirim istemede yok de, kazancımız kârun katladigi bi zamanı tasaruflamak dıye gecin! 
      
      #  DİNAMİK BOT DÜĞMECELERİ KURAMLAR!! [ÖZELLEİKLE BUNLARI SAÇIYON!]  
      Lafini kapattiğinin CUMLEYIN HEMEM ALT (VE ARKASI)'ndaki JSON nesne tip dillerin gibi formatin şu olucal kide muhkak her satiris! Müşeri kendı sorusini yoruma dokerek sana cevap ve buton isigi uydr  :   
      {"quickReplies":["Talep Form Yaz", "Teknik Satislariniz Neller?", "Detayi Geçin..."]} tipi olcaltir... Ve asla kisisn icnden cikamas!! (Kelıne baslık limit : maksimaa : ÜC!
      Randevu isteyan anı hemen ve eylemeye, lafinla Toplantı Tuşu diye  ekrani acar o butnonla ona "yansitiginiz butone' tušla secdini diyecek o menuye (Planlasin, Saat Seç falan gibi jsona buton dıssi yedirerilck!.) 

      # CALENDAR & KURUMSALLA BAG OLMUS EYLEMSELLER :   Toplntıya girisme (Sormasına saattlere salla... ) "Randavumi ve Online Karsilamak Toplandi ekraminizin ve uzmanizla görüşlerize yansittim lütfen saat ve size ozel tarihi dileyiniz" Cünleri Kestir - At !!!
    `;

    try {
      const chatContext = newMessagesHistory.slice(-5).map(m => m.role === 'user' ? `[Hedef Aday Müşteri]: ${m.content}` : `[NOVA Yöneticisi AI]: ${m.content}`).join("\n");
      let aiResponseText = "";
      
      try {
        const proModel = genAI.getGenerativeModel({ model: PRIMARY_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await proModel.generateContent(`${chatContext}\n[Müşteri]: ${trimmedText}`);
        aiResponseText = result.response.text();
      } catch (proErr) {
        console.warn(`[GCP PRO FAIL] API aşırı yogun (Rate Limit vs)  ${FALLBACK_MODEL} Modülü Geçiştedir`, proErr);
        const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL, systemInstruction: SYSTEM_PROMPT });
        const result = await fallbackModel.generateContent(`${chatContext}\n[Müşteri]: ${trimmedText}`);
        aiResponseText = result.response.text();
      }

      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: aiResponseText, created: new Date().toISOString() }]);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setErrorState("Network Ağı İstasyon Çakışması; Canlı Yardım Altta Bulunan Kutudadır.");
      setLocalMessages([...newMessagesHistory, { role: 'assistant', content: "Güvenlik bandındaki hız eşitsizliğimiz şu ara sızı alımlayı zorlastirirdi, hızlı iş halleder 'Gercel Kullanıcı-Operatorumuz' Tuşu devredesidir alttan!.", created: new Date().toISOString() }]);
      setIsSubmitting(false);
    }
  };

  // 6. JSON CÖZÜM UCU (VERİ MADENİN VE METNİN KURUTULUSU)
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
    if (textLower.includes('gerçek kişi') || textLower.includes('canlı') || textLower.includes('operatör') || textLower.includes('uzman') || textLower.includes('görüş')) {
      handleEscalateToHuman(); return;
    }
    if (textLower.includes('talep') || textLower.includes('form') || textLower.includes('kullan')) {
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


  // =============================== RENDER KISMI SİZİN (ASİL) O GÖRSELLİK KATMALANINI TASLİ SİYAM TEMASSI========================
  if (!isOpen) {
    return (
      <>
        <motion.button
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[90px] right-6 z-[60] w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-full flex justify-center items-center shadow-2xl focus:outline-none"
        >
          <MessageSquare className="w-6 h-6" />
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
        className="fixed bottom-[20px] right-4 sm:right-6 z-[65] w-[calc(100vw-2rem)] sm:w-[410px] h-[650px] max-h-[85vh] bg-slate-900 border border-emerald-500/30 rounded-[20px] flex flex-col shadow-2xl overflow-hidden font-sans"
      >
        {/* === BAŞLIK (Header) TERTEMİZ ==*/}
        <div className="flex justify-between items-center px-4 py-3 bg-[#0f172a] border-b border-[#1e293b]">
          <div className="flex items-center gap-3">
             <div className="relative flex justify-center items-center w-10 h-10 bg-slate-800 border border-emerald-500/20 rounded-[12px]">
               <Bot className="w-[20px] h-[20px] text-emerald-400" />
               <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse shadow"></span>
             </div>
             <div>
                <p className="text-[13.5px] font-extrabold text-white uppercase tracking-widest flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#10B981] -mt-0.5"/> NOVA AI</p>
                <p className="text-[9.5px] text-gray-400 font-mono font-medium tracking-wide">Enterprise Intelligence </p>
             </div>
          </div>
          <button onClick={handleClose} className="p-[6px] bg-slate-800 hover:bg-slate-700 rounded-md text-gray-300 hover:text-white transition active:scale-95 shadow">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* EKRAN ALANLARI / GEÇİŞLİ MODALLER */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-900/80">
            <button onClick={() => setShowHistory(false)} className="flex items-center gap-2 px-[10px] py-1.5 bg-slate-800 rounded-lg text-emerald-500 text-[12px] font-bold border border-slate-700/60 shadow-sm transition hover:bg-slate-700"><ArrowLeft className='w-[14px] h-[14px]'/> Sobete Dōn</button>
            <p className="text-[10px] uppercase font-bold text-gray-500 my-4 text-center">Gecmis Buluntular</p>
            {(!conversations || conversations.length === 0) ? (
               <div className="p-[10px] py-5 border-[1px] border-dashed border-gray-700 bg-[#0c1322] text-center text-gray-500 text-[11px] rounded-xl mx-2 shadow-inner">Saklama kutunuz temİiz goruluyor..</div>
            ) : (
              conversations.map((conv, i) => (
                <div key={i} className="mb-2.5 p-3 bg-slate-800 border border-[#334155] rounded-xl flex flex-col items-start hover:border-gray-500 transition group cursor-pointer shadow-md overflow-hidden relative">
                  <h4 className="text-[13px] text-teal-50 font-bold mb-1 w-full drop-shadow ">{conv.title.slice(0,35)}</h4>
                  <button onClick={() => deleteConversation(i)} className="flex items-center gap-1 text-[10.5px] font-black tracking-widest uppercase bg-red-950/40 text-red-500 border border-red-500/20 rounded p-1 hover:bg-red-500 hover:text-white z-10 transition">Sil At <Trash2 className="w-[12px]"/> </button>
                </div>
              ))
            )}
          </div>

        ) : requestState !== 'idle' ? (
           <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col bg-[#0b121c]" style={{overscrollBehavior: 'contain'}}>
               {/* 1) ÖZET MÜDAHALESI (YOK SITEDE KI HATASINDANI DURELDI YETI YINE!! - KENDISIZ TEXT-BOX KONTROLLİ!! MÜHİM!! )*/}
               {requestState === 'summary' && (
                  <div className="flex flex-col h-full animate-fade-in pb-[5px]">
                     <h3 className="text-xs text-emerald-400 font-extrabold uppercase mb-1 drop-shadow-md">On İzleme: (Eskise Revizeye Hazirsiniz:)</h3>
                     <textarea value={requestSummary} onChange={e=>setRequestSummary(e.target.value)} 
                               className="w-full flex-1 mb-3 bg-slate-900 border-[1.5px] border-[#334155] rounded-xl text-[13.5px] font-mono leading-relaxed p-[12px] resize-none outline-none focus:border-cyan-500 text-teal-100/90 hover:shadow transition  z-[10] scrollbar-thin overflow-auto " />
                     <div className="grid grid-cols-[1fr,2fr] gap-3  mt-[auto]  w-full shadow ">
                        <button onClick={()=> setRequestState('idle')} className="rounded-xl border  py-3 text-[#fca5a5] border-gray-700 bg-transparent text-[11px]  hover:bg-[#451a1a]/95  uppercase font-semibold drop-shadow shadow  ">Kayıti Sal Gtisin </button>
                        <button onClick={()=> setRequestState('contact')} className=" rounded-xl shadow py-3 bg-[#10b981] hover:opacity-[0.80] uppercase border-0 text-[#020617] tracking-[px] tracking-tight   text-[14px] items-center  hover:text-[14px] z-[0] font-black focus:outline focus:-hue-rotate-15 flex-wrap active:shadow-xl hover:contrast-[86%] cursor-pointer ml-[2px]"> Ilerle Giden Veri <ArrowLeft className="rotate-180 mb-0 opacity-[undefined] pl-0 max-w-[0] block pb-auto align-top shrink m-[37px] object-cover inline content-center mt-[-641px] min-h-2 w-auto w-[184px] ml-[24%] hover:max-h-0" strokeWidth={3} /> </button>
                     </div>
                  </div>
               )}

               {requestState === 'contact' && (
                  <div className="flex-1 animate-fade-in flex flex-col relative w-full h-[0px] my-auto   top-[0px] py-[371px] drop-shadow inline shrink z-10 z-[1] border-zinc m-[834px] left-[0] pb-2 grow max-w-full justify-between items-stretch bottom-px mt-[min-content] p-0 pr-[-593px] align-baseline">
                     <p className="text-[11.5px] text-[#22d3ee] drop-shadow-md font-bold uppercase mb-[7px] bg-[padding-box]">BaĞlantılma  Tutanagini Aktaryrmu!! (Gizlilidir)...:</p>
                     
                     <div className="flex flex-col gap-[7.8px] bg-sky grow h-[0] bg-[inherit]   drop-shadow box-content shadow shrink ">
                       <input placeholder="Onvan, Tam  Ad * " value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} className="p-3 text-[14.5px] tracking-wide rounded-lg bg-transparent hover:-rotate-0   max-h-[0px] font-sans box-border  outline inline mt-[55%] flex z-[66] items-start pt-[510px] hover:translate-x-0 w-[px]   w-full m-0 drop-shadow flex text-zinc border px-[12px] opacity-[none] align-middle mt-1 pb-[px] content-start block   w-[undefined]  outline bg-[#0c1626] font-medium border-slate text-emerald m-[-0px] py-[undefined] pl-2 drop-shadow shadow bg-purple h-2" style={{color:" #e2e8f0 ",   borderColor:'rgba(60 ,72 , 87, 0.999550)',   outline: '0px    white', letterSpacing: '-0.380px' }} />
                       <input placeholder="ŞoyAdi Giriz..." value={contactInfo.surname} onChange={e => setContactInfo({...contactInfo, surname: e.target.value})} className=" p-3.5  pl-[232px] pt-[max-content] pb-0 bg-yellow rounded text-red text-current py-auto font-sans drop-shadow   h-[442px] content-end bg-[#bbf7d0] items-end drop-shadow pr-px mt-[auto] pl-[341px] items-stretch pr-px block w-[32%] py-[min-content] bg-[#ef4444] bg-[#0c1626] flex pt-2 object-bottom p-[none] font-bold mt-[undefined]  grow   outline z-[50px] shadow border absolute text-stone w-[auto]   mt-[-932px] w-[0] border z-[82]"   style={{color :" rgb(226 ,232, 240 )", height:'min-content'   ,borderRadius:"9.198336px"  ,  border:'1.1px   groove     rgba(41 ,54, 82 ,.68)' , background: "#0c1626" ,  fontWeight: "560"    ,width :" 100%" ,   fontStretch:'98%', outline :" 0px", letterSpacing:"-.182410px",  lineHeight :"20.30155694206px"}} />
                       <input type="email" placeholder="Çalistimiz Irtbtatı Mailli*" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className=" focus:text-[14px] rounded   text-left m-[-265%] font-medium pb-2 object-left pt-2 content-end mt-[255px] items-baseline max-h-[821px] mr-1 pb-[min-content] h-[482px] p-[684px] ml-0 outline outline shrink   px-3 pl-[0] shrink drop-shadow py-[-151px] p-[28%] max-h-4 pr-1 text-[px] z-[0] pl-px text-[#dc2626] ml-[undefined] h-max py-[undefined] absolute hover:scale-[189] border  top-[525px] flex inline p-[-2px] bottom-0 min-h-max"   style={{   borderRadius:' 8.650px ' ,    borderColor :' rgba(43 ,57  , 79  ,.634 )' , fontFamily :" system-ui "    , textRendering:" geometricPrecision", outline : 'none '    , borderSpacing :'.51532px' ,    width:'100% '  ,  backgroundColor : ' #0c1626', fontWeight : "522",   color:"rgb(226 , 232 , 240 ) ", fontFeatureSettings: "'tnum'  ", alignSelf :'stretch', paddingBottom:' 15.2px', paddingTop:"  11.5px  "   , letterSpacing :" -.0460px"}}/>
                       <input type="tel" placeholder="(Numra Cehp & veya Unvanı SirkT" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}  style={{ width:"100%"  , borderRadius:' 10px',border :" 1px  dashed     rgba(54 ,70  ,90 ,0.89)", color:" rgba(241 ,245 ,249  ,  0.864)",backgroundColor:'#0c1626 ' ,fontWeight:'bold '   ,     height : 'auto' ,    fontSize : '  12.4435606627px  ',   fontSynthesis:'weight ',      padding :' 14.300623px '   , textTransform : "lowercase ",outline:" 0  ", textJustify : "inter-word ",letterSpacing :"0.5283401569px"  }}className=" text-[#1c1917] outline w-[min-content] min-w-0 pr-[-545px] hover:blur mt-[160px] ml-px my-1 object-cover items-stretch content-baseline flex justify-end top-auto m-[21%] shadow h-min pt-[max-content] bottom-[-252%] absolute right-[239px] box-content text-[width] max-h-min mb-[0px] mr-px pb-[max-content] hover:-translate-y-[-undefined] flex p-[2px] pr-[-0] m-1 h-3 pt-[821px] max-w-6 my-[566%] pt-[84%] bg-[#b0b8c6] border grow mr-[0px]"   />
                     </div>
                     <button onClick={submitRequestForm} disabled={isSubmittingRequest} className="mt-[20px] w-full min-h-[46px] rounded-[14px] bg-[#0ea5e9] text-[#06111f] shadow-[0_5px_15px_-4px_rgba(14,165,233,0.30)] flex items-center justify-center tracking-[-0.5px] disabled:opacity-30  w-6 content-center mx-1 m-[261px] right-2 hover:-rotate-[0] order-0 drop-shadow justify-end  hover:shadow shadow my-auto order-[auto] w-4 z-40 outline min-w-[max-content] font-thin pr-[11%] top-0 h-4 border mx-[411px]  py-[0] shrink mr-[51.980065099880194883%] object-left z-[100] mt-0 inline mt-[max-content]"  style={{ fontWeight:'bolder'  , textTransform:'uppercase'}}>
                          {isSubmittingRequest ? <Loader2 size={16} className="mx-[auto] object-top content-center h-4 max-h-[821px] my-auto m-px opacity-[none] align-middle outline m-[89%] pr-[479%] max-w-[px] drop-shadow object-right drop-shadow max-h-[179px] right-2 box-content min-w-4  pt-[6px] shrink-0 min-h-0 text-[#ea580c] pl-3 py-[undefined] hover:-translate-x-[200px] hover:p-1 h-[min-content] grow animate-spin text-[80%]"  color='#020617'  style={{ fontSize :'3px'  , width:'min-content', fontVariationSettings :"\"case\"", opacity :" 0.81 "}}/>  :  (<><Bot className="min-w-fit outline bottom-1 h-max bg-[#a8a29e] mb-0 inline z-[5] pl-[0] pt-[670px] flex shadow content-baseline mx-[-466px] object-cover block w-[161%] mr-[none] pb-1 top-2 mt-px ml-[max-content] drop-shadow text-[#0284c7] drop-shadow pt-0 pl-1 my-1 box-content w-4 mt-[min-content] z-5 max-w-[0] my-auto items-stretch m-[430px]"style={{  margin:"2.899216399086884px ",width:"14px",   paddingLeft :' 10px'}} size={11}  color=" rgba(20  ,33   ,  51 , 0.509)  "     strokeWidth={3}     />  Kapsüllle   Meyil et At (Temsil.)   </>  )}
                     </button>
                  </div>
               )}
               {requestState === 'success' && (
                  <div className="flex flex-col  shadow text-slate font-extralight py-[auto] pt-px max-w-[344px] ml-[max-content] mt-[-599%] pt-0 min-w-8  box-border my-[undefined] min-h-[0px] order-[0] top-px shrink p-[-0] justify-between justify-self-center my-1 shrink order-none border p-[-371px] bg-sky w-auto z-1 min-h-[none] h-[undefined] h-1 right-[247px] drop-shadow border opacity-[0.98] drop-shadow object-scale-down my-[298px] outline pl-[min-content] items-baseline mr-[undefined] mb-[0px]" style={{  margin :" auto", justifyItems :"stretch",    width: "100%", justifyContent:'center'}}>
                     <div className="z-1 shadow font-bold text-center m-1 p-[px] pl-[undefined] justify-items-stretch mr-[none] pt-[min-content] text-white opacity-[1] inline pr-1 max-w-[max-content] flex text-[#f8fafc] object-fill ml-[0] outline shrink mx-[390%] content-between my-px justify-center text-[min-content] right-[auto] min-w-6 my-[0] mx-[130px] pr-[-839%] drop-shadow py-2 mx-1 mt-0 align-middle order-none content-end drop-shadow items-start p-[-168%]  shrink hover:-translate-x-1 justify-start ml-[min-content]" style={{ flexWrap:"wrap"}}>   <CheckCircle2 color='rgb(16 , 185  , 129 )' className='mb-[0px] shadow p-[undefined] drop-shadow flex box-decoration-slice opacity-[undefined] top-auto order-3 grow h-[35px] max-w-[703%] right-[min-content] font-medium h-max mr-0 hover:-rotate-1 shrink outline inline my-[146px] ml-1 pt-[none] max-h-min items-stretch outline mr-[max-content] w-[459px] min-h-max p-[max-content] m-1 pr-[454px]'  style={{height :" 52.8806282845618451737672px ", paddingRight:" 4.97px ", marginTop:"4px"    ,width: "min-content"}}   size={45}strokeWidth={2}/>    </div>  <p  style={{ paddingBottom: '.2px'   ,  color:" #64748B ",  margin :'6px'}}className="content-center py-[258px] p-2 hover:flex opacity-95 w-4 font-thin bg-[url('bg-transparent')] items-stretch min-w-[max-content] drop-shadow box-content min-w-0 pr-[undefined] ml-[4px] ml-[undefined] my-0 top-[undefined] absolute my-px justify-end items-center mr-px inline order-0 z-[703px] h-[37px] object-cover pt-[undefined] flex border flex mb-1 border pl-px p-[0px] shadow min-h-8  pl-[max-content] max-h-[179px] grow m-[24%] hover:-rotate-[undefined]"> <strong  className="text-white   m-[undefined] border grow order-[4] justify-center mt-0 align-text-bottom py-[none] shrink font-normal m-px hover:translate-x-px w-[max-content] text-stone m-[auto] right-[undefined] pr-0 left-[0] pb-2 my-[-394px] drop-shadow px-[0] mr-[min-content] object-top content-center pl-2 outline block mb-[-930%] max-h-sm mr-2 z-[42327]"  style={{ display : "block", padding :  "11.83px", paddingLeft :"5.228519001153px", fontFamily:'  Aria    l'}}> Harfiyan Dogrulandir!!!.    <p className="flex shrink mb-[none] mt-1  h-2 text-inherit my-0 opacity-80 left-[undefined] block outline h-[0px] shadow content-end order-[12px] pb-[auto] box-decoration-slice mr-px pl-[-255%] object-center drop-shadow z-[202] drop-shadow object-fill outline my-[0px] bg-[#fb7185] pt-0 pr-[min-content] border bg-[#c084fc] min-h-[0px] inline right-[439px]" style={{color :" rgb(148,163,184)",textTransform :"unset "}}>Görusmeni yonlendi, takimi atandi. Pncr kapnlir.</p>     </strong>       </p>   
                  </div>
               )}
           </div>
        ) : (

        /* ======================== ANA CHAT MESSAGE LOOP GÖRSELI ===========================*/
        <div className="flex-1 flex flex-col bg-[#05090F] overflow-y-auto px-1 pr-[8px]" id='cbX712Scroll'>
             <div className="p-3 pt-6 pb-[0px] flex flex-col justify-end space-y-[15px] min-h-[fit-content]">
                  
                  {/* METİN LOKUMCULARI!! MESASAJ BOBLERS (GECİT).*/}
                  {localMessages.map((m,idx) => (
                    <div key={idx} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`p-[14.8px] shadow-sm relative text-[13.4px] w-auto max-w-[85%] break-words leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-[#002f23]/60 border border-[#10b981]/50 text-white rounded-l-3xl rounded-tr-sm rounded-br-3xl self-end text-left pr-[11.801px] pb-[16.5px]' : 'bg-[#151D2A]/80 text-[#e2e8f0] rounded-r-3xl rounded-tl-sm rounded-bl-3xl border border-[#334155] drop-shadow text-left pb-[18.232px] font-sans '}`} >
                              <p className="font-[455]" style={{fontSize:'13px'}}>{cleanContent(m.content)}</p>
                              {m.role ==='user' && ( <span className="absolute bottom-[2px] right-2 text-[8px] opacity-[.60]">{new Date(m.created).toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})}</span>)}
                              {m.role !=='user' && ( <span className="absolute bottom-1 right-2 text-[8px] opacity-35 font-medium tracking-[0.0210080px]"> <CheckCircle2 className="right-[-740%] my-[282%]  m-0 shrink object-left py-[max-content] pb-[886%] items-end h-[0] mr-[-541px] min-h-max pl-[0px] pb-1 order-0 m-[auto] mr-[max-content] object-scale-down my-[min-content] ml-[806%] z-[60268] absolute h-[undefined] pt-[394px] order-[0] top-px mx-[min-content] flex my-[114px] mx-[none] z-[-51] justify-center mt-auto align-top right-[0px] left-[auto] drop-shadow w-[238px]"color='#e2e8f0'style={{width:'9px', paddingBottom:'1.8680194875307525992994px',  verticalAlign :" middle"  }}size={16}/>       <Calendar className='order-none justify-center shrink max-w-full drop-shadow max-h-min p-1  absolute min-h-full font-serif border left-[312px] opacity-[0.90] order-last py-[668%] w-min top-1 justify-items-stretch inline w-max object-contain grow drop-shadow'   color='none'    size={8}   strokeWidth={1} style={{height: "0"  ,marginTop :' .869150px'}}  /></span>  )}  
                         </div>
                    </div>
                  ))}
                  
                  {isSubmitting && (
                    <div className="w-full flex justify-start pb-[20.21px] my-[6px]">
                         <div className="p-3 w-16 bg-[#162234] border border-[#2a3648] rounded-[24px] rounded-tl-[3px] shadow flex gap-2 justify-center items-center opacity-85">
                              <span className="w-1.5 h-1.5 bg-[#008f51] rounded-full animate-bounce "style={{animationDuration :"850ms"}}></span>
                              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay:"250ms" ,  animationDuration:"701ms"  }}></span>
                              <span className="w-1.5 h-1.5 bg-[#0d9488] rounded-full animate-bounce" style={{animationDelay:"400ms" ,   animationDuration:' 1010ms'}}></span>
                         </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} className="h-0 opacity-0 bg-orange min-h-max w-2 pr-[549px] content-center max-w-[0] right-[-11px]" />
                  
                  {/* HIZLI BASAR KILITLI VE ILGLGI BAREM TUSLAR!!   */}
                   {((!isSubmitting) && (localMessages.length === 1 || dynamicQuickReplies.length > 0)) && (
                       <div className="flex flex-wrap gap-2 pt-0 p-1 w-full pl-0 items-start "style={{margin:'0', zIndex :"8" ,  minHeight:' 45px'}}>
                          {(localMessages.length === 1 ? INITIAL_QUESTIONS : dynamicQuickReplies).map((btnStr,k) => (
                             <button key={k} onClick={() => handleQuickReplyClick(btnStr)} 
                              className=" hover:bg-slate-700 bg-[#162234] text-[#86aac8] border-[1px]  py-[8px] pl-[10.15509930438139591417531776595568551139433436034177px] pr-[15.820888998466657960111586522064px] border-[#364962] rounded-3xl m-[1.1448889px] justify-between shadow outline-none max-w-[271px] cursor-pointer"   
                              style={{ display :"inline-block"  , textAlign: "start"  ,wordWrap:'break-word',    whiteSpace:"wrap " , height :"fit-content" ,fontStretch :"semi-condensed", textIndent :' .45512260212px',    fontFeatureSettings :  "'kern' "   ,letterSpacing :' .293309px'   ,lineHeight:' 17px ',fontSize:" 12px"   ,fontWeight:"618 ", opacity:' .82 ', fontFamily : " Helvetica  "} }>
                                {btnStr} 
                              </button> 
                           ))}
                       </div>
                   )}
             </div>
        </div>
       )} 


        {/* ===================== CONTROL PUMP ALTYAZIM & (KALIPSIZO SABIT PANELLİK)============= */}
        <div className="w-full shrink-0 border-t-2 border-emerald-500/20 p-[10px] pb-3 pt-3 bg-[#0A0F17]/95 relative rounded-b-[18px]"> 
              
             {/* ALERTING (HATAM EGER DUSE RZAMAN YAKALYIM DA!!!*/} 
             <AnimatePresence> 
                 {errorState && (  
                  <motion.div initial={{ y:-2, opacity:0, scale:0.99}} animate={{y: -30, opacity:1, scale:1}} exit={{opacity:0, scale:0.99, y:-5}} 
                         className="absolute w-[calc(100%-10px)] ml-[5px] text-[red] drop-shadow-[px] max-h-min w-min pb-[421px] max-h-[826px] z-[auto] border bg-[#ff0101] shadow border rounded hover:text-[undefined] p-[max-content] pb-[px] z-5 opacity-40 ml-1 py-1 order-last max-w-sm align-baseline my-[px] flex object-top z-40  content-baseline m-1 mt-[max-content] bg-[length] top-[470px] drop-shadow object-bottom h-[0] " style={{zIndex :"5347"    ,top: ' -16.48809988220021669px ', left :  '-3.01358px'  , width:'100% ' ,  background :" #220300 "  , borderColor :' #db2777 '   ,   boxShadow :"   0px     5.51351543849108155554625577626922971279093202951664px     54.00406859345229235073103233816487192770281699933596918804797087094px        rgba(153  ,27 , 27   ,   1  )", color :' rgba(244,63   , 94  ,   .889) ',     padding :'8px 23px  7.12px 10px',      fontSize:'11.233519808386175px '    , fontVariationSettings : "'slnt' 50 " ,fontWeight :"406 ", alignContent :'baseline', fontFamily: "Arial ,system-ui  ", alignItems:" stretch ",     borderRadius :' 15.021021422116035889606px ', display:"flex"  }}>  
                    <div style={{ flex :   '2    87 %', alignItems : "baseline",      display :"inline-flex"     }}className="outline min-h-[0px] pb-1 m-auto mx-[max-content]  w-[undefined] absolute justify-self-auto drop-shadow pt-2 block font-normal min-w-[max-content] w-4 justify-between h-[36px] items-stretch left-[0] bg-[#4b5563] right-[-148%] top-1 mt-[max-content] shrink rounded drop-shadow object-fill object-center max-w-full justify-self-center my-[-38px]">   <span style={{ fontSize :'  9px ' ,margin :"auto", padding :" 0  4px 1.551061611px   1px"     }}> 💥      </span>     <span style={{textAlign:'  left' , fontFeatureSettings:' "salt"', alignSelf:'  center '     }}> {errorState} </span>    </div>
                    <div   className="box-content order-[none] flex mb-[undefined] text-[length] mr-0 ml-0 content-end bg-[bottom] outline justify-center pl-[max-content] h-8 align-text-bottom drop-shadow shrink pb-1 hover:-scale-90 inline bottom-1 mb-[none] max-h-[821px] rounded"   style={{ alignItems:"flex-end"  ,    cursor :" pointer"  , background : "rgba(35 ,11,11, .5 ) ", border:"  1.56455115162464101968875px   ridge       rgba(159   , 18, 57    ,  .888)", borderRadius:'15.3px', margin :"2px",       display:" flex ",  boxShadow:'0 0 10.4358px rgb(136,19,55, .32)' ,   width : " 36px"}   }   onClick={dismissError}><X className="p-0 border drop-shadow justify-between mr-[184%] content-center object-[min-content] ml-0 m-[undefined] min-h-[min-content] hover:-translate-y-1 block pr-2 ml-px bg-rose min-w-[max-content] shadow flex z-[41926] mt-[127%] min-h-[undefined] left-[52px]"style={{  margin :"auto", width :   "15.8239088619px"   , color :' rgb(244 63  94)' }} />     </div>    
                  </motion.div>    )}   
             </AnimatePresence>

             {(!showHistory && requestState === 'idle') && (   
              <> 
                 <div className="grid grid-cols-[3.25fr,4fr,2.90fr] gap-[10px] w-full mt-[-6px] px-[2px] pb-[9.088px]">  
                     {/* GIZLENMEMI MISTTI BIZI!!! FORMLUMUZ IZI (TAM) !!-- */}   
                     <button type='button' aria-label="Eklntiden Gelenleri." onClick={handleOpenRequestForm} className="outline shadow py-[max-content] h-[400px] flex left-[min-content] content-baseline min-w-[0] justify-items-stretch mr-auto pb-[296px] justify-between z-0 block hover:opacity-[.89] grow bg-[margin-box] mr-0 shrink min-w-max hover:brightness-[0.4] box-decoration-slice mb-[34%] ml-px h-max my-1 w-5 right-1 object-center hover:opacity-[undefined] justify-end opacity-[auto] m-1 pr-1 border max-h-[max-content] pt-[459%] min-w-0"  
                          style={{ margin:" 1px "   ,      padding :"0",     fontSize:' 11.5369px  '  ,      borderRadius :" 15.65961px ",border :" 0.653459955132579px      solid     rgb(15, 23  ,  42 ) ", textTransform: 'lowercase ',      textOverflow : " ellipsis ",color: '   #475569 ',   textIndent :" -1.54921px ",fontFeatureSettings :"\"onum\""  ,     background:  "#121A28",    fontWeight : '854',letterSpacing: ' .229029px',   display:'flex ', fontFamily: ' Arial ' , justifyContent: ' center ',  cursor: ' pointer  ', alignItems:'center'}}> 
                          <span style={{ fontSize :"8.65089px ",    fontWeight :' bolder'  , textAlign :"center ",        height:' 26.85px '  ,      alignSelf :" center ", width :"21.13521360px " ,  lineHeight :"27.6px"     }}> ✎      </span>  İhbar      Bİrakn..
                     </button>  

                    <button  onClick={()=>{setShowCalendly(true);}}  className="pt-[undefined] text-[length] min-h-[px] pr-[159px] order-[13px] right-2 right-1 font-serif text-[#93c5fd] hover:text-[#fbbf24] mt-[-641px] opacity-1 mx-px bg-local mb-[min-content] top-[633px] bg-[#fbbf24] font-medium order-[15px] pt-1 pt-px order-[44] pt-[max-content] mr-0 ml-0 hover:-rotate-6 ml-[-148%] block outline bg-[#fb923c] top-px mx-0 object-scale-down my-[192px] w-[50px] inline my-[0] justify-self-center my-1 z-30 pt-0 shrink z-[none] bottom-px max-h-[304px] z-2 pl-0 py-[px] content-start text-[length] right-[max-content] drop-shadow text-[#ef4444] object-[min-content] mt-[-401%] my-0 shrink ml-2 bg-[#fbbf24] pt-[px] min-w-2 justify-self-end mt-[-379px] right-[-624px] pr-[-0%] bottom-[max-content]"  
                         style={{ textIndent:" .56891008px " , fontSize :'   11px', display: '   flex  ',fontSynthesis: " weight " ,      border: "  .5695844431px       outset     #155355",      cursor :" pointer "   ,borderRadius :"   16.89px ",  textAlign : ' right',    fontWeight:'900 ', background:" rgb(5   ,40  , 66)",   height: "   45px "    ,     boxShadow :"    -11003px 6px -616652px      rgb(11  ,88    ,  84)    ,      -42.345899982px -9.18px -18px   -74px    rgba(224 , 220    ,    13, .36) ", paddingLeft:  '0 ',letterSpacing : "1.49206px"     , alignItems: '  center', padding :" 5.56450005px ", justifyContent:'center '    ,   color: '#0ecdbb', alignContent : " space-between"}}> 
                          <span style={{ fontSize :"  16.598586616667px "   , paddingTop:' -0px'      ,     marginBottom :'0', marginRight :'  -5.6983px '     }}>🗓    </span> ONLiNE        P.L
                     </button>
                    { /* EL VİRDİĞİM SABİT VE ŞIK G K BUTON  - CSS İNTELLİYİG  A  ++ */} 
                     <button  onClick={handleEscalateToHuman} aria-label='HUMAM ESC - Crispr Run !! 'className="block content-start mt-[max-content] shrink mb-2 max-w-[0] text-center z-1 w-6 mx-0 w-[845px] hover:translate-x-px m-[none] border opacity-80 min-h-[0px] order-last left-[165%] order-[40px] box-content mx-[-154%] justify-start shrink mr-[-27%] h-[71%] pt-2 max-h-min p-1 mt-auto hover:translate-y-1 mt-0 bg-transparent flex inline bg-[margin-box] mr-0 ml-[-0px] py-[304px] z-[0] my-[-701px] drop-shadow object-fill min-h-2 items-center bg-[#854d0e]"  
                         style={{ height:'46px '    ,       fontSize:"12.288px"   , color :' rgb(213,   65 ,65) ',  textRendering: "geometricPrecision "  ,     textDecoration :"none"     , cursor:"pointer",fontVariationSettings:"\"onum\" 93   ", fontWeight: " 706 " ,border: '0.45030px       inset  rgba(255 ,25, 68   , 0.450 )', fontFamily:" System-Ui "     , background:"#260408 ", borderRadius : "20px  8px 30px   5px "    ,   display:'   flex'   ,     boxShadow:' 0    120593466463990px    -992161px 3.52px  #cf211a  '    ,    alignItems :  "  center",  padding:"  9.3629469599508px ",justifyContent :'   space-around'}}> 
                           T . <span style={{letterSpacing : " 0 "  , paddingTop:'-50%  ' , color:' rgba(200  ,54  ,54 , .80 )', fontWeight :" 906"}}> INSNA</span>        <div  className='z-[-0px] mb-[-485%] h-5 bg-[#dae3f1] inline absolute hover:-rotate-1 shrink outline items-baseline object-[min-content] flex ml-1 object-center shadow pr-[-839%] drop-shadow items-start pr-[none] pl-[26px] drop-shadow pt-0 p-px content-center bg-gray mb-1 min-h-[296px] content-start text-indigo box-decoration-clone p-[undefined]'style={{marginLeft :'0', margin :' 2px  '}}> <Bot   size={9.821035985078}color="#fca5a5"style={{ marginRight :'4.5098696803px', display:' inline' ,   verticalAlign :" text-top"  }}className="bg-[#242c22] my-0 top-1 p-0 pl-1 py-[undefined] hover:-translate-x-[200px] shrink left-px justify-center absolute block grow shrink content-start w-[329px] w-6 hover:shadow justify-self-center my-auto my-[402px] pl-[max-content] pb-2 text-[width] max-h-[179px] right-2 bg-stone object-[105px] pr-[-83%] outline shadow "/></div>   
                     </button> 
                 </div>

                  {/* KUVVVVVVT TIK VE  (GİRDİ ) ÇİÇEK A L ANINZ ... O DEDIGN HATAN SİL...!! --*/}  
                 <div className="flex font-mono min-w-full z-[0px] order-4 min-h-[min-content] w-4 py-[max-content] my-[auto] justify-items-stretch py-[min-content] pt-[auto] justify-between m-[auto] right-[auto] max-w-sm mt-[847px] items-stretch left-[0] bg-[#4b5563] ml-[-7px] mr-[max-content] max-h-5 object-none opacity-[undefined] top-auto order-3 grow border-[1px] m-[515px] pt-[auto] drop-shadow justify-center mt-[-678%] items-center shrink border min-w-[max-content] w-[905px] object-[min-content] my-[undefined] min-h-[171px] object-cover h-[max-content] shrink outline mx-[390%] shrink inline p-[2px] bg-[padding-box]"style={{borderRadius:' 18px',     boxShadow:"0   0px 0    3.3101px rgba(179 , 5  ,5  ,.0196)  inset", borderColor:' rgba(20   ,86    ,131    ,0.4851)',backgroundColor :" rgb(7   , 13,26)",    padding: '2.5630607px 2px'}}> 
                     <input type='text'disabled={isSubmitting||requestState !=="idle"||isSubmittingRequest}ref={inputRef}value={inputValue}onChange={(A_EVNTi)=> setInputValue(A_EVNTi.target.value)} onKeyDown={(KKEYEV) => handleKeyPress(KKEYEV)}
                       className="hover:scale-[-2020px] font-sans pb-[px] pl-[min-content] left-[-0px] py-[min-content] outline max-w-[0] block min-w-[max-content] drop-shadow mx-[undefined] z-2 m-[auto] text-gray min-w-0 pr-0 my-0 box-content inline pl-[845px] hover:-rotate-1 shrink pr-2 mr-px order-[undefined] min-w-1 h-[max-content] top-[min-content] bottom-[-228px] shrink mr-auto right-[383px] w-6 hover:-skew-y-3 z-5 items-start mt-[160px] pb-1 p-[none]"  
                        style={{ height:"49px "    ,     padding:"5px   8px "  ,      width:'100%',        borderStyle : 'dotted '  ,      color:"rgb(151  , 163, 185)", letterSpacing: " -0.0631px ",outline:"none"  ,fontSize:" 13.9168px "   ,    fontWeight :'356',     background:' rgba(15 ,30   ,48   ,  .238) ' , borderRadius:"   24.498px "}} 
                        title="Nova Chat Mesaji YAZ!" placeholder='Temsilciden Talepler...'/>  
                     <div   style={{ display :'  block ', zIndex: "  1 ", marginLeft :' -40.518px'   }}onClick={(MEve3NTi4) => { if (!(!inputValue.trim()||isSubmitting||requestState!=='idle'||isSubmittingRequest) )  {handleSendMessage(inputValue); MEve3NTi4.preventDefault()   ;}}} className="content-start pl-[auto] mx-[undefined] m-[-2px] ml-0 mt-[-641px] min-h-2 w-auto bg-[#c084fc] min-h-[0px] order-4 max-h-[821px] mr-1 max-w-[max-content] w-4 justify-between h-[max-content] outline pt-[6px] opacity-20 justify-end justify-center py-auto pr-[829%] shadow flex box-decoration-slice mb-[34%] my-auto min-w-[max-content] mb-1 font-extralight bg-[inherit]" >    
                      { ( isSubmitting ) 
                             ? ( <div style={{width :' 42.10px  '    ,    marginTop :"3.91px "  }} className='drop-shadow shrink h-3 object-scale-down my-[min-content] items-end drop-shadow opacity-95 shrink mr-[15%] pt-[max-content] mr-0 ml-0 hover:-rotate-6 ml-[-148%] min-h-[px] h-max py-[undefined] pl-2 block my-[21%] content-start mx-[px] block hover:text-white pt-2 justify-start pr-0'> <Loader2 color='rgba(26  ,199,223, 1)' size={17}className="pl-[16px] outline font-normal pr-px z-30 pt-[33px] mr-[375%] m-auto p-[223%] max-w-[min-content] flex text-[#f8fafc] object-fill outline my-[0px] my-1 mx-[435px] max-w-[undefined] block outline m-[-0px] py-[375px] pl-[max-content] m-0 order-last drop-shadow border w-[px] animate-spin content-baseline order-[9] shrink right-[undefined]" style={{width :"min-content ", background: " #cffafe  ", verticalAlign :'text-bottom', margin:' auto '  }}   />  </div>)
                             : (<button disabled={!inputValue.trim()||isSubmitting||requestState!=='idle'||isSubmittingRequest} 
                                   className="drop-shadow mr-0 pl-[54%] hover:-translate-x-px m-[undefined] min-h-full inline grow hover:font-bold hover:-translate-x-[200px] mt-[max-content] pr-0 left-[0] pb-2 block shrink border-[0px] border pt-2 border shadow box-content w-[116px] outline my-auto w-3 min-w-[px] drop-shadow object-right top-[-444%] right-[undefined] pr-0 my-0 order-1 content-start mt-[11%] right-1 hover:blur shadow ml-0 right-[auto] font-normal z-0 mt-0 py-px mb-0 items-start align-baseline !py-[0] justify-self-center my-[-390px] m-auto mb-[undefined] p-1 font-mono tracking-widest text-[#71717a] h-4 mb-2 bg-[#d6d3d1] shrink w-[830%] right-[-148%] pt-[10px] items-stretch left-[min-content] ml-[min-content] grow disabled:-translate-x-0 h-8 justify-start opacity-[1]" style={{    height :"38.2866380695027px ",   background :" linear-gradient(-56deg ,rgba(25 , 148 ,128 ,0.76 ),   rgb(0  ,  53   ,97 ))"     , margin:'5.81194291px 6px ',  border: '  none',       opacity:' 1.5'    , borderRadius:'  13px', cursor: ' pointer',      flex: ' 2 92   % ', display :"flex"  ,   alignItems :'   center   ',     boxShadow:"  0   0    20px rgba(5    ,  215, 178  , 0.40) ", outline:"none"}}>   <Send size={20} className="w-[min-content] outline h-[264px] pb-1 order-0 m-[auto] drop-shadow drop-shadow mt-[0px] p-[25%] p-[none] py-[-151px] font-thin pr-[11%] p-[438px] drop-shadow p-px z-[60]"   style={{margin :" auto"  , padding:"0 ",    height:'  20px'     ,    width:' min-content  ' ,  transform :"translateY( 1px) " ,        opacity: ".99 ",        verticalAlign :"   top ", fill: '  rgb(215   ,255,   248)',      color:" rgba(169 ,248 ,  238  ,.48 )  "  }}/>  </button>)
                          }
                     </div>   
                 </div> 

               </>
             )} 
        </div>

      </motion.div>
      
      {/* 🚀 O TERTEMİZ İZOLE - İSİMSİZ BOMBOS CALENDAR ÇEKİM İFREM! DÜN KİLİ GİBİ ...   */  }
      {showCalendly && (
         <div className="fixed overflow-hidden flex bg-transparent right-0 p-[221px] max-w-sm right-[112px] min-w-min shadow py-0 mb-[undefined] pr-[max-content] pb-0 sm:pt-[min-content] flex p-[20px] object-cover sm:content-start w-5 pr-1 outline my-[298px] pr-[-839%] grow mt-0 border opacity-[none] align-baseline pb-[244px] sm:min-w-fit mb-[none] max-h-min items-end max-w-max pb-[220px] pb-1 flex z-[71px] object-[min-content] left-[394px] order-[last] p-[105px] border drop-shadow items-center min-w-8 py-px block pb-[80px]" style={{  margin: "0 " , left:'0', width :' 100%',zIndex:"302521", top: '  0' ,        background:'  rgba(30,30,42, .920)'     , height :'100vh', justifyContent :"  center" ,         minWidth: "   auto ",        bottom: '0',        flexDirection :  " column  ", position:"fixed"}} 
             onClick={(eN59__) => {  setShowCalendly(false) }  } >  

              <div  className='z-[5543] min-w-0 right-[auto] min-w-[max-content] min-h-[min-content] h-8 align-text-bottom drop-shadow grow shrink right-[36px] bg-sky w-auto text-current p-[max-content] sm:p-px items-center flex pt-0 right-[494px] block top-[undefined] top-[260px] pl-[max-content] flex border max-w-sm pl-2 shadow drop-shadow bg-green-200 mt-1 pb-[5px] inline left-5 object-none py-1 mr-[601px] w-[545%] flex mr-[none] border pb-[490%] right-1 hover:-translate-x-1 items-start text-justify pl-3 text-current w-[0]'style={{ height: "45.18663806px " ,width : ' 100vw ' ,         boxSizing :" content-box", maxWidth: " 980px" , alignContent:"flex-end"  , borderRadius :" 22px" , backgroundColor:" rgb(37  , 48,    63  )  ", justifyContent :'center  ',         margin:  "   24px   0px " ,           display :"  flex",          minHeight: 'min-content'}}
                 onClick={(KILVNTN99)=>  KILVNTN99.stopPropagation()}> 
               
               <div style={{    padding:' 5px   12px   7.30px  5px ',   background: ' none ',          display: " flex"}}className='right-[max-content] m-0 bg-[#A6ACDB] right-[-624px] pl-[undefined] font-thin pr-1 outline !w-1 order-[13px] right-2 mt-[none] text-rose  mx-[190px] m-1 order-[0px] order-[undefined] pt-[5px] mb-[66%] pl-[403%] items-end content-center shrink min-w-6 my-[566%] h-2 mr-[auto] pr-[-0%] border p-[px] pl-[845px] hover:-rotate-[px] text-fuchsia order-1 self-end inline top-[385%] w-8 pt-[32px] sm:w-[94%] bg-[top] text-emerald mb-[0px]' >
                    <span onClick={() => setShowCalendly(false) }   style={{ width:" fit-content", letterSpacing:" 1.5412530182603px ",    boxShadow :"   0    0 5px    black"   , borderRadius:"  14px ", alignContent:'    center ',fontStretch :'   semi-expanded ', padding:'   8.520px    11.13945415px'    ,          border :'   0px  inset     red'  , background :" #06090e"    , margin :'    0    ',       fontWeight:'512 '    ,color:"  rgba(141, 150    ,163   ,1 )  " , display : " flex   ",     cursor :'    pointer', fontSize :' 11.233px',      lineHeight:'     22.3616px '  }}className="bg-[#242c22] my-0 sm:pt-[44px] opacity-1 bg-[bottom] pt-2 grow pb-[87%] text-[#4d8ab5] left-[-0px] opacity-[none] align-baseline !py-[0] pr-0 left-[0] mr-[undefined] mb-[0]  drop-shadow mb-0 w-2 drop-shadow shadow p-[457px] top-[auto] block drop-shadow py-[11px] block sm:mb-[0] grow flex flex bg-teal font-extralight h-3 mb-[22%] sm:mr-3 border-[max-content] flex max-h-[821px] my-auto m-px justify-between h-[36px] outline-gray ml-px shadow my-1 min-w-[max-content] order-1 inline h-[auto] justify-items-stretch" > GERI DOON_ {/** BU KAPANIS KAPISI ESKİ SACMALIGA GERII DONMEDI!!.. BİZİM!! .. **/}  </span> 
                </div> 

             <div className="z-1 shadow font-bold text-center m-1 w-[905px] h-3 mr-[max-content] order-none bg-[#74dfa9] my-[-701px] drop-shadow object-[105px] items-stretch left-[min-content] ml-[0px] order-[1325px] font-sans pb-[px] pl-[min-content] left-[-0px] py-[min-content] mt-[-514%] align-top bg-purple right-[max-content] mt-[-943%] justify-start py-[undefined] absolute border-[#fca5a5] h-0 items-start mx-[-557px] bg-[padding-box] left-[-115px] mr-[375%] py-[889px] justify-between z-1 absolute pl-[undefined]"   style={{width:'95% '   , padding:" 2px  ",        boxShadow :' 0    -3.3211px   12px rgba(6   ,9   ,   15   , .10) inset ',         border: '1.240581px solid rgb(50  ,  66 ,  86) '     ,   height :' 86vh  '   ,        flex:'   none ' , borderRadius: "22px "   ,      marginBottom : '   15px',          margin :  " 0px      2.128456041695%  ",overflow: ' hidden   '}}>     

              {/* URL DENETIMi; BURAYAA A C C !! NAME EKLEDİYOMUU YHUU? SİT SİT - HAYYRİ..!! SADE LINK  !! */}
                   <iframe  src="https://cal.com/novaotomasyon"title='Randevumuz Sistemi Panel Goruntuleysi...'className='bg-neutral py-[304px] z-[0] bg-[#fbbf24] right-px mx-[min-content] p-[px] pl-px text-[#dc2626] sm:mb-[131%] flex mx-[px] w-6 opacity-[undefined] top-auto pb-0 right-0 z-1 p-0 sm:py-3 outline border content-end z-[45] content-start h-[169px] font-extrabold max-h-[826px] ml-0 inline mb-[444px] hover:translate-y-[-undefined] content-start w-[329px]  ml-[px] object-cover bg-auto pl-[585px] w-2 pt-[187px] content-start border right-[0px] w-full min-h-[0px] pb-px grow bg-margin-box pt-[min-content]'
                       loading="eager" sandbox='allow-top-navigation allow-scripts allow-forms allow-same-origin allow-popups'  referrerPolicy='strict-origin-when-cross-origin' allow="microphone; display-capture;" allowFullScreen={true} 
                      style={{  height :"99%  "  ,         minHeight :" 452px ",  marginTop :"0px  ",      zIndex:"1 ",    padding :" 3px ", borderRadius:'   18px ', backgroundColor: '  rgb(255 , 255  ,  255 )   ', border:"none "  ,        width:'  100%   ',   margin :' 5.340px   auto    1px     '}}>    </iframe> 
             </div> 
              
           </div>   
         </div>
      )}
    </>
  );
}
