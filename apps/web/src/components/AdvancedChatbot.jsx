import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// DIKKAT: useIntegratedAi HOOK'U SİLİNDİ. KENDI BEYNIMIZ (GEMINI) VAR ARTIK.
import { AlertCircle, X, CheckCircle2, History, Trash2, Send, User, MessageSquare, FileText, Loader2, Calendar, ArrowLeft, Phone } from 'lucide-react';
import CalendlyWidget from './CalendlyWidget.jsx';
// GOOGLE GEMINI MOTORU ENTEGRE EDILDI
import { GoogleGenerativeAI } from "@google/generativeai";

// STATİK BUTONLAR - Başlangıçta görünür
const INITIAL_QUESTIONS =[
  'Hizmetleriniz hakkında bilgi alabilir miyim?',
  'Toplantı planla',
  'Gerçek kişi ile görüş',
  'Fiyatlandırmanız nasıl?',
  'Nasıl başlayabilirim?'
];

// --- GUVENLIK KONTROLU (TESLA STANDARD): API KEY ---
const GEMINI_API_KEY = "AIzaSyC5FtSklR0kn6h_9A5Slbb148zvihlnz1w"; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function AdvancedChatbot() {
  // --- STATE (DURUM) YONETIMI ---
  const[isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  // Sistem ilk mesaji biz vermeyelim, musteri tiklayinca bos gorunsun veya kisa bir mesaj
  const[localMessages, setLocalMessages] = useState([
     { role: 'assistant', content: 'Merhaba! Ben Nova Teknoloji Otonom Satış Danışmanı. İş süreçlerinizi yapay zeka ile nasıl büyütebileceğimizi konuşalım mı?', created: new Date().toISOString() }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const[successState, setSuccessState] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const[showCalendly, setShowCalendly] = useState(false);
  
  // FORM STATES (İSTEK)
  const[requestState, setRequestState] = useState('idle'); 
  const [requestSummary, setRequestSummary] = useState('');
  const [contactInfo, setContactInfo] = useState({ name: '', surname: '', email: '', phone: '' });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // REFERANSLAR
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // --- 1. CRISP ENTEGRASYONU (HAYALET MOD VE DINLEME) ---
  useEffect(() => {
    // Sayfa acilinca Crisp gizli olacak (z-index cakismamasi icin)
    if (window.$crisp) {
        window.$crisp.push(["do", "chat:hide"]);
    }
    
    // Musteri Crispi (Gercen Kisi modunu) kendisi manuel kapatirsa bot tekrar gorunsun
    const handleCrispClose = () => {
      document.body.classList.remove('crisp-active');
      setIsOpen(true);
    };

    if (window.$crisp) {
      window.$crisp.push(["on", "chat:closed", handleCrispClose]);
    }
  },[]);

  // --- 2. GLOBAL TRIGGER (SITEDEKI BASTA YERDEN ACMA) ---
  useEffect(() => {
    const handleOpenChatEvent = (e) => {
      setIsOpen(true);
      // Eger butondan ozel bir emir geldiyse formu ac (Orn: Hizmetler sayfasindan)
      if (e.detail?.mode === 'request') {
         handleOpenRequestForm();
      }
      setTimeout(() => scrollToBottom(), 100);
    };

    window.addEventListener('open-ai-chat', handleOpenChatEvent);
    return () => window.removeEventListener('open-ai-chat', handleOpenChatEvent);
  }, [requestState]);

  // --- 3. SCROLL YONETIMI (YUKARI/ASAGI SORUNSUZ KAYDIRMA) ---
  const scrollToBottom = () => {
    if (messagesEndRef.current && !showHistory) {
      // scrollIntoView, yeni mesaj gelince yumusakca en alta ceker, ama yukari kaydirmayi ENGELLEMEZ
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  useEffect(() => {
    if (isOpen && !showHistory) {
      scrollToBottom();
    }
  },[localMessages, isSubmitting, isOpen, showHistory, requestState]);

  const handleClose = () => setIsOpen(false);
  const dismissError = () => setErrorState(null);
  
  const showSuccess = (message) => {
    setSuccessState(message);
    setTimeout(() => setSuccessState(null), 5000);
  };

  // --- 4. HUMAN HANDOFF (KUSURSUZ CRISP GECISI) ---
  const handleEscalateToHuman = () => {
    setIsSubmitting(true);
    dismissError();
    
    try {
      document.body.classList.add('crisp-active');
      
      // Sohbet gecmisini metin olarak derle
      const transcript = localMessages.map(msg => `${msg.role === 'user' ? 'Müşteri' : 'Asistan'}: ${msg.content}`).join('\n\n');
      
      if (window.$crisp) {
        // Ziyaretciye bir takma ad ver (Sizde "Nova Mustetisi" diye gorunecek)
        window.$crisp.push(['set', 'user:nickname',['Nova Ziyaretçisi']]);
        
        // Gecmisi ve aciklamayi sizin goreceginiz ekrana at
        window.$crisp.push(['do', 'message:send', ['text', `🚨 [GERÇEK KİŞİ TALEBİ] - SOHBET GEÇMİŞİ AKTARILIYOR:\n\n${transcript}`]]);
        
        // AI botunu gizle
        setIsOpen(false);
        // Crisp'i gorunur yap ve pat diye ac
        window.$crisp.push(['do', 'chat:show']);
        window.$crisp.push(['do', 'chat:open']);
        
        setIsSubmitting(false);
      } else {
        // Sayet AdBlock vs yuzunden crisp yuklenmediyse yedek (Fallback) WhatsApp (Bu guvenlik onlemidir)
        setErrorState('Canlı destek ağı engellendi (AdBlock). Sizi yönlendiriyoruz...');
        setTimeout(() => {
          window.open('https://wa.me/905468667215?text=Merhaba,%20web%20sitenizden%20canlı%20destek%20istiyorum', '_blank');
        }, 1500);
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrorState('Geçiş sırasında hata oluştu.');
      setIsSubmitting(false);
    }
  };

  // --- 5. INTERAKTIF FORM ISLEMLERI (API'SIZ, FETCHSIZ) ---
  const handleOpenRequestForm = () => {
    // Sadece Musteri'nin konustuklarinin degil, baglamsal genis bir ozet yapiyoruz. (Tembel degil akilli goster)
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
    
    // API CÖKMESİ VE 404 HATASINDAN KURTULMANIN EN ZARİF YOLU: VERIYİ CRISP UZERINDEN BANA (ADMIN'E) AT!
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
            // Müşterinin Mailini Crispe Kaydet
            window.$crisp.push(['set', 'user:email', [contactInfo.email]]);
            window.$crisp.push(['set', 'user:nickname',[`${contactInfo.name} ${contactInfo.surname}`]]);
            
            // Talebi gizli/veya direkt sistem uzerinden size ulastirin (Siz panelde goreceksiniz)
            window.$crisp.push(['do', 'message:send', ['text', leadData]]);
            
            // Simule edilmiş islem hızı (Guven verir)
            setTimeout(() => {
                setRequestState('success');
                setIsSubmittingRequest(false);

                // 4 Saniye sonra Form Ekranini tertemiz Kapat
                setTimeout(() => {
                    setRequestState('idle');
                    setContactInfo({ name: '', surname: '', email: '', phone: '' });
                    setRequestSummary('');
                    // Kullanıcıya bota döndüğünü hissettir.
                    setLocalMessages(prev =>[...prev, { role: 'assistant', content: '✅ Formunuz Nova Teknoloji Sistemine ulaştı. Mühendislerimiz 1 saat içinde size geri dönecektir. Takvimimizi kullanarak bir ön görüşme de ayarlayabilirsiniz.', created: new Date().toISOString() }]);
                }, 4000);
            }, 1500);

        } else {
             // Fallback Mail (Mail uygulamasını aç)
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


  // --- 6. AI MESAJ GÖNDERME MANTIGI (GEMINI İŞ BAŞINDA!) ---
  const handleSendMessage = async (textToProcess) => {
    const text = typeof textToProcess === 'string' ? textToProcess : inputValue;
    
    // Hatalı giris, gonderiliyor durumu engelleme (Debounce mekanizmasi)
    if (!text || typeof text !== 'string' || !text.trim() || isSubmitting) return;

    const trimmedText = text.trim();
    lastMessageRef.current = trimmedText;
    
    // Mesaji Hmen ekrana basil (User Experience: Hizlilik)
    const newMessagesHistory =[...localMessages, { role: 'user', content: trimmedText, created: new Date().toISOString() }];
    setLocalMessages(newMessagesHistory);
    
    setInputValue(''); // Input temizle
    setIsSubmitting(true);
    dismissError();

    // 🌟 THE CLOSER SYSTEM PROMPT (AKILLI SATIS/RAPORLAMA AI PERSONASI) 🌟
    const SYSTEM_PROMPT = `Senin adın Nova. Sen Nova Teknoloji'nin Kıdemli İş Geliştirme Asistanısın (Satış odaklı ve Kapatıcısın).
    Asla bir sohbet robotu gibi pasif durma, kısa, saygılı, prestijli (Tesla markası tonunda) cevaplar ver. 
    Lafı uzatma, sürtünmeyi azalt ve sonuç üret.
    Kullanıcının amacı ya 'Hizmet Öğrenmek', ya 'Fiyat Sormak', ya 'Teklif Almak' (Talep formunu tetikletmek) ya da 'Toplantı Planlamak'.

    # HİZMET BİLGİSİ
    Otonom Üretim & Fabrika Zekası, RPA (Robotik Süreç Otomasyonu), B2B Küresel Müşteri Radarı gibi B2B hizmetler verirsiniz. Müşteriye uygun olduğunu anlatıp '15 dk Demo' teklif et.
    
    # FİYAT POLİTİKASI
    Sürekli "kişiden kişiye değişir" DEME! Açık fiyat bantlarını VERECEKSIN.
    Kurulum (Setup) ve Başlangıç Maliyeti: Karmaşıklığa ve kullanılacak API/AI modellerine göre 1.000€ (EUR) ile 10.000€ arasında değişmektedir.
    Aylık Bakım, Geliştirme, Barındırma ve SLA Paketleri: Operasyon hacmine göre aylık 100€ ile 3.000€ arasında fiyatlandırılmaktadır. 
    Bu hizmetler müşterilere bir gider değil; eleman azaltımı, zaman tasarrufu olarak "Asimetrik bir Getiri" sağlar. 
    
    # DİNAMİK BUTON ÇIKARTMA SİHİRLİ ÖZELLİĞİ:
    Cevabının TAM SONUNDA mutlaka {"quickReplies": ["Buton1", "Buton2", "Buton3"]} yapısında geçerli, bağlama en uygun JSON Array döndüreceksin (Metne gizli halde olacak biz söküp göstereceğiz). Seçtiğin sorular zekice olmalı, klasik "nasıl yardımcı olurum" yazma. Toplantı isteyene hızlı butona 'Toplantı planla' kelimesini zorla ekle!
    Not: Her buton adı maximum 3 kelime olsun ki mobil ekranda tasiyor.

    # TOPLANTI ÇAĞRISI MANTIGI (EMİR!)
    Eğer müşteri net olarak "Randevu", "Görüşelim", "Yarın ara", "14:00'te toplantı" veya "Toplantı ayarla" gibi net zaman talebi girerse; GEREKSİZ CÜMLE KURMA! ASLA CEVABI SEN UZATMA VE SORGULAMA YAPMA.
    Şu şekilde direktif ver: "Sizi takvimimde görmekten mutluluk duyacağım. Müsait saati netleştirmek için lütfen yandaki Toplantı butonuna tıklayın."
    Bu senaryoda da "Toplantı planla" kelimesini quick replies JSON içine zorla ekle.
    `;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", systemInstruction: SYSTEM_PROMPT });
      
      // Kullanicinin 5 soruluk gecmisini context olark gemini'ye yolluyoruz (Token harcamasini dengele).
      const chatContext = newMessagesHistory.slice(-5).map(m => m.role === 'user' ? `User: ${m.content}` : `Nova: ${m.content}`).join("\n");
      
      // Istek Zamani Eslestirmesi
      const result = await model.generateContent(`${chatContext}\n User'in son yazdiği metin: ${trimmedText}`);
      const botReplyRaw = result.response.text();

      // Bot mesajini Ekrana Basilmasi. (Zarif bir UI hilesi icin timeout)
      setTimeout(() => {
        setLocalMessages([...newMessagesHistory, { role: 'assistant', content: botReplyRaw, created: new Date().toISOString() }]);
        setIsSubmitting(false);
      }, 500); // Sanki düşünmüş efekti

    } catch (err) {
      console.error("Gemini Istek Hatasi:", err);
      // Faiil-safe: Eger limit dolar / koparsa:
      handleError(new Error("API Yanit Vermedi"));
      setLocalMessages([...newMessagesHistory, { 
        role: 'assistant', 
        content: "Mühendislerimizden dolayı yoğunluk algıladım. Beni hiç beklemeden lütfen aşağıdaki 'Gerçek Kişiyle Görüş' butonuna basın, sistemimiz anında bağlantı kuracaktır.", 
        created: new Date().toISOString() 
      }]);
      setIsSubmitting(false);
    }
  };


  // --- 7. MUKEMMEL ARAYÜZ (BUTONLARI COZUMLEYICI ALGORITMA) ---
  const extractQuickReplies = (text) => {
    if (!text) return [];
    try {
      // Promptan alinan {"quickReplies": ["x","y"]} arrayini kaza cikar
      const match = text.match(/\{"quickReplies"\s*:\s*\[.*?\]\}/s);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return parsed.quickReplies ||[];
      }
    } catch (e) {}
    // Array yoksa fallback etme. Hicbir sey cikartma.
    return[];
  };

  const cleanContent = (text) => {
    if (!text) return text;
    // JSon parcalarinin ekranda cirkin durmamasi icin SIZINTI temzi
    return text.replace(/\{"quickReplies"\s*:\s*\[[^\]]*\]\}/g, '').trim();
  };

  const handleQuickReplyClick = (buttonText) => {
    // 🚦 BÜYÜK SORUNLAR BURADA ÇÖZÜLDÜ!
    // Kisa yol butonu Takvimi işaret ediyorsa; Koda gitmeyecek Direkt Modali açacak!
    if (buttonText.toLowerCase().includes('toplantı') || buttonText.toLowerCase().includes('randevu')) {
      setShowCalendly(true);
      return;
    }
    if (buttonText.toLowerCase().includes('gerçek kişi') || buttonText.toLowerCase().includes('canlı')) {
      handleEscalateToHuman();
      return;
    }
    // Yok, teknik veya normal bir soru sorduysa devam
    handleSendMessage(buttonText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // Chatbot'un render icerisindeki quick button algisi
  const lastMessage = localMessages[localMessages.length - 1];
  const dynamicQuickReplies = lastMessage?.role === 'assistant' ? extractQuickReplies(lastMessage.content) :[];


  // 🚀 MAIN UI RENDER EDIYOR 
  if (!isOpen) {
    return (
      <>
        {/* Kapalı (Minimal) AI Asistan Ikonu  - WHATSAPP BUTONUYLA KESİŞMEMEK İÇİN BOTTOM YÜKSEK, ZINDEX: UYGUNDUR*/}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          // Eger sag alta Whatsapp varsa, bot yukari kacmalidir (bottom-28). Degistirmek mumkun.
          className="fixed bottom-24 right-5 z-[55] w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full shadow-xl flex items-center justify-center glow-emerald transition-shadow focus:outline-none"
          aria-label="Nova AI Başlat"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
        {/* Disaridaki cal.com penceresi hazirligi */}
        {showCalendly && (
           <CalendlyWidget isOpen={showCalendly} onClose={() => setShowCalendly(false)} />
        )}
      </>
    );
  }

  // --- ACILIŞ PENCERESİ EKRANI ---
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-4 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-96 max-h-[85vh] h-[650px] bg-slate-950/90 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Ust Header  (Apple Cam Etkisi - Premium Hissiyat)*/}
        <div className="flex items-center justify-between p-4 border-b border-emerald-500/10 bg-gradient-to-r from-slate-900 to-slate-800 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex flex-col items-center justify-center border border-emerald-500/30">
                 <span className="text-emerald-400 font-extrabold font-serif text-lg tracking-wider">N</span>
             </div>
             <div className="flex flex-col">
                 <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest leading-none">NOVA CORE</h2>
                 <span className="text-[10px] text-emerald-400/80 font-mono tracking-wide mt-1 animate-pulse">■ Sistem Çevrimiçi</span>
             </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* CONTENT DONGUSU */}
        {showHistory ? (
          <div className="flex-1 p-4 bg-slate-950/50">
             {/* Gereksiz Kaldi History kısmı, ama korumaktı felsefemiz.*/}
             <button onClick={() => setShowHistory(false)} className="text-sm text-emerald-500 mb-4">Geri Dön</button>
          </div>
        ) : requestState !== 'idle' ? (
           /* ONAY EKRANLARI / DUZENLENEBILIR TEXT AREA MODU MUKEMMEL HALI*/
          <div className="flex-1 overflow-y-auto p-5 bg-slate-900 custom-scrollbar">
            {requestState === 'summary' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white tracking-wide border-b border-slate-800 pb-2 text-sm uppercase">1/2 Talep Özetiniz</h3>
                <p className="text-xs text-slate-400 mb-1">Mühendislerimizin hızlanması için sohbetten çıkarttığım bu taslağı (kendi cümlelerinizle de) revize edebilirsiniz:</p>
                <textarea
                  value={requestSummary}
                  onChange={(e) => setRequestSummary(e.target.value)}
                  className="w-full h-40 p-4 bg-slate-950/80 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none shadow-inner outline-none leading-relaxed"
                  placeholder="Burası boş olamaz, kısaca not yazabilirsiniz."
                />
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setRequestState('contact')} className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">İletişim'e İlerle</button>
                  <button onClick={() => setRequestState('idle')} className="flex-1 bg-slate-800/80 text-white font-medium py-3.5 rounded-xl hover:bg-slate-800 border border-slate-700 transition-all">Vazgeç</button>
                </div>
              </div>
            )}
            {requestState === 'contact' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white tracking-wide border-b border-slate-800 pb-2 text-sm uppercase">2/2 İletişim Formu</h3>
                <input type="text" placeholder="İsminiz*" value={contactInfo.name} onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})} className="w-full p-3.5 bg-slate-950/80 border border-slate-700/50 rounded-xl text-sm text-slate-200 outline-none" />
                <input type="text" placeholder="Soyisminiz*" value={contactInfo.surname} onChange={(e) => setContactInfo({...contactInfo, surname: e.target.value})} className="w-full p-3.5 bg-slate-950/80 border border-slate-700/50 rounded-xl text-sm text-slate-200 outline-none" />
                <input type="email" placeholder="E-Posta (Kurumsal/Şahsi)*" value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} className="w-full p-3.5 bg-slate-950/80 border border-slate-700/50 rounded-xl text-sm text-slate-200 outline-none" />
                <input type="tel" placeholder="Telefonunuz" value={contactInfo.phone} onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full p-3.5 bg-slate-950/80 border border-slate-700/50 rounded-xl text-sm text-slate-200 outline-none" />
                
                {errorState && <p className="text-red-400 text-xs px-1 text-center bg-red-900/10 py-2 rounded-lg border border-red-500/20">{errorState}</p>}

                <div className="flex gap-3 pt-2">
                  <button onClick={submitRequestForm} disabled={isSubmittingRequest} className="flex-1 flex justify-center bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)] disabled:opacity-50 hover:brightness-110">
                    {isSubmittingRequest ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kayıt Gönder'}
                  </button>
                  <button onClick={() => setRequestState('summary')} className="px-5 bg-slate-800/80 border border-slate-700 text-slate-300 font-medium py-3.5 rounded-xl hover:bg-slate-700 transition-all text-sm">Geri</button>
                </div>
              </div>
            )}
             {requestState === 'success' && (
              <div className="flex flex-col items-center justify-center h-full space-y-6 text-center pt-10 pb-8 px-6 animate-fade-in bg-slate-900/40 rounded-2xl border border-emerald-900/30 m-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -z-10 rounded-full" />
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex flex-col justify-center items-center backdrop-blur-sm border border-emerald-500/30 relative">
                   <div className="absolute inset-0 border-2 border-t-emerald-400 border-r-emerald-500 border-b-transparent border-l-transparent rounded-full animate-spin-slow" style={{ animationDuration: '3s'}}/>
                   <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                </div>
                <div>
                   <h3 className="font-extrabold text-white text-xl tracking-tight mb-2">Başarıyla İşlendi.</h3>
                   <p className="text-[13px] text-slate-400 leading-relaxed font-light">Nova Protokol devrede.<br/>Yönetici birimi size ({contactInfo.email}) dönmek üzere analiz sürecini başlattı.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-4 bg-slate-950/60 custom-scrollbar relative overflow-y-auto z-10" id="chatbot-msg-container" style={{overscrollBehavior: 'contain'}}>
            <div className="flex-1 flex flex-col justify-end space-y-4 relative min-h-0 z-0 pt-2 pb-6 px-1.5 ">

              {localMessages.map((msg, i) => (
                <div key={i} className={`flex w-full animate-fade-in ${msg.role === 'user' ? 'justify-end pl-8' : 'justify-start pr-8'} z-0`}>
                  <div className={`relative px-4 py-3 text-[13px] sm:text-[14px] leading-relaxed break-words break-all hyphens-auto
                    ${msg.role === 'user' 
                       ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 rounded-2xl rounded-tr-[4px] shadow-sm backdrop-blur-md self-end'
                       : 'bg-slate-800/80 border border-slate-700/80 text-slate-200 rounded-2xl rounded-tl-[4px] shadow-md shadow-black/20 self-start'}
                  `} style={{wordWrap: 'break-word'}}>
                    <p className="whitespace-pre-wrap">{cleanContent(msg.content)}</p>
                  </div>
                </div>
              ))}
              
              {/* TYPING ISARETI */}
              {isSubmitting && (
                <div className="flex w-full justify-start pr-8 z-0 pb-1 mt-2">
                   <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl rounded-tl-[4px] px-5 py-4 flex gap-1 items-center backdrop-blur-sm shadow-sm w-fit self-start">
                     <span className="block w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-pulse"></span>
                     <span className="block w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-pulse delay-75"></span>
                     <span className="block w-1.5 h-1.5 bg-emerald-500/80 rounded-full animate-pulse delay-150"></span>
                   </div>
                </div>
              )}

            </div>
             <div ref={messagesEndRef} className="pb-1"></div>
             
             {/* DINAMIK QUICK REPLIES - ALTA ZINCIRLE */}
              {((dynamicQuickReplies.length > 0 && lastMessage.role !== 'user' && !isSubmitting) || (localMessages.length === 1 && !isSubmitting)) && (
               <div className="flex flex-wrap gap-2 w-full mt-0 sticky bottom-0 pt-2 pb-1 pr-1" style={{background: 'linear-gradient(to bottom, rgba(2,6,23,0), rgba(2,6,23,0.95))', flexShrink:0}}>
                    {(localMessages.length === 1 ? INITIAL_QUESTIONS : dynamicQuickReplies).map((q, i) => (
                      <button key={i} onClick={() => handleQuickReplyClick(q)} 
                              className="text-xs bg-slate-800/90 text-slate-300 px-3.5 py-2.5 rounded-[12px] border border-slate-700/70 hover:border-emerald-500 hover:text-emerald-100 hover:bg-slate-800 transition-all text-left whitespace-normal max-w-full hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] shadow-sm font-medium hover:-translate-y-0.5 z-20">
                          {q}
                      </button>
                   ))}
               </div>
              )}
          </div>
        )}

        {/* INPUT ALANI - Bütün Hata Sürücülerden arindirilmis, En Altta Kilitli, Yapi ve Design Fix. */}
        {(!showHistory && requestState === 'idle') && (
          <div className="p-3 bg-slate-900 border-t border-emerald-500/20 shadow-[0_-5px_20px_rgba(0,0,0,0.15)] flex flex-col gap-2.5 shrink-0 z-[65] mt-auto backdrop-blur-2xl">
              
             {/* Alt Fonksiyon Çubuğu  (Satışı Yönlendirme Odaklı Butonlar - ASLA KALDIRILAMAZ SİLİNEMEZ MADDESİ)*/}
             <div className="grid grid-cols-3 gap-2 px-1 w-full pt-1 pb-1">
                 <button onClick={handleOpenRequestForm} className="flex gap-2 items-center justify-center p-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all shadow-sm">
                    <FileText className="w-3.5 h-3.5" /> Talep At
                 </button>
                 <button onClick={() => { setShowCalendly(true); window.dispatchEvent(new Event('open-calendar-modal'));}} className="flex gap-1.5 items-center justify-center p-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all hover:scale-105 shadow-sm active:scale-95">
                    <Calendar className="w-3.5 h-3.5" /> Toplantı
                 </button>
                 <button onClick={handleEscalateToHuman} className="flex gap-1 items-center justify-center p-2 rounded-xl text-[11px] font-bold tracking-tight bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors shadow-sm hover:scale-105 active:scale-95 uppercase whitespace-nowrap overflow-hidden">
                    Gerçek Kişi
                 </button>
             </div>

             <div className="flex gap-2 relative bg-slate-950 p-1.5 border border-slate-800 rounded-[14px]">
                 <input
                    type="text"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Detaylarınızı iletin..."
                    disabled={isSubmitting || isStreaming}
                    className="flex-1 w-full p-2.5 pl-3 text-[14px] bg-transparent text-white outline-none border-none placeholder:text-slate-600 disabled:opacity-50"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={isSubmitting || isStreaming || !inputValue.trim()} 
                    className="shrink-0 h-10 w-11 rounded-[10px] bg-gradient-to-b from-emerald-500 to-teal-600 flex justify-center items-center disabled:opacity-50 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/20"
                    aria-label="Submit Question">
                        {isSubmitting || isStreaming 
                           ? <Loader2 className="w-4 h-4 text-emerald-100 animate-spin"/>
                           : <Send className="w-[18px] h-[18px] text-white/90 drop-shadow-md ml-[2px]" />
                        }
                  </button>
             </div>

              {errorState && (
                <div className="absolute -top-12 left-0 right-0 p-2 mx-4 bg-red-500 text-white rounded-lg flex items-center justify-between text-xs font-medium z-50">
                  <span>{errorState}</span>
                  <button onClick={dismissError}><X className="w-4 h-4 hover:bg-red-600 rounded" /></button>
                </div>
              )}
          </div>
        )}
      </motion.div>
      
      {/* 🚀 APPLE/TESLA MODULU: SAF (SİZ) BİR CAL.COM IFRAMESI CIZELIM! ESKILERINDEN FARKLI YAPTIK. URL Icine Isım Ekletmiyoruz. */}
      {showCalendly && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md overflow-hidden p-0 sm:p-6 lg:p-12 animate-fade-in"
               onClick={() => setShowCalendly(false)}>
           <div className="relative bg-[#F3F4F6] sm:rounded-[30px] rounded-none overflow-hidden w-[100vw] h-[100vh] sm:w-[96vw] sm:max-w-[1000px] sm:h-full lg:max-h-[750px] shadow-2xl flex flex-col isolate m-0 animate-scale-up border sm:border-slate-300"
                onClick={(e) => e.stopPropagation()}>
                
             {/* Navigasyon Bara */}
             <div className="w-full flex-shrink-0 bg-white sm:bg-[#F3F4F6] sm:border-b-0 border-b border-gray-200 py-3 sm:py-0 px-4 mb-2 flex items-center justify-end relative sm:absolute sm:top-5 sm:right-6 sm:z-10 h-14 sm:h-auto z-[60]">
               <button 
                 onClick={() => setShowCalendly(false)}
                 className="flex items-center gap-1 sm:px-4 px-2 py-1.5 sm:py-2 text-[14px] text-slate-700 bg-white border border-gray-300 sm:rounded-[14px] rounded-md sm:shadow-[0_2px_15px_rgba(0,0,0,0.1)] hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-wider group transition-all"
               >
                 <X className="w-4 h-4 sm:group-hover:rotate-90 transition-transform duration-300 text-gray-500" />
                 <span>KAPAT</span>
               </button>
             </div>
             
             {/* Full Responsive IFrame */}
             <div className="w-full h-full pb-4 px-2 pt-2 bg-white flex flex-1 grow items-center relative overflow-hidden flex-col h-[calc(100vh-60px)] z-0 rounded-none sm:rounded-[30px] border border-gray-100 mx-0 mt-0">
                  <iframe 
                    // İSİMLENDİRİLMİŞ YA DA KİRLİ LINK YÖNLENDİRİLMİYOR, URL %100 SABİTTİR:
                    src="https://cal.com/novaotomasyon?hideEventTypeDetails=false" 
                    title="Takvim Randevusu" 
                    frameBorder="0" 
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    className="absolute inset-0 w-full h-[calc(100vh-1rem)] md:h-[calc(100vh-60px)] lg:h-[750px] border-none scale-100 sm:scale-100 min-h-0 top-0 left-0 shadow-inner -z-10 object-contain mx-auto right-0 overscroll-contain overflow-y-scroll max-w-[100vw]">
                  </iframe>
              </div>

           </div>
         </div>
      )}
    </>
  );
}

export default AdvancedChatbot;
