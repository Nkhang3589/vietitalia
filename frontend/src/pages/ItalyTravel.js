import { getLocale } from "../i18n/i18n.js";

const API_URL = 'https://vietitalia.onrender.com/api'; 
// const API_URL = 'http://localhost:5000/api'; 

export default function ItalyTravel(container) {
  async function render() {
    const lang = getLocale();

    const uiText = {
      tag: lang === "vi" ? "Trải nghiệm Ý" : "Esperienza in Italia",
      title: lang === "vi" ? "Du Lịch & Khám Phá" : "Viaggi e Scoperte",
      dateLabel: lang === "vi" ? "Chủ đề:" : "Tema:",
      otherEvents: lang === "vi" ? "Bài viết khác" : "Altri articoli",
      loading: lang === "vi" ? "Đang tải bài viết..." : "Caricamento...",
      error: lang === "vi" ? "Chưa có bài viết nào." : "Nessun articolo trovato."
    };

    // Hiển thị trạng thái loading trước khi gọi API
    container.innerHTML = `
      <div class="flex justify-center items-center py-32">
        <p class="text-lg text-secondary animate-pulse">${uiText.loading}</p>
      </div>
    `;

    try {
      // Gọi API lấy dữ liệu theo ngôn ngữ
      const response = await fetch(`${API_URL}/travels?lang=${lang}`);
      const result = await response.json();
      
      const currentData = result.success && result.data.length > 0 ? result.data : [];

      // Xử lý nếu Database chưa có dữ liệu
      if (currentData.length === 0) {
        container.innerHTML = `
          <section class="bg-cover bg-center bg-no-repeat text-white p-20 flex flex-col justify-center items-center text-center" style="height: 300px; background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/italy/Colosseum.jpg');">
             <p class="text-label-sm uppercase tracking-widest">${uiText.tag}</p>
             <h1 class="font-display-lg text-display-lg mt-3">${uiText.title}</h1>
          </section>
          <section class="max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop py-24 text-center">
            <p class="text-xl text-on-surface-variant">${uiText.error}</p>
          </section>
        `;
        return;
      }

      // Lấy bài viết đang chọn dựa vào URL Hash (mặc định bài đầu tiên)[cite: 11]
      // Hỗ trợ tìm kiếm theo cả id hoặc slug (nếu dùng db)
      const hash = window.location.hash.substring(1);
      const currentPost = hash 
        ? (currentData.find(p => p.id == hash || p.slug === hash) || currentData[0]) 
        : currentData[0];

      container.innerHTML = `
        <!-- Hero Banner -->
        <section 
          class="bg-cover bg-center bg-no-repeat text-white p-20 flex flex-col justify-center items-center text-center"
          style="
            height: 300px;
            background-image:
              linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('/images/italy/Colosseum.jpg');
          "
        >
           <p class="text-label-sm uppercase tracking-widest">${uiText.tag}</p>
           <h1 class="font-display-lg text-display-lg mt-3">${uiText.title}</h1>
        </section>

        <!-- Bố cục 80/20 (Nội dung chính và Sidebar) -->
        <section class="max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- Cột chính 80% -->
          <article class="lg:col-span-9">
            <h1 class="text-4xl md:text-5xl font-extrabold text-primary leading-tight mb-2">${currentPost.title}</h1>
            <p class="text-sm text-secondary italic mb-8">${uiText.dateLabel} ${currentPost.category || currentPost.date || ''}</p>
            <div class="prose max-w-none text-on-surface-variant text-justify">
              ${currentPost.content}
            </div>
          </article>

          <!-- Sidebar 20% -->
          <aside class="lg:col-span-3 border-l border-outline-variant pl-8 sticky top-24 self-start">
            <h3 class="font-headline-sm mb-6 pb-2 border-b">${uiText.otherEvents}</h3>
            <ul class="space-y-6">
              ${currentData.map(post => `
                <li>
                  <a href="#${post.slug || post.id}" class="block group">
                    <span class="text-xs text-primary font-bold uppercase tracking-wide">${post.category || post.date || ''}</span>
                    <h4 class="font-semibold text-on-surface-variant mt-1 group-hover:text-primary transition">${post.title}</h4>
                  </a>
                </li>
              `).join("")}
            </ul>
          </aside>
        </section>
      `;
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Travel:", error);
      container.innerHTML = `<p class="text-center py-32 text-red-500">Lỗi kết nối máy chủ.</p>`;
    }
  }

  // Khởi tạo render lần đầu và lắng nghe sự thay đổi hash[cite: 11]
  render();
  window.addEventListener("hashchange", () => {
    render();
    window.scrollTo(0, 0); // Tự động cuộn lên trên khi chuyển bài[cite: 11]
  });
}