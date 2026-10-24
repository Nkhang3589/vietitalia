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

initFlagEffect();