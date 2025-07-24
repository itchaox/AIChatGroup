# AI工具分组管理器 Chrome扩展

一个专为ChatGPT、Claude等AI工具设计的分组管理Chrome侧边栏插件，帮助用户更好地管理和组织AI对话记录。

## 功能特性

- 🤖 **多AI工具支持**：支持ChatGPT、Claude、Gemini、Poe、Character.AI等主流AI工具
- 📁 **分组管理**：创建、编辑、删除分组，支持自定义图标
- 🔖 **收藏管理**：添加、编辑、删除收藏链接，支持描述信息
- 🔍 **搜索功能**：快速搜索分组和收藏
- 💾 **本地存储**：所有数据存储在本地localStorage中
- 🎨 **现代UI**：深色主题，响应式设计
- ⚡ **快速访问**：点击直接跳转，Ctrl+点击新标签页打开

## 安装方法

### 方法一：开发者模式安装（推荐）

1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择项目的 `dist` 文件夹
6. 扩展安装完成！

### 方法二：从源码构建

```bash
# 克隆项目
git clone <项目地址>
cd ai-group

# 安装依赖
pnpm install

# 构建扩展
npm run build

# 然后按照方法一安装dist文件夹
```

## 使用方法

### 1. 打开侧边栏
- 点击浏览器工具栏中的扩展图标
- 或者右键点击扩展图标选择「打开侧边面板」

### 2. 选择AI工具
- 在顶部标签页中选择对应的AI工具（ChatGPT、Claude等）
- 每个AI工具都有独立的分组管理

### 3. 创建分组
- 点击底部的「新建」按钮
- 输入分组名称，选择图标
- 点击「创建」完成

### 4. 添加收藏
- 点击分组右侧的菜单按钮，选择「添加收藏」
- 或者点击「获取当前页面信息」自动填充
- 填写标题、URL等信息
- 选择目标分组，点击「添加」

### 5. 管理收藏
- **访问**：点击收藏项直接跳转，Ctrl+点击新标签页打开
- **编辑**：点击收藏项右侧菜单选择「编辑」
- **删除**：点击收藏项右侧菜单选择「删除」

### 6. 管理分组
- **编辑**：点击分组右侧菜单选择「编辑分组」
- **删除**：点击分组右侧菜单选择「删除分组」（会同时删除分组下的所有收藏）

### 7. 搜索功能
- 点击底部的「搜索」按钮
- 输入关键词搜索分组

## 技术栈

- **前端框架**：React 18 + TypeScript
- **状态管理**：Zustand
- **样式框架**：Tailwind CSS
- **构建工具**：Vite
- **图标库**：Lucide React
- **通知组件**：Sonner

## 项目结构

```
src/
├── components/          # React组件
│   ├── AIToolSelector.tsx    # AI工具选择器
│   ├── GroupList.tsx         # 分组列表
│   ├── BookmarkItem.tsx      # 收藏项
│   ├── GroupModal.tsx        # 分组模态框
│   ├── BookmarkModal.tsx     # 收藏模态框
│   ├── SearchBar.tsx         # 搜索栏
│   └── ActionBar.tsx         # 底部操作栏
├── store/               # 状态管理
│   └── useAppStore.ts        # Zustand store
├── types/               # 类型定义
│   └── index.ts              # 数据类型
├── utils/               # 工具函数
│   └── storage.ts            # 本地存储管理
├── background.ts        # Chrome扩展后台脚本
├── content.ts          # Content script
└── App.tsx             # 主应用组件
```

## 数据存储

所有数据都存储在浏览器的localStorage中：

- `ai_tool_groups`：分组数据
- `ai_tool_bookmarks`：收藏数据
- `current_ai_tool`：当前选中的AI工具
- `app_settings`：应用设置

## 开发说明

### 开发环境

```bash
# 安装依赖
pnpm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run check
```

### 扩展权限说明

- `storage`：用于访问Chrome存储API（备用方案）
- `activeTab`：获取当前活动标签页信息
- `sidePanel`：使用Chrome侧边栏API

## 常见问题

### Q: 扩展无法正常工作？
A: 请确保Chrome版本支持Side Panel API（Chrome 114+），并检查是否正确安装扩展。

### Q: 数据丢失了怎么办？
A: 数据存储在localStorage中，清除浏览器数据会导致数据丢失。建议定期导出重要数据。

### Q: 如何添加新的AI工具？
A: 可以选择「其他」分类，或者在源码中的 `src/types/index.ts` 文件中添加新的AI工具定义。

### Q: 扩展占用内存过多？
A: 扩展使用轻量级设计，正常情况下内存占用很小。如有问题请重启浏览器。

## 更新日志

### v1.0.0 (2024-01-XX)
- 🎉 首次发布
- ✨ 支持多AI工具分组管理
- ✨ 收藏链接管理功能
- ✨ 搜索和过滤功能
- ✨ 现代化UI设计
- ✨ 本地数据存储

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

---

**注意**：这是一个开源项目，仅用于学习和个人使用。请遵守各AI平台的使用条款。