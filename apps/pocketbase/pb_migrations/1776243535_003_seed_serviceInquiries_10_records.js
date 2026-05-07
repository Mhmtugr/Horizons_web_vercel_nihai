/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("serviceInquiries");

  const record0 = new Record(collection);
    record0.set("serviceId", "srv_001");
    record0.set("serviceName", "Otonom \u00dcretim & Fabrika Zekas\u0131");
    record0.set("description", "\u00dcretim s\u00fcre\u00e7lerini otomatikle\u015ftiren ve fabrika operasyonlar\u0131n\u0131 optimize eden yapay zeka \u00e7\u00f6z\u00fcm\u00fc");
    record0.set("benefits", ["\u00dcretim verimlili\u011finde %40 art\u0131\u015f", "Hata oran\u0131nda %60 azal\u0131\u015f", "Ger\u00e7ek zamanl\u0131 \u00fcretim izleme", "Otomatik kalite kontrol"]);
    record0.set("pricing", "\u00d6zel fiyatland\u0131rma");
    record0.set("implementationTime", "8-12 hafta");
    record0.set("caseStudies", [{"company": "\u00d6rnek \u00dcretim A.\u015e.", "result": "\u00dcretim kapasitesi %35 artt\u0131"}]);
    record0.set("faqs", [{"question": "Mevcut sistemlerle uyumlu mu?", "answer": "Evet, t\u00fcm end\u00fcstri 4.0 standartlar\u0131yla uyumludur"}]);
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
    record1.set("serviceId", "srv_002");
    record1.set("serviceName", "B2B K\u00fcresel M\u00fc\u015fteri Radar\u0131");
    record1.set("description", "K\u00fcresel B2B pazar\u0131nda potansiyel m\u00fc\u015fterileri tan\u0131mlayan ve analiz eden yapay zeka sistemi");
    record1.set("benefits", ["Yeni m\u00fc\u015fteri bulma otomasyonu", "Pazar analizi ve trendler", "Rekabet analizi", "M\u00fc\u015fteri segmentasyonu"]);
    record1.set("pricing", "Ayl\u0131k abonelik modeli");
    record1.set("implementationTime", "4-6 hafta");
    record1.set("caseStudies", [{"company": "\u0130hracat \u015eirketi Ltd.", "result": "Yeni m\u00fc\u015fteri say\u0131s\u0131 3 kat\u0131na \u00e7\u0131kt\u0131"}]);
    record1.set("faqs", [{"question": "Hangi pazarlar\u0131 kaps\u0131yor?", "answer": "T\u00fcm d\u00fcnya pazarlar\u0131n\u0131 kapsamaktad\u0131r"}]);
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
    record2.set("serviceId", "srv_003");
    record2.set("serviceName", "Elektrik M\u00fchendisli\u011fi & Ak\u0131ll\u0131 Enerji");
    record2.set("description", "Enerji y\u00f6netimi ve elektrik sistemlerini optimize eden yapay zeka \u00e7\u00f6z\u00fcm\u00fc");
    record2.set("benefits", ["Enerji t\u00fcketiminde %30 tasarruf", "Sistem ar\u0131zalar\u0131n\u0131n \u00f6nceden tespiti", "Ak\u0131ll\u0131 enerji da\u011f\u0131l\u0131m\u0131", "Yenilenebilir enerji entegrasyonu"]);
    record2.set("pricing", "Kurulum + Ayl\u0131k");
    record2.set("implementationTime", "6-10 hafta");
    record2.set("caseStudies", [{"company": "Enerji \u015eirketi A.\u015e.", "result": "Y\u0131ll\u0131k enerji maliyeti %28 azald\u0131"}]);
    record2.set("faqs", [{"question": "G\u00fcne\u015f panelleriyle uyumlu mu?", "answer": "Evet, t\u00fcm yenilenebilir enerji kaynaklar\u0131yla uyumludur"}]);
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
    record3.set("serviceId", "srv_004");
    record3.set("serviceName", "Y\u00f6netim Kurulu Finans & Teklif Otonomisi");
    record3.set("description", "Finansal kararlar\u0131 otomatikle\u015ftiren ve teklif s\u00fcre\u00e7lerini h\u0131zland\u0131ran yapay zeka sistemi");
    record3.set("benefits", ["Teklif haz\u0131rlama s\u00fcresi %70 azal\u0131\u015f", "Finansal tahminleme do\u011frulu\u011fu %95+", "Otomatik b\u00fct\u00e7e y\u00f6netimi", "Risk analizi ve uyar\u0131lar\u0131"]);
    record3.set("pricing", "Kurumsal lisans");
    record3.set("implementationTime", "10-14 hafta");
    record3.set("caseStudies", [{"company": "Finans Kurumu Ltd.", "result": "Teklif d\u00f6n\u00fc\u015f\u00fcm oran\u0131 %45 artt\u0131"}]);
    record3.set("faqs", [{"question": "Muhasebe yaz\u0131l\u0131m\u0131yla entegre olur mu?", "answer": "Evet, t\u00fcm pop\u00fcler muhasebe yaz\u0131l\u0131mlar\u0131yla entegre olur"}]);
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
    record4.set("serviceId", "srv_005");
    record4.set("serviceName", "S\u00fcre\u00e7 (RPA) Otomasyonu & Kurumsal Haf\u0131za");
    record4.set("description", "\u0130\u015f s\u00fcre\u00e7lerini otomatikle\u015ftiren ve kurumsal bilgiyi merkezi olarak y\u00f6neten sistem");
    record4.set("benefits", ["Tekrarlayan i\u015flerde %80 zaman tasarrufu", "\u0130nsan hatalar\u0131nda %90 azal\u0131\u015f", "Kurumsal bilgi kayb\u0131 \u00f6nleme", "S\u00fcre\u00e7 standardizasyonu"]);
    record4.set("pricing", "Proses ba\u015f\u0131na \u00fccretlendirme");
    record4.set("implementationTime", "6-8 hafta");
    record4.set("caseStudies", [{"company": "Hizmet \u015eirketi A.\u015e.", "result": "Y\u0131ll\u0131k 5000+ saat i\u015f\u00e7ilik tasarrufu"}]);
    record4.set("faqs", [{"question": "Hangi yaz\u0131l\u0131mlar\u0131 otomatikle\u015ftirebilir?", "answer": "T\u00fcm Windows tabanl\u0131 uygulamalar\u0131 otomatikle\u015ftirebilir"}]);
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
    record5.set("serviceId", "srv_006");
    record5.set("serviceName", "Limit Tan\u0131mayan Otonomi Modeli");
    record5.set("description", "S\u0131n\u0131rs\u0131z \u00f6l\u00e7eklenebilir ve tamamen otonom i\u015fletme modeli");
    record5.set("benefits", ["24/7 otomatik operasyon", "S\u0131n\u0131rs\u0131z \u00f6l\u00e7eklenebilirlik", "\u0130nsan m\u00fcdahalesi gerektirmez", "Maliyet optimizasyonu"]);
    record5.set("pricing", "\u00d6zel kurumsal fiyatland\u0131rma");
    record5.set("implementationTime", "12-16 hafta");
    record5.set("caseStudies", [{"company": "Teknoloji \u015eirketi Ltd.", "result": "Operasyonel maliyetler %50 azald\u0131"}]);
    record5.set("faqs", [{"question": "Tamamen otomatik \u00e7al\u0131\u015fabilir mi?", "answer": "Evet, sistem tamamen otonom olarak tasarlanm\u0131\u015ft\u0131r"}]);
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
    record6.set("serviceId", "srv_007");
    record6.set("serviceName", "AI Veri Analizi & De\u011ferlendirme Otomasyonu");
    record6.set("description", "B\u00fcy\u00fck veri setlerini analiz eden ve otomatik raporlar \u00fcreten yapay zeka sistemi");
    record6.set("benefits", ["Veri analizi s\u00fcresi %85 azal\u0131\u015f", "Gizli desenleri ke\u015ffetme", "Otomatik rapor olu\u015fturma", "Ger\u00e7ek zamanl\u0131 i\u015f zekas\u0131"]);
    record6.set("pricing", "Veri hacmine g\u00f6re \u00fccretlendirme");
    record6.set("implementationTime", "4-6 hafta");
    record6.set("caseStudies", [{"company": "Veri Analitik \u015eirketi A.\u015e.", "result": "Analiz do\u011frulu\u011fu %92'ye y\u00fckseldi"}]);
    record6.set("faqs", [{"question": "Hangi veri formatlar\u0131n\u0131 destekler?", "answer": "CSV, JSON, XML, SQL ve daha bir\u00e7ok format\u0131 destekler"}]);
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
    record7.set("serviceId", "srv_008");
    record7.set("serviceName", "AI Ajanlar\u0131 & Otonom \u0130\u015f S\u00fcre\u00e7leri");
    record7.set("description", "Ba\u011f\u0131ms\u0131z olarak \u00e7al\u0131\u015fan yapay zeka ajanlar\u0131 ile i\u015f s\u00fcre\u00e7lerini y\u00f6netme sistemi");
    record7.set("benefits", ["Otonom karar alma", "Ger\u00e7ek zamanl\u0131 problem \u00e7\u00f6zme", "\u0130\u015f s\u00fcre\u00e7lerinde esneklik", "Adaptif sistem davran\u0131\u015f\u0131"]);
    record7.set("pricing", "Ajan ba\u015f\u0131na ayl\u0131k \u00fccret");
    record7.set("implementationTime", "8-10 hafta");
    record7.set("caseStudies", [{"company": "Lojistik \u015eirketi Ltd.", "result": "Teslimat s\u00fcresi %25 azald\u0131"}]);
    record7.set("faqs", [{"question": "Ajanlar birbirleriyle ileti\u015fim kurabilir mi?", "answer": "Evet, ajanlar tam otonom ileti\u015fim kurabilir"}]);
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
    record8.set("serviceId", "srv_009");
    record8.set("serviceName", "Tahminsel Analitik & Risk Y\u00f6netimi");
    record8.set("description", "Gelecekteki trendleri tahmin eden ve riskleri \u00f6nceden tespit eden yapay zeka sistemi");
    record8.set("benefits", ["Tahminleme do\u011frulu\u011fu %90+", "Risk \u00f6nceden tespiti", "Senaryolama ve sim\u00fclasyon", "Proaktif karar alma"]);
    record8.set("pricing", "Kurumsal lisans + Dan\u0131\u015fmanl\u0131k");
    record8.set("implementationTime", "10-12 hafta");
    record8.set("caseStudies", [{"company": "Sigorta \u015eirketi A.\u015e.", "result": "Risk tahminlemesi %88 do\u011fruluk oran\u0131na ula\u015ft\u0131"}]);
    record8.set("faqs", [{"question": "Tarihsel veriye ihtiya\u00e7 var m\u0131?", "answer": "Evet, en az 2 y\u0131ll\u0131k tarihsel veri \u00f6nerilir"}]);
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
    record9.set("serviceId", "srv_010");
    record9.set("serviceName", "Kurumsal Veri G\u00fcvenli\u011fi & AI Uyum");
    record9.set("description", "Kurumsal verileri koruyan ve yapay zeka sistemlerini uyumlu hale getiren g\u00fcvenlik \u00e7\u00f6z\u00fcm\u00fc");
    record9.set("benefits", ["Veri \u015fifreleme ve koruma", "AI sistemlerinin uyumlulu\u011fu", "Siber tehdit tespiti", "D\u00fczenleme uyumlulu\u011fu (GDPR, KVKK)"]);
    record9.set("pricing", "Kurumsal g\u00fcvenlik paketi");
    record9.set("implementationTime", "6-8 hafta");
    record9.set("caseStudies", [{"company": "Finans Kurumu Ltd.", "result": "Veri ihlali riski %99 azald\u0131"}]);
    record9.set("faqs", [{"question": "GDPR uyumlu mu?", "answer": "Evet, t\u00fcm uluslararas\u0131 veri koruma standartlar\u0131na uyumludur"}]);
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