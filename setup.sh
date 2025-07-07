#!/usr/bin/env bash
# Usage: bash setup.sh
# 从零环境自动安装依赖并启动开发服务器。
set -e

# 1. 检查 Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js 未安装，请先安装 Node 18+" && exit 1
fi

# 2. 安装 pnpm (如无)
if ! command -v pnpm >/dev/null 2>&1; then
  echo "👉 安装 pnpm..."
  npm i -g pnpm
fi

echo "👉 安装项目依赖..."
pnpm install

# 3. Prisma 生成客户端并执行迁移
echo "👉 生成 Prisma Client..."
pnpm prisma generate

echo "👉 执行数据库迁移..."
# 如果是第一次部署使用 migrate dev 以创建数据库及种子数据
pnpm prisma migrate dev --name init || true

# 4. 启动开发服务器
echo "✅ 一切就绪，启动 Next.js 开发服务器 (http://localhost:3000)"
pnpm dev 