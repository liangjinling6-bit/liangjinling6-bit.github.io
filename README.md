# 梁金玲作品集网站

UI 动效视觉设计师个人作品集网站，用于求职展示。

## 文件结构

```
portfolio_website/
├── index.html                 # 主页（全屏 Hero 大图 + 技能展示 + PART 导航 + 精选作品）
├── all-projects.html          # 全部作品汇总页（深色主题 + 分类筛选）
├── project-chaoshan.html      # 潮汕非遗文化宣传设计
├── project-leicha.html        # 湖南非遗《擂茶》短片
├── project-xilan.html         # 西兰卡普非遗动画设计
├── project-sony.html          # 索尼相机广告影像创作
├── project-e-teach.html       # 智慧课堂（浅色主题）
├── project-motion.html        # 动效与 AIGC 视觉作品
├── project-film.html          # 影像创作作品集
├── project-ocean.html         # 民宿减塑视觉传播设计
├── project-creative.html      # 文化创意与数字视觉作品
├── project-heritage.html      # 非遗数字化设计
├── project-animal.html        # 动物成长乐园 IP 设计
├── project-town.html          # 文旅古镇视觉设计
├── project-ui.html            # UI 设计与交互作品展示（浅色主题）
├── detail-template-dark.html  # 深色详情页模板
├── detail-template-light.html # 浅色详情页模板
├── css/
│   └── style.css              # 全部样式（含 CSS 变量 + 动画 + 响应式）
├── js/
│   └── main.js                # 交互脚本（滚动动画/筛选/灯箱/视差）
└── assets/
    └── images/                # 15 张设计截图素材
```

## 作品分类

| 分类 | 项目 |
|------|------|
| PART 01 产品体验设计 | 智慧课堂、校园智能点单、潮玩购物小程序 |
| PART 02—03 交互体验与 AI 创意 | 动物成长乐园、Motion Interaction Lab、AI Visual Creation |
| PART 04 视觉探索 | 文旅古镇、文化创意与数字视觉、Visual Storytelling |

## 交互特性

- **滚动揭示动画** — 元素进入视口时淡入上滑
- **鼠标视差** — Hero 区域 blob 随鼠标移动
- **作品分类筛选** — 全部作品页支持 PART 分类切换
- **图片灯箱** — 点击详情页图片放大查看，支持键盘导航
- **数字递增动画** — About 区域数据滚动到视口时计数
- **平滑滚动** — 锚点链接平滑过渡

## 本地预览

```bash
cd portfolio_website
python -m http.server 8080
# 或
npx serve . -l 8080
```

访问 `http://localhost:8080`

## 新增项目

1. 复制 `detail-template-dark.html` 或 `detail-template-light.html`
2. 重命名为 `project-xxx.html`
3. 替换图片 `src`、标题、标签、描述、画廊
4. 在 `all-projects.html` 的作品网格中添加卡片（设置 `data-category` 属性）
5. 在相邻项目的上下篇导航中添加链接
