import { renderHeader } from "./components/layout/Header.js";
import { renderFooter } from "./components/layout/Footer.js";
import { updateActiveNavigation } from "./components/layout/Navigation.js";
import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Ambassador from "./pages/Ambassador.js";
import Events from "./pages/Events.js";
import News from "./pages/News.js";
import ItalyMarket from "./pages/ItalyMarket.js";
import JobMarket from "./pages/JobMarket.js";
import VietnamMarket from "./pages/VietnamMarket.js";
import BusinessMatching from "./pages/BusinessMatching.js";
import { renderContact } from "./components/sections/Contact.js";
import ItalyTravel from "./pages/ItalyTravel.js";
import InternationalTraining from "./pages/InternationalTraining.js"; // MỚI THÊM

import { initFlagEffect } from "./components/sections/SnowEffect.js";

const routes = {
  "/": Home,
  "/about": About,
  "/ambassador": Ambassador,
  "/events": Events,
  "/news": News,
  "/italy-market": ItalyMarket,
  "/job-market": JobMarket,
  "/vietnam-market": VietnamMarket,
  "/business-matching": BusinessMatching,
  "/contact": (container) => renderContact(container),
  "/italy-travel": ItalyTravel,
  "/international-training": InternationalTraining, // MỚI THÊM
};
const root = document.querySelector("#app-root");
const headerRoot = document.querySelector("#app-header");
const footerRoot = document.querySelector("#app-footer");

function renderAppHeader() {
  headerRoot.replaceChildren();
  renderHeader(headerRoot);
}
function normal(path) {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}
export function navigate(url) {
  const next = new URL(url, location.origin);
  history.pushState({}, "", next.pathname + next.search + next.hash);
  renderRoute();
}
export function renderRoute() {
  const path = normal(location.pathname);
  const view = routes[path] || Home;
  root.replaceChildren();
  view(root);
  updateActiveNavigation(path);
  window.scrollTo(0, 0);
}
document.addEventListener("click", (event) => {
  const a = event.target.closest("a");
  if (
    !a ||
    event.defaultPrevented ||
    a.target === "_blank" ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  const href = a.getAttribute("href");
  if (a.dataset.link !== undefined || (href && href.startsWith("/"))) {
    event.preventDefault();
    navigate(href);
  }
});
window.addEventListener("popstate", renderRoute);
renderAppHeader();
renderFooter(footerRoot);
renderRoute();

window.addEventListener("localechange", () => {
  renderAppHeader();
  renderRoute();
});
// ==========================================
// TÍNH NĂNG TÌM KIẾM NỘI BỘ (WIDGET NỔI GÓC DƯỚI WEB)
// ==========================================
let postsData = [];

// 1. Tải dữ liệu JSON
async function fetchPostsData() {
  try {
    const response = await fetch('/data/posts.json');
    if (!response.ok) throw new Error('Không thể tải file JSON');
    postsData = await response.json();
  } catch (error) {
    console.error('Lỗi tải dữ liệu tìm kiếm:', error);
  }
}

// 2. Chèn Widget tìm kiếm cố định góc dưới bên phải màn hình
function renderBottomSearchWidget() {
  if (document.getElementById('floating-search-widget')) return;

  const widget = document.createElement('div');
  widget.id = 'floating-search-widget';
  widget.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2 font-sans';
  
  widget.innerHTML = `
    <!-- Khung kết quả & Ô nhập từ khóa (Ẩn/Hiện) -->
    <div id="searchBoxContainer" class="hidden w-80 sm:w-96 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-emerald-100 transition-all duration-200">
      <div class="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
        <span class="text-xs font-bold text-[#008751] uppercase tracking-wider flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          Tìm kiếm VietItalia
        </span>
        <button id="closeSearchBtn" class="text-gray-400 hover:text-gray-600 text-sm font-bold px-1.5 py-0.5 rounded-lg hover:bg-gray-100">✕</button>
      </div>

      <div class="relative">
        <input 
          type="text" 
          id="searchInput" 
          placeholder="Nhập từ khóa bài viết, sự kiện..." 
          class="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] text-gray-800 bg-gray-50/50"
        />
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <div id="searchResults" class="hidden mt-2 bg-white rounded-xl border border-gray-100 shadow-inner max-h-60 overflow-y-auto divide-y divide-gray-100">
      </div>
    </div>

    <!-- Nút hình kính lúp tròn để mở tìm kiếm -->
    <button id="toggleSearchBtn" class="flex items-center gap-2 bg-[#008751] hover:bg-[#006b40] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      <span>Tìm kiếm</span>
    </button>
  `;

  document.body.appendChild(widget);

  // Xử lý ẩn/hiện khung tìm kiếm
  const toggleBtn = document.getElementById('toggleSearchBtn');
  const closeBtn = document.getElementById('closeSearchBtn');
  const boxContainer = document.getElementById('searchBoxContainer');
  const searchInput = document.getElementById('searchInput');

  toggleBtn.addEventListener('click', () => {
    boxContainer.classList.toggle('hidden');
    if (!boxContainer.classList.contains('hidden')) {
      searchInput.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    boxContainer.classList.add('hidden');
  });

  // Xử lý logic gõ từ khóa
  const searchResults = document.getElementById('searchResults');
  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.trim().toLowerCase();

    if (!keyword) {
      searchResults.innerHTML = '';
      searchResults.classList.add('hidden');
      return;
    }

    const filtered = postsData.filter(post => 
      post.title.toLowerCase().includes(keyword) || 
      post.summary.toLowerCase().includes(keyword) ||
      post.category.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) {
      searchResults.innerHTML = `
        <div class="p-3 text-xs text-gray-500 text-center">
          Không thấy kết quả cho "<b>${keyword}</b>"
        </div>`;
    } else {
      searchResults.innerHTML = filtered.map(item => `
        <a href="${item.url}" class="block p-3 hover:bg-emerald-50/60 transition-colors group">
          <div class="text-[10px] font-semibold text-[#008751] uppercase tracking-wider mb-0.5">${item.category}</div>
          <div class="text-xs font-bold text-gray-800 group-hover:text-[#008751] transition-colors line-clamp-1">${item.title}</div>
          <div class="text-[11px] text-gray-500 line-clamp-1 mt-0.5">${item.summary}</div>
        </a>
      `).join('');
    }

    searchResults.classList.remove('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchPostsData();
  renderBottomSearchWidget();
});