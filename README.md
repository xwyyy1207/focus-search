# Focus Search

一个以主动检索为中心的极简 Chrome 扩展：统一检索入口、专注浏览，并支持自定义快捷入口。

> 当前版本：`v0.1.0`。项目适合通过 Chrome 的“加载已解压的扩展程序”试用；部分平台行为仍需在真实 Chrome 中按清单人工验证。

## 核心功能

- 用极简新标签页替换 Chrome 默认新标签页。
- 在 Google、小红书、知乎和 Bilibili 之间切换官方检索入口。
- 通过当前标签页原生导航发起搜索，保留正常浏览器历史记录和前进后退行为。
- 在小红书、Bilibili、知乎首页提供专注搜索界面，搜索结果页和内容详情页不覆盖。
- 通过工具栏弹窗分别开关三个网站的专注模式。
- 添加、编辑、删除自定义快捷入口；名称和 HTTP/HTTPS 地址保存在浏览器本地。
- 网站 favicon 加载失败时使用本地默认图标，不读取浏览历史。

## 项目截图

截图目录为 [`assets/screenshots/`](assets/screenshots/)。目前仓库只提供截图占位说明，建议安装并人工验收后再补充实际截图。

## 支持的平台

| 平台 | 综合搜索 | 首页专注模式 | 备注 |
| --- | --- | --- | --- |
| Google | 支持 | 不处理 | 保留浏览器默认搜索引擎设置 |
| 小红书 | 支持 | 支持 `/explore` | 网站改版后需重新人工确认 |
| 知乎 | 支持 | 支持 `/` | 已登录、未登录页面结构可能不同 |
| Bilibili | 支持 | 支持 `/` | 视频详情页优先保留播放器和正文 |

搜索 URL 由 [`newtab/search-engines.js`](newtab/search-engines.js) 统一维护。插件不抓取、存储或聚合搜索结果。

## 安装

1. 下载或克隆本项目。
2. 打开 Chrome，访问 `chrome://extensions/`。
3. 打开右上角的“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择包含 [`manifest.json`](manifest.json) 的项目目录。
6. 打开新标签页，检查 Focus Search 首页。

本项目当前没有 `package.json`，也没有构建步骤或后端服务；源码目录就是可加载的扩展目录。修改文件后，在扩展管理页点击该扩展卡片的刷新按钮，再重新打开新标签页。

## 使用说明

- 点击搜索框左侧的平台图标，选择检索平台；切换平台不会清空已输入关键词。
- 按 Enter 或点击放大镜，在当前标签页打开官方搜索结果。
- 点击搜索框下方的 `+` 添加快捷入口。只接受 `http://` 或 `https://` 地址。
- 右键快捷入口可以编辑或删除；快捷入口数据保存在 `chrome.storage.local`。
- 点击工具栏图标，在弹窗中分别控制小红书、知乎和 Bilibili 的专注模式。

## 技术实现

- Chrome Extension Manifest V3
- `chrome_url_overrides.newtab` 新标签页替换
- 原生 HTML、CSS、JavaScript，无运行时框架依赖
- Content Scripts + Shadow DOM 页面覆盖
- `MutationObserver` 和路由检查用于平台单页应用页面更新
- `chrome.storage.local` 保存专注模式和快捷入口设置
- Manifest 仅申请 `storage` 权限

## 隐私说明

Focus Search 不包含后端、账号系统、统计代码或广告代码，不读取 Cookie、密码、访问令牌或浏览历史，也不会向项目服务器上传搜索词和快捷入口。搜索请求直接导航到对应平台的官方网页；平台自身的隐私政策和数据处理规则仍然适用。

## 已知限制

- 小红书、Bilibili 和知乎是动态网站，页面结构或路由变化可能导致专注模式需要更新。
- 当前仓库没有自动化真实浏览器测试；登录/未登录、详情页阅读、站内返回和关闭专注模式等项目请按 [`TESTING.md`](TESTING.md) 人工验证。
- 三个平台独立搜索首页的大 Logo 优先从平台公开静态资源运行时加载，失败时回退到仓库内的小图标。运行时加载需要网络，且公开可访问不代表获得品牌再分发或商标授权。
- 自定义快捷入口的 favicon 依赖目标网站公开的图标路径；目标网站禁止跨域加载或没有标准 favicon 时会显示默认图标。
- 这里不修改 Chrome 地址栏默认搜索引擎，也不替换浏览器的前进、后退和标签页行为。

## 开源、商标与第三方资源

原创代码以 MIT License 发布，见 [`LICENSE`](LICENSE)。平台名称、Logo、favicon 和相关商标归 Google、小红书、Bilibili、知乎及其他相应权利人所有。本项目是独立第三方工具，与这些平台没有官方合作、授权、赞助或隶属关系；第三方品牌素材不因本项目采用 MIT License 而自动获得 MIT 授权。

扩展自身的 Focus Search 图标位于 `assets/brand/` 和 `assets/extension-icon-*.png`。平台小图标位于 `assets/logos/`，使用前请按各平台品牌规范确认适用范围。

当前平台 Logo 资源和使用位置如下：

| 平台 | 仓库内资源 | 独立专注首页大 Logo | 当前许可结论 |
| --- | --- | --- | --- |
| Google | `assets/logos/google.png`，新标签页小图标 | 不处理 | 应遵循 [Google Identity 品牌规范](https://developers.google.com/identity/branding-guidelines?hl=zh-cn)；未将其视为 MIT 资源 |
| 小红书 | `assets/logos/xiaohongshu.png`，新标签页小图标和回退图标 | 小红书官方静态资源 URL，见 `focus/xiaohongshu.js` | 公开可访问不等于允许再分发；需人工确认商标和资源使用范围 |
| Bilibili | `assets/logos/bilibili.png`，新标签页小图标和回退图标 | Bilibili 官方静态资源 URL，见 `focus/bilibili.js` | 未发现随项目再分发的明确许可；需人工确认 |
| 知乎 | `assets/logos/zhihu.png`，新标签页小图标和回退图标 | 知乎官方静态资源 URL，见 `focus/zhihu.js` | 未发现随项目再分发的明确许可；需人工确认 |

仓库内的小图标用于界面识别，并不表示获得平台授权；独立首页大图标优先运行时加载，失败时使用本地回退图标。若希望最大限度降低品牌风险，可在公开发布前改用不含第三方 Logo 的平台文字标识，或先取得平台书面许可；本次整理不擅自删除或替换现有资源。

## 贡献与问题反馈

欢迎提交 Issue 或 Pull Request，尤其欢迎：平台 URL 变化、页面结构变化、可复现的兼容性问题、无障碍改进和文档修正。提交问题时请不要附带 Cookie、Token、截图中的个人账号信息或其他敏感数据，并尽量提供平台、页面类型、是否登录和复现步骤。

本项目曾使用 Codex 辅助进行代码检查和文档整理；代码和决策仍以仓库内容为准。

## 发布建议

建议 GitHub 仓库名：`focus-search`

建议 Description：`一个以主动检索为中心的极简 Chrome 扩展，提供统一检索入口、专注浏览和自定义快捷入口。`

建议 Topics：`chrome-extension`、`manifest-v3`、`focus`、`search`、`productivity`、`student-tools`、`privacy`

在确认代码检查、人工测试和品牌资源使用范围后，再创建公开仓库并推送。推送命令示例见 [`CHANGELOG.md`](CHANGELOG.md)。
