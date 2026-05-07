import { 
  Factory, Globe2, Zap, Briefcase, RefreshCcw, Brain, 
  BarChart3, Bot, ShieldAlert, Lock
} from 'lucide-react';

export const servicesData = [
  {
    slug: 'otonom-uretim-fabrika-zekasi',
    icon: Factory,
    title: 'Otonom Üretim & Fabrika Zekası',
    shortDesc: 'Makine arızalarını önceden tahmin eden AI sistemleri ile plansız duruşları sıfırlayın. Üretim verimliliğinizi %40 artırın.',
    benefits: [
      'Predictive maintenance ile %95 arıza öngörüsü',
      'Plansız duruş süresini %80 azaltma',
      'Bakım maliyetlerinde %40 tasarruf',
      'Üretim verimliliğinde %35 artış'
    ],
    roi: '6-9 ay içinde tam yatırım geri dönüşü (ROI)',
    process: [
      'IoT sensör entegrasyonu ve veri toplama',
      'Geçmiş arıza verilerinin makine öğrenimi ile analizi',
      'Gerçek zamanlı izleme dashboard kurulumu',
      'Erken uyarı sistemlerinin devreye alınması'
    ]
  },
  {
    slug: 'b2b-kuresel-musteri-radari',
    icon: Globe2,
    title: 'B2B Küresel Müşteri Radarı',
    shortDesc: 'Dünya çapında proje ihalelerini otomatik tespit edin. İhracat süreçlerinizi AI ile otomatikleştirin ve yeni pazarlara açılın.',
    benefits: [
      'Küresel ihale ve proje fırsatlarını otomatik tarama',
      'Hedef pazar analizi ve müşteri segmentasyonu',
      'Otomatik teklif hazırlama ve gönderim',
      'CRM entegrasyonu ile otonom müşteri takibi'
    ],
    roi: '3-6 ay içinde yeni kalifiye müşteri kazanımı',
    process: [
      'Hedef pazar ve ideal müşteri profilinin belirlenmesi',
      'Web scraping ve API entegrasyonlarının yapılması',
      'Doğal dil işleme (NLP) ile veri filtrelenmesi',
      'Otonom iletişim döngülerinin başlatılması'
    ]
  },
  {
    slug: 'elektrik-muhendisligi-akilli-enerji',
    icon: Zap,
    title: 'Elektrik Mühendisliği & Akıllı Enerji',
    shortDesc: 'Enerji tüketiminizi optimize edin. Tarife otomasyonu ile elektrik maliyetlerinizi %30 düşürün.',
    benefits: [
      'Gerçek zamanlı enerji tüketim izleme',
      'Tarife optimizasyonu ile %30 maliyet düşüşü',
      'Yük dengeleme ve pik yönetimi',
      'Karbon ayak izi azaltımı ve raporlama'
    ],
    roi: '4-8 ay içinde net enerji tasarrufu',
    process: [
      'Mevcut enerji altyapısının analizi',
      'Akıllı sayaç ve izleme sistemlerinin kurulumu',
      'AI destekli tarife ve tüketim optimizasyonu',
      'Sürekli iyileştirme ve otonom yük yönetimi'
    ]
  },
  {
    slug: 'yonetim-kurulu-finans-teklif',
    icon: Briefcase,
    title: 'Yönetim Kurulu Finans & Teklif Otonomisi',
    shortDesc: 'Dinamik teklif oluşturma sistemleri ile kar marjınızı koruyun. Finansal kararlarınızı AI destekli analizlerle güçlendirin.',
    benefits: [
      'Otomatik maliyet hesaplama ve dinamik fiyatlandırma',
      'Kar marjı koruma algoritmaları',
      'Rakip analizi ve piyasa fiyat takibi',
      'Yönetim kurulu için gerçek zamanlı finansal raporlama'
    ],
    roi: 'İlk tekliften itibaren kar marjı koruması ve artışı',
    process: [
      'Mevcut maliyet kalemlerinin ve teklif yapısının analizi',
      'Dinamik fiyatlandırma modelinin eğitilmesi',
      'ERP ve muhasebe sistemleri ile entegrasyon',
      'Otonom teklif üretimi ve onay süreçlerinin otomasyonu'
    ]
  },
  {
    slug: 'surec-rpa-otomasyonu',
    icon: RefreshCcw,
    title: 'Süreç (RPA) Otomasyonu & Kurumsal Hafıza',
    shortDesc: 'Tekrarlayan süreçleri otomatikleştirin. Kurumsal bilgi birikimini yapay zeka ile koruyun ve aktarın.',
    benefits: [
      'Manuel veri girişini %90 azaltma',
      'İnsan hatasını minimize etme',
      'Çalışan deneyimini dokümante etme',
      '7/24 kesintisiz operasyon kabiliyeti'
    ],
    roi: '2-4 ay içinde ölçülebilir zaman ve işgücü tasarrufu',
    process: [
      'Tekrarlayan ve kural bazlı süreçlerin tespiti',
      'RPA botlarının programlanması ve testleri',
      'Kurumsal bilgi tabanının AI ile indekslenmesi',
      'Sistemlerin canlıya alınması ve çalışan eğitimi'
    ]
  },
  {
    slug: 'limit-tanimayan-otonomi-modeli',
    icon: Brain,
    title: 'Limit Tanımayan Otonomi Modeli',
    shortDesc: 'İşletmenize özel AI modeli eğitimi 48 saatte. Sektörünüze özgü çözümlerle rakiplerinizin önüne geçin.',
    benefits: [
      'Sektörünüze özel özelleştirilmiş Büyük Dil Modeli (LLM)',
      '48 saat içinde çalışan prototip teslimatı',
      'Şirket içi veri gizliliği (On-premise seçenekleri)',
      'Sürekli kendi kendini eğiten sistem mimarisi'
    ],
    roi: 'Hemen ilk haftadan itibaren operasyonel hızlanma',
    process: [
      'Kurumsal verilerin güvenli bir şekilde toplanması',
      'Özel modelin (Fine-tuning) eğitilmesi',
      'Güvenlik ve doğruluk testlerinin yapılması',
      'Tüm departmanların kullanımına sunulması'
    ]
  },
  {
    slug: 'ai-veri-analizi',
    icon: BarChart3,
    title: 'AI Veri Analizi & Değerlendirme Otomasyonu',
    shortDesc: 'Büyük veriyi saniyeler içinde anlamlı içgörülere dönüştürün. Karar alma süreçlerinizi yapay zeka ile hızlandırın.',
    benefits: [
      'Dağınık verilerin tek merkezde birleştirilmesi',
      'Görsel zenginliğe sahip interaktif dashboardlar',
      'Doğal dille veri sorgulama (Chat with your data)',
      'Gizli trendlerin otonom tespiti'
    ],
    roi: 'Karar alma sürelerinde %70 hızlanma',
    process: [
      'Veri silolarının tespiti ve entegrasyonu',
      'Veri temizleme ve yapılandırma otomasyonu',
      'Analitik modelin inşası ve eğitimi',
      'Yönetim panellerinin aktivasyonu'
    ]
  },
  {
    slug: 'ai-ajanlari-otonom-is',
    icon: Bot,
    title: 'AI Ajanları & Otonom İş Süreçleri',
    shortDesc: 'Birbiriyle iletişim kuran yapay zeka ajanları ile departmanlar arası iş akışlarını tamamen insansız hale getirin.',
    benefits: [
      'Departmanlar arası %100 senkronizasyon',
      '7/24 çalışan dijital iş gücü',
      'Müşteri taleplerinin otonom çözümlenmesi',
      'Operasyonel darboğazların eliminasyonu'
    ],
    roi: 'Operasyonel maliyetlerde %50\'ye varan kalıcı düşüş',
    process: [
      'İş akışlarının dijital haritasının çıkarılması',
      'Departmanlara özel AI ajanlarının tanımlanması',
      'Ajanlar arası iletişim protokollerinin kurulması',
      'Sürekli gözetim altında kademeli otonomi geçişi'
    ]
  },
  {
    slug: 'tahminsel-analitik-risk',
    icon: ShieldAlert,
    title: 'Tahminsel Analitik & Risk Yönetimi',
    shortDesc: 'Tedarik zinciri kopmaları, finansal dalgalanmalar ve pazar risklerini önceden tahmin ederek önlem alın.',
    benefits: [
      'Tedarik zinciri risklerinin %85 oranında önceden tespiti',
      'Talep tahminleme sapmalarının minimize edilmesi',
      'Makroekonomik verilerin otonom takibi',
      'Risk senaryolarına karşı dinamik eylem planları'
    ],
    roi: 'Olası kriz maliyetlerinin %90 oranında önlenmesi',
    process: [
      'İç ve dış risk faktörlerinin modellenmesi',
      'Tahminsel algoritmaların geçmiş veriyle test edilmesi',
      'Erken uyarı eşiklerinin belirlenmesi',
      'Otomatik risk bildirim sisteminin kurulması'
    ]
  },
  {
    slug: 'kurumsal-veri-guvenligi',
    icon: Lock,
    title: 'Kurumsal Veri Güvenliği & AI Uyum',
    shortDesc: 'Yapay zeka sistemlerinizin KVKK/GDPR uyumluluğunu sağlayın ve siber tehditlere karşı otonom savunma kalkanı oluşturun.',
    benefits: [
      'AI destekli otonom siber tehdit avcılığı',
      'Veri sızıntılarının (DLP) gerçek zamanlı önlenmesi',
      'Tam yasal uyumluluk ve denetim raporlaması',
      'Sıfır güven (Zero Trust) mimarisinin entegrasyonu'
    ],
    roi: 'Olası veri ihlali cezaları ve itibar kaybının sıfırlanması',
    process: [
      'Mevcut güvenlik altyapısının penetrasyon testleri',
      'AI uyumlu güvenlik politikalarının yazılması',
      'Otonom savunma sistemlerinin ağa entegrasyonu',
      'Sürekli izleme ve olay müdahale (Incident Response) otomasyonu'
    ]
  }
];

