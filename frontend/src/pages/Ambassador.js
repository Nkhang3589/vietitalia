import { getLocale } from "../i18n/i18n.js";

export default function Ambassador(container) {
  const isVi = getLocale() === "vi";

  // --- DỮ LIỆU ĐA NGÔN NGỮ ---
  const themes = isVi 
    ? [ "Văn hóa và lối sống của người Ý", "Hệ thống giáo dục và đào tạo nghề tại Veneto", "Các mô hình doanh nghiệp địa phương", "Cuộc sống cộng đồng tại Belluno và Feltre", "Cơ hội học tập, hợp tác và phát triển giữa Việt Nam và Ý", "Chương trình Đại Sứ Văn Hóa Việt Ý" ]
    : [ "Cultura e stile di vita italiano", "Sistema di istruzione e formazione professionale in Veneto", "Modelli di business locali", "Vita comunitaria a Belluno e Feltre", "Opportunità di studio, cooperazione e sviluppo tra Vietnam e Italia", "Programma Ambasciatore Culturale VietItalia" ];

  const audiences = isVi 
    ? [ ["school", "Sinh viên"], ["cast_for_education", "Giáo viên"], ["work", "Doanh nhân"], ["travel_explore", "Người làm du lịch"], ["edit_note", "Người sáng tạo nội dung"], ["favorite", "Người yêu văn hóa Ý"] ]
    : [ ["school", "Studenti"], ["cast_for_education", "Insegnanti"], ["work", "Imprenditori"], ["travel_explore", "Operatori turistici"], ["edit_note", "Creatori di contenuti"], ["favorite", "Amanti della cultura italiana"] ];

  const itinerary = isVi 
    ? [
        { day: 1, icon: "👋", title: "Chào mừng đến Feltre", items: ["Đón đoàn và nhận phòng.", "Giới thiệu chương trình Đại Sứ Văn Hóa VietItalia.", "Giao lưu làm quen với cộng đồng địa phương.", "Tìm hiểu tổng quan về Feltre, Belluno và vùng Veneto."] },
        { day: 2, icon: "🏛️", title: "Khám phá Feltre lịch sử", items: ["Tham quan trung tâm lịch sử Feltre.", "Khám phá bảo tàng, nhà thờ và di tích La Mã dưới lòng đất.", "Tìm hiểu lịch sử và văn hóa địa phương.", "Thực hành giao tiếp và quan sát đời sống người dân Ý."] },
        { day: 3, icon: "🏔️", title: "Thiên nhiên và phát triển bền vững", items: ["Tham quan khu vực Dolomiti UNESCO hoặc công viên tự nhiên.", "Tìm hiểu mô hình bảo tồn môi trường của Ý.", "Trao đổi về du lịch bền vững và chất lượng sống tại Belluno."] },
        { day: 4, icon: "🎓", title: "Giáo dục và Doanh nghiệp Ý", items: ["Tham quan trường đào tạo nghề hoặc đại học tại Belluno.", "Gặp gỡ doanh nghiệp địa phương.", "Tìm hiểu mô hình đào tạo nghề, khởi nghiệp và quản trị doanh nghiệp tại Ý.", 'Chuyên đề: "Học nước Ý từ những người Ý thật".'] },
        { day: 5, icon: "🤝", title: "Đại Sứ Văn Hóa VietItalia", items: ["Workshop về văn hóa Ý và kỹ năng giao tiếp quốc tế.", "Thảo luận về cơ hội hợp tác Việt Nam – Ý.", "Gặp gỡ các tổ chức, hiệp hội và cộng đồng địa phương.", "Xây dựng ý tưởng dự án cá nhân sau khi trở về Việt Nam."] },
        { day: 6, icon: "🚂", title: "Trải nghiệm Venice", items: ["Di chuyển bằng tàu hỏa đến Venice.", "Khám phá di sản văn hóa thế giới.", "Tìm hiểu mô hình phát triển du lịch và bảo tồn di sản của Ý.", "Ghi hình, thực hiện bài tập trải nghiệm văn hóa."] },
        { day: 7, icon: "🎤", title: "Kết nối và tốt nghiệp", items: ["Tổng kết chương trình.", "Thuyết trình ý tưởng hoặc kế hoạch hành động cá nhân.", "Nhận Chứng nhận tham gia chương trình.", "Chính thức gia nhập Mạng lưới Đại Sứ Văn Hóa VietItalia.", "Kết thúc chương trình, tự do di chuyển ra sân bay."] }
      ]
    : [
        { day: 1, icon: "👋", title: "Benvenuti a Feltre", items: ["Accoglienza e check-in.", "Presentazione del programma Ambasciatore Culturale VietItalia.", "Incontro con la comunità locale.", "Panoramica su Feltre, Belluno e la regione Veneto."] },
        { day: 2, icon: "🏛️", title: "Alla scoperta della Feltre storica", items: ["Visita al centro storico di Feltre.", "Esplorazione di musei, chiese e rovine romane sotterranee.", "Scoperta della storia e della cultura locale.", "Pratica di comunicazione e osservazione della vita quotidiana italiana."] },
        { day: 3, icon: "🏔️", title: "Natura e sviluppo sostenibile", items: ["Visita alle Dolomiti UNESCO o a un parco naturale.", "Scoperta del modello italiano di conservazione ambientale.", "Discussione sul turismo sostenibile e la qualità della vita a Belluno."] },
        { day: 4, icon: "🎓", title: "Istruzione e Imprese italiane", items: ["Visita a una scuola professionale o università a Belluno.", "Incontro con le imprese locali.", "Scoperta del modello di formazione professionale, startup e gestione aziendale in Italia.", 'Tema: "Imparare l\'Italia dai veri italiani".'] },
        { day: 5, icon: "🤝", title: "Ambasciatore Culturale VietItalia", items: ["Workshop sulla cultura italiana e le competenze di comunicazione internazionale.", "Discussione sulle opportunità di cooperazione Vietnam-Italia.", "Incontro con organizzazioni, associazioni e comunità locali.", "Sviluppo di idee per progetti personali dopo il ritorno in Vietnam."] },
        { day: 6, icon: "🚂", title: "Esperienza a Venezia", items: ["Viaggio in treno per Venezia.", "Esplorazione del patrimonio culturale mondiale.", "Scoperta del modello di sviluppo turistico e conservazione del patrimonio in Italia.", "Registrazioni video e compiti di esperienza culturale."] },
        { day: 7, icon: "🎤", title: "Connessione e diploma", items: ["Conclusione del programma.", "Presentazione delle idee o dei piani d'azione personali.", "Consegna dell'Attestato di partecipazione.", "Ingresso ufficiale nella Rete degli Ambasciatori Culturali VietItalia.", "Fine del programma, trasferimento libero all'aeroporto."] }
      ];

  const values = isVi 
    ? [ "Hiểu sâu hơn về văn hóa và lối sống người Ý", "Khám phá hệ thống giáo dục và đào tạo nghề tại Veneto", "Tiếp cận doanh nghiệp địa phương và mô hình phát triển cộng đồng", "Trải nghiệm Belluno – Feltre – Dolomiti UNESCO – Venice", "Mở rộng mạng lưới quan hệ quốc tế", "Trở thành thành viên chương trình Đại Sứ Văn Hóa VietItalia" ]
    : [ "Comprendere a fondo la cultura e lo stile di vita italiano", "Scoprire il sistema di istruzione e formazione professionale in Veneto", "Avvicinarsi alle imprese locali e ai modelli di sviluppo comunitario", "Vivere l'esperienza Belluno – Feltre – Dolomiti UNESCO – Venezia", "Espandere la rete di relazioni internazionali", "Diventare membro del programma Ambasciatore Culturale VietItalia" ];

  const text = {
    tag: isVi ? "Chương trình 2026" : "Programma 2026",
    title: isVi ? "Trở thành Đại Sứ Văn Hóa VietItalia" : "Diventa Ambasciatore Culturale VietItalia",
    subtitle: isVi ? "Khám phá Belluno – Feltre – Dolomiti qua Văn hóa, Giáo dục và Cộng đồng" : "Scopri Belluno – Feltre – Dolomiti attraverso Cultura, Educazione e Comunità",
    award: isVi ? "Giải thưởng: 01 vé máy bay khứ hồi Vietnam Airlines" : "Premio: 01 biglietto di andata e ritorno Vietnam Airlines",
    btnSchedule: isVi ? "Xem lịch trình 7 ngày" : "Vedi il programma di 7 giorni",
    introTag: isVi ? "Giới thiệu chương trình" : "Introduzione al programma",
    introTitle: isVi ? "Trải nghiệm văn hóa và giáo dục quốc tế" : "Esperienza culturale ed educativa internazionale",
    introP1: isVi ? "Chương trình do <strong>Associazione Culturale VietItalia</strong> tổ chức, dành cho sinh viên, giáo viên, doanh nhân và những người yêu nước Ý mong muốn tìm hiểu thực tế về văn hóa, giáo dục và cộng đồng tại vùng Veneto, nước Ý." : "Il programma è organizzato dall'<strong>Associazione Culturale VietItalia</strong> ed è rivolto a studenti, insegnanti, imprenditori e amanti dell'Italia che desiderano scoprire la realtà culturale, educativa e comunitaria della regione Veneto.",
    introP2: isVi ? "Trong <strong>7 ngày trải nghiệm</strong>, người tham gia sẽ gặp gỡ doanh nghiệp địa phương, trường học, tổ chức cộng đồng, khám phá Dolomiti – di sản UNESCO, và xây dựng kế hoạch hành động cá nhân sau khi trở về Việt Nam." : "In <strong>7 giorni di esperienza</strong>, i partecipanti incontreranno imprese locali, scuole, organizzazioni comunitarie, esploreranno le Dolomiti – patrimonio UNESCO e svilupperanno un piano d'azione personale da realizzare una volta tornati in Vietnam.",
    introLearn: isVi ? "Bạn sẽ tìm hiểu về" : "Scoprirai:",
    quote: isVi ? '"Không chỉ đến để tham quan.<br>Đến để học hỏi, kết nối và tạo ra giá trị."' : '"Non solo per visitare.<br>Ma per imparare, connettere e creare valore."',
    audTag: isVi ? "Đối tượng tham gia" : "A chi è rivolto",
    audTitle: isVi ? "Dành cho ai?" : "Per chi?",
    audCond: isVi ? "📌 Điều kiện: Công dân Việt Nam từ 18 tuổi trở lên." : "📌 Requisito: Cittadini vietnamiti dai 18 anni in su.",
    locTag: isVi ? "🏔 Địa điểm" : "🏔 Luogo",
    locTitle: isVi ? "Feltre – Belluno – Dolomiti UNESCO – Veneto, Italia" : "Feltre – Belluno – Dolomiti UNESCO – Veneto, Italia",
    locP: isVi ? "Vùng núi Dolomiti được UNESCO công nhận là Di sản Thiên nhiên Thế giới, cùng thị trấn cổ Feltre và tỉnh Belluno thuộc vùng Veneto, miền Bắc nước Ý." : "Le Dolomiti, riconosciute dall'UNESCO come Patrimonio Naturale dell'Umanità, insieme all'antica città di Feltre e alla provincia di Belluno nella regione Veneto, nel Nord Italia.",
    schTag: isVi ? "Lịch trình" : "Programma",
    schTitle: isVi ? "7 ngày 6 đêm tại Belluno" : "7 giorni e 6 notti a Belluno",
    schDay: isVi ? "Ngày" : "Giorno",
    valTag: isVi ? "Sau chương trình" : "Dopo il programma",
    valTitle: isVi ? "Giá trị nhận được" : "Valore acquisito"
  };

  // --- RENDER HTML ---
  container.innerHTML =
    `<section class="relative text-white pt-20 pb-16 md:pt-24 bg-cover bg-center" style="background-image: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/images/italy/Rome.jpg')">
      <div class="max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop text-center">
        <p class="text-label-sm uppercase tracking-widest text-white/80">${text.tag}</p>
        <h1 class="font-display-lg text-display-lg mt-3 max-w-3xl mx-auto">${text.title}</h1>
        <p class="mt-4 text-lg italic max-w-2xl mx-auto text-white/90">${text.subtitle}</p>
        <div class="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur px-5 py-3 border border-white/30">
          <span class="text-2xl">🎁</span>
          <span class="text-sm font-semibold">${text.award}</span>
        </div>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#lich-trinh" class="bg-white text-primary px-6 py-3 font-semibold">${text.btnSchedule}</a>
        </div>
      </div>
    </section>` +

    `<section class="max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop py-16">
      <div class="grid lg:grid-cols-5 gap-10 items-start">
        <div class="lg:col-span-3">
          <p class="text-primary text-label-sm uppercase tracking-widest">${text.introTag}</p>
          <h2 class="font-headline-md text-headline-md mt-2">${text.introTitle}</h2>
          <p class="mt-5 text-on-surface-variant leading-relaxed">${text.introP1}</p>
          <p class="mt-4 text-on-surface-variant leading-relaxed">${text.introP2}</p>
        </div>
        <div class="lg:col-span-2 bg-surface-container-low p-7">
          <h3 class="font-headline-sm text-headline-sm">${text.introLearn}</h3>
          <ul class="mt-4 space-y-3 text-sm">${themes.map((t) => `<li class="flex gap-2"><span class="text-secondary">✅</span><span>${t}</span></li>`).join("")}</ul>
        </div>
      </div>
    </section>` +

    `<section class="bg-secondary text-white py-20 relative overflow-hidden">
      <svg class="absolute bottom-0 left-0 w-full opacity-15" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 200 L150 60 L260 140 L400 20 L520 130 L680 40 L820 150 L980 70 L1100 160 L1200 90 L1200 200 Z" fill="white"/>
      </svg>
      <div class="relative max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop text-center">
        <p class="font-headline-md text-headline-md italic max-w-3xl mx-auto">${text.quote}</p>
      </div>
    </section>` +

    `<section class="max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop py-16">
      <p class="text-primary text-label-sm uppercase tracking-widest">${text.audTag}</p>
      <h2 class="font-headline-md text-headline-md mt-2">${text.audTitle}</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
        ${audiences.map(([icon, label]) => `<article class="vietnam-accent bg-surface-container-low p-5 flex items-center gap-3"><span class="material-symbols-outlined text-primary">${icon}</span><h3 class="font-headline-sm text-headline-sm">${label}</h3></article>`).join("")}
      </div>
      <p class="mt-5 text-sm text-on-surface-variant">${text.audCond}</p>
    </section>` +

    `<section class="bg-surface-container-low py-16">
      <div class="max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p class="text-primary text-label-sm uppercase tracking-widest">${text.locTag}</p>
          <h2 class="font-headline-md text-headline-md mt-2">${text.locTitle}</h2>
          <p class="mt-4 text-on-surface-variant">${text.locP}</p>
        </div>
        <img src="/images/ambassador/flyer-${isVi ? "vi" : "it"}.jpg" alt="Tờ rơi chương trình Đại Sứ Văn Hóa VietItalia" class="w-full h-auto rounded-lg institutional-shadow">
      </div>
    </section>` +

    `<section id="lich-trinh" class="max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop py-16">
      <p class="text-primary text-label-sm uppercase tracking-widest">${text.schTag}</p>
      <h2 class="font-headline-md text-headline-md mt-2">${text.schTitle}</h2>
      <div class="grid md:grid-cols-2 gap-6 mt-10">
        ${itinerary.map((d, i) => {
          const isLast = i === itinerary.length - 1 && itinerary.length % 2 !== 0;
          return isLast
            ? `<article class="md:col-span-2 vietnam-accent bg-surface-container-low institutional-shadow p-8 text-center">
                <div class="flex flex-col items-center gap-3">
                  <span class="w-12 h-12 rounded-full bg-primary text-white grid place-items-center font-headline-sm text-headline-sm">${d.day}</span>
                  <h3 class="font-headline-sm text-headline-sm">${d.icon} ${text.schDay} ${d.day} – ${d.title}</h3>
                </div>
                <ul class="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm text-on-surface-variant max-w-3xl mx-auto text-left">${d.items.map((item) => `<li>• ${item}</li>`).join("")}</ul>
              </article>`
            : `<article class="${i % 2 === 0 ? "vietnam-accent" : "italy-accent"} bg-surface-container-low institutional-shadow p-7">
                <div class="flex items-center gap-4">
                  <span class="shrink-0 w-12 h-12 rounded-full bg-primary text-white grid place-items-center font-headline-sm text-headline-sm">${d.day}</span>
                  <h3 class="font-headline-sm text-headline-sm">${d.icon} ${text.schDay} ${d.day} – ${d.title}</h3>
                </div>
                <ul class="mt-4 space-y-1.5 text-sm text-on-surface-variant">${d.items.map((item) => `<li>• ${item}</li>`).join("")}</ul>
              </article>`;
        }).join("")}
      </div>
    </section>` +

    `<section class="italy-accent bg-surface-container-low py-16">
      <div class="max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop">
        <p class="text-secondary text-label-sm uppercase tracking-widest">${text.valTag}</p>
        <h2 class="font-headline-md text-headline-md mt-2">${text.valTitle}</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
          ${values.map((v) => `<div class="bg-white p-5 flex gap-2"><span class="text-secondary">✅</span><p class="text-sm">${v}</p></div>`).join("")}
        </div>
      </div>
    </section>`;
}