import { getLocale } from '../i18n/i18n.js'; 

const API_URL = 'https://vietitalia-v2q9.onrender.com/api'; 
// const API_URL = 'http://localhost:5000/api'; 

function parseDate(dateStr) {
  if (!dateStr) return new Date(0);
  
  if (dateStr.includes('-')) return new Date(dateStr);
  
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  } 
  
  return new Date(dateStr);
}

export default function Events(container) {
  async function render() {
    const lang = getLocale();
    
    const uiText = {
      tag: lang === "vi" ? "Sự kiện" : "Eventi",
      title: lang === "vi" ? "Tin tức & Sự kiện" : "Notizie ed Eventi",
      dateLabel: lang === "vi" ? "Ngày đăng:" : "Data di pubblicazione:",
      otherEvents: lang === "vi" ? "Sự kiện khác" : "Altri eventi",
      loading: lang === "vi" ? "Đang tải sự kiện..." : "Caricamento...",
      error: lang === "vi" ? "Chưa có sự kiện nào." : "Nessun evento trovato."
    };

    container.innerHTML = `
      <div class="flex justify-center items-center py-32">
        <p class="text-lg text-secondary animate-pulse">${uiText.loading}</p>
      </div>
    `;

    try {
      const response = await fetch(`${API_URL}/events?lang=${lang}`);
      const result = await response.json();
      
      const rawData = result.success && result.data.length > 0 ? result.data : [];

      if (rawData.length === 0) {
        container.innerHTML = `
          <section class="bg-cover bg-center bg-no-repeat text-white p-20 flex flex-col justify-center items-center text-center" style="height: 300px; background-image: linear-gradient(rgba(240, 93, 132, 0.65), rgba(51, 141, 112, 0.55)), url('/images/italy/riomaggiore-shutterstock_1195849822_1118a4b73d.jpg');">
             <p class="text-label-sm uppercase tracking-widest">${uiText.tag}</p>
             <h1 class="font-display-lg text-display-lg mt-3">${uiText.title}</h1>
          </section>
          <section class="max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop py-24 text-center">
            <p class="text-xl text-on-surface-variant">${uiText.error}</p>
          </section>
        `;
        return;
      }

      // Sắp xếp ngày mới nhất lên đầu 
      const currentData = [...rawData].sort((a, b) => 
        parseDate(b.event_date || b.date) - parseDate(a.event_date || a.date)
      );

      // Giải mã hash để so sánh được cả slug tiếng Việt có dấu/gạch nối
      const rawHash = window.location.hash.substring(1);
      const hash = decodeURIComponent(rawHash);

      // Tìm kiếm theo slug hoặc id
      const currentPost = hash 
        ? (currentData.find(p => p.slug === hash || p.id == hash) || currentData[0])
        : currentData[0];

      const displayDate = currentPost.event_date 
        ? new Date(currentPost.event_date).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'it-IT')
        : currentPost.date;

      container.innerHTML = `
        <!-- Hero Banner -->
        <section 
          class="bg-cover bg-center bg-no-repeat text-white p-20 flex flex-col justify-center items-center text-center"
          style="
            height: 300px;
            background-image:
              linear-gradient(rgba(240, 93, 132, 0.65), rgba(51, 141, 112, 0.55)),
              url('/images/italy/riomaggiore-shutterstock_1195849822_1118a4b73d.jpg');
          "
        >
           <p class="text-label-sm uppercase tracking-widest">${uiText.tag}</p>
           <h1 class="font-display-lg text-display-lg mt-3">${uiText.title}</h1>
        </section>

        <!-- Bố cục Main / Sidebar -->
        <section class="max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- Cột chính 80% -->
          <article class="lg:col-span-9">
            <h1 class="text-4xl md:text-5xl font-extrabold text-primary leading-tight mb-2">${currentPost.title}</h1>
            <p class="text-sm text-secondary italic mb-6">${uiText.dateLabel} ${displayDate || ''}</p>
            <div class="prose max-w-none text-on-surface-variant text-justify">
              ${currentPost.content || currentPost.description}
            </div>
          </article>

          <!-- Sidebar 20%  -->
          <aside class="lg:col-span-3 border-l border-outline-variant pl-8 sticky top-24 self-start">
            <h3 class="font-headline-sm mb-6 pb-2 border-b">${uiText.otherEvents}</h3>
            
            <div class="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
              <ul class="space-y-3">
                ${currentData.map(post => {
                  const itemDate = post.event_date 
                    ? new Date(post.event_date).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'it-IT')
                    : post.date;
                  
                  // Kiểm tra xem item này có phải là bài đang được chọn không
                  const isActive = (currentPost.slug && post.slug === currentPost.slug) || (post.id == currentPost.id);

                  return `
                  <li>
                    <a 
                      href="#${post.slug || post.id}" 
                      class="block p-3 transition rounded ${isActive ? 'bg-[#f3e8eb] border-l-2 border-primary' : 'hover:opacity-80'}"
                    >
                      <span class="text-xs text-primary font-bold block mb-1">${itemDate || ''}</span>
                      <h4 class="font-semibold text-on-surface-variant line-clamp-3 leading-snug">${post.title}</h4>
                    </a>
                  </li>
                `}).join("")}
              </ul>
            </div>
          </aside>
        </section>
      `;
    } catch (error) {
      console.error("Lỗi khi tải sự kiện:", error);
      container.innerHTML = `<p class="text-center py-32 text-red-500">Lỗi kết nối máy chủ.</p>`;
    }
  }

  render();
  window.addEventListener("hashchange", () => {
    render();
    window.scrollTo(0, 0);
  });
}