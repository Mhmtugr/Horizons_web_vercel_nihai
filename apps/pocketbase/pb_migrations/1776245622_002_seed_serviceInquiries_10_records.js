/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("serviceInquiries");

  const record0 = new Record(collection);
    record0.set("serviceId", "autonomous-manufacturing");
    record0.set("serviceName", "Otonom \u00dcretim Sistemi");
    record0.set("description", "End\u00fcstri 4.0 teknolojileri ile \u00fcretim s\u00fcre\u00e7lerinizi tamamen otomatikle\u015ftirin. Yapay zeka ve makine \u00f6\u011frenmesi kullanarak \u00fcretim verimlili\u011fini %40'a kadar art\u0131r\u0131n. Ger\u00e7ek zamanl\u0131 veri analizi ile kalite kontrol ve hata tespitini otomatikle\u015ftirin.\n\nRobot ve IoT sens\u00f6rleri entegrasyonu ile \u00fcretim hatt\u0131n\u0131z\u0131 ak\u0131ll\u0131 hale getirin. \u00dcretim planlamas\u0131, envanter y\u00f6netimi ve lojistik operasyonlar\u0131n\u0131 yapay zeka ile optimize edin. Kesinti s\u00fcrelerini %60 azalt\u0131n ve \u00fcretim maliyetlerini \u00f6nemli \u00f6l\u00e7\u00fcde d\u00fc\u015f\u00fcr\u00fcn.\n\nTamamen \u00f6zelle\u015ftirilebilir \u00e7\u00f6z\u00fcm, mevcut sistemlerinizle uyumlu. 24/7 teknik destek ve s\u00fcrekli iyile\u015ftirme hizmetleri dahil.");
    record0.set("benefits", ["\u00dcretim verimlili\u011fi %40 art\u0131\u015f", "Kalite kontrol otomasyonu", "Kesinti s\u00fcresi %60 azal\u0131\u015f", "Maliyetlerde %30 tasarruf", "Ger\u00e7ek zamanl\u0131 raporlama"]);
    record0.set("pricing", "\u20ba500.000 - \u20ba2.500.000 (kurulum ve lisans)");
    record0.set("implementationTime", "3-6 ay");
    record0.set("caseStudies", [{"title": "Otomotiv \u00dcreticisi Verimlili\u011fi Art\u0131rma", "company": "TurboAuto A.\u015e.", "result": "\u00dcretim h\u0131z\u0131 %35 artt\u0131, hata oran\u0131 %75 azald\u0131"}, {"title": "Tekstil Fabrikas\u0131 Modernizasyonu", "company": "FabrikTeks Ltd.", "result": "Enerji t\u00fcketimi %25 azald\u0131, \u00fcretim kapasitesi %50 artt\u0131"}]);
    record0.set("faqs", [{"question": "Mevcut \u00fcretim hatt\u0131mla uyumlu mu?", "answer": "Evet, t\u00fcm end\u00fcstriyel sistemlerle entegre edilebilir. Uyumluluk analizi i\u00e7in \u00fccretsiz dan\u0131\u015fmanl\u0131k sunuyoruz."}, {"question": "Ka\u00e7 ki\u015fi e\u011fitim almas\u0131 gerekir?", "answer": "Ortalama 5-10 ki\u015fi. T\u00fcm e\u011fitim ve sertifikasyon program\u0131 paket i\u00e7inde yer al\u0131r."}]);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("serviceId", "global-customer-radar");
    record1.set("serviceName", "Global M\u00fc\u015fteri Radar Sistemi");
    record1.set("description", "D\u00fcnya \u00e7ap\u0131nda m\u00fc\u015fteri davran\u0131\u015flar\u0131n\u0131 ger\u00e7ek zamanl\u0131 olarak izleyin ve analiz edin. Yapay zeka destekli sistem, m\u00fc\u015fteri trendlerini \u00f6nceden tahmin eder ve pazarlama stratejilerinizi otomatik olarak optimize eder. Sosyal medya, web analitikleri ve sat\u0131\u015f verilerini birle\u015ftirerek b\u00fct\u00fcnsel bir m\u00fc\u015fteri g\u00f6r\u00fcn\u00fcm\u00fc olu\u015fturun.\n\nSegmentasyon ve personalizasyon otomasyonu ile her m\u00fc\u015fteriye \u00f6zel deneyim sunun. Churn (m\u00fc\u015fteri kayb\u0131) riskini %80 oran\u0131nda azalt\u0131n. M\u00fc\u015fteri ya\u015fam d\u00f6ng\u00fcs\u00fcn\u00fcn her a\u015famas\u0131nda do\u011fru mesaj\u0131 do\u011fru zamanda ileti\u015fim kurun.\n\nMulti-kanal entegrasyonu (email, SMS, push, sosyal medya) ile kampanya y\u00f6netimini basitle\u015ftirin. Ger\u00e7ek zamanl\u0131 A/B testleri ve otomatik optimizasyon ile ROI'nizi maksimize edin.");
    record1.set("benefits", ["M\u00fc\u015fteri churn %80 azal\u0131\u015f", "Sat\u0131\u015f d\u00f6n\u00fc\u015f\u00fcm oran\u0131 %45 art\u0131\u015f", "Kampanya ROI %200 iyile\u015ftirme", "M\u00fc\u015fteri memnuniyeti %35 art\u0131\u015f", "Otomatik segmentasyon"]);
    record1.set("pricing", "\u20ba300.000 - \u20ba1.500.000 (y\u0131ll\u0131k lisans)");
    record1.set("implementationTime", "2-4 ay");
    record1.set("caseStudies", [{"title": "E-ticaret Platformu M\u00fc\u015fteri Tutma", "company": "ShopGlobal E-ticaret", "result": "M\u00fc\u015fteri kayb\u0131 %75 azald\u0131, tekrar sat\u0131n alma oran\u0131 %60 artt\u0131"}, {"title": "Telekom\u00fcnikasyon \u015eirketi Churn Azaltma", "company": "NetTurk Telecom", "result": "Ayl\u0131k churn %8'den %1.5'e d\u00fc\u015ft\u00fc, y\u0131ll\u0131k gelir \u20ba50M artt\u0131"}]);
    record1.set("faqs", [{"question": "Hangi veri kaynaklar\u0131 entegre edilebilir?", "answer": "CRM, ERP, web analitikleri, sosyal medya, email platformlar\u0131 ve daha bir\u00e7ok sistem. API entegrasyonu desteklenir."}, {"question": "Veri gizlili\u011fi nas\u0131l sa\u011flan\u0131r?", "answer": "GDPR ve KVKK uyumlu. T\u00fcm veriler \u015fifreli ve g\u00fcvenli sunucularda saklan\u0131r."}]);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("serviceId", "smart-energy");
    record2.set("serviceName", "Ak\u0131ll\u0131 Enerji Y\u00f6netim Sistemi");
    record2.set("description", "Enerji t\u00fcketimini yapay zeka ile optimize ederek i\u015fletme maliyetlerini %35'e kadar azalt\u0131n. Ger\u00e7ek zamanl\u0131 enerji izleme, tahmin ve otomatik kontrol sistemi ile enerji verimlili\u011fini maksimize edin. G\u00fcne\u015f panelleri, r\u00fczgar enerjisi ve di\u011fer yenilenebilir kaynaklar\u0131 ak\u0131ll\u0131 \u015fekilde y\u00f6netin.\n\nMakine \u00f6\u011frenmesi algoritmalar\u0131, enerji t\u00fcketim paternlerini analiz ederek en uygun kullan\u0131m zamanlar\u0131n\u0131 belirler. Pik saatlerde t\u00fcketimi azaltarak elektrik faturalar\u0131nda \u00f6nemli tasarruf sa\u011flay\u0131n. Karbon ayak izini %40 azaltarak \u00e7evre dostu i\u015fletme yap\u0131n.\n\nIoT sens\u00f6rleri ve ak\u0131ll\u0131 saya\u00e7lar ile t\u00fcm enerji ak\u0131\u015f\u0131n\u0131 kontrol edin. Mobil uygulama \u00fczerinden ger\u00e7ek zamanl\u0131 raporlar ve \u00f6neriler al\u0131n. Otomatik uyar\u0131 sistemi ile anormal t\u00fcketimi hemen tespit edin.");
    record2.set("benefits", ["Enerji maliyeti %35 azal\u0131\u015f", "Karbon ayak izi %40 azal\u0131\u015f", "Yenilenebilir enerji entegrasyonu", "Otomatik t\u00fcketim optimizasyonu", "Ger\u00e7ek zamanl\u0131 izleme"]);
    record2.set("pricing", "\u20ba200.000 - \u20ba800.000 (kurulum ve 3 y\u0131l lisans)");
    record2.set("implementationTime", "1-3 ay");
    record2.set("caseStudies", [{"title": "Hastane Enerji Tasarrufu", "company": "Sa\u011fl\u0131k Plus Hastanesi", "result": "Ayl\u0131k enerji maliyeti \u20ba500K'dan \u20ba325K'ya d\u00fc\u015ft\u00fc, y\u0131ll\u0131k tasarruf \u20ba2.1M"}, {"title": "Fabrika Enerji Verimlili\u011fi", "company": "\u0130n\u015faat Malzemeleri Ltd.", "result": "Enerji t\u00fcketimi %32 azald\u0131, \u00fcretim kapasitesi ayn\u0131 kald\u0131"}]);
    record2.set("faqs", [{"question": "Mevcut elektrik altyap\u0131s\u0131 de\u011fi\u015ftirilmesi gerekir mi?", "answer": "Hay\u0131r, mevcut altyap\u0131 ile uyumludur. Sadece ak\u0131ll\u0131 sens\u00f6rler ve kontrol cihazlar\u0131 eklenir."}, {"question": "Yenilenebilir enerji kaynaklar\u0131 nas\u0131l entegre edilir?", "answer": "G\u00fcne\u015f panelleri, r\u00fczgar t\u00fcrbinleri ve di\u011fer kaynaklar sistem taraf\u0131ndan otomatik olarak y\u00f6netilir."}]);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("serviceId", "financial-autonomy");
    record3.set("serviceName", "Mali \u00d6zerklik Sistemi");
    record3.set("description", "Finansal i\u015flemleri tamamen otomatikle\u015ftirerek muhasebe ve finans departman\u0131n\u0131z\u0131n verimlili\u011fini %70 art\u0131r\u0131n. Yapay zeka destekli sistem, fatura i\u015fleme, \u00f6deme takibi, b\u00fct\u00e7e y\u00f6netimi ve finansal raporlamay\u0131 otomatik hale getirir. Hata oran\u0131n\u0131 neredeyse s\u0131f\u0131ra indirin ve uyum maliyetlerini %50 azalt\u0131n.\n\nGer\u00e7ek zamanl\u0131 finansal analiz ve tahmin modelleri ile i\u015fletme kararlar\u0131n\u0131z\u0131 veri temelli al\u0131n. Nakit ak\u0131\u015f\u0131 optimizasyonu, bor\u00e7 y\u00f6netimi ve yat\u0131r\u0131m tavsiyesi otomatik olarak sa\u011flan\u0131r. Vergi uyumlulu\u011fu ve denetim haz\u0131rl\u0131\u011f\u0131 tamamen otomatikle\u015ftirilir.\n\nMulti-para birimi ve multi-\u00fclke deste\u011fi ile global operasyonlar\u0131 y\u00f6netin. T\u00fcm muhasebe standartlar\u0131na (TFRS, IFRS) uyumlu. Entegre risk y\u00f6netimi ve uyum kontrol mekanizmalar\u0131 dahil.");
    record3.set("benefits", ["Muhasebe verimlili\u011fi %70 art\u0131\u015f", "Hata oran\u0131 %99 azal\u0131\u015f", "Uyum maliyeti %50 azal\u0131\u015f", "Finansal tahmin do\u011frulu\u011fu %95", "Otomatik vergi uyumlulu\u011fu"]);
    record3.set("pricing", "\u20ba400.000 - \u20ba2.000.000 (kurulum ve y\u0131ll\u0131k lisans)");
    record3.set("implementationTime", "2-5 ay");
    record3.set("caseStudies", [{"title": "Holding \u015eirketi Mali Konsolidasyon", "company": "Mega Holding A.\u015e.", "result": "Konsolidasyon s\u00fcresi 3 haftadan 2 g\u00fcne d\u00fc\u015ft\u00fc, hata %0'a indi"}, {"title": "Banka \u00d6deme \u0130\u015flemleri Otomasyonu", "company": "Finans Bankas\u0131", "result": "G\u00fcnl\u00fck i\u015flem hacmi 10 kat\u0131na \u00e7\u0131kt\u0131, personel say\u0131s\u0131 %40 azald\u0131"}]);
    record3.set("faqs", [{"question": "Mevcut muhasebe yaz\u0131l\u0131m\u0131mla uyumlu mu?", "answer": "Evet, SAP, Oracle, NetSuite ve di\u011fer ERP sistemleri ile entegre edilebilir."}, {"question": "Vergi mevzuat\u0131 g\u00fcncellemeleri nas\u0131l yap\u0131l\u0131r?", "answer": "Sistem otomatik olarak g\u00fcncellenir. T\u00fcm vergi de\u011fi\u015fiklikleri an\u0131nda uygulan\u0131r."}]);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("serviceId", "rpa-automation");
    record4.set("serviceName", "RPA (Robotic Process Automation) \u00c7\u00f6z\u00fcm\u00fc");
    record4.set("description", "Tekrarlayan ve manuel i\u015f s\u00fcre\u00e7lerini yaz\u0131l\u0131m robotlar\u0131 ile otomatikle\u015ftirin. \u0130nsan m\u00fcdahalesi gerektirmeyen g\u00f6revleri %100 otomatik hale getirerek personel verimlili\u011fini %60 art\u0131r\u0131n. Veri giri\u015fi, form doldurma, sistem entegrasyonu ve raporlama gibi i\u015flemleri 24/7 otomatik olarak yap\u0131n.\n\nKodlama bilgisi gerektirmeyen g\u00f6rsel programlama aray\u00fcz\u00fc ile h\u0131zl\u0131 uygulama geli\u015ftirin. Mevcut sistemlerinize m\u00fcdahale etmeden \u00e7al\u0131\u015fan robotlar, eski ve yeni sistemler aras\u0131nda k\u00f6pr\u00fc g\u00f6revi yapar. Hata oran\u0131n\u0131 %99 azalt\u0131n ve i\u015flem s\u00fcrelerini %80 k\u0131salt\u0131n.\n\nEklenebilir mimari ile ihtiyac\u0131n\u0131z artt\u0131k\u00e7a robot say\u0131s\u0131n\u0131 art\u0131r\u0131n. T\u00fcm i\u015f s\u00fcre\u00e7lerinde uygulanabilir: \u0130nsan Kaynaklar\u0131, Muhasebe, Sat\u0131\u015f, M\u00fc\u015fteri Hizmetleri, Lojistik. Tam denetim ve audit izleri ile uyum gereksinimlerini kar\u015f\u0131lay\u0131n.");
    record4.set("benefits", ["\u0130\u015f s\u00fcreci verimlili\u011fi %60 art\u0131\u015f", "Hata oran\u0131 %99 azal\u0131\u015f", "\u0130\u015flem s\u00fcresi %80 k\u0131sal\u0131\u015f", "24/7 otomatik i\u015flem", "Kodlama gerektirmez"]);
    record4.set("pricing", "\u20ba250.000 - \u20ba1.200.000 (proje bazl\u0131)");
    record4.set("implementationTime", "1-4 ay");
    record4.set("caseStudies", [{"title": "Sigorta \u015eirketi Talep \u0130\u015fleme", "company": "G\u00fcven Sigorta A.\u015e.", "result": "Talep i\u015fleme s\u00fcresi 5 g\u00fcnden 2 saate d\u00fc\u015ft\u00fc, maliyet %45 azald\u0131"}, {"title": "Perakende Zinciri Envanter Y\u00f6netimi", "company": "MegaMarket Perakende", "result": "Envanter i\u015flemleri %100 otomatik, hata %0'a indi"}]);
    record4.set("faqs", [{"question": "Eski sistemlerle uyumlu mu?", "answer": "Evet, t\u00fcm eski ve yeni sistemlerle \u00e7al\u0131\u015fabilir. Sistem entegrasyonu gerektirmez."}, {"question": "Robotlar ne kadar g\u00fcvenli?", "answer": "T\u00fcm i\u015flemler kaydedilir ve denetlenebilir. Uyum ve g\u00fcvenlik standartlar\u0131na tamamen uyumludur."}]);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("serviceId", "unlimited-autonomy");
    record5.set("serviceName", "S\u0131n\u0131rs\u0131z \u00d6zerklik Platformu");
    record5.set("description", "T\u00fcm i\u015fletme s\u00fcre\u00e7lerinizi yapay zeka ile tamamen otonomla\u015ft\u0131r\u0131n. Karar alma, planlama, y\u00fcr\u00fctme ve kontrol d\u00f6ng\u00fcs\u00fcn\u00fcn tamam\u0131 otomatik olarak \u00e7al\u0131\u015f\u0131r. \u0130nsan m\u00fcdahalesi minimum seviyeye indirilir, sadece stratejik kararlar i\u00e7in gerekli olur.\n\nMakine \u00f6\u011frenmesi modelleri, i\u015fletme verilerinizden s\u00fcrekli \u00f6\u011frenerek sistem performans\u0131n\u0131 iyile\u015ftirir. \u00d6ng\u00f6r\u00fcl\u00fc analitik ile pazardaki de\u011fi\u015fikliklere otomatik olarak uyum sa\u011flay\u0131n. Rekabet avantaj\u0131n\u0131 korumak i\u00e7in sistem kendini s\u00fcrekli optimize eder.\n\nK\u00fcresel \u00f6l\u00e7ekte operasyonlar\u0131 y\u00f6netin, yerel pazarlar\u0131n \u00f6zelliklerine otomatik olarak uyum sa\u011flay\u0131n. T\u00fcm departmanlar (Sat\u0131\u015f, Pazarlama, Operasyon, Finans, \u0130nsan Kaynaklar\u0131) entegre \u015fekilde \u00e7al\u0131\u015f\u0131r. Kurumsal zeka ve otonom karar alma sistemi ile yeni \u00e7a\u011fa haz\u0131r olun.");
    record5.set("benefits", ["Operasyonel verimlili\u011fi %80 art\u0131\u015f", "Karar alma s\u00fcresi %95 k\u0131sal\u0131\u015f", "\u0130nsan hatas\u0131 %99 azal\u0131\u015f", "Otonom operasyon", "S\u00fcrekli iyile\u015ftirme"]);
    record5.set("pricing", "\u20ba1.000.000 - \u20ba5.000.000 (kurulum ve 5 y\u0131l lisans)");
    record5.set("implementationTime", "6-12 ay");
    record5.set("caseStudies", [{"title": "Lojistik \u015eirketi Tam Otonom Operasyon", "company": "LogiSmart Lojistik", "result": "Operasyonel maliyet %35 azald\u0131, teslimat h\u0131z\u0131 %50 artt\u0131"}, {"title": "\u00dcretim \u015eirketi Tam Otonom Fabrika", "company": "SmartFactory \u00dcretim", "result": "\u00dcretim kapasitesi %60 artt\u0131, insan m\u00fcdahalesi %90 azald\u0131"}]);
    record5.set("faqs", [{"question": "\u0130nsan i\u015f\u00e7iler i\u015fini kaybeder mi?", "answer": "Hay\u0131r, sistem insanlar\u0131 tekrarlayan i\u015flerden kurtar\u0131r. Daha y\u00fcksek de\u011ferli, yarat\u0131c\u0131 i\u015flere y\u00f6nlendirir."}, {"question": "Sistem hata yapabilir mi?", "answer": "Evet, ancak hata oran\u0131 %0.1'in alt\u0131ndad\u0131r. T\u00fcm kararlar denetlenebilir ve geri al\u0131nabilir."}]);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("serviceId", "ai-data-analysis");
    record6.set("serviceName", "Yapay Zeka Veri Analiz Sistemi");
    record6.set("description", "Milyonlarca veri noktas\u0131n\u0131 saniyeler i\u00e7inde analiz ederek i\u015fletmeniz i\u00e7in de\u011ferli i\u00e7g\u00f6r\u00fcler \u00e7\u0131kar\u0131n. Yapay zeka destekli sistem, gizli paternleri, trendleri ve anomalileri otomatik olarak tespit eder. Veri bilimci olmadan ileri analitik yapabilirsiniz.\n\nPrediktif modeller ile gelecek trendlerini %90 do\u011frulukla tahmin edin. M\u00fc\u015fteri davran\u0131\u015f\u0131, sat\u0131\u015f trendleri, pazar hareketleri ve operasyonel verimlili\u011fi \u00f6nceden g\u00f6r\u00fcn. Veriye dayal\u0131 stratejik kararlar alarak rekabet avantaj\u0131 elde edin.\n\nOtomatik raporlama ve g\u00f6rselle\u015ftirme ile karma\u015f\u0131k verileri anla\u015f\u0131l\u0131r hale getirin. Mobil uygulamalar ve dashboard'lar ile her yerden ger\u00e7ek zamanl\u0131 analiz yap\u0131n. T\u00fcm veri kaynaklar\u0131 (CRM, ERP, web analitikleri, sosyal medya) otomatik olarak entegre edilir.");
    record6.set("benefits", ["Analiz s\u00fcresi %95 k\u0131sal\u0131\u015f", "Tahmin do\u011frulu\u011fu %90", "Gizli paternleri otomatik tespit", "Ger\u00e7ek zamanl\u0131 raporlama", "Veri bilimci gerektirmez"]);
    record6.set("pricing", "\u20ba150.000 - \u20ba600.000 (y\u0131ll\u0131k lisans)");
    record6.set("implementationTime", "1-3 ay");
    record6.set("caseStudies", [{"title": "Perakende Zinciri Sat\u0131\u015f Tahmini", "company": "RetailPro Perakende", "result": "Sat\u0131\u015f tahmini do\u011frulu\u011fu %75'ten %92'ye \u00e7\u0131kt\u0131, stok maliyeti %20 azald\u0131"}, {"title": "Sa\u011fl\u0131k Kurumu Hasta Analizi", "company": "Sa\u011fl\u0131k Merkezi Hastanesi", "result": "Hasta sonu\u00e7lar\u0131 %25 iyile\u015fti, operasyonel maliyet %15 azald\u0131"}]);
    record6.set("faqs", [{"question": "Hangi veri formatlar\u0131 desteklenir?", "answer": "CSV, Excel, JSON, XML, SQL veritabanlar\u0131 ve daha bir\u00e7ok format. API entegrasyonu da m\u00fcmk\u00fcnd\u00fcr."}, {"question": "Veri g\u00fcvenli\u011fi nas\u0131l sa\u011flan\u0131r?", "answer": "T\u00fcm veriler \u015fifreli, g\u00fcvenli sunucularda saklan\u0131r. GDPR ve KVKK uyumludur."}]);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("serviceId", "ai-agents");
    record7.set("serviceName", "Yapay Zeka Ajanlar\u0131 Sistemi");
    record7.set("description", "Otonom yapay zeka ajanlar\u0131, m\u00fc\u015fteri hizmetleri, sat\u0131\u015f, pazarlama ve operasyonlar\u0131 24/7 y\u00f6netir. Do\u011fal dil i\u015fleme ile m\u00fc\u015fterilerle insan gibi konu\u015fan ajanlar, %95 m\u00fc\u015fteri memnuniyeti sa\u011flar. Karma\u015f\u0131k g\u00f6revleri ba\u011f\u0131ms\u0131z olarak \u00e7\u00f6zen ajanlar, insan m\u00fcdahalesi gerektirmez.\n\nMulti-ajanlar sistemi ile farkl\u0131 departmanlar aras\u0131nda koordinasyon otomatik olarak sa\u011flan\u0131r. M\u00fc\u015fteri sorular\u0131n\u0131 an\u0131nda cevapla, sat\u0131\u015f f\u0131rsatlar\u0131n\u0131 otomatik olarak tespit et, operasyonel sorunlar\u0131 proaktif olarak \u00e7\u00f6z. Ajanlar birbirinden \u00f6\u011frenerek sistem performans\u0131 s\u00fcrekli iyile\u015fir.\n\nT\u00fcm ileti\u015fim kanallar\u0131nda (chat, email, telefon, sosyal medya) \u00e7al\u0131\u015fan ajanlar. M\u00fc\u015fteri ba\u011flam\u0131n\u0131 anlayan, ki\u015fiselle\u015ftirilmi\u015f hizmet sunan ajanlar. Karma\u015f\u0131k problemleri insan temsilcisine ak\u0131ll\u0131 \u015fekilde y\u00f6nlendiren ajanlar.");
    record7.set("benefits", ["M\u00fc\u015fteri hizmetleri %90 otomatik", "M\u00fc\u015fteri memnuniyeti %95", "24/7 hizmet", "Yan\u0131t s\u00fcresi <1 saniye", "\u00c7ok dilli destek"]);
    record7.set("pricing", "\u20ba200.000 - \u20ba1.000.000 (kurulum ve y\u0131ll\u0131k lisans)");
    record7.set("implementationTime", "2-4 ay");
    record7.set("caseStudies", [{"title": "E-ticaret M\u00fc\u015fteri Hizmetleri", "company": "ShopSmart E-ticaret", "result": "M\u00fc\u015fteri hizmetleri %85 otomatik, maliyet %60 azald\u0131"}, {"title": "Telekom\u00fcnikasyon M\u00fc\u015fteri Deste\u011fi", "company": "NetTurk Telecom", "result": "M\u00fc\u015fteri memnuniyeti %78'den %94'e \u00e7\u0131kt\u0131, personel say\u0131s\u0131 %50 azald\u0131"}]);
    record7.set("faqs", [{"question": "Ajanlar ne kadar ak\u0131ll\u0131?", "answer": "GPT-4 seviyesi yapay zeka kullan\u0131r. Karma\u015f\u0131k sorular\u0131 anlay\u0131p cevaplar, ba\u011flam hat\u0131rlar."}, {"question": "Hangi dilleri destekler?", "answer": "100+ dili destekler. T\u00fcrk\u00e7e, \u0130ngilizce, Arap\u00e7a, \u00c7ince ve daha bir\u00e7ok dil."}]);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("serviceId", "predictive-analytics");
    record8.set("serviceName", "\u00d6ng\u00f6r\u00fcl\u00fc Analitik Sistemi");
    record8.set("description", "Gelecek olaylar\u0131 tahmin ederek i\u015fletmenizi \u00f6nceden haz\u0131rlay\u0131n. M\u00fc\u015fteri kayb\u0131, sat\u0131\u015f f\u0131rsatlar\u0131, pazarl\u0131k riskleri ve operasyonel sorunlar\u0131 \u00f6nceden tespit edin. Makine \u00f6\u011frenmesi modelleri, ge\u00e7mi\u015f verilerden \u00f6\u011frenerek gelece\u011fi %85-95 do\u011frulukla tahmin eder.\n\nChurn tahmini ile m\u00fc\u015fteri kayb\u0131n\u0131 %70 azalt\u0131n. Sat\u0131\u015f tahmini ile envanter ve \u00fcretim planlamas\u0131n\u0131 optimize edin. Talep tahmini ile stok maliyetlerini %40 azalt\u0131n. Pazarl\u0131k riski tahmini ile finansal kay\u0131plar\u0131 \u00f6nleyin.\n\nOtomatik uyar\u0131 sistemi ile riskli durumlar\u0131 hemen tespit edin. Proaktif m\u00fcdahale \u00f6nerileri alarak sorunlar\u0131 ba\u015flamadan \u00e7\u00f6z\u00fcn. T\u00fcm departmanlar i\u00e7in \u00f6zelle\u015ftirilmi\u015f tahmin modelleri. S\u00fcrekli \u00f6\u011frenen sistem, do\u011fruluk zamanla artar.");
    record8.set("benefits", ["Tahmin do\u011frulu\u011fu %90", "M\u00fc\u015fteri kayb\u0131 %70 azal\u0131\u015f", "Sat\u0131\u015f tahmini %85 do\u011fru", "Talep tahmini %80 do\u011fru", "Proaktif risk y\u00f6netimi"]);
    record8.set("pricing", "\u20ba180.000 - \u20ba700.000 (y\u0131ll\u0131k lisans)");
    record8.set("implementationTime", "2-4 ay");
    record8.set("caseStudies", [{"title": "Banka Kredi Riski Tahmini", "company": "Finans Bankas\u0131", "result": "Kredi riski tahmini do\u011frulu\u011fu %92'ye \u00e7\u0131kt\u0131, k\u00f6t\u00fc bor\u00e7 %35 azald\u0131"}, {"title": "\u00dcretim \u015eirketi Talep Tahmini", "company": "\u0130malat Plus Ltd.", "result": "Talep tahmini do\u011frulu\u011fu %88'e \u00e7\u0131kt\u0131, stok maliyeti \u20ba5M azald\u0131"}]);
    record8.set("faqs", [{"question": "Ne kadar ge\u00e7mi\u015f veri gerekir?", "answer": "Minimum 6 ay, ideal 2-3 y\u0131l. Daha fazla veri, daha do\u011fru tahmin."}, {"question": "Model ne s\u0131kl\u0131kla g\u00fcncellenir?", "answer": "Otomatik olarak g\u00fcnl\u00fck g\u00fcncellenir. Yeni veriler otomatik olarak modele dahil edilir."}]);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("serviceId", "data-security");
    record9.set("serviceName", "Veri G\u00fcvenli\u011fi ve Siber Koruma Sistemi");
    record9.set("description", "Yapay zeka destekli siber g\u00fcvenlik sistemi, tehditleri ger\u00e7ek zamanl\u0131 olarak tespit ederek i\u015fletmenizi korur. Anormal aktiviteleri otomatik olarak alg\u0131layan sistem, sald\u0131r\u0131lar\u0131 ba\u015flamadan engeller. T\u00fcm veri ak\u0131\u015f\u0131n\u0131 izleyerek yetkisiz eri\u015fimi %99.9 oran\u0131nda \u00f6nleyin.\n\nZero-trust mimarisi ile her eri\u015fim iste\u011fi do\u011frulan\u0131r. \u015eifreleme, eri\u015fim kontrol, kimlik do\u011frulama ve audit izleri tamamen otomatik. Uyum gereksinimlerini (GDPR, KVKK, ISO 27001) otomatik olarak kar\u015f\u0131lay\u0131n.\n\nTehditleri \u00f6nceden tahmin eden sistem, sald\u0131r\u0131lar\u0131 ba\u015flamadan engeller. Insider tehditleri tespit eden sistem, yetkisiz veri eri\u015fimini \u00f6nler. T\u00fcm cihazlar, a\u011flar ve bulut hizmetleri merkezi olarak korunur. 24/7 tehdit izleme ve otomatik yan\u0131t sistemi.");
    record9.set("benefits", ["Siber sald\u0131r\u0131 %99.9 engelleme", "Veri ihlali riski %99 azal\u0131\u015f", "Uyum otomasyonu", "Ger\u00e7ek zamanl\u0131 tehdit tespiti", "Otomatik yan\u0131t sistemi"]);
    record9.set("pricing", "\u20ba300.000 - \u20ba1.500.000 (y\u0131ll\u0131k lisans)");
    record9.set("implementationTime", "1-3 ay");
    record9.set("caseStudies", [{"title": "Banka Siber G\u00fcvenli\u011fi", "company": "G\u00fcven Bankas\u0131", "result": "Siber sald\u0131r\u0131 %99.8 engellendi, veri ihlali s\u0131f\u0131r"}, {"title": "Hastane Veri Korumas\u0131", "company": "Sa\u011fl\u0131k Plus Hastanesi", "result": "Hasta verisi tamamen korundu, HIPAA uyumlulu\u011fu sa\u011fland\u0131"}]);
    record9.set("faqs", [{"question": "Sistem ne kadar g\u00fcvenli?", "answer": "Askeri seviye \u015fifreleme ve \u00e7ok katmanl\u0131 g\u00fcvenlik. Sald\u0131r\u0131 ba\u015far\u0131 oran\u0131 %0.1'in alt\u0131nda."}, {"question": "Performans etkilenir mi?", "answer": "Hay\u0131r, sistem arka planda \u00e7al\u0131\u015f\u0131r. A\u011f h\u0131z\u0131 ve sistem performans\u0131 etkilenmez."}]);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})