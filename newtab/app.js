(() => {
  const form = document.querySelector("#search-form");
  const input = document.querySelector("#query-input");
  const trigger = document.querySelector("#platform-trigger");
  const menu = document.querySelector("#platform-menu");
  const logo = document.querySelector("#platform-logo");
  const status = document.querySelector("#status-message");

  let selectedEngine = getSearchEngineOrDefault(DEFAULT_ENGINE_ID);

  function renderMenu() {
    menu.innerHTML = SEARCH_ENGINES.map((engine) => `
      <button class="platform-option" type="button" role="option"
        data-engine-id="${engine.id}" aria-selected="${engine.id === selectedEngine.id}">
        <img class="platform-logo" src="${engine.logo}" alt="" />
        <span class="platform-name">${engine.name}</span>
        ${engine.note ? `<span class="platform-note">${engine.note}</span>` : ""}
      </button>
    `).join("");
  }

  function updateSelectedEngine(engine) {
    selectedEngine = engine;
    logo.src = engine.logo;
    logo.alt = engine.name;
    menu.querySelectorAll(".platform-option").forEach((option) => {
      option.setAttribute("aria-selected", String(option.dataset.engineId === engine.id));
    });
    status.textContent = "";
  }

  function setMenuOpen(isOpen) {
    menu.hidden = !isOpen;
    trigger.setAttribute("aria-expanded", String(isOpen));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) {
      input.focus();
      return;
    }
    window.location.assign(selectedEngine.buildUrl(query));
  });

  trigger.addEventListener("click", () => setMenuOpen(menu.hidden));

  menu.addEventListener("click", (event) => {
    const option = event.target.closest(".platform-option");
    if (!option) return;
    const engine = SEARCH_ENGINES.find(({ id }) => id === option.dataset.engineId);
    if (!engine) return;
    updateSelectedEngine(engine);
    setMenuOpen(false);
    input.focus();
  });

  document.addEventListener("click", (event) => {
    if (!form.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
      trigger.focus();
    }
  });

  renderMenu();
})();
