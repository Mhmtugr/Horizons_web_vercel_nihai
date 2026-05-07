import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Merhaba! Ben Nova Teknoloji Otomasyon AI Asistanıyım. İşletmenizi nasıl otonom hale getirebiliriz? Size hangi konuda yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStep, setChatStep] = useState('initial');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = '';

      if (chatStep === 'initial') {
        const lowerMsg = userMsg.toLowerCase();
        if (lowerMsg.includes('fiyat') || lowerMsg.includes('ücret')) {
          botReply = 'Fiyatlandırmalarımız işletmenizin ihtiyaçlarına göre kurumsal projelendirme ile belirlenmektedir. Size özel bir analiz yapabilmemiz için iletişim bilgilerinizi (E-posta ve Telefon) paylaşabilir misiniz?';
          setChatStep('lead_capture');
        } else if (lowerMsg.includes('hizmet') || lowerMsg.includes('neler')) {
          botReply = 'Otonom Üretim, RPA Süreç Otomasyonu, B2B Küresel Müşteri Radarı ve Özel AI Modeli Eğitimi gibi alanlarda hizmet veriyoruz. Detaylı bilgi için 15 dakikalık ücretsiz bir keşif toplantısı ayarlayalım mı?';
          setChatStep('calendly_pitch');
        } else {
          botReply = 'Anlıyorum. Bu konuda uzman ekibimiz size çok daha detaylı yardımcı olabilir. Hızlıca bir tanışma toplantısı organize edebilmemiz için e-posta adresinizi bırakabilir misiniz?';
          setChatStep('lead_capture');
        }
      } else if (chatStep === 'lead_capture') {
        botReply = 'Teşekkürler! Bilgilerinizi kaydettim. Uzmanlarımız en kısa sürede sizinle iletişime geçecek. Beklerken hizmetlerimiz sayfasını incelemek ister misiniz? Ya da "Gerçek kişiye bağlan" diyerek canlı destek talep edebilirsiniz. 🚀';
        setChatStep('general');
      } else if (chatStep === 'calendly_pitch') {
        botReply = 'Harika! Aşağıdaki linkten doğrudan takvimimizden uygun bir zaman seçebilirsiniz:\n\n🔗 https://calendly.com/novateknoloji/kesif\n\nBaşka bir sorunuz varsa yanıtlamaktan memnuniyet duyarım.';
        setChatStep('general');
      } else {
        if (userMsg.toLowerCase().includes('gerçek kişi') || userMsg.toLowerCase().includes('müşteri temsilcisi')) {
          botReply = 'Talebinizi aldım. Sizi gerçek bir danışmanımıza yönlendiriyorum. Lütfen hattan ayrılmayın... (Bu bir demo asistanıdır, lütfen iletişim sayfasını kullanın).';
        } else {
          botReply = 'Bu değerli sorunuzu not aldım. Şu anda sadece %20 kapasite ile çalışan bir AI asistanıyım, işletmenizde tam kapasite çalıştığımda neler yapabileceğimi hayal edin! Başka nasıl yardımcı olabilirim?';
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', text: botReply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] z-[60] flex flex-col glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Header */}
          <div className="px-4 py-4 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Nova AI Asistan</h3>
                <p className="text-xs text-primary font-medium">Çevrimiçi</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-secondary/20' : 'bg-primary/20'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-secondary" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-secondary text-secondary-foreground rounded-br-none' 
                      : 'bg-muted text-foreground rounded-bl-none border border-white/5'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-muted border border-white/5 flex items-center space-x-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-primary/60" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-primary/60" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-primary/60" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background/50 border-t border-white/10">
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mesajınızı yazın..."
                className="bg-muted border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-10"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim() || isTyping}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-muted-foreground">Nova AI Asistanı tarafından desteklenmektedir</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AIChat;