export const faqData = [
  {
    question: 'AI entegrasyonu ne kadar sürüyor?',
    answer: 'İşletmenizin dijital olgunluğuna bağlı olarak, "Limit Tanımayan Otonomi Modeli"miz ile 48 saat içinde ilk prototipleri devreye alabiliyoruz. Kapsamlı RPA ve fabrika zekası projeleri ise genellikle 4 ila 12 hafta arasında tamamlanmaktadır.'
  },
  {
    question: 'Şirket verilerimiz güvende mi?',
    answer: 'Kesinlikle. Nova Teknoloji Otomasyon olarak "Kurumsal Veri Güvenliği & AI Uyum" standartlarında çalışıyoruz. Verileriniz izole sunucularda tutulur, yapay zeka modelleri kapalı devre (on-premise) çalıştırılarak dışarıya veri sızıntısı %100 engellenir.'
  },
  {
    question: 'Yatırımın geri dönüşünü (ROI) ne zaman görürüz?',
    answer: 'Çözümlerimiz genellikle ilk 3 ila 6 ay içinde kendini amorti eder. Örneğin, enerji otomasyonu sistemlerimiz ilk aydan itibaren faturanıza %30\'a varan düşüş olarak yansır.'
  },
  {
    question: 'Ekibimizin teknik bilgisi olması gerekiyor mu?',
    answer: 'Hayır, gerekmiyor. Geliştirdiğimiz otonom sistemler ve AI ajanları, doğal dil (Türkçe) komutlarla çalışacak şekilde tasarlanmıştır. "WhatsApp kullanabilen herkes" sistemlerimizi yönetebilir.'
  },
  {
    question: 'Hizmet maliyetleri nasıl belirleniyor?',
    answer: 'Maliyetler, işletmenizin büyüklüğüne, entegre edilecek sistem sayısına ve istenen otonomi seviyesine göre proje bazlı belirlenir. Kesin bir teklif için 15 dakikalık ücretsiz dijital olgunluk analizi toplantısı talep edebilirsiniz.'
  }
];