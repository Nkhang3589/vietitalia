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
import { getLocale } from "./i18n/i18n.js";

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

initFlagEffect();
// Tìm kiếm nhanh trên dữ liệu bài viết tĩnh.
let postsData = [];

async function fetchPostsData() {
  try {
    const response = await fetch("/data/posts.json");
    if (!response.ok) throw new Error("Không thể tải dữ liệu tìm kiếm");
    postsData = await response.json();
  } catch (error) {
    console.error("Lỗi tải dữ liệu tìm kiếm:", error);
  }
}

function normalizeSearchText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi")
    .trim();
}

function initInternalSearch() {
  const searchBox = document.getElementById("internal-search-box");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  if (!searchBox || !searchInput || !searchResults) return;

  const renderResults = () => {
    const keyword = normalizeSearchText(searchInput.value);
    searchResults.replaceChildren();
    if (!keyword) {
      searchResults.classList.add("hidden");
      return;
    }

    const locale = getLocale();
    const matches = postsData.filter((post) =>
      [post.title, post.category, post.summary, post["title_" + locale], post["category_" + locale], post["summary_" + locale]]
        .some((value) => normalizeSearchText(value).includes(keyword)),
    );

    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "p-4 text-sm text-gray-500 text-center";
      empty.textContent = "Không tìm thấy nội dung phù hợp";
      searchResults.append(empty);
    } else {
      matches.slice(0, 8).forEach((post) => {
        const link = document.createElement("a");
        link.href = post.url || "#";
        if (link.href.startsWith("http")) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        link.setAttribute("role", "option");
        link.className = "block p-3.5 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-0";
        const category = document.createElement("div");
        category.className = "text-[11px] font-semibold text-[#008751] uppercase mb-1";
        category.textContent = post["category_" + getLocale()] || post.category || "";
        const title = document.createElement("div");
        title.className = "text-sm font-semibold text-gray-800";
        title.textContent = post["title_" + getLocale()] || post.title || "";
        link.append(category, title);
        searchResults.append(link);
      });
    }
    searchResults.classList.remove("hidden");
  };

  searchInput.addEventListener("input", renderResults);
  searchInput.addEventListener("focus", renderResults);
  document.addEventListener("click", (event) => {
    if (!searchBox.contains(event.target)) searchResults.classList.add("hidden");
  });
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") searchResults.classList.add("hidden");
  });
}

await fetchPostsData();
initInternalSearch();
