/**
 * 阶段一的搜索平台配置。
 * 每个平台只负责描述名称、Logo 和官方跳转 URL，UI 逻辑不写死平台细节。
 */
const SEARCH_ENGINES = Object.freeze([
  {
    id: "google",
    name: "Google",
    logo: "../assets/logos/google.png",
    buildUrl: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`
  },
  {
    id: "xiaohongshu",
    name: "小红书",
    logo: "../assets/logos/xiaohongshu.png",
    buildUrl: (query) => `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(query)}`,
    note: "网页参数可能调整"
  },
  {
    id: "zhihu",
    name: "知乎",
    logo: "../assets/logos/zhihu.png",
    buildUrl: (query) => `https://www.zhihu.com/search?type=content&q=${encodeURIComponent(query)}`
  },
  {
    id: "bilibili",
    name: "Bilibili",
    logo: "../assets/logos/bilibili.png",
    buildUrl: (query) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`
  }
]);

const DEFAULT_ENGINE_ID = "google";

// 兼容未来的设置/本地存储读取：任何已移除或未知的平台 ID 都会回退到 Google。
function getSearchEngineOrDefault(engineId) {
  return SEARCH_ENGINES.find(({ id }) => id === engineId)
    || SEARCH_ENGINES.find(({ id }) => id === DEFAULT_ENGINE_ID)
    || SEARCH_ENGINES[0];
}
