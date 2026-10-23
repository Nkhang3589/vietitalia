import { renderNavigation, updateNavigationLanguage } from "./Navigation.js"; 
import { getLocale, toggleLocale, t } from "../../i18n/i18n.js"; 

// 1. Hàm khử dấu Tiếng Việt chuẩn
function removeVietnameseTones(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Danh sách các trang cố định trên website
const staticPages = [
  { title: "Giới thiệu VietItalia Bridge", category: "GIỚI THIỆU", url: "/about", summary: "Tổ chức cầu nối văn hóa, giáo dục và kinh doanh song phương Việt Nam - Italia." },
  { title: "Chương trình Đại sứ Văn hóa VietItalia 2026", category: "ĐẠI SỨ", url: "/ambassador", summary: "Kết nối thế hệ trẻ, tôn vinh mối quan hệ ngoại giao Việt Nam - Ý." },
  { title: "Chương trình Đào tạo Quốc tế & Học bổng Du học Ý", category: "ĐÀO TẠO QUỐC TẾ", url: "/international-training", summary: "Tuyển sinh và học bổng du học tại các trường đại học danh tiếng ở Ý." },
  { title: "Thị trường nước Ý & Cơ hội Giao thương Doanh nghiệp", category: "THỊ TRƯỜNG Ý", url: "/italy-market", summary: "Tổng quan kinh tế, xuất nhập khẩu và cơ hội đầu tư kinh doanh Việt - Ý." },
  { title: "Thị trường Việt Nam cho Doanh nghiệp Ý", category: "THỊ TRƯỜNG VIỆT NAM", url: "/vietnam-market", summary: "Thông tin hỗ trợ các doanh nghiệp Ý mở rộng thị trường tại Việt Nam." },
  { title: "Business Matching - Kết nối Giao thương Doanh nghiệp", category: "KẾT NỐI KINH DOANH", url: "/business-matching", summary: "Dịch vụ cầu nối trực tiếp giữa các đối tác Việt Nam và Ý." },
  { title: "Du lịch Ý & Trải nghiệm Văn hóa", category: "DU LỊCH", url: "/italy-travel", summary: "Khám phá các di sản văn hóa, ẩm thực, địa điểm du lịch nổi tiếng tại Ý." },
  { title: "Liên hệ & Hợp tác VietItalia", category: "LIÊN HỆ", url: "/contact", summary: "Thông tin văn phòng liên hệ tại Feltre (BL) - Italia." }
];

let searchCache = null;

// 2. Hàm nạp toàn bộ dữ liệu thật từ tất cả API & file JSON
async function loadAllSearchData() {
  if (searchCache) return searchCache;

  try {
    const [eventsRes, coursesRes, travelsRes, postsRes] = await Promise.all([
      fetch('/api/events').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/courses').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/travels').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/data/posts.json').then(r => r.ok ? r.json() : []).catch(() => [])
    ]);

    const events = Array.isArray(eventsRes) ? eventsRes : (eventsRes.data || eventsRes.events || []);
    const courses = Array.isArray(coursesRes) ? coursesRes : (coursesRes.data || coursesRes.courses || []);
    const travels = Array.isArray(travelsRes) ? travelsRes : (travelsRes.data || travelsRes.travels || []);
    const posts = Array.isArray(postsRes) ? postsRes : [];

    const formattedEvents = events.map(item => ({
      title: item.title || item.name || '',
      category: 'SỰ KIỆN',
      url: `/events#${item._id || item.id || ''}`,
      summary: item.description || item.summary || item.content || ''
    }));

    const formattedCourses = courses.map(item => ({
      title: item.title || item.name || '',
      category: 'ĐÀO TẠO QUỐC TẾ',
      url: `/international-training#${item._id || item.id || ''}`,
      summary: item.description || item.summary || item.content || ''
    }));

    const formattedTravels = travels.map(item => ({
      title: item.title || item.name || '',
      category: 'DU LỊCH',
      url: `/italy-travel#${item._id || item.id || ''}`,
      summary: item.description || item.summary || item.content || ''
    }));

    searchCache = [
      ...formattedCourses,
      ...formattedEvents,
      ...formattedTravels,
      ...posts,
      ...staticPages
    ];
  } catch (err) {
    searchCache = [...staticPages];
  }

  return searchCache;
}

