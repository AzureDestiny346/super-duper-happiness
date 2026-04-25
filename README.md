# 智课工坊

> 专为数学教师和师范生打造的AI辅助备课云平台

## 功能特性

- **智能备课中心**：基于ADDIE教学设计模型，AI辅助五阶段备课
- **提示词工坊**：7个预设数学教学提示词模板
- **项目管理**：课程设计、版本管理、导出分享

## 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 打开 http://localhost:5000
```

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 部署方式

详见 [DEPLOY.md](./DEPLOY.md)

### Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### Docker

```bash
# 构建镜像
docker build -t zhike-studio .

# 运行
docker run -p 5000:5000 zhike-studio
```

## 技术栈

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui
- coze-coding-dev-sdk

## 项目结构

```
src/
├── app/
│   ├── page.tsx          # 首页
│   ├── prep/page.tsx    # 智能备课
│   ├── prompt/page.tsx  # 提示词工坊
│   ├── projects/page.tsx # 项目管理
│   └── api/             # API路由
├── components/          # UI组件
└── lib/                # 工具函数
```

## License

MIT
