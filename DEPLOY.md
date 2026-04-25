# ===========================================
# 智课工坊 - 部署配置文件
# ===========================================

## 方式一：本地开发运行

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd zhike-studio

# 2. 安装依赖（必须使用pnpm）
npm install -g pnpm  # 如果没有pnpm
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 打开浏览器访问 http://localhost:5000
```

## 方式二：Vercel 部署（推荐，免费）

### 1. 创建 vercel.json

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "@app-url"
  }
}
```

### 2. 部署命令

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录（浏览器打开授权）
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

### 3. 或者通过 GitHub 部署

1. 将项目推送到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入项目
3. 配置构建命令：`pnpm build`
4. 点击 Deploy

## 方式三：Docker 部署

### 1. 创建 Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 构建
RUN pnpm build

# 生产镜像
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

EXPOSE 5000

ENV PORT 5000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. 创建 .dockerignore

```dockerfile
node_modules
.next
.git
*.md
.coze
.vercel
```

### 3. 构建和运行

```bash
# 构建镜像
docker build -t zhike-studio .

# 运行容器
docker run -p 5000:5000 zhike-studio

# 后台运行
docker run -d -p 5000:5000 --name zhike-studio zhike-studio
```

## 方式四：传统服务器部署

### Ubuntu/CentOS 服务器

```bash
# 1. 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 pnpm
npm install -g pnpm

# 3. 安装 Nginx
sudo apt-get install -y nginx

# 4. 克隆项目
git clone <your-repo-url> /var/www/zhike-studio
cd /var/www/zhike-studio

# 5. 安装依赖并构建
pnpm install
pnpm build

# 6. 配置 Nginx
sudo nano /etc/nginx/sites-available/zhike-studio
```

### Nginx 配置模板

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/zhike-studio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 方式五：PM2 进程管理（生产环境推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start pnpm --name "zhike-studio" -- start

# 保存进程列表
pm2 save

# 设置开机自启
pm2 startup
```

---

## 环境变量说明

### 必需的环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `COZE_PROJECT_DOMAIN_DEFAULT` | 公网访问域名 | `https://xxx.vercel.app` |
| `DEPLOY_RUN_PORT` | 服务端口 | `5000` |

### 本地开发 .env.local

```env
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:5000
```

---

## 快速开始脚本

### deploy-vercel.sh

```bash
#!/bin/bash
# Vercel 快速部署脚本

echo "🚀 开始部署智课工坊到 Vercel..."

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "安装 pnpm..."
    npm install -g pnpm
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo "🔨 构建项目..."
pnpm build

# 部署
echo "🚀 部署中..."
vercel --prod

echo "✅ 部署完成！"
```

### deploy-docker.sh

```bash
#!/bin/bash
# Docker 快速部署脚本

echo "🚀 开始构建 Docker 镜像..."

docker build -t zhike-studio:latest .

echo "🚀 启动容器..."
docker run -d \
  --name zhike-studio \
  -p 5000:5000 \
  --restart unless-stopped \
  zhike-studio:latest

echo "✅ 服务已启动！访问 http://localhost:5000"
```

---

## GitHub Actions 自动部署

### 创建 .github/workflows/deploy.yml

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 故障排查

### 构建失败

```bash
# 清除缓存重新安装
rm -rf node_modules .next
pnpm install
pnpm build
```

### 端口被占用

```bash
# 查找占用端口的进程
lsof -i :5000

# 杀掉进程或使用其他端口
PORT=5001 pnpm dev
```

### 生产环境白屏

```bash
# 检查环境变量
echo $NEXT_PUBLIC_APP_URL

# 重新构建
pnpm build
```
