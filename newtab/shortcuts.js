(() => {
  const STORAGE_KEY = "customShortcuts";
  const list = document.querySelector("#shortcuts");
  const dialog = document.querySelector("#shortcut-dialog");
  const form = document.querySelector("#shortcut-form");
  const dialogTitle = document.querySelector("#shortcut-dialog-title");
  const nameInput = document.querySelector("#shortcut-name");
  const urlInput = document.querySelector("#shortcut-url");
  const errorMessage = document.querySelector("#shortcut-form-error");
  const cancelButton = document.querySelector("#shortcut-cancel");
  const contextMenu = document.querySelector("#shortcut-context-menu");
  const FAVICON_PATHS = [
    "/favicon.ico",
    "/favicon.svg",
    "/favicon.png",
    "/apple-touch-icon.png",
    "/apple-touch-icon-precomposed.png"
  ];

  let shortcuts = [];
  let editingId = null;
  let contextShortcutId = null;

  function createId() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function parseHttpUrl(value) {
    try {
      const parsed = new URL(value.trim());
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
      return parsed.href;
    } catch {
      return null;
    }
  }

  function sanitizeShortcuts(value) {
    if (!Array.isArray(value)) return [];
    return value
      .filter((item) => item && typeof item.name === "string" && typeof item.url === "string")
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : createId(),
        name: item.name.trim().slice(0, 40),
        url: parseHttpUrl(item.url)
      }))
      .filter((item) => item.name && item.url);
  }

  function saveShortcuts() {
    chrome.storage.local.set({ [STORAGE_KEY]: shortcuts });
  }

  function createFallbackIcon() {
    const fallback = document.createElement("span");
    fallback.className = "shortcut-favicon shortcut-favicon-fallback";
    fallback.textContent = "•";
    fallback.setAttribute("aria-hidden", "true");
    return fallback;
  }

  function createFavicon(item) {
    const image = document.createElement("img");
    image.className = "shortcut-favicon";
    image.alt = "";
    image.loading = "eager";
    image.fetchPriority = "high";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";

    const itemUrl = new URL(item.url);
    const candidates = [...FAVICON_PATHS];
    const isChatGptHost = itemUrl.hostname === "chatgpt.com"
      || itemUrl.hostname.endsWith(".chatgpt.com")
      || itemUrl.hostname === "chat.openai.com";

    // ChatGPT publishes its current favicon on OpenAI's official static asset CDN,
    // rather than at chatgpt.com/favicon.ico.
    if (isChatGptHost) {
      candidates.unshift(
        "https://cdn.oaistatic.com/_next/static/media/favicon-32x32.be48395e.png",
        "https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.59f2e898.png",
        "https://cdn.oaistatic.com/assets/favicon-eex17e9e.ico"
      );
    }

    if (itemUrl.hostname === "treehole.pku.edu.cn") {
      candidates.unshift("https://treehole.pku.edu.cn/web/favicon.ico");
    }

    let candidateIndex = 0;
    const tryNextCandidate = () => {
      if (candidateIndex >= candidates.length) {
        image.replaceWith(createFallbackIcon());
        return;
      }

      const candidate = candidates[candidateIndex];
      image.src = candidate.startsWith("http")
        ? candidate
        : new URL(candidate, item.url).href;
      candidateIndex += 1;
    };

    image.addEventListener("error", tryNextCandidate);
    tryNextCandidate();
    return image;
  }

  function render() {
    list.replaceChildren();

    shortcuts.forEach((item) => {
      const link = document.createElement("a");
      link.className = "shortcut-chip";
      link.href = item.url;
      link.dataset.shortcutId = item.id;
      link.title = `${item.name}\n右键编辑或删除`;

      link.append(createFavicon(item));
      const label = document.createElement("span");
      label.textContent = item.name;
      link.append(label);

      link.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        openContextMenu(item.id, event.clientX, event.clientY);
      });

      list.append(link);
    });

    const addButton = document.createElement("button");
    addButton.className = "shortcut-add";
    addButton.type = "button";
    addButton.textContent = "+";
    addButton.title = "添加快捷入口";
    addButton.setAttribute("aria-label", "添加快捷入口");
    addButton.addEventListener("click", () => openDialog());
    list.append(addButton);
  }

  function openDialog(item = null) {
    editingId = item?.id || null;
    dialogTitle.textContent = editingId ? "编辑快捷入口" : "添加快捷入口";
    nameInput.value = item?.name || "";
    urlInput.value = item?.url || "";
    errorMessage.textContent = "";
    dialog.hidden = false;
    nameInput.focus();
  }

  function closeDialog() {
    dialog.hidden = true;
    editingId = null;
    form.reset();
    errorMessage.textContent = "";
  }

  function openContextMenu(id, x, y) {
    contextShortcutId = id;
    contextMenu.hidden = false;
    contextMenu.style.left = `${Math.min(x, window.innerWidth - 100)}px`;
    contextMenu.style.top = `${Math.min(y, window.innerHeight - 76)}px`;
  }

  function closeContextMenu() {
    contextMenu.hidden = true;
    contextShortcutId = null;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim().slice(0, 40);
    const url = parseHttpUrl(urlInput.value);

    if (!name) {
      errorMessage.textContent = "请输入网站名称";
      nameInput.focus();
      return;
    }

    if (!url) {
      errorMessage.textContent = "请输入有效的 HTTP 或 HTTPS 网址";
      urlInput.focus();
      return;
    }

    if (editingId) {
      shortcuts = shortcuts.map((item) => item.id === editingId ? { ...item, name, url } : item);
    } else {
      shortcuts = [...shortcuts, { id: createId(), name, url }];
    }

    saveShortcuts();
    render();
    closeDialog();
  });

  cancelButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target.matches("[data-dialog-close]")) closeDialog();
  });

  contextMenu.addEventListener("click", (event) => {
    const action = event.target.closest("[data-shortcut-action]")?.dataset.shortcutAction;
    if (!action || !contextShortcutId) return;

    const item = shortcuts.find((shortcut) => shortcut.id === contextShortcutId);
    closeContextMenu();
    if (!item) return;

    if (action === "edit") openDialog(item);
    if (action === "delete" && window.confirm(`删除“${item.name}”？`)) {
      shortcuts = shortcuts.filter((shortcut) => shortcut.id !== item.id);
      saveShortcuts();
      render();
    }
  });

  document.addEventListener("click", (event) => {
    if (!contextMenu.contains(event.target)) closeContextMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!dialog.hidden) closeDialog();
    closeContextMenu();
  });

  chrome.storage.local.get({ [STORAGE_KEY]: [] }, (result) => {
    shortcuts = sanitizeShortcuts(result[STORAGE_KEY]);
    render();
  });
})();
