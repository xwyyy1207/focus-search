(() => {
  const ROOT_ID = "focus-research-bilibili-root";
  const HOME_PATH = /^\/?$/;
  const SEARCH_URL = "https://search.bilibili.com/all?keyword=";
  const LOGO_URL = "https://i0.hdslb.com/bfs/static/jinkela/long/images/512.png";
  const FALLBACK_LOGO_URL = chrome.runtime.getURL("assets/logos/bilibili.png");
  const STORAGE_KEY = "bilibiliFocusModeEnabled";

  let focusModeEnabled = true;
  let root = null;
  let shadow = null;
  let previousDocumentOverflow = "";
  let previousBodyOverflow = "";
  let interfaceVisible = false;
  let syncScheduled = false;

  function isHome() {
    return HOME_PATH.test(window.location.pathname);
  }

  function scheduleSync() {
    if (syncScheduled) return;
    syncScheduled = true;
    window.requestAnimationFrame(() => {
      syncScheduled = false;
      syncPage();
    });
  }

  function createInterface() {
    if (root) return;

    root = document.createElement("div");
    root.id = ROOT_ID;
    root.setAttribute("data-focus-research", "bilibili-home");
    root.style.cssText = "position: fixed; inset: 0; z-index: 2147483647; background: #fff;";
    shadow = root.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { all: initial; }
        * { box-sizing: border-box; }
        .page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #fff; color: #24252a; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .content { width: min(100%, 640px); transform: translateY(-5.5vh); }
        .logo { display: block; width: 48px; height: 48px; margin: 0 auto 24px; object-fit: contain; }
        form { display: flex; align-items: center; height: 58px; border: 1px solid #dadce2; border-radius: 29px; background: #fff; box-shadow: 0 4px 16px rgba(45, 46, 54, .08); }
        form:focus-within { border-color: #b9bbc3; box-shadow: 0 6px 22px rgba(45, 46, 54, .11); }
        input { min-width: 0; flex: 1; height: 100%; padding: 0 12px 0 22px; border: 0; outline: 0; background: transparent; color: #24252a; font: inherit; font-size: 17px; }
        input::placeholder { color: #9b9da4; }
        button { display: grid; place-items: center; width: 54px; height: 54px; margin-right: 2px; border: 0; border-radius: 50%; background: transparent; color: #4b4d55; cursor: pointer; }
        button:hover { background: #f2f2f5; }
        button:focus-visible { outline: 3px solid rgba(118, 113, 216, .35); outline-offset: 2px; }
        svg { width: 21px; height: 21px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
        @media (max-width: 480px) { .page { padding: 16px; } .content { transform: translateY(-8vh); } form { height: 54px; } button { width: 50px; height: 50px; } input { font-size: 16px; } }
      </style>
      <main class="page">
        <section class="content" aria-label="Bilibili 搜索">
          <img class="logo" src="${LOGO_URL}" alt="Bilibili" decoding="async" referrerpolicy="no-referrer" />
          <form role="search">
            <input type="search" placeholder="搜索 Bilibili" autocomplete="off" spellcheck="false" aria-label="搜索 Bilibili" />
            <button type="submit" aria-label="搜索">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6"></circle><path d="m16 16 4.4 4.4"></path></svg>
            </button>
          </form>
        </section>
      </main>
    `;

    const logoImage = shadow.querySelector(".logo");
    logoImage.addEventListener("error", () => {
      if (logoImage.src !== FALLBACK_LOGO_URL) logoImage.src = FALLBACK_LOGO_URL;
    });

    shadow.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      const query = shadow.querySelector("input").value.trim();
      if (!query) return;
      window.location.assign(`${SEARCH_URL}${encodeURIComponent(query)}`);
    });
  }

  function showInterface() {
    createInterface();
    if (!root.isConnected) document.documentElement.appendChild(root);
    if (!interfaceVisible) {
      previousDocumentOverflow = document.documentElement.style.overflow;
      previousBodyOverflow = document.body?.style.overflow || "";
      interfaceVisible = true;
    }
    document.documentElement.style.overflow = "hidden";
    if (document.body) document.body.style.overflow = "hidden";
  }

  function hideInterface() {
    if (root) root.remove();
    if (!interfaceVisible) return;
    document.documentElement.style.overflow = previousDocumentOverflow;
    if (document.body) document.body.style.overflow = previousBodyOverflow;
    interfaceVisible = false;
  }

  function syncPage() {
    if (focusModeEnabled && isHome()) showInterface();
    else hideInterface();
  }

  chrome.storage.local.get({ [STORAGE_KEY]: true }, (settings) => {
    focusModeEnabled = settings[STORAGE_KEY] !== false;
    syncPage();
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes[STORAGE_KEY]) return;
    focusModeEnabled = changes[STORAGE_KEY].newValue !== false;
    syncPage();
  });

  window.addEventListener("popstate", scheduleSync);
  window.addEventListener("hashchange", scheduleSync);
  window.setInterval(scheduleSync, 500);

  const observer = new MutationObserver(scheduleSync);
  const observeBody = () => {
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    syncPage();
  };
  if (document.body) observeBody();
  else document.addEventListener("DOMContentLoaded", observeBody, { once: true });
})();
