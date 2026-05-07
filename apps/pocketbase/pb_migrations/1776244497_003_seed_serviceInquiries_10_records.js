/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("serviceInquiries");

  const record0 = new Record(collection);
    record0.set("serviceId", "otonom-uretim-fabrika-zekasi");
    record0.set("serviceName", "Otonom \u00dcretim & Fabrika Zekas\u0131");
    record0.set("description", "\u00dcretim tesislerinizi yapay zeka ve otomasyon teknolojileri ile d\u00f6n\u00fc\u015ft\u00fcr\u00fcn. Ger\u00e7ek zamanl\u0131 \u00fcretim optimizasyonu, kalite kontrol otomasyonu ve tahminsel bak\u0131m sistemleri ile fabrika verimlili\u011fini %40'a kadar art\u0131r\u0131n. End\u00fcstri 4.0 standartlar\u0131na uygun, tam entegre \u00e7\u00f6z\u00fcmler.");
    record0.set("benefits", ["\u00dcretim verimlili\u011finde %40 art\u0131\u015f", "Kalite kontrol otomasyonu", "Tahminsel bak\u0131m sistemi", "Ger\u00e7ek zamanl\u0131 veri analizi", "\u0130\u015f g\u00fcc\u00fc optimizasyonu"]);
    record0.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record0.set("implementationTime", "8-12 hafta");
    record0.set("caseStudies", [{"company": "TechManufacturing A.\u015e.", "industry": "Otomotiv Par\u00e7alar\u0131", "challenge": "\u00dcretim hatt\u0131nda %15 hatal\u0131 \u00fcr\u00fcn oran\u0131 ve y\u00fcksek bak\u0131m maliyetleri", "solution": "AI tabanl\u0131 kalite kontrol sistemi ve tahminsel bak\u0131m algoritmas\u0131 entegrasyonu", "result": "Hatal\u0131 \u00fcr\u00fcn oran\u0131 %2'ye d\u00fc\u015f\u00fcr\u00fcld\u00fc, bak\u0131m maliyetleri %35 azald\u0131"}, {"company": "\u0130stanbul Elektrik \u00dcretim Ltd.", "industry": "Elektrik \u00dcretimi", "challenge": "\u00dcretim kapasitesinin tam kullan\u0131lamamas\u0131 ve operasyon maliyetleri", "solution": "Otonom \u00fcretim planlama ve kaynak optimizasyonu sistemi", "result": "Kapasite kullan\u0131m\u0131 %92'ye \u00e7\u0131kt\u0131, operasyon maliyetleri %28 azald\u0131"}, {"company": "Anadolu Tekstil Fabrikalar\u0131", "industry": "Tekstil", "challenge": "\u00dcretim s\u00fcresi uzun ve kalite tutars\u0131zl\u0131\u011f\u0131", "solution": "Ger\u00e7ek zamanl\u0131 \u00fcretim izleme ve otomatik kalite ayarlama sistemi", "result": "\u00dcretim s\u00fcresi %30 k\u0131sald\u0131, kalite tutarl\u0131l\u0131\u011f\u0131 %98'e ula\u015ft\u0131"}]);
    record0.set("faqs", [{"question": "Mevcut \u00fcretim sistemimizle uyumlu mu?", "answer": "Evet, \u00e7o\u011fu end\u00fcstriyel sistem ile entegre edilebilir. Detayl\u0131 uyumluluk analizi i\u00e7in dan\u0131\u015fmanlar\u0131m\u0131zla ileti\u015fime ge\u00e7in."}, {"question": "Ka\u00e7 ki\u015filik bir ekip gerekli?", "answer": "Ba\u015flang\u0131\u00e7ta 2-3 ki\u015filik bir ekip yeterlidir. Sistem otomatik olarak \u00e7al\u0131\u015ft\u0131ktan sonra minimum g\u00f6zetim gerekir."}, {"question": "ROI ne kadar s\u00fcrede sa\u011flan\u0131r?", "answer": "Tipik olarak 6-9 ay i\u00e7inde tam ROI sa\u011flan\u0131r. Baz\u0131 m\u00fc\u015fterilerimiz 4 ay i\u00e7inde geri d\u00f6n\u00fc\u015f elde etmi\u015ftir."}, {"question": "Veri g\u00fcvenli\u011fi nas\u0131l sa\u011flan\u0131r?", "answer": "End\u00fcstri standard\u0131 \u015fifreleme, g\u00fcvenli API'ler ve d\u00fczenli g\u00fcvenlik denetimleri ile korunur."}]);
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
    record1.set("serviceId", "b2b-kuresel-musteri-radari");
    record1.set("serviceName", "B2B K\u00fcresel M\u00fc\u015fteri Radar\u0131");
    record1.set("description", "K\u00fcresel B2B pazar\u0131nda potansiyel m\u00fc\u015fterileri otomatik olarak ke\u015ffedin ve analiz edin. AI destekli m\u00fc\u015fteri segmentasyonu, sat\u0131\u015f f\u0131rsat\u0131 tan\u0131mlama ve pazarlama otomasyonu ile sat\u0131\u015f d\u00f6ng\u00fcn\u00fcz\u00fc %50 k\u0131salt\u0131n. Ger\u00e7ek zamanl\u0131 pazar analizi ve rekabet izleme.");
    record1.set("benefits", ["Potansiyel m\u00fc\u015fteri ke\u015ffi otomasyonu", "Sat\u0131\u015f f\u0131rsat\u0131 tan\u0131mlama", "Pazarlama kampanyas\u0131 otomasyonu", "Rekabet analizi", "Pazar trendleri raporlamas\u0131"]);
    record1.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record1.set("implementationTime", "4-6 hafta");
    record1.set("caseStudies", [{"company": "Global Tech Solutions", "industry": "Yaz\u0131l\u0131m ve Dan\u0131\u015fmanl\u0131k", "challenge": "Yeni pazarlara girmek i\u00e7in potansiyel m\u00fc\u015fteri bulma zorlu\u011fu", "solution": "B2B m\u00fc\u015fteri radar\u0131 sistemi ile otomatik m\u00fc\u015fteri ke\u015ffi ve segmentasyonu", "result": "Sat\u0131\u015f f\u0131rsatlar\u0131 %300 artt\u0131, sat\u0131\u015f d\u00f6ng\u00fcs\u00fc 45 g\u00fcnden 22 g\u00fcne d\u00fc\u015ft\u00fc"}, {"company": "Avrupa \u0130hracat A.\u015e.", "industry": "End\u00fcstriyel \u00dcr\u00fcnler", "challenge": "Uluslararas\u0131 pazarlarda m\u00fc\u015fteri bulma ve ili\u015fki y\u00f6netimi", "solution": "K\u00fcresel m\u00fc\u015fteri radar\u0131 ve CRM entegrasyonu", "result": "Yeni m\u00fc\u015fteri say\u0131s\u0131 %250 artt\u0131, pazarlama ROI %180 iyile\u015fti"}, {"company": "T\u00fcrk Makine \u0130hracat\u00e7\u0131lar\u0131", "industry": "Makine \u0130malat", "challenge": "Ticari f\u0131rsatlar\u0131 ka\u00e7\u0131rma ve pazarlama verimsizli\u011fi", "solution": "Otomatik pazar analizi ve m\u00fc\u015fteri profil e\u015fle\u015ftirme sistemi", "result": "F\u0131rsat yakalama oran\u0131 %85'e \u00e7\u0131kt\u0131, pazarlama maliyeti %40 azald\u0131"}]);
    record1.set("faqs", [{"question": "Hangi pazarlar\u0131 kaps\u0131yor?", "answer": "T\u00fcm b\u00fcy\u00fck B2B pazarlar\u0131 kapsamaktad\u0131r. \u00d6zel pazarlar i\u00e7in \u00f6zelle\u015ftirme yap\u0131labilir."}, {"question": "Veri ne s\u0131kl\u0131kla g\u00fcncellenir?", "answer": "Sistem ger\u00e7ek zamanl\u0131 olarak \u00e7al\u0131\u015f\u0131r ve verileri saatlik olarak g\u00fcnceller."}, {"question": "GDPR uyumlu mu?", "answer": "Evet, t\u00fcm veri i\u015fleme GDPR ve yerel veri koruma yasalar\u0131na uygun yap\u0131l\u0131r."}, {"question": "Hangi CRM sistemleri ile entegre olur?", "answer": "Salesforce, HubSpot, Pipedrive ve di\u011fer pop\u00fcler CRM'ler ile entegre edilebilir."}]);
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
    record2.set("serviceId", "elektrik-muhendisligi-akilli-enerji");
    record2.set("serviceName", "Elektrik M\u00fchendisli\u011fi & Ak\u0131ll\u0131 Enerji");
    record2.set("description", "Enerji y\u00f6netim sistemlerinizi ak\u0131ll\u0131 hale getirin. Ger\u00e7ek zamanl\u0131 enerji t\u00fcketim analizi, talep tahmini ve otomatik y\u00fck dengeleme ile enerji maliyetlerini %35'e kadar azalt\u0131n. Yenilenebilir enerji entegrasyonu ve ak\u0131ll\u0131 \u015febeke \u00e7\u00f6z\u00fcmleri.");
    record2.set("benefits", ["Enerji maliyeti %35 azalmas\u0131", "Talep tahmini ve y\u00fck dengeleme", "Yenilenebilir enerji entegrasyonu", "Ger\u00e7ek zamanl\u0131 izleme", "Karbon ayak izi azalmas\u0131"]);
    record2.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record2.set("implementationTime", "6-10 hafta");
    record2.set("caseStudies", [{"company": "\u0130stanbul Hastanesi", "industry": "Sa\u011fl\u0131k", "challenge": "Y\u00fcksek enerji maliyetleri ve kesintisiz g\u00fc\u00e7 ihtiyac\u0131", "solution": "Ak\u0131ll\u0131 enerji y\u00f6netim sistemi ve g\u00fcne\u015f paneli entegrasyonu", "result": "Enerji maliyeti %32 azald\u0131, kesinti s\u00fcresi %99.9'a iyile\u015fti"}, {"company": "Ankara Ticari Merkez", "industry": "Gayrimenkul", "challenge": "Binada enerji verimsizli\u011fi ve y\u00fcksek i\u015fletme maliyetleri", "solution": "Ak\u0131ll\u0131 bina enerji y\u00f6netim sistemi ve LED otomasyonu", "result": "Enerji t\u00fcketimi %38 azald\u0131, i\u015fletme maliyeti %25 d\u00fc\u015ft\u00fc"}, {"company": "Bursa \u00dcretim Tesisi", "industry": "\u00dcretim", "challenge": "\u00dcretim saatlerinde y\u00fcksek enerji talep ve maliyetleri", "solution": "Talep tahmini ve otomatik y\u00fck dengeleme sistemi", "result": "Pik saatlerde enerji maliyeti %40 azald\u0131, verimlilik %15 artt\u0131"}]);
    record2.set("faqs", [{"question": "Mevcut elektrik altyap\u0131s\u0131 de\u011fi\u015ftirilmeli mi?", "answer": "Hay\u0131r, sistem mevcut altyap\u0131 ile uyumludur. Minimal donan\u0131m eklentisi gerekebilir."}, {"question": "Yenilenebilir enerji kaynaklar\u0131 gerekli mi?", "answer": "Hay\u0131r, ancak varsa sistem bunlar\u0131 optimize eder. Geleneksel kaynaklar ile de \u00e7al\u0131\u015f\u0131r."}, {"question": "Kurulum s\u00fcresi ne kadar?", "answer": "Tipik olarak 2-4 hafta i\u00e7inde tam operasyonel hale gelir."}, {"question": "Enerji tasarrufu garantili mi?", "answer": "Evet, %25 minimum tasarruf garantisi ile ba\u015fl\u0131yoruz. \u00c7o\u011fu m\u00fc\u015fteri %30-40 elde eder."}]);
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
    record3.set("serviceId", "yonetim-kurulu-finans-teklif-otonomisi");
    record3.set("serviceName", "Y\u00f6netim Kurulu Finans & Teklif Otonomisi");
    record3.set("description", "Finansal karar alma s\u00fcre\u00e7lerinizi otomatikle\u015ftirin ve h\u0131zland\u0131r\u0131n. AI destekli finansal analiz, otomatik teklif olu\u015fturma ve b\u00fct\u00e7e optimizasyonu ile y\u00f6netim kurulu raporlamas\u0131 %60 h\u0131zlan\u0131r. Ger\u00e7ek zamanl\u0131 finansal g\u00f6stergeler ve tahminsel analitik.");
    record3.set("benefits", ["Finansal raporlama %60 h\u0131zlanmas\u0131", "Otomatik teklif olu\u015fturma", "B\u00fct\u00e7e optimizasyonu", "Tahminsel finansal analiz", "Karar alma h\u0131z\u0131 art\u0131\u015f\u0131"]);
    record3.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record3.set("implementationTime", "5-8 hafta");
    record3.set("caseStudies", [{"company": "T\u00fcrk Holding A.\u015e.", "industry": "Holding", "challenge": "Y\u00f6netim kurulu raporlamas\u0131 uzun zaman al\u0131yor ve veri tutars\u0131zl\u0131\u011f\u0131", "solution": "Otomatik finansal raporlama ve veri entegrasyonu sistemi", "result": "Raporlama s\u00fcresi 3 haftadan 5 g\u00fcne d\u00fc\u015ft\u00fc, veri tutarl\u0131l\u0131\u011f\u0131 %99.8'e ula\u015ft\u0131"}, {"company": "Ankara Finans Dan\u0131\u015fmanl\u0131k", "industry": "Finansal Hizmetler", "challenge": "Teklif olu\u015fturma s\u00fcreci manuel ve hata oran\u0131 y\u00fcksek", "solution": "AI tabanl\u0131 otomatik teklif olu\u015fturma ve do\u011frulama sistemi", "result": "Teklif olu\u015fturma s\u00fcresi %75 azald\u0131, hata oran\u0131 %0.5'e d\u00fc\u015ft\u00fc"}, {"company": "\u0130zmir Ticaret Bankas\u0131", "industry": "Bankac\u0131l\u0131k", "challenge": "Kredi kararlar\u0131 uzun zaman al\u0131yor ve risk analizi yetersiz", "solution": "Tahminsel analitik ve otomatik risk de\u011ferlendirme sistemi", "result": "Kredi karar s\u00fcresi %65 k\u0131sald\u0131, risk tahmin do\u011frulu\u011fu %94'e ula\u015ft\u0131"}]);
    record3.set("faqs", [{"question": "Mevcut muhasebe yaz\u0131l\u0131m\u0131 ile uyumlu mu?", "answer": "Evet, SAP, Oracle, NetSuite ve di\u011fer pop\u00fcler sistemler ile entegre edilebilir."}, {"question": "Finansal veri g\u00fcvenli\u011fi nas\u0131l sa\u011flan\u0131r?", "answer": "Banka d\u00fczeyinde \u015fifreleme, \u00e7ok fakt\u00f6rl\u00fc kimlik do\u011frulama ve denetim g\u00fcnl\u00fckleri ile korunur."}, {"question": "E\u011fitim gerekli mi?", "answer": "Minimal e\u011fitim gereklidir. Sistem kullan\u0131c\u0131 dostu ve sezgiseldir."}, {"question": "\u00d6zelle\u015ftirme m\u00fcmk\u00fcn m\u00fc?", "answer": "Evet, \u015firketinizin spesifik finansal s\u00fcre\u00e7lerine g\u00f6re tam \u00f6zelle\u015ftirme yap\u0131labilir."}]);
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
    record4.set("serviceId", "surec-rpa-otomasyonu-kurumsal-hafiza");
    record4.set("serviceName", "S\u00fcre\u00e7 (RPA) Otomasyonu & Kurumsal Haf\u0131za");
    record4.set("description", "\u0130\u015f s\u00fcre\u00e7lerinizi Robotic Process Automation (RPA) ile otomatikle\u015ftirin. Tekrarlayan g\u00f6revleri %90 otomatikle\u015ftirerek insan g\u00fcc\u00fcn\u00fc stratejik i\u015flere y\u00f6nlendirin. Kurumsal bilgi y\u00f6netimi ve i\u015flem haf\u0131zas\u0131 sistemi ile bilgi kayb\u0131n\u0131 \u00f6nleyin.");
    record4.set("benefits", ["Tekrarlayan g\u00f6revlerde %90 otomasyonu", "\u0130nsan g\u00fcc\u00fc verimlili\u011fi art\u0131\u015f\u0131", "Kurumsal bilgi korumas\u0131", "Hata oran\u0131 minimizasyonu", "Operasyon maliyeti azalmas\u0131"]);
    record4.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record4.set("implementationTime", "6-9 hafta");
    record4.set("caseStudies", [{"company": "Sigorta \u015eirketi T\u00fcrkiye", "industry": "Sigorta", "challenge": "Talep i\u015fleme s\u00fcreci manuel ve zaman al\u0131c\u0131, hata oran\u0131 y\u00fcksek", "solution": "RPA sistemi ile talep i\u015fleme otomasyonu ve do\u011frulama", "result": "Talep i\u015fleme s\u00fcresi %85 azald\u0131, hata oran\u0131 %0.2'ye d\u00fc\u015ft\u00fc, 50 ki\u015fi stratejik i\u015flere y\u00f6nlendirildi"}, {"company": "G\u00fcmr\u00fck M\u00fc\u015favirlik Firmas\u0131", "industry": "Lojistik", "challenge": "G\u00fcmr\u00fck belgeleri manuel i\u015fleme ve veri giri\u015fi", "solution": "RPA tabanl\u0131 belge i\u015fleme ve veri entegrasyonu", "result": "Belge i\u015fleme s\u00fcresi %80 k\u0131sald\u0131, veri giri\u015fi hatalar\u0131 %99 azald\u0131"}, {"company": "Kamu Kurumu", "industry": "Kamu", "challenge": "Ba\u015fvuru i\u015fleme s\u00fcreci uzun ve vatanda\u015f memnuniyeti d\u00fc\u015f\u00fck", "solution": "RPA sistemi ile otomatik ba\u015fvuru i\u015fleme ve bildirim", "result": "\u0130\u015fleme s\u00fcresi 30 g\u00fcnden 3 g\u00fcne d\u00fc\u015ft\u00fc, vatanda\u015f memnuniyeti %92'ye \u00e7\u0131kt\u0131"}]);
    record4.set("faqs", [{"question": "Hangi sistemler otomatikle\u015ftirilebilir?", "answer": "\u00c7o\u011fu kurumsal sistem otomatikle\u015ftirilebilir. Detayl\u0131 analiz i\u00e7in dan\u0131\u015fmanlar\u0131m\u0131zla ileti\u015fime ge\u00e7in."}, {"question": "\u0130\u015f\u00e7i \u00e7\u0131karmaya neden olur mu?", "answer": "Hay\u0131r, \u00e7al\u0131\u015fanlar tekrarlayan i\u015flerden kurtulur ve daha de\u011ferli i\u015flere y\u00f6nlendirilir."}, {"question": "Sistem ne kadar g\u00fcvenilir?", "answer": "%99.9 uptime garantisi ile \u00e7al\u0131\u015f\u0131r. Hata durumunda otomatik uyar\u0131 ve geri alma mekanizmas\u0131 vard\u0131r."}, {"question": "Bak\u0131m ve destek nas\u0131l sa\u011flan\u0131r?", "answer": "24/7 teknik destek ve ayl\u0131k sistem bak\u0131m\u0131 hizmetleri sunulur."}]);
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
    record5.set("serviceId", "limit-tanimazan-otonomi-modeli");
    record5.set("serviceName", "Limit Tan\u0131mayan Otonomi Modeli");
    record5.set("description", "Organizasyonunuzu tam otonom i\u015fletme modeline d\u00f6n\u00fc\u015ft\u00fcr\u00fcn. Merkezi olmayan karar alma, AI destekli y\u00f6netim ve otomatik i\u015f ak\u0131\u015flar\u0131 ile hiyerar\u015fi seviyelerini %70 azalt\u0131n. \u00c7al\u0131\u015fan \u00f6zerkli\u011fi ve i\u015f tatmini art\u0131\u015f\u0131.");
    record5.set("benefits", ["Hiyerar\u015fi seviyeleri %70 azalmas\u0131", "Karar alma h\u0131z\u0131 10x art\u0131\u015f\u0131", "\u00c7al\u0131\u015fan \u00f6zerkli\u011fi ve tatmini", "Operasyon maliyeti azalmas\u0131", "\u0130novasyon h\u0131z\u0131 art\u0131\u015f\u0131"]);
    record5.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record5.set("implementationTime", "8-12 hafta");
    record5.set("caseStudies", [{"company": "Yaz\u0131l\u0131m Geli\u015ftirme \u015eirketi", "industry": "Teknoloji", "challenge": "Hiyerar\u015fik yap\u0131 inovasyonu yava\u015flat\u0131yor ve \u00e7al\u0131\u015fan memnuniyeti d\u00fc\u015f\u00fck", "solution": "Otonom tak\u0131m yap\u0131s\u0131 ve AI destekli karar alma sistemi", "result": "Karar alma s\u00fcresi %80 k\u0131sald\u0131, \u00e7al\u0131\u015fan memnuniyeti %85'e \u00e7\u0131kt\u0131, \u00fcr\u00fcn geli\u015ftirme h\u0131z\u0131 3x artt\u0131"}, {"company": "Dan\u0131\u015fmanl\u0131k Firmas\u0131", "industry": "Dan\u0131\u015fmanl\u0131k", "challenge": "Proje y\u00f6netimi merkezi ve esnek de\u011fil", "solution": "Otonom proje tak\u0131mlar\u0131 ve merkezi olmayan b\u00fct\u00e7e y\u00f6netimi", "result": "Proje teslim s\u00fcresi %40 k\u0131sald\u0131, m\u00fc\u015fteri memnuniyeti %90'a \u00e7\u0131kt\u0131"}, {"company": "Perakende Zinciri", "industry": "Perakende", "challenge": "Ma\u011faza m\u00fcd\u00fcrleri merkezi kararlar\u0131 bekliyor, m\u00fc\u015fteri hizmet kalitesi d\u00fc\u015f\u00fck", "solution": "Ma\u011faza d\u00fczeyinde otonom karar alma ve AI destekli envanter y\u00f6netimi", "result": "M\u00fc\u015fteri hizmet s\u00fcresi %50 azald\u0131, sat\u0131\u015f %25 artt\u0131, ma\u011faza m\u00fcd\u00fcr\u00fc memnuniyeti %88'e \u00e7\u0131kt\u0131"}]);
    record5.set("faqs", [{"question": "Kontrol nas\u0131l sa\u011flan\u0131r?", "answer": "AI tabanl\u0131 risk y\u00f6netimi ve otomatik uyar\u0131 sistemleri ile kontrol sa\u011flan\u0131r. Kritik kararlar insan onay\u0131 gerektirir."}, {"question": "T\u00fcm organizasyon i\u00e7in uygulanabilir mi?", "answer": "Evet, ancak kademeli olarak uygulanmas\u0131 \u00f6nerilir. Pilot projelerle ba\u015flay\u0131p geni\u015fletebilirsiniz."}, {"question": "K\u00fclt\u00fcr de\u011fi\u015fimi gerekli mi?", "answer": "Evet, \u00f6nemli bir k\u00fclt\u00fcr de\u011fi\u015fimi gereklidir. Kapsaml\u0131 e\u011fitim ve de\u011fi\u015fim y\u00f6netimi deste\u011fi sa\u011flan\u0131r."}, {"question": "Ba\u015far\u0131 oran\u0131 nedir?", "answer": "Do\u011fru uyguland\u0131\u011f\u0131nda %95 ba\u015far\u0131 oran\u0131 ile sonu\u00e7lan\u0131r. Ba\u015far\u0131s\u0131zl\u0131k genellikle k\u00fclt\u00fcr direncinden kaynaklan\u0131r."}]);
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
    record6.set("serviceId", "ai-veri-analizi-degerlendirme-otomasyonu");
    record6.set("serviceName", "AI Veri Analizi & De\u011ferlendirme Otomasyonu");
    record6.set("description", "B\u00fcy\u00fck veri setlerinizi AI ile analiz edin ve otomatik de\u011ferlendirmeler yap\u0131n. Makine \u00f6\u011frenmesi algoritmalar\u0131 ile gizli desenleri ke\u015ffedin, tahminler yap\u0131n ve i\u015fletme zekas\u0131 raporlar\u0131 otomatik olu\u015fturun. Veri odakl\u0131 karar alma k\u00fclt\u00fcr\u00fc olu\u015fturun.");
    record6.set("benefits", ["Veri analizi s\u00fcresi %80 azalmas\u0131", "Gizli desenlerin ke\u015ffi", "Tahminsel analitik", "Otomatik raporlama", "Veri odakl\u0131 karar alma"]);
    record6.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record6.set("implementationTime", "5-8 hafta");
    record6.set("caseStudies", [{"company": "E-ticaret Platformu", "industry": "E-ticaret", "challenge": "M\u00fc\u015fteri davran\u0131\u015f\u0131 analizi zaman al\u0131c\u0131, sat\u0131\u015f tahminleri hatal\u0131", "solution": "AI tabanl\u0131 m\u00fc\u015fteri analizi ve sat\u0131\u015f tahmin sistemi", "result": "Sat\u0131\u015f tahmin do\u011frulu\u011fu %92'ye \u00e7\u0131kt\u0131, m\u00fc\u015fteri segmentasyonu %300 iyile\u015fti, sat\u0131\u015f %35 artt\u0131"}, {"company": "Sa\u011fl\u0131k Hizmetleri Grubu", "industry": "Sa\u011fl\u0131k", "challenge": "Hasta verilerinin analizi manuel, tan\u0131 destek sistemi yok", "solution": "AI tabanl\u0131 hasta veri analizi ve tan\u0131 destek sistemi", "result": "Tan\u0131 do\u011frulu\u011fu %88'e \u00e7\u0131kt\u0131, hasta sonu\u00e7lar\u0131 %25 iyile\u015fti, operasyon s\u00fcresi %20 k\u0131sald\u0131"}, {"company": "\u00dcretim \u015eirketi", "industry": "\u00dcretim", "challenge": "\u00dcretim verilerinin analizi yetersiz, kalite sorunlar\u0131 \u00f6nceden tahmin edilemiyor", "solution": "AI tabanl\u0131 \u00fcretim veri analizi ve kalite tahmin sistemi", "result": "Kalite sorunlar\u0131 %85 oran\u0131nda \u00f6nceden tahmin edildi, hatal\u0131 \u00fcr\u00fcn %60 azald\u0131"}]);
    record6.set("faqs", [{"question": "Hangi veri formatlar\u0131 destekleniyor?", "answer": "CSV, Excel, JSON, XML, SQL veritabanlar\u0131 ve ger\u00e7ek zamanl\u0131 veri ak\u0131\u015flar\u0131 desteklenir."}, {"question": "Veri gizlili\u011fi nas\u0131l korunur?", "answer": "T\u00fcm veriler \u015fifreli olarak saklan\u0131r ve i\u015flenir. GDPR ve KVKK uyumludur."}, {"question": "Sonu\u00e7lar ne kadar g\u00fcvenilir?", "answer": "Model do\u011frulu\u011fu %85-95 aras\u0131nda de\u011fi\u015fir. Veri kalitesi ve miktar\u0131 do\u011frulu\u011fu etkiler."}, {"question": "Raporlar ne s\u0131kl\u0131kla g\u00fcncellenir?", "answer": "Ger\u00e7ek zamanl\u0131, g\u00fcnl\u00fck, haftal\u0131k veya ayl\u0131k raporlama se\u00e7enekleri sunulur."}]);
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
    record7.set("serviceId", "ai-ajanlari-otonom-is-surecleri");
    record7.set("serviceName", "AI Ajanlar\u0131 & Otonom \u0130\u015f S\u00fcre\u00e7leri");
    record7.set("description", "Yapay zeka ajanlar\u0131 ile tam otonom i\u015f s\u00fcre\u00e7leri olu\u015fturun. M\u00fc\u015fteri hizmetinden sat\u0131\u015f, pazarlama ve operasyonlara kadar t\u00fcm s\u00fcre\u00e7leri AI ajanlar\u0131 y\u00f6netebilir. 24/7 operasyon, insan m\u00fcdahalesi olmadan i\u015fletme y\u00f6netimi.");
    record7.set("benefits", ["24/7 otonom operasyon", "\u0130nsan m\u00fcdahalesi %95 azalmas\u0131", "M\u00fc\u015fteri hizmet kalitesi art\u0131\u015f\u0131", "Operasyon maliyeti %60 azalmas\u0131", "\u00d6l\u00e7eklenebilir i\u015f modeli"]);
    record7.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record7.set("implementationTime", "8-12 hafta");
    record7.set("caseStudies", [{"company": "M\u00fc\u015fteri Hizmetleri Merkezi", "industry": "Hizmetler", "challenge": "24/7 m\u00fc\u015fteri hizmetinin y\u00fcksek maliyeti, \u00e7al\u0131\u015fan devir oran\u0131 y\u00fcksek", "solution": "AI ajanlar\u0131 ile 24/7 m\u00fc\u015fteri hizmetleri ve insan deste\u011fi entegrasyonu", "result": "M\u00fc\u015fteri hizmet maliyeti %65 azald\u0131, m\u00fc\u015fteri memnuniyeti %92'ye \u00e7\u0131kt\u0131, \u00e7al\u0131\u015fan devir oran\u0131 %40 d\u00fc\u015ft\u00fc"}, {"company": "Sat\u0131\u015f \u015eirketi", "industry": "Sat\u0131\u015f", "challenge": "Sat\u0131\u015f temsilcileri manuel g\u00f6revlerle me\u015fgul, sat\u0131\u015f verimlili\u011fi d\u00fc\u015f\u00fck", "solution": "AI ajanlar\u0131 ile m\u00fc\u015fteri takip, teklif olu\u015fturma ve sat\u0131\u015f y\u00f6netimi otomasyonu", "result": "Sat\u0131\u015f temsilcileri %70 daha fazla sat\u0131\u015f yapabildi, sat\u0131\u015f d\u00f6ng\u00fcs\u00fc %50 k\u0131sald\u0131"}, {"company": "Pazarlama Ajans\u0131", "industry": "Pazarlama", "challenge": "Kampanya y\u00f6netimi zaman al\u0131c\u0131, A/B testleri manuel yap\u0131l\u0131yor", "solution": "AI ajanlar\u0131 ile otomatik kampanya y\u00f6netimi ve optimizasyonu", "result": "Kampanya ROI %180 artt\u0131, kampanya olu\u015fturma s\u00fcresi %80 azald\u0131, A/B test otomasyonu %95 h\u0131zland\u0131"}]);
    record7.set("faqs", [{"question": "AI ajanlar\u0131 ne kadar ak\u0131ll\u0131?", "answer": "G\u00fcn\u00fcm\u00fcz\u00fcn en geli\u015fmi\u015f LLM'ler kullan\u0131l\u0131r. \u00c7o\u011fu m\u00fc\u015fteri hizmet sorusunu %95 do\u011frulukla \u00e7\u00f6zer."}, {"question": "\u0130nsan deste\u011fine ne zaman ihtiya\u00e7 duyulur?", "answer": "Karma\u015f\u0131k veya \u00f6zel durumlar i\u00e7in insan deste\u011fine y\u00f6nlendirilir. Tipik olarak %5-10 durumda gereklidir."}, {"question": "Ajanlar \u00f6\u011frenebilir mi?", "answer": "Evet, her etkile\u015fimden \u00f6\u011frenirler ve zaman i\u00e7inde daha iyi hale gelirler."}, {"question": "Hangi dilleri destekler?", "answer": "50+ dili destekler. T\u00fcrk\u00e7e tam olarak desteklenir."}]);
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
    record8.set("serviceId", "tahminsel-analitik-risk-yonetimi");
    record8.set("serviceName", "Tahminsel Analitik & Risk Y\u00f6netimi");
    record8.set("description", "Gelecekteki riskleri \u00f6nceden tahmin edin ve y\u00f6netin. Makine \u00f6\u011frenmesi ile finansal riskleri, operasyon risklerini ve pazarlama risklerini tahmin edin. Proaktif risk y\u00f6netimi ile kay\u0131plar\u0131 %70'e kadar azalt\u0131n.");
    record8.set("benefits", ["Risk tahmin do\u011frulu\u011fu %90+", "Proaktif risk y\u00f6netimi", "Finansal kay\u0131p azalmas\u0131 %70", "Sigorta maliyeti azalmas\u0131", "Uyum ve denetim otomasyonu"]);
    record8.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record8.set("implementationTime", "6-10 hafta");
    record8.set("caseStudies", [{"company": "Banka", "industry": "Bankac\u0131l\u0131k", "challenge": "Kredi riski y\u00f6netimi yetersiz, k\u00f6t\u00fc bor\u00e7lar y\u00fcksek", "solution": "Tahminsel analitik ile kredi riski de\u011ferlendirmesi ve izleme", "result": "K\u00f6t\u00fc bor\u00e7 oran\u0131 %8'den %1.5'e d\u00fc\u015ft\u00fc, kredi tahmin do\u011frulu\u011fu %94'e \u00e7\u0131kt\u0131"}, {"company": "Sigorta \u015eirketi", "industry": "Sigorta", "challenge": "Talep tahminleri hatal\u0131, rezerv y\u00f6netimi yetersiz", "solution": "Tahminsel analitik ile talep tahminleri ve rezerv optimizasyonu", "result": "Talep tahmin do\u011frulu\u011fu %91'e \u00e7\u0131kt\u0131, rezerv maliyeti %25 azald\u0131"}, {"company": "\u00dcretim \u015eirketi", "industry": "\u00dcretim", "challenge": "Makine ar\u0131zalar\u0131 \u00f6nceden tahmin edilemiyor, \u00fcretim kesintileri s\u0131k", "solution": "Tahminsel analitik ile makine ar\u0131zas\u0131 tahminleri ve bak\u0131m planlama", "result": "Makine ar\u0131zalar\u0131 %80 oran\u0131nda \u00f6nceden tahmin edildi, \u00fcretim kesintileri %75 azald\u0131"}]);
    record8.set("faqs", [{"question": "Tahminler ne kadar do\u011fru?", "answer": "Tipik olarak %85-95 do\u011fruluk oran\u0131 elde edilir. Veri kalitesi do\u011frulu\u011fu etkiler."}, {"question": "Ka\u00e7 y\u0131l \u00f6nceden tahmin yap\u0131labilir?", "answer": "Tipik olarak 6-12 ay \u00f6nceden tahmin yap\u0131labilir. Daha uzun d\u00f6nem tahminler daha az do\u011frudur."}, {"question": "Modeller d\u00fczenli olarak g\u00fcncellenmeli mi?", "answer": "Evet, ayda bir veya yeni veriler elde edildik\u00e7e g\u00fcncellenmesi \u00f6nerilir."}, {"question": "Hangi risk t\u00fcrleri tahmin edilebilir?", "answer": "Finansal, operasyon, pazarlama, siber g\u00fcvenlik ve uyum riskleri tahmin edilebilir."}]);
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
    record9.set("serviceId", "kurumsal-veri-guvenligi-ai-uyum");
    record9.set("serviceName", "Kurumsal Veri G\u00fcvenli\u011fi & AI Uyum");
    record9.set("description", "Kurumsal verilerinizi AI \u00e7a\u011f\u0131nda g\u00fcvenli tutun. Geli\u015fmi\u015f \u015fifreleme, anomali tespiti ve otomatik tehdit yan\u0131t\u0131 ile siber sald\u0131r\u0131lar\u0131 %99 oran\u0131nda \u00f6nleyin. GDPR, KVKK ve AI d\u00fczenlemeleri ile tam uyum sa\u011flay\u0131n.");
    record9.set("benefits", ["Siber sald\u0131r\u0131 \u00f6nleme %99", "Veri ihlali riski minimizasyonu", "GDPR/KVKK uyumu", "AI d\u00fczenleme uyumu", "Otomatik tehdit yan\u0131t\u0131"]);
    record9.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record9.set("implementationTime", "4-8 hafta");
    record9.set("caseStudies", [{"company": "Finans Kurumu", "industry": "Finansal Hizmetler", "challenge": "Veri ihlali riski y\u00fcksek, uyum denetimi ba\u015far\u0131s\u0131z", "solution": "Kurumsal veri g\u00fcvenli\u011fi ve otomatik uyum izleme sistemi", "result": "Veri ihlali riski %99 azald\u0131, uyum denetimi %100 ba\u015far\u0131l\u0131, siber sigorta maliyeti %40 d\u00fc\u015ft\u00fc"}, {"company": "Sa\u011fl\u0131k Hizmetleri", "industry": "Sa\u011fl\u0131k", "challenge": "Hasta verilerinin gizlili\u011fi kritik, KVKK uyumu zorunlu", "solution": "Hasta veri \u015fifreleme ve otomatik KVKK uyum sistemi", "result": "Veri g\u00fcvenli\u011fi %99.9'a \u00e7\u0131kt\u0131, KVKK uyumu %100, denetim bulgular\u0131 s\u0131f\u0131ra indi"}, {"company": "Teknoloji \u015eirketi", "industry": "Teknoloji", "challenge": "AI modellerinin uyum riski, veri y\u00f6neti\u015fimi yetersiz", "solution": "AI uyum sistemi ve otomatik veri y\u00f6neti\u015fimi", "result": "AI uyum riski %95 azald\u0131, veri y\u00f6neti\u015fimi %100 otomatikle\u015fti, denetim s\u00fcresi %70 k\u0131sald\u0131"}]);
    record9.set("faqs", [{"question": "Hangi d\u00fczenlemeler kapsan\u0131yor?", "answer": "GDPR, KVKK, HIPAA, PCI-DSS ve di\u011fer end\u00fcstri standartlar\u0131 kapsan\u0131r."}, {"question": "\u015eifreleme ne kadar g\u00fcvenli?", "answer": "Banka d\u00fczeyinde 256-bit AES \u015fifreleme kullan\u0131l\u0131r. End\u00fcstri standard\u0131 en y\u00fcksek seviyedir."}, {"question": "Anomali tespiti ne kadar do\u011fru?", "answer": "Yanl\u0131\u015f pozitif oran\u0131 %1'den az, ger\u00e7ek tehditleri %98 oran\u0131nda yakalar."}, {"question": "Denetim raporlar\u0131 otomatik mi?", "answer": "Evet, ayl\u0131k veya talep \u00fczerine otomatik denetim raporlar\u0131 olu\u015fturulur."}]);
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