export function renderHeader(container) {
  const bar = document.createElement("div");
  bar.className =
    "fixed inset-x-0 top-0 z-50 bg-surface/95 backdrop-blur border-b border-outline-variant institutional-shadow";

  const row = document.createElement("div");
  row.className =
    "max-w-container-max mx-auto px-margin-mobile xl:px-margin-desktop min-h-[72px] flex items-center justify-between gap-3";

  // --- L O G O ---
  const brand = document.createElement("a");
  brand.href = "/";
  brand.dataset.link = "";
  brand.className = "flex items-center gap-3 shrink-0 ";

  const logoImage = document.createElement("img");
  logoImage.src = "/images/logos/logoVNIT.png";
  logoImage.alt = "VietItalia logo";
  logoImage.className = "w-14 h-14 object-contain";

  const logoText = document.createElement("span");
  logoText.className =
    "font-headline-sm text-headline-sm text-primary leading-none";

  logoText.innerHTML = `
      Viet<span class="text-secondary">Italia</span>
      <small class="block font-label-sm text-[9px] tracking-[.18em] text-on-surface-variant mt-1">
        VIETNAM · ITALY
      </small>
  `;

  brand.append(logoImage, logoText);
  row.append(brand);

  // --- N A V I G A T I O N (Desktop) ---
  renderNavigation(row);

  // --- S E A R C H   B O X ---
  const searchBox = document.createElement("div");
  searchBox.id = "internal-search-box";
  searchBox.className = "relative w-36 sm:w-48 lg:w-60 my-auto ml-auto mr-2";
  searchBox.innerHTML = `
    <div class="relative">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="Tìm kiếm..." 
        autocomplete="off"
        class="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-full focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] transition-all bg-gray-50/80 focus:bg-white text-gray-800"
      />
      <svg class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
    <div id="searchResults" class="hidden absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto z-50 divide-y divide-gray-100">
    </div>
  `;
  row.append(searchBox);

  // --- GÁN SỰ KIỆN TÌM KIẾM CHO Ô INPUT HEADER ---
  const searchInput = searchBox.querySelector("#searchInput");
  const searchResults = searchBox.querySelector("#searchResults");

  if (searchInput && searchResults) {
    searchInput.addEventListener("input", async (e) => {
      const rawVal = e.target.value;
      const cleanQuery = removeVietnameseTones(rawVal);

      if (!cleanQuery) {
        searchResults.classList.add("hidden");
        searchResults.innerHTML = "";
        return;
      }

      const dataset = await loadAllSearchData();

      const matches = dataset.filter((item) => {
        const title = removeVietnameseTones(item.title);
        const summary = removeVietnameseTones(item.summary);
        const category = removeVietnameseTones(item.category);

        return (
          title.includes(cleanQuery) ||
          summary.includes(cleanQuery) ||
          category.includes(cleanQuery)
        );
      });

      searchResults.classList.remove("hidden");

      if (matches.length === 0) {
        searchResults.innerHTML = `
          <div class="p-3 text-xs text-gray-500 text-center">
            Không tìm thấy kết quả cho "<b>${rawVal}</b>"
          </div>
        `;
      } else {
        searchResults.innerHTML = matches
          .map(
            (item) => `
          <a href="${item.url || '#'}" data-link class="block p-3 hover:bg-green-50/60 transition-colors">
            <div class="text-[10px] font-bold text-[#008751] uppercase tracking-wider mb-0.5">
              ${item.category || 'TIN TỨC'}
            </div>
            <div class="text-xs font-semibold text-gray-900 leading-snug line-clamp-1 mb-1">
              ${item.title}
            </div>
            ${
              item.summary
                ? `<div class="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">${item.summary}</div>`
                : ''
            }
          </a>
        `
          )
          .join("");
      }
    });

    // Bấm ra ngoài thì đóng dropdown tìm kiếm
    document.addEventListener("click", (evt) => {
      if (!searchBox.contains(evt.target)) {
        searchResults.classList.add("hidden");
      }
    });
  }

  // --- L A N G U A G E   B U T T O N ---
  const langButton = document.createElement("button");
  langButton.type = "button";
  langButton.className =
    "p-2 border border-outline rounded-md transition hover:bg-gray-100 flex items-center justify-center min-w-[40px]";
  langButton.setAttribute("aria-label", "Đổi ngôn ngữ");

  const renderFlag = () => {
    const imgSrc = getLocale() === "vi" 
      ?  "/images/logos/flag-vn.jpg"
      : "/images/logos/flag-it.jpg" ;
        
    const altText = getLocale() === "vi" ? "IT" : "VN";
    
    return `<img src="${imgSrc}" alt="${altText}" class="w-6 h-4 object-cover rounded-sm shadow-sm" />`;
  };

  langButton.innerHTML = renderFlag();
  
  langButton.addEventListener("click", () => {
    toggleLocale();
    langButton.innerHTML = renderFlag();
    updateNavigationLanguage();
    window.location.reload();
  });

  row.append(langButton);

  // --- M O B I L E   M E N U   B U T T O N ---
  const menuButton = document.createElement("button");
  menuButton.type = "button";
  menuButton.className = "xl:hidden p-2 text-primary";
  menuButton.innerHTML =
    '<span class="material-symbols-outlined">menu</span>';

  // --- M O B I L E   M E N U   C O N T E N T ---
  const mobile = document.createElement("div");
  mobile.className =
    "hidden absolute top-full inset-x-0 bg-surface border-b border-outline-variant p-5 xl:hidden";

  const mobileMenus = [
    ["/", "nav.home"],
    ["/about", "nav.about"],
    ["/ambassador", "nav.ambassador"],
    ["/events", "nav.events"],
    ["/international-training", "nav.internationalTraining"],
  ];

  mobileMenus.forEach(([path, key]) => {
    const a = document.createElement("a");
    a.href = path;
    a.dataset.link = "";
    a.dataset.route = path;
    a.dataset.i18n = key;
    a.className = "nav-link block py-3 uppercase text-label-sm";
    a.textContent = t(key);
    mobile.append(a);
  });

  // Dropdown Tin tức (Mobile)
  const details = document.createElement("details");
  details.className = "border-t border-outline-variant py-2";

  const summary = document.createElement("summary");
  summary.className =
    "cursor-pointer uppercase text-label-sm font-semibold py-2";
  
  summary.innerHTML = `<span data-i18n="nav.news">${t("nav.news")}</span>`;
  details.append(summary);

  const mobileSubmenus = [
    ["/italy-market", "nav.italyMarket"],
    ["/vietnam-market", "nav.vietnamMarket"],
    ["/business-matching", "nav.businessMatching"],
    ["/italy-travel", "nav.italyTravel"],
  ];

  mobileSubmenus.forEach(([path, key]) => {
    const a = document.createElement("a");
    a.href = path;
    a.dataset.link = "";
    a.dataset.route = path;
    a.dataset.i18n = key;
    a.className =
      "block py-2 pl-5 text-sm text-on-surface-variant hover:text-primary";
    a.textContent = t(key);
    details.append(a);
  });

  mobile.append(details);

  // Contact (Mobile)
  const contact = document.createElement("a");
  contact.href = "/contact";
  contact.dataset.link = "";
  contact.dataset.route = "/contact";
  contact.dataset.i18n = "nav.contact";
  contact.className = "nav-link block py-3 uppercase text-label-sm";
  contact.textContent = t("nav.contact");

  mobile.append(contact);

  menuButton.addEventListener("click", () => {
    mobile.classList.toggle("hidden");
  });

  mobile.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      mobile.classList.add("hidden");
    }
  });

  row.append(menuButton);
  bar.append(row, mobile);
  container.append(bar);
}