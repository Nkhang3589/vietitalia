import { renderNavigation, updateNavigationLanguage } from "./Navigation.js"; 
import { getLocale, toggleLocale, t } from "../../i18n/i18n.js"; 

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

  // --- S E A R C H   B O X (GOOGLE PROGRAMMABLE SEARCH ENGINE) ---
  const searchBox = document.createElement("div");
  searchBox.id = "internal-search-box";
  searchBox.className = "relative w-48 sm:w-60 lg:w-72 my-auto ml-auto mr-2 min-h-[38px] flex items-center min-w-[180px]";
  searchBox.innerHTML = `<div class="gcse-search"></div>`;
  row.append(searchBox);

  // Kích hoạt Google Search Widget cho SPA
  const triggerGoogleSearch = () => {
    if (window.google && window.google.search && window.google.search.cse && window.google.search.cse.element) {
      window.google.search.cse.element.go();
    }
  };

  let cseScript = document.querySelector('script[src*="cse.google.com"]');
  if (!cseScript) {
    cseScript = document.createElement("script");
    cseScript.src = "https://cse.google.com/cse.js?cx=a3506fac398294cae";
    cseScript.async = true;
    cseScript.onload = () => setTimeout(triggerGoogleSearch, 100);
    document.head.appendChild(cseScript);
  } else {
    triggerGoogleSearch();
    setTimeout(triggerGoogleSearch, 300);
    setTimeout(triggerGoogleSearch, 800);
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