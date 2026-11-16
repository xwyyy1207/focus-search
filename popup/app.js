const toggle = document.querySelector("#focus-toggle");
const bilibiliToggle = document.querySelector("#bilibili-focus-toggle");
const zhihuToggle = document.querySelector("#zhihu-focus-toggle");
const status = document.querySelector("#status");

chrome.storage.local.get({ focusModeEnabled: true, bilibiliFocusModeEnabled: true, zhihuFocusModeEnabled: true }, ({ focusModeEnabled, bilibiliFocusModeEnabled, zhihuFocusModeEnabled }) => {
  toggle.checked = focusModeEnabled !== false;
  bilibiliToggle.checked = bilibiliFocusModeEnabled !== false;
  zhihuToggle.checked = zhihuFocusModeEnabled !== false;
});

toggle.addEventListener("change", () => {
  chrome.storage.local.set({ focusModeEnabled: toggle.checked }, () => {
    status.textContent = toggle.checked ? "已开启" : "已关闭";
  });
});

bilibiliToggle.addEventListener("change", () => {
  chrome.storage.local.set({ bilibiliFocusModeEnabled: bilibiliToggle.checked }, () => {
    status.textContent = bilibiliToggle.checked ? "Bilibili 专注模式已开启" : "Bilibili 专注模式已关闭";
  });
});

zhihuToggle.addEventListener("change", () => {
  chrome.storage.local.set({ zhihuFocusModeEnabled: zhihuToggle.checked }, () => {
    status.textContent = zhihuToggle.checked ? "知乎专注模式已开启" : "知乎专注模式已关闭";
  });
});
