# Changelog

所有重要变更记录在此文件。当前版本尚未发布到 Chrome Web Store。

## [0.1.0] - 2026-11-16

### 已实现

- Manifest V3 新标签页替换。
- Google、小红书、知乎、Bilibili 四平台统一搜索入口。
- 当前标签页原生搜索导航和正常历史记录行为。
- 小红书、Bilibili、知乎首页专注搜索覆盖层。
- 工具栏弹窗中的平台专注模式开关。
- 本地自定义快捷入口的添加、编辑、删除和持久化。
- 本地扩展图标、平台回退图标和运行时高清 Logo 回退机制。
- 中文 README、测试清单、MIT License 和 GitHub 发布准备材料。

### 验证状态

- 已完成源码、Manifest、资源引用和敏感信息静态检查。
- 真实 Chrome 中的登录/未登录兼容性、平台页面路由、视频/文章详情和站内返回仍需按 `TESTING.md` 人工确认。

## GitHub 推送准备（确认后执行）

以下命令仅在你确认创建公开仓库并已完成人工测试后执行：

```bash
git init
git add .
git commit -m "chore: prepare Focus Search v0.1.0"
git branch -M main
git remote add origin https://github.com/<你的用户名>/focus-search.git
git push -u origin main
```

如果使用 GitHub CLI，可先执行 `gh auth login`，再创建仓库并推送；本项目当前不会代替你执行公开发布。
