
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnimatedText } from '@/hooks/use-animated-text';
import { useIntegratedAi } from '@/hooks/use-integrated-ai';
import { X, Send, Paperclip, Loader2, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiServerClient from '@/lib/apiServerClient';

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const getImageKey = file => `${file.name}:${file.size}:${file.lastModified}`;

const INITIAL_QUESTIONS = [
  'Hizmetleriniz hakkında bilgi alabilir miyim?',
  'Toplantı planla',
  'Gerçek kişi ile görüş',
  'Fiyatlandırmanız nasıl?',
  'Nasıl başlayabilirim?'
];

const FOLLOW_UP_QUESTIONS = [
  'Bu süreç ne kadar sürer?',
  'Hangi sektörlere hizmet veriyorsunuz?',
  'Referanslarınız var mı?',
  'Maliyet avantajı nedir?',
  'Entegrasyon süreci nasıl işliyor?'
];

export default function IntegratedAiChat() {
	const [input, setInput] = useState('');
	const [selectedImages, setSelectedImages] = useState([]);
	const { messages, isStreaming, isLoadingHistory, sendMessage, clearMessages } = useIntegratedAi();
	const messagesEndRef = useRef(null);
	const fileInputRef = useRef(null);
	
	// Request Form State
	const [requestFormState, setRequestFormState] = useState('idle'); // idle, prompt, form, submitting, success
	const [contactData, setContactData] = useState({ name: '', surname: '', email: '', phone: '' });

	const imagePreviews = useMemo(() => selectedImages.map(file => ({
		key: getImageKey(file),
		file,
		url: URL.createObjectURL(file),
	})), [selectedImages]);

	useEffect(() => () => {
		imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
	}, [imagePreviews]);

	const lastMessage = messages[messages.length - 1];
	const isLastMessageStreaming = isStreaming && lastMessage?.role === 'assistant';
	const animatedText = useAnimatedText(isLastMessageStreaming ? lastMessage.content : '');

	useEffect(() => {
		const scrollToBottom = () => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
				});
			}
		};
		scrollToBottom();
	}, [messages, isStreaming, requestFormState]);

	const handleSubmit = useCallback((e) => {
		e.preventDefault();
		const trimmed = input.trim();
		if ((!trimmed && selectedImages.length === 0) || isStreaming) return;
		setInput('');
		sendMessage(trimmed, selectedImages);
		setSelectedImages([]);
	}, [input, selectedImages, isStreaming, sendMessage]);

	const handleImageSelect = useCallback((e) => {
		const files = Array.from(e.target.files || []);
		const validFiles = files.filter(file => VALID_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE);

		setSelectedImages((prev) => {
			const uniqueFilesMap = new Map(prev.map(file => [getImageKey(file), file]));
			validFiles.forEach(file => uniqueFilesMap.set(getImageKey(file), file));
			return Array.from(uniqueFilesMap.values()).slice(0, MAX_IMAGES);
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, [fileInputRef]);

	const removeImage = useCallback((index) => {
		setSelectedImages(prev => prev.filter((_, i) => i !== index));
	}, []);

	const handleQuickAction = (text) => {
	  if (text === 'Toplantı planla') {
	    window.dispatchEvent(new Event('open-calendar-modal'));
	  } else if (text === 'Gerçek kişi ile görüş') {
	    document.body.classList.add('crisp-active');
	    if (window.$crisp) {
	      window.$crisp.push(['do', 'chat:open']);
	    }
	  } else {
	    sendMessage(text);
	  }
	};

	const handleRequestFormSubmit = async (e) => {
	  e.preventDefault();
	  if (!contactData.name || !contactData.surname || !contactData.email) return;
	  
	  setRequestFormState('submitting');
	  
	  try {
	    const summary = messages.map(m => `${m.role === 'user' ? 'Kullanıcı' : 'Asistan'}: ${m.content}`).join('\n\n');
	    
	    await apiServerClient.fetch('/send-request-form', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify({
	        conversationSummary: summary,
	        requestForm: {
	          service: 'Genel Danışmanlık / AI Çözümleri',
	          details: {
	            'Kaynak': 'AI Chatbot',
	            'Tarih': new Date().toLocaleString('tr-TR')
	          }
	        },
	        contactInfo: contactData
	      })
	    });
	    
	    setRequestFormState('success');
	    setTimeout(() => setRequestFormState('idle'), 5000);
	  } catch (error) {
	    console.error('Form submission failed:', error);
	    setRequestFormState('form'); // Revert to form on error
	  }
	};

	// Get 2 random follow-up questions
	const currentFollowUps = useMemo(() => {
	  const shuffled = [...FOLLOW_UP_QUESTIONS].sort(() => 0.5 - Math.random());
	  return shuffled.slice(0, 2);
	}, [messages.length]);

	return (
		<div className="flex flex-col h-[600px] max-w-2xl mx-auto form-container-premium p-0 overflow-hidden relative">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-border bg-card z-10 shrink-0">
				<h2 className="text-lg font-bold text-foreground flex items-center gap-2">
				  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
				  AI Asistan
				</h2>
			  {messages.length > 0 && (
				<button
					onClick={clearMessages}
					disabled={isStreaming}
					className="text-sm font-medium text-muted hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-md px-2 py-1"
				>
					Sohbeti Temizle
				</button>
			  )}
			</div>

			{/* Chat Area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar bg-background" role="log" aria-live="polite">
				{isLoadingHistory && (
					<div className="text-center text-sm text-primary py-4 flex items-center justify-center gap-2">
					  <Loader2 className="w-4 h-4 animate-spin" /> Geçmiş yükleniyor...
					</div>
				)}
				
				{messages.length === 0 && !isLoadingHistory && (
				  <div className="flex flex-col items-center justify-center h-full text-center">
				    <div className="w-16 h-16 bg-card border border-border rounded-full flex items-center justify-center mb-4 shadow-sm">🤖</div>
				    <p className="text-muted mb-6">Size nasıl yardımcı olabilirim?</p>
				    <div className="flex flex-wrap justify-center gap-2 max-w-md">
				      {INITIAL_QUESTIONS.map((q, i) => (
				        <button
				          key={i}
				          onClick={() => handleQuickAction(q)}
				          className="text-xs font-medium bg-card border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary px-3 py-2 rounded-full transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
				        >
				          {q}
				        </button>
				      ))}
				    </div>
				  </div>
				)}

				{messages.map((msg, i) => {
					const isLastStreamingMessage = isStreaming && i === messages.length - 1 && msg.role === 'assistant';
					const displayContent = isLastStreamingMessage ? animatedText : msg.content;
					const isLastMessage = i === messages.length - 1;

					return (
						<div key={i} className="flex flex-col">
						  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-slide-in`}>
							  <div
								  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
									  msg.role === 'user'
										  ? 'bg-primary text-primary-foreground rounded-tr-sm'
										  : 'bg-card border border-border text-foreground rounded-tl-sm'
								  }`}
							  >
								  <p className="whitespace-pre-wrap break-words">{displayContent}</p>
								  
								  {msg.images?.length > 0 && (
								    <div className="flex flex-wrap gap-2 mt-3">
  								    {msg.images.map((url, j) => (
  									    <img
  										    key={j}
  										    src={url}
  										    alt="AI generated"
  										    className="rounded-lg max-w-[200px] object-cover border border-border"
  										    loading="lazy"
  									    />
  								    ))}
								    </div>
								  )}
								  
								  {isLastStreamingMessage && !msg.content && (
									  <div className="flex items-center gap-1 mt-1">
									    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
									    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
									    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
									  </div>
								  )}
							  </div>
						  </div>
						  
						  {/* Action Buttons & Follow-ups after Assistant Message */}
						  {msg.role === 'assistant' && isLastMessage && !isStreaming && requestFormState === 'idle' && (
						    <motion.div 
						      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
						      className="mt-3 flex flex-col gap-3 ml-2"
						    >
						      <div className="flex flex-wrap gap-2">
						        {currentFollowUps.map((q, idx) => (
						          <button
				                key={idx}
				                onClick={() => sendMessage(q)}
				                className="text-xs font-medium bg-background border border-border text-muted-foreground hover:bg-card hover:text-foreground px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary"
				              >
				                {q}
				              </button>
						        ))}
						      </div>
						      <div className="flex flex-wrap gap-2">
						        <button onClick={() => handleQuickAction('Toplantı planla')} className="flex items-center gap-1.5 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 px-3 py-2 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary">
						          <Calendar className="w-3.5 h-3.5" /> Toplantı Planla
						        </button>
						        <button onClick={() => handleQuickAction('Gerçek kişi ile görüş')} className="flex items-center gap-1.5 text-xs font-bold bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 px-3 py-2 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary">
						          <User className="w-3.5 h-3.5" /> Gerçek Kişi ile Görüş
						        </button>
						        <button onClick={() => setRequestFormState('prompt')} className="flex items-center gap-1.5 text-xs font-bold bg-card border border-border text-foreground hover:bg-border/50 px-3 py-2 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary">
						          <FileText className="w-3.5 h-3.5" /> Talep Formu Oluştur
						        </button>
						      </div>
						    </motion.div>
						  )}
						</div>
					);
				})}
				
				{/* Request Form Flow */}
				<AnimatePresence>
				  {requestFormState !== 'idle' && (
				    <motion.div 
				      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
				      className="bg-card border border-border rounded-2xl p-4 shadow-md mt-4"
				    >
				      {requestFormState === 'prompt' && (
				        <div>
				          <p className="text-sm text-foreground mb-4 leading-relaxed">
				            Sizin için oluşturduğum talep formu aşağıda ki gibidir, bu talep formunu Nova Teknoloji gerçek kişilerine talebiniz ile ilgili teklif hazırlanması ve sizinle iletişime geçilmesi için ileteceğim onaylıyor musunuz?
				          </p>
				          <div className="flex gap-2">
				            <button onClick={() => setRequestFormState('form')} className="flex-1 bg-primary text-primary-foreground font-bold py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm">Evet</button>
				            <button onClick={() => setRequestFormState('idle')} className="flex-1 bg-background border border-border text-foreground font-bold py-2 rounded-lg hover:bg-border/50 transition-colors text-sm">Hayır</button>
				          </div>
				        </div>
				      )}
				      
				      {(requestFormState === 'form' || requestFormState === 'submitting') && (
				        <form onSubmit={handleRequestFormSubmit} className="space-y-3">
				          <h4 className="font-bold text-sm text-foreground mb-2">İletişim Bilgileriniz</h4>
				          <div className="grid grid-cols-2 gap-2">
				            <input type="text" placeholder="Adınız" required disabled={requestFormState === 'submitting'} value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} className="input-premium !py-2 !px-3 text-sm !min-h-[36px]" />
				            <input type="text" placeholder="Soyadınız" required disabled={requestFormState === 'submitting'} value={contactData.surname} onChange={e => setContactData({...contactData, surname: e.target.value})} className="input-premium !py-2 !px-3 text-sm !min-h-[36px]" />
				          </div>
				          <input type="email" placeholder="E-posta Adresiniz" required disabled={requestFormState === 'submitting'} value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} className="input-premium w-full !py-2 !px-3 text-sm !min-h-[36px]" />
				          <input type="tel" placeholder="Telefon Numaranız" disabled={requestFormState === 'submitting'} value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} className="input-premium w-full !py-2 !px-3 text-sm !min-h-[36px]" />
				          
				          <div className="flex gap-2 pt-2">
				            <button type="submit" disabled={requestFormState === 'submitting'} className="flex-1 bg-primary text-primary-foreground font-bold py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm flex items-center justify-center">
				              {requestFormState === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gönder'}
				            </button>
				            <button type="button" onClick={() => setRequestFormState('idle')} disabled={requestFormState === 'submitting'} className="px-4 bg-background border border-border text-foreground font-bold py-2 rounded-lg hover:bg-border/50 transition-colors text-sm">İptal</button>
				          </div>
				        </form>
				      )}
				      
				      {requestFormState === 'success' && (
				        <div className="text-center py-4">
				          <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-2" />
				          <h4 className="font-bold text-foreground mb-1">Talebiniz Alındı</h4>
				          <p className="text-sm text-muted">Uzmanlarımız en kısa sürede sizinle iletişime geçecektir.</p>
				        </div>
				      )}
				    </motion.div>
				  )}
				</AnimatePresence>
				
				<div ref={messagesEndRef} className="h-1" />
			</div>

			{/* Input Area */}
			<div className="p-4 border-t border-border bg-card shrink-0 relative z-10">
				{selectedImages.length > 0 && (
					<div className="mb-3 flex gap-2 flex-wrap">
						{imagePreviews.map(({ key, file, url }, index) => (
							<div key={key} className="relative group">
								<img
									src={url}
									alt={file.name}
									className="w-16 h-16 object-cover rounded-lg border border-border shadow-md"
								/>
								<button
									type="button"
									onClick={() => removeImage(index)}
									className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:brightness-110 opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-destructive outline-none"
									aria-label="Remove image"
								>
									<X className="w-3 h-3" />
								</button>
							</div>
						))}
					</div>
				)}
				
				<form onSubmit={handleSubmit} className="flex gap-2">
					<input
						ref={fileInputRef}
						type="file"
						accept={VALID_IMAGE_TYPES.join(',')}
						multiple
						onChange={handleImageSelect}
						className="hidden"
						disabled={isStreaming || isLoadingHistory}
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="min-w-[44px] min-h-[44px] rounded-lg border border-border bg-background hover:bg-border/50 text-muted-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
						disabled={isStreaming || isLoadingHistory || selectedImages.length >= MAX_IMAGES}
						title="Resim Yükle"
						aria-label="Resim Yükle"
					>
						<Paperclip className="w-5 h-5" />
					</button>
					<input
						type="text"
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder="Mesajınızı yazın..."
						className="input-premium flex-1"
						disabled={isStreaming || isLoadingHistory}
						maxLength={5000}
						aria-label="Message input"
					/>
					<button
						type="submit"
						disabled={isStreaming || (!input.trim() && selectedImages.length === 0)}
						className="btn-premium min-w-[48px] px-0 disabled:bg-muted disabled:text-muted-foreground disabled:hover:scale-100"
						aria-label="Mesaj Gönder"
					>
					  {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
					</button>
				</form>
			</div>
		</div>
	);
}
