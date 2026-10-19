# syntax=docker/dockerfile:1
# YYC3 Intelligent Hub System —— 静态导出容器化部署（验收第九章：容器化部署）
# 构建: docker build -t yyc3-intelligent-hub .
# 运行: docker run -p 8080:80 yyc3-intelligent-hub

# ─── Stage 1: 构建（与 CI 同链路：pnpm 10 + Node 22） ───
FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app

# 依赖层缓存：先拷贝清单再安装
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ─── Stage 2: 运行（纯静态产物 + nginx，无 Node 运行时） ───
FROM nginx:1.27-alